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
  // El backend puede enviar 'id' o 'id_cliente'
  const rawId = backendClient.id || backendClient.id_cliente;

  // Manejar diferentes formatos de ID (UUID object, string, number)
  let id: string;
  if (typeof rawId === "object" && rawId !== null) {
    // Si es un objeto UUID, convertirlo a string
    id = String(rawId);
  } else {
    id = String(rawId);
  }

  const transformed = {
    id,
    name: backendClient.nombre,
    domain: backendClient.dominio,
  };

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

    // Si data es un objeto con una propiedad que contiene el array
    let clientes = data;

    // Verificar si data tiene una propiedad 'clientes' o similar
    if (data && typeof data === "object" && !Array.isArray(data)) {
      if (Array.isArray(data.clientes)) {
        clientes = data.clientes;
      } else if (Array.isArray(data.data)) {
        clientes = data.data;
      } else {
        // Tomar el primer valor que sea un array
        const arrayProp = Object.values(data).find((val) => Array.isArray(val));
        if (arrayProp) {
          clientes = arrayProp;
        }
      }
    }

    if (!Array.isArray(clientes)) {
      console.error("❌ La respuesta no es un array:", clientes);
      return [];
    }

    const transformed = clientes.map(transformBackendClient);
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
    const url = `${ENDPOINTS.CREATE_ADMIN_CLIENT}?nombre=${encodeURIComponent(
      client.name
    )}&dominio=${encodeURIComponent(client.domain)}`;

    const data = await apiRequest(url, {
      method: "POST",
    });

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
      throw new Error(
        "El nombre y dominio son requeridos para actualizar un cliente"
      );
    }

    // Construir URL con query params según el backend
    const url = `${
      ENDPOINTS.UPDATE_ADMIN_CLIENT
    }?id_cliente=${encodeURIComponent(id)}&nombre=${encodeURIComponent(
      updates.name
    )}&dominio=${encodeURIComponent(updates.domain)}`;

    const data = await apiRequest(url, {
      method: "PATCH",
    });

    console.log("✅ Respuesta de actualización:", data);

    // El backend devuelve {ok: true, mensaje: "..."}, no el cliente actualizado
    // Si la respuesta tiene ok: true, o si es un objeto con el cliente actualizado
    if (
      data &&
      (data.ok === true || data.ok === "true" || data.id_cliente || data.id)
    ) {
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
    const url = `${
      ENDPOINTS.DELETE_ADMIN_CLIENT
    }?id_cliente=${encodeURIComponent(id)}`;

    const data = await apiRequest(url, {
      method: "DELETE", // El backend usa DELETE, no PATCH
    });

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

// Obtener los servicios asociados a un cliente
export async function getClientServices(clientId: string): Promise<string[]> {
  try {
    const data = await apiRequest(ENDPOINTS.CLIENT_SERVICES(clientId), {
      method: "GET",
    });

    console.log("📥 Servicios del cliente recibidos:", data);
    // El backend devuelve {servicios_clientes: [...]}
    // Intentar devolver id_servicio cuando esté disponible; si no, devolver nombre como fallback
    if (
      data &&
      data.servicios_clientes &&
      Array.isArray(data.servicios_clientes)
    ) {
      const keys = data.servicios_clientes.map((s: any) => {
        console.log("🔄 Procesando servicio del cliente (raw):", s);
        // Priorizar id_servicio (el id real del servicio), luego id_cliente_servicio (relación), luego nombre
        if (s.id_servicio) return String(s.id_servicio);
        if (s.id_cliente_servicio) return String(s.id_cliente_servicio);
        if (s.nombre) return String(s.nombre);
        return null;
      }).filter(Boolean) as string[];

      console.log("✅ Keys de servicios del cliente (id_servicio|fallback):", keys);
      return keys;
    }

    return [];
  } catch (error) {
    console.error("Error loading client services:", error);
    return [];
  }
}

/**
 * Actualizar los servicios asociados a un cliente
 * @param clientId ID del cliente
 * @param serviceIds Array de IDs de servicios a asociar
 */
export async function updateClientServices(
  clientId: string,
  serviceIds: string[]
): Promise<void> {
  try {
    console.log("🔄 Actualizando servicios del cliente (by id):", {
      clientId,
      serviceIds,
    });

    // Construir la URL con query params según el patrón establecido
    // FastAPI espera un parámetro de lista `servicios_clientes: list[str]`.
    // En la query string lo enviaremos como múltiples pares `servicios_clientes=id1&servicios_clientes=id2...`.
    const serviciosParams = serviceIds
      .map((s) => `servicios_clientes=${encodeURIComponent(s)}`)
      .join("&");
    const url = `${ENDPOINTS.UPDATE_CLIENT_SERVICES}?id_cliente=${encodeURIComponent(
      clientId
    )}&${serviciosParams}`;

    const response = await apiRequest(url, {
      method: "PATCH",
    });

    console.log("✅ Servicios del cliente actualizados (respuesta):", response);
  } catch (error) {
    console.error("Error updating client services:", error);
    throw error;
  }
}
