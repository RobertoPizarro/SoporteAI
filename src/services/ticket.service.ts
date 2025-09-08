import { Ticket, Colaborador } from "@/types";

// Obtener ticket por ID
export const getTicketById = async (id: string): Promise<Ticket | null> => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/tickets/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el ticket");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    return null;
  }
};

// Obtener usuario por ID
export const getUserById = async (userId: string): Promise<Colaborador | null> => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
};
