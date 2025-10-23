import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserData } from "@/types";
import { ensureHandshake } from "@/lib/handshakeClient";

interface UseCurrentUserReturn {
  // Datos básicos de NextAuth
  session: any;
  
  // Datos específicos del backend
  userData: UserData | null;
  
  // Estados de carga y autenticación
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Información específica del usuario
  role: "analista" | "colaborador" | null;
  email: string | null;
  name: string | null;
  
  // Datos específicos del analista (si aplica)
  analistaId: string | null;
  nivel: number | null;
  
  // Funciones de utilidad
  isAnalista: boolean;
  isColaborador: boolean;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [backendDataLoaded, setBackendDataLoaded] = useState(false);

  // Efecto para obtener datos del backend después de la autenticación
  useEffect(() => {
    const fetchUserData = async () => {
      if (status !== "authenticated" || backendDataLoaded) return;
      
      const idToken = (session as any)?.idToken;
      
      if (!idToken) return;

      try {
        // Ejecuta (o reutiliza) el handshake único
        const response = await ensureHandshake({ idToken });

        // Crear objeto userData basado en la respuesta del backend
        // Inferir rol según los campos recibidos.
        const isAnalista = typeof response?.analista_id === "string" && response.analista_id.length > 0;
        let backendUserData: UserData;
        if (isAnalista) {
          backendUserData = {
            email: session?.user?.email || "",
            name: session?.user?.name || "",
            persona_id: response?.persona_id || "",
            rol: "analista",
            analista_id: response.analista_id as string,
            nivel: response?.nivel ?? undefined,
          };
        } else {
          backendUserData = {
            email: session?.user?.email || "",
            name: session?.user?.name || "",
            persona_id: response?.persona_id || "",
            rol: "colaborador",
            colaborador_id: response?.colaborador_id ?? "",
            cliente_id: response?.cliente_id,
          } as UserData;
        }

        setUserData(backendUserData);
        setBackendDataLoaded(true);
      } catch (error) {
        console.error("Error fetching user data from backend:", error);
      }
    };

    fetchUserData();
  }, [status, session, backendDataLoaded]);

  // Calcular valores derivados
  const isLoading = status === "loading" || (status === "authenticated" && !backendDataLoaded);
  const isAuthenticated = status === "authenticated" && backendDataLoaded;
  const role = userData?.rol || null;
  const isAnalista = role === "analista";
  const isColaborador = role === "colaborador";

  return {
    // Datos básicos
    session,
    userData,
    
    // Estados
    isLoading,
    isAuthenticated,
    
    // Información del usuario
    role,
    email: session?.user?.email || null,
    name: session?.user?.name || null,
    
    // Datos específicos del analista
  analistaId: isAnalista ? (userData as any)?.analista_id || null : null,
  nivel: isAnalista ? ((userData as any)?.nivel ?? null) : null,
    
    // Utilidades
    isAnalista,
    isColaborador,
  };
}