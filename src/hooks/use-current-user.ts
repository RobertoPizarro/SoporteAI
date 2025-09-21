import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserData } from "@/types";
import { apiRequest, ENDPOINTS } from "@/services/api.config";

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
      const email = session?.user?.email || "";
      
      if (!idToken) return;

      try {
        // Determinar endpoint basado en el email (lógica del useBackendHandshake)
        const endpoint = email.endsWith("@gmail.com")
          ? ENDPOINTS.AUTH_GOOGLE_ANALISTA
          : ENDPOINTS.AUTH_GOOGLE_COLABORADOR;

        const response = await apiRequest(endpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });

        // El backend devuelve datos como {ok: true, persona_id: "...", analista_id: "...", nivel: 2}
        console.log("🔐 Backend user data:", response);
        
        // Crear objeto userData basado en la respuesta del backend
        const backendUserData: UserData = {
          email: email,
          name: session?.user?.name || "",
          persona_id: response.persona_id,
          ...(email.endsWith("@gmail.com") 
            ? {
                rol: "analista" as const,
                analista_id: response.analista_id,
                nivel: response.nivel
              }
            : {
                rol: "colaborador" as const,
                colaborador_id: response.colaborador_id,
                cliente_id: response.cliente_id
              }
          )
        };

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
    nivel: isAnalista ? (userData as any)?.nivel || null : null,
    
    // Utilidades
    isAnalista,
    isColaborador,
  };
}