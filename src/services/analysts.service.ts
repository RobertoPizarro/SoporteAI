import { apiRequest, ENDPOINTS } from "./api.config";

export interface Analyst {
  id: string;
  name: string;
  email: string;
  level: number;
}

// Interface para el analista que viene del backend
interface BackendAnalyst {
  id: any; // Puede ser string, objeto UUID, o number
  nombre: string;
  email: string;
  nivel: number;
}

// Función para transformar analista del backend al formato del frontend
const transformBackendAnalyst = (backendAnalyst: BackendAnalyst): Analyst => {
  // Manejar diferentes formatos de ID (UUID object, string, number)
  let id: string;
  if (typeof backendAnalyst.id === "object" && backendAnalyst.id !== null) {
    // Si es un objeto UUID, convertirlo a string
    id = String(backendAnalyst.id);
  } else {
    id = String(backendAnalyst.id);
  }

  return {
    id,
    name: backendAnalyst.nombre,
    email: backendAnalyst.email,
    level: backendAnalyst.nivel,
  };
};

// Función para transformar analista del frontend al formato del backend
const transformAnalystToBackend = (analyst: Omit<Analyst, "id">) => {
  return {
    nombre: analyst.name,
    email: analyst.email,
    nivel: analyst.level,
  };
};

// Niveles disponibles
export const getLevels = () => [
  { value: 1, label: "Nivel 1" },
  { value: 2, label: "Nivel 2" },
  { value: 3, label: "Nivel 3" },
  { value: 4, label: "Nivel 4" },
];

// Obtener todos los analistas
export async function getAnalysts(): Promise<Analyst[]> {
  try {
    const data = await apiRequest(ENDPOINTS.ADMIN_ANALYSTS, {
      method: "GET",
    });

    console.log("📥 Datos recibidos del backend:", data);
    console.log("📥 Tipo de datos:", typeof data);
    console.log("📥 Es array?:", Array.isArray(data));
    console.log("📥 Claves del objeto:", data ? Object.keys(data) : "null");

    // Si data es un objeto con una propiedad que contiene el array
    let analistas = data;

    // Verificar si data tiene una propiedad 'analistas' o similar
    if (data && typeof data === "object" && !Array.isArray(data)) {
      console.log("🔍 data es un objeto, buscando array dentro...");
      // Buscar una propiedad que contenga el array
      if (Array.isArray(data.analistas)) {
        analistas = data.analistas;
        console.log("✅ Encontrado array en data.analistas");
      } else if (Array.isArray(data.data)) {
        analistas = data.data;
        console.log("✅ Encontrado array en data.data");
      } else {
        // Tomar el primer valor que sea un array
        const arrayProp = Object.values(data).find((val) => Array.isArray(val));
        if (arrayProp) {
          analistas = arrayProp;
          console.log("✅ Encontrado array en propiedad del objeto");
        }
      }
    }

    if (!Array.isArray(analistas)) {
      console.error("❌ La respuesta no es un array:", analistas);
      return [];
    }

    console.log("✅ Array con", analistas.length, "elementos");

    const transformed = analistas.map(transformBackendAnalyst);
    console.log("✅ Analistas transformados:", transformed);

    return transformed;
  } catch (error) {
    console.error("Error loading analysts:", error);
    return [];
  }
}

// Crear un nuevo analista
export async function createAnalyst(
  analyst: Omit<Analyst, "id">
): Promise<Analyst> {
  try {
    const data = await apiRequest(ENDPOINTS.ADMIN_ANALYSTS, {
      method: "POST",
      body: JSON.stringify(transformAnalystToBackend(analyst)),
    });

    return transformBackendAnalyst(data);
  } catch (error) {
    console.error("Error creating analyst:", error);
    throw new Error("Error al crear el analista");
  }
}

// Actualizar un analista existente (solo nivel por ahora)
export async function updateAnalyst(
  id: string,
  updates: Partial<Omit<Analyst, "id">>
): Promise<Analyst> {
  try {
    // El backend solo acepta actualizar el nivel
    if (updates.level === undefined) {
      throw new Error("El nivel es requerido para actualizar un analista");
    }

    // Construir URL con query params según el backend
    const url = `${ENDPOINTS.UPDATE_ADMIN_ANALYST}?id_analista=${encodeURIComponent(id)}&nivel=${updates.level}`;
    
    const data = await apiRequest(url, {
      method: "PATCH",
    });

    console.log("✅ Respuesta de actualización:", data);

    // El backend devuelve {ok: true, mensaje: "..."}, no el analista actualizado
    // Devolver el analista con todos los datos proporcionados
    if (data.ok) {
      return {
        id,
        name: updates.name || "",
        email: updates.email || "",
        level: updates.level,
      };
    }

    throw new Error(data.mensaje || "No se pudo actualizar el analista");
  } catch (error) {
    console.error("Error updating analyst:", error);
    throw error;
  }
}

// Eliminar un analista
export async function deleteAnalyst(id: string): Promise<boolean> {
  try {
    // Construir URL con query params según el backend
    const url = `${ENDPOINTS.DELETE_ADMIN_ANALYST}?id_analista=${encodeURIComponent(id)}`;
    
    const data = await apiRequest(url, {
      method: "PATCH", // Tu backend usa PATCH, no DELETE
    });

    console.log("✅ Respuesta de eliminación:", data);

    // El backend devuelve {ok: true, mensaje: "..."}
    if (data.ok) {
      return true;
    }

    throw new Error(data.mensaje || "No se pudo eliminar el analista");
  } catch (error) {
    console.error("Error deleting analyst:", error);
    throw error;
  }
}
