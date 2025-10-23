// A small client-side singleton to ensure the backend handshake is called only once
// across components, renders (including React.StrictMode double-invocation), and pages.

import { apiRequest, ENDPOINTS } from "@/services/api.config";

type Role = "analista" | "colaborador";

export type HandshakeResponse = {
  persona_id: string;
  analista_id?: string;
  nivel?: number | null;
  colaborador_id?: string;
  cliente_id?: string;
};

declare global {
  interface Window {
    __handshakePromise?: Promise<HandshakeResponse> | null;
    __handshakeResult?: HandshakeResponse | null;
  }
}

/**
 * Ensure the backend handshake is executed at most once per page load.
 * Subsequent calls return the same promise/result, avoiding duplicate POSTs.
 */
export async function ensureHandshake(params: {
  idToken: string;
  role?: Role; // if omitted, will try to infer from localStorage
}): Promise<HandshakeResponse> {
  if (typeof window === "undefined") {
    // Should never be called server-side; return a rejected promise for safety
    return Promise.reject(new Error("ensureHandshake must be called on the client"));
  }

  // If we already have a resolved result, return it immediately.
  if (window.__handshakeResult) {
    return window.__handshakeResult;
  }

  // If a promise is already in-flight, reuse it.
  if (window.__handshakePromise) {
    return window.__handshakePromise;
  }

  // Determine role once here to keep behavior consistent.
  let role: Role = params.role ?? "colaborador";
  try {
    const stored = localStorage.getItem("loginRole");
    if (stored === "analista" || stored === "colaborador") {
      role = stored as Role;
    }
  } catch {
    // ignore access errors
  }

  const endpoint =
    role === "analista" ? ENDPOINTS.AUTH_GOOGLE_ANALISTA : ENDPOINTS.AUTH_GOOGLE_COLABORADOR;

  // Create and cache the in-flight promise
  window.__handshakePromise = (async () => {
    const response = await apiRequest(endpoint, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: params.idToken }),
    });

    const result: HandshakeResponse = {
      persona_id: response?.persona_id,
      analista_id: response?.analista_id,
      nivel: response?.nivel ?? null,
      colaborador_id: response?.colaborador_id,
      cliente_id: response?.cliente_id,
    };

    // Cache the resolved result to avoid future network calls in this session/page load
    window.__handshakeResult = result;

    // Optionally clear the role hint to avoid cross-role confusion in future navigations
    try {
      localStorage.removeItem("loginRole");
    } catch {
      // ignore
    }

    return result;
  })();

  try {
    return await window.__handshakePromise;
  } finally {
    // Keep __handshakePromise set so concurrent callers still reuse it;
    // the resolved value lives in __handshakeResult for instant reuse.
  }
}
