import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { ensureHandshake } from "@/lib/handshakeClient";
export function useBackendHandshake() {
  const { data: session, status } = useSession();
  const done = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (status !== "authenticated" || done.current) return;
      const idToken = (session as any)?.idToken;
      if (!idToken) return;
      try {
        await ensureHandshake({ idToken });
        done.current = true; // no repetir
      } catch (e) {
        console.error("backend handshake failed", e);
      }
    };
    run();
  }, [status, session]);
}