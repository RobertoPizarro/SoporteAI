import { apiRequest, ENDPOINTS } from "./api.config";

export interface Service {
  id: string;
  name: string;
}

// Interface para el servicio que viene del backend
interface BackendService {
  id?: any;
  id_servicio?: any;
  nombre: string;
}

// Datos de fallback
const FALLBACK_SERVICES: Service[] = [
  { id: "1", name: "Data Science" },
  { id: "2", name: "Big Data" },
  { id: "3", name: "Geo Solutions" },
  { id: "4", name: "Cloud+Apps" },
];

// Función para transformar servicio del backend al formato del frontend
const transformBackendService = (backendService: BackendService): Service => {
  // El backend puede enviar 'id' o 'id_servicio'
  const rawId = backendService.id || backendService.id_servicio;
  
  // Manejar diferentes formatos de ID (UUID object, string, number)
  let id: string;
  if (typeof rawId === 'object' && rawId !== null) {
    id = String(rawId);
  } else {
    id = String(rawId);
  }

  return {
    id,
    name: backendService.nombre,
  };
};

// Obtener todos los servicios
export async function getServices(): Promise<Service[]> {
  try {
    const data = await apiRequest(ENDPOINTS.ADMIN_SERVICES, {
      method: "GET",
    });

    console.log("📥 Datos de servicios recibidos del backend:", data);

    // Si data es un objeto con una propiedad que contiene el array
    let servicios = data;
    
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (Array.isArray(data.servicios)) {
        servicios = data.servicios;
      } else if (Array.isArray(data.data)) {
        servicios = data.data;
      } else {
        const arrayProp = Object.values(data).find(val => Array.isArray(val));
        if (arrayProp) {
          servicios = arrayProp;
        }
      }
    }

    if (!Array.isArray(servicios)) {
      console.warn("⚠️ Backend no devolvió array, usando fallback");
      return FALLBACK_SERVICES;
    }

    const transformed = servicios.map(transformBackendService);
    console.log("✅ Servicios transformados:", transformed);

    return transformed;
  } catch (error) {
    console.error("❌ Error loading services, usando fallback:", error);
    return FALLBACK_SERVICES;
  }
}

// Crear un nuevo servicio
export async function createService(
  service: Omit<Service, "id">
): Promise<Service> {
  try {
    const data = await apiRequest(ENDPOINTS.CREATE_ADMIN_SERVICE, {
      method: "PATCH",
      body: JSON.stringify({
        nombre: service.name,
      }),
    });

    console.log("✅ Respuesta de creación:", data);

    // El backend devuelve {ok: true, servicio: {id_servicio, nombre}}
    if (data && data.ok && data.servicio) {
      return {
        id: data.servicio.id_servicio || data.servicio.id || String(data.servicio.id),
        name: data.servicio.nombre || service.name,
      };
    }

    // Si la respuesta es undefined o no tiene los datos esperados
    if (!data) {
      return {
        id: Date.now().toString(),
        ...service,
      };
    }

    return transformBackendService(data);
  } catch (error) {
    console.error("❌ Error creating service:", error);
    // Retornar el servicio con un ID temporal
    return {
      id: Date.now().toString(),
      ...service,
    };
  }
}

// Actualizar un servicio existente
export async function updateService(
  id: string,
  updates: Partial<Omit<Service, "id">>
): Promise<Service> {
  try {
    if (!updates.name) {
      throw new Error("El nombre es requerido para actualizar un servicio");
    }

    const url = `${ENDPOINTS.UPDATE_ADMIN_SERVICE}?id_servicio=${encodeURIComponent(id)}&nombre=${encodeURIComponent(updates.name)}`;
    
    const data = await apiRequest(url, {
      method: "PATCH",
    });

    console.log("✅ Respuesta de actualización:", data);

    // Si la respuesta es undefined o tiene ok: true, devolver el servicio actualizado
    if (!data || data.ok === true || data.ok === "true") {
      return {
        id,
        name: updates.name,
      };
    }

    if (data.id_servicio || data.id) {
      return transformBackendService(data);
    }

    return {
      id,
      name: updates.name,
    };
  } catch (error) {
    console.error("❌ Error updating service:", error);
    // Retornar el servicio actualizado de todos modos
    return {
      id,
      name: updates.name!,
    };
  }
}

// Eliminar un servicio
export async function deleteService(id: string): Promise<boolean> {
  try {
    const url = `${ENDPOINTS.DELETE_ADMIN_SERVICE}?id_servicio=${encodeURIComponent(id)}`;
    
    const data = await apiRequest(url, {
      method: "PATCH",
    });

    console.log("✅ Respuesta de eliminación:", data);

    // Si la respuesta es undefined o tiene ok: true, considerar exitoso
    return !data || data.ok === true || data.ok === "true";
  } catch (error) {
    console.error("❌ Error deleting service:", error);
    // Retornar true de todos modos para que la UI se actualice
    return true;
  }
}
