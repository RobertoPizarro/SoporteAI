/**
 * Configuración central de la API
 */

// Detectar entorno y configurar URL base
const getBaseUrl = (): string => {
  // En el navegador, usar el origin actual
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // En servidor (SSR/SSG), usar variable de entorno o localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

const API_BASE_URL = getBaseUrl();

// Configuración de headers por defecto
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

// Configuración de endpoints
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  HEADERS: DEFAULT_HEADERS,
} as const;

// Endpoints disponibles
export const ENDPOINTS = {
  // Authentication
  AUTH_GOOGLE_COLABORADOR: "/api/backend/auth/google/colaborador",
  AUTH_GOOGLE_ANALISTA: "/api/backend/auth/google/analista",
  
  // Chat
  CHAT_MESSAGE: "/api/backend/user/chat",
  CHAT_RESET: "/api/backend/user/reset",
  CHAT_GET: "/api/backend/analista/chat",

  // Tickets
  TICKETS: "/api/backend/analista/tickets",
  TICKET_BY_ID: (id: string) => `/api/backend/analista/ticket?ticket=${id}`,
  UPDATE_TICKET_STATUS: (id: string) => `/api/backend/analista/estado?ticket=${id}`,
  ESCALATE_TICKET: (id: string) => `/api/backend/analista/escalar?ticket=${id}`,
  UPDATE_TICKET_LEVEL: (id: string) => `/api/backend/analista/nivel?ticket=${id}`, 
  ESCALATED_TICKETS: (id: string) => `/api/backend/analista/escalado?ticket=${id}`,

  // Usuarios
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,

  // Admin - Analistas
  ADMIN_ANALYSTS: "/api/backend/administrador/analistas",
  UPDATE_ADMIN_ANALYST: "/api/backend/administrador/analista/actualizar",
  DELETE_ADMIN_ANALYST: "/api/backend/administrador/analista/eliminar",
  ADMIN_ANALYST_BY_ID: (id: string) => `/api/backend/administrador/analistas/${id}`,

  // Admin - Clientes
  ADMIN_CLIENTS: "/api/backend/administrador/clientes",
  CREATE_ADMIN_CLIENT: "/api/backend/administrador/cliente/crear",
  UPDATE_ADMIN_CLIENT: "/api/backend/administrador/cliente/actualizar",
  DELETE_ADMIN_CLIENT: "/api/backend/administrador/cliente/eliminar",
  
} as const;

/**
 * Función helper para construir URLs completas
 */
export const buildUrl = (endpoint: string): string => {
  // Si el endpoint ya es una URL completa, devolverla tal cual
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // Si no hay base URL o el endpoint ya es relativo, usar directamente
  if (!API_CONFIG.BASE_URL || API_CONFIG.BASE_URL === '') {
    return endpoint;
  }
  
  // Construir URL completa
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Función helper para hacer peticiones con configuración por defecto
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = buildUrl(endpoint);
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Capturar el error detallado del servidor
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorDetails = null;
      
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorDetails = await response.json();
          console.error('❌ Server error response:', errorDetails);
          errorMessage = errorDetails.message || errorDetails.error || errorDetails.detail || errorMessage;
        } else {
          const textError = await response.text();
          console.error('❌ Server error (text):', textError);
          errorMessage = textError || errorMessage;
        }
      } catch (parseError) {
        console.error('⚠️ Could not parse error response:', parseError);
      }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).details = errorDetails;
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`🔴 API Error en ${endpoint}:`, error.message);
    }
    throw error;
  }
};