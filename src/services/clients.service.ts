import { apiRequest, ENDPOINTS } from "./api.config";

export interface Client {
  id: string;
  name: string;
  domain: string;
}

// Interface para el cliente que viene del backend
interface BackendClient {
  id?: any; // Puede ser string, objeto UUID, o number
  id_cliente?: any; // El backend puede usar este nombre de campo
  nombre: string;
  dominio: string;
}

// Función para transformar cliente del backend al formato del frontend
const transformBackendClient = (backendClient: BackendClient): Client => {
  console.log("🔄 Transformando cliente del backend:", backendClient);
  
  // El backend puede enviar 'id' o 'id_cliente'
  const rawId = backendClient.id || backendClient.id_cliente;
  console.log("🔄 ID recibido:", rawId, "- Tipo:", typeof rawId);
  
  // Manejar diferentes formatos de ID (UUID object, string, number)
  let id: string;
  if (typeof rawId === 'object' && rawId !== null) {
    // Si es un objeto UUID, convertirlo a string
    id = String(rawId);
    console.log("🔄 ID como objeto UUID convertido a:", id);
  } else {
    id = String(rawId);
    console.log("🔄 ID convertido directamente a:", id);
  }

  const transformed = {
    id,
    name: backendClient.nombre,
    domain: backendClient.dominio,
  };
  
  console.log("✅ Cliente transformado:", transformed);
  return transformed;
};

// Función para transformar cliente del frontend al formato del backend
const transformClientToBackend = (client: Omit<Client, "id">) => {
  return {
    nombre: client.name,
    dominio: client.domain,
  };
};

// Obtener todos los clientes
export async function getClients(): Promise<Client[]> {
  try {
    const data = await apiRequest(ENDPOINTS.ADMIN_CLIENTS, {
      method: "GET",
    });

    console.log("📥 Datos de clientes recibidos del backend:", data);
    console.log("📥 Tipo de datos:", typeof data);
    console.log("📥 Es array?:", Array.isArray(data));

    // Si data es un objeto con una propiedad que contiene el array
    let clientes = data;
    
    // Verificar si data tiene una propiedad 'clientes' o similar
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      console.log("🔍 data es un objeto, buscando array dentro...");
      console.log("📥 Claves del objeto:", Object.keys(data));
      
      if (Array.isArray(data.clientes)) {
        clientes = data.clientes;
        console.log("✅ Encontrado array en data.clientes");
      } else if (Array.isArray(data.data)) {
        clientes = data.data;
        console.log("✅ Encontrado array en data.data");
      } else {
        // Tomar el primer valor que sea un array
        const arrayProp = Object.values(data).find(val => Array.isArray(val));
        if (arrayProp) {
          clientes = arrayProp;
          console.log("✅ Encontrado array en propiedad del objeto");
        }
      }
    }

    if (!Array.isArray(clientes)) {
      console.error("❌ La respuesta no es un array:", clientes);
      return [];
    }

    console.log("✅ Array con", clientes.length, "elementos");
    
    const transformed = clientes.map(transformBackendClient);
    console.log("✅ Clientes transformados:", transformed);

    return transformed;
  } catch (error) {
    console.error("Error loading clients:", error);
    return [];
  }
}

// Crear un nuevo cliente
export async function createClient(
  client: Omit<Client, "id">
): Promise<Client> {
  try {
    // Construir URL con query params según el backend
    const url = `${ENDPOINTS.CREATE_ADMIN_CLIENT}?nombre=${encodeURIComponent(client.name)}&dominio=${encodeURIComponent(client.domain)}`;
    
    const data = await apiRequest(url, {
      method: "PATCH",
    });

    console.log("✅ Respuesta de creación:", data);

    return transformBackendClient(data);
  } catch (error) {
    console.error("Error creating client:", error);
    throw new Error("Error al crear el cliente");
  }
}

// Actualizar un cliente existente
export async function updateClient(
  id: string,
  updates: Partial<Omit<Client, "id">>
): Promise<Client> {
  try {
    // El backend acepta actualizar nombre y dominio
    if (!updates.name || !updates.domain) {
      throw new Error("El nombre y dominio son requeridos para actualizar un cliente");
    }

    // Construir URL con query params según el backend
    const url = `${ENDPOINTS.UPDATE_ADMIN_CLIENT}?id_cliente=${encodeURIComponent(id)}&nombre=${encodeURIComponent(updates.name)}&dominio=${encodeURIComponent(updates.domain)}`;
    
    const data = await apiRequest(url, {
      method: "PATCH",
    });

    console.log("✅ Respuesta de actualización:", data);
    console.log("✅ Tipo de respuesta:", typeof data);
    console.log("✅ data.ok:", data.ok);
    console.log("✅ Claves de data:", Object.keys(data || {}));

    // El backend devuelve {ok: true, mensaje: "..."}, no el cliente actualizado
    // Si la respuesta tiene ok: true, o si es un objeto con el cliente actualizado
    if (data && (data.ok === true || data.ok === "true" || data.id_cliente || data.id)) {
      return {
        id,
        name: updates.name,
        domain: updates.domain,
      };
    }

    throw new Error(data?.mensaje || "No se pudo actualizar el cliente");
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
}

// Eliminar un cliente
export async function deleteClient(id: string): Promise<boolean> {
  try {
    // Construir URL con query params según el backend
    const url = `${ENDPOINTS.DELETE_ADMIN_CLIENT}?id_cliente=${encodeURIComponent(id)}`;
    
    const data = await apiRequest(url, {
      method: "PATCH", // El backend usa PATCH, no DELETE
    });

    console.log("✅ Respuesta de eliminación:", data);

    // El backend devuelve {ok: true, mensaje: "..."}
    if (data.ok) {
      return true;
    }

    throw new Error(data.mensaje || "No se pudo eliminar el cliente");
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
}
