import "server-only";

import type { AuthResponse, Plan, Producer, Subscription, TasteProfile } from "./types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

/** An error response from the API, parsed from its RFC 9457 problem-detail body. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: unknown;
  revalidate?: number;
};

async function request<T>(path: string, { method = "GET", token, body, revalidate }: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    // Per-user data is never cached; public catalog data is revalidated periodically.
    ...(revalidate === undefined ? { cache: "no-store" } : { next: { revalidate } }),
  });

  if (!res.ok) {
    const problem = (await res.json().catch(() => ({}))) as { detail?: string; errors?: Record<string, string> };
    throw new ApiError(res.status, problem.detail ?? res.statusText, problem.errors);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

/** Resolves to null instead of throwing when the resource doesn't exist yet. */
async function orNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export const api = {
  register: (input: { email: string; password: string; firstName: string; lastName?: string; adultConfirmed: boolean }) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: input }),

  login: (input: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: input }),

  plans: () => request<Plan[]>("/api/plans", { revalidate: 300 }),

  producers: () => request<Producer[]>("/api/producers", { revalidate: 300 }),

  tasteProfile: (token: string) => orNull(request<TasteProfile>("/api/taste-profile", { token })),

  saveTasteProfile: (token: string, profile: TasteProfile) =>
    request<TasteProfile>("/api/taste-profile", { method: "PUT", token, body: profile }),

  subscription: (token: string) => orNull(request<Subscription>("/api/subscription", { token })),

  subscribe: (token: string, planCode: string) =>
    request<Subscription>("/api/subscription", { method: "PUT", token, body: { planCode } }),

  cancelSubscription: (token: string) => request<void>("/api/subscription", { method: "DELETE", token }),
};
