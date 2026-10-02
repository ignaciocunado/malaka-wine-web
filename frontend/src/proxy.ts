// Next.js 16 "proxy" (formerly middleware): runs Auth.js's `authorized` callback before protected pages render.
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/account/:path*"],
};
