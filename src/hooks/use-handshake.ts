import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { apiRequest, ENDPOINTS } from "../services/api.config";
export function useBackendHandshake() {
  const { data: session, status } = useSession();
  const done = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (status !== "authenticated" || done.current) return;
      const idToken = (session as any)?.idToken;
      const email = session?.user?.email || "";
      if (!idToken) return;

      const endpoint = email.endsWith("@gmail.com")
        ? ENDPOINTS.AUTH_GOOGLE_ANALISTA
        : ENDPOINTS.AUTH_GOOGLE_COLABORADOR;

      const res = await apiRequest(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (!res.ok) {
        console.error("backend handshake failed", await res.text());
        return;
      }
      done.current = true; // no repetir
    };
    run();
  }, [status, session]);
}