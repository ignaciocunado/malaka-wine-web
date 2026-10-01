import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { ApiError, api } from "@/lib/api";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    accessTokenExpires?: number;
  }
  interface Session {
    /** The Spring Boot API's JWT, sent as a Bearer token from server code. */
    accessToken: string;
    user: { id: string } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
  }
}

class InvalidCredentials extends CredentialsSignin {
  code = "invalid_credentials";
}

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

/**
 * Auth.js (NextAuth v5). The Credentials provider delegates email/password checks to the Spring Boot API,
 * which returns its own JWT. That token lives inside Auth.js's encrypted session cookie and is attached to
 * every API call made from server components and server actions.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: "/login" },
  // Matches the API token lifetime (app.jwt.ttl); the session ends when the API token expires.
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) throw new InvalidCredentials();
        try {
          const { token, expiresAt, user } = await api.login(parsed.data);
          return {
            id: String(user.id),
            email: user.email,
            name: user.firstName,
            accessToken: token,
            accessTokenExpires: Date.parse(expiresAt),
          };
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) throw new InvalidCredentials();
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }
      // Returning null clears the session cookie, which signs the user out.
      if (!token.accessToken || (token.accessTokenExpires && Date.now() >= token.accessTokenExpires)) {
        return null;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken!;
      session.user.id = token.sub!;
      return session;
    },
    // Used by proxy.ts: unauthenticated visitors to protected pages are sent to /login?callbackUrl=...
    authorized({ auth }) {
      return !!auth;
    },
  },
});
