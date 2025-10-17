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
      if (!idToken) return;

      // Determinar el rol seleccionado desde los botones
      let role: "analista" | "colaborador" = "colaborador";
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("loginRole");
        if (stored === "analista" || stored === "colaborador") role = stored;
      }

      const endpoint =
        role === "analista"
          ? ENDPOINTS.AUTH_GOOGLE_ANALISTA
          : ENDPOINTS.AUTH_GOOGLE_COLABORADOR;

      try {
        await apiRequest(endpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });
        done.current = true; // no repetir
      } catch (e) {
        console.error("backend handshake failed", e);
      }
    };
    run();
  }, [status, session]);
}