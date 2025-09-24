/**
 * Configuración central de la API
 */

// URLs base para diferentes entornos
const API_BASE_URL = "";

// Configuración de headers por defecto
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

// Configuración de timeouts
const DEFAULT_TIMEOUT = 10000; // 10 segundos

// Configuración de endpoints
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: DEFAULT_TIMEOUT,
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
  UPDATE_TICKET_LEVEL: (id: string) => `/api/backend/analista/nivel?ticket=${id}`, // FALTA IMPLEMENTAR

  // Usuarios
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  
} as const;

/**
 * Función helper para construir URLs completas
 */
export const buildUrl = (endpoint: string): string => {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error en ${endpoint}:`, error);
    throw error;
  }
};
