import { useState, useEffect } from "react";
import { Ticket, Colaborador } from "@/types";
import { getTicketById, getUserById, updateTicketStatus, escalateTicket } from "@/services/ticket.service";

export default function useTicket(id: string) {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<Colaborador | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  async function handleFindUser(userId: string): Promise<Colaborador | null> {
    const user = await getUserById(userId);
    return user;
  }

  const handleStatusChange = (newStatus: string) => {
    if (currentTicket && newStatus !== currentTicket.estado) {
      setPendingStatus(newStatus);
      setShowStatusModal(true);
    }
  };

  const handleConfirmStatusChange = async (solution?: string) => {
    if (currentTicket && pendingStatus) {
      try {
        // Usar el service para actualizar el ticket
        const response = await updateTicketStatus(
          currentTicket.id,
          pendingStatus,
          solution
        );
        
        // El backend solo devuelve un mensaje de confirmación, no el ticket actualizado
        // Por eso necesitamos recargar el ticket manualmente
        console.log("✅ Estado actualizado:", response);
        
        // Recargar el ticket actualizado
        const refreshedTicket = await getTicketById(currentTicket.id);
        if (refreshedTicket) {
          setCurrentTicket(refreshedTicket);
        }
        
        setShowStatusModal(false);
        setPendingStatus(null);
      } catch (error) {
        console.error("Error al actualizar ticket:", error);
        // Aquí podrías mostrar un toast/alert con el error
        alert(error instanceof Error ? error.message : "Error al actualizar el ticket");
      }
    }
  };

  const handleCancelStatusChange = () => {
    setShowStatusModal(false);
    setPendingStatus(null);
  };

  const handleEscalateTicket = () => {
    setShowEscalateModal(true);
  };

  const handleConfirmEscalateTicket = async (reason: string) => {
    if (!currentTicket) {
      console.error("No hay ticket para escalar");
      return;
    }

    try {
      console.log(`Escalando ticket ${currentTicket.id} con razón: ${reason}`);
      
      // Llamar al service para escalar el ticket
      const result = await escalateTicket(currentTicket.id, reason);
      
      if (result) {
        console.log("✅ Escalación exitosa:", result.mensaje);
        
        // Opcional: Recargar el ticket para mostrar los cambios
        const updatedTicket = await getTicketById(currentTicket.id);
        if (updatedTicket) {
          setCurrentTicket(updatedTicket);
        }
        
        // Cerrar el modal
        setShowEscalateModal(false);
        
        // Opcional: Mostrar mensaje de éxito al usuario
        // alert(result.mensaje); // Podrías usar un toast en lugar de alert
      }
    } catch (error) {
      console.error("Error al escalar ticket:", error);
      
      // Mostrar error al usuario
      alert(
        error instanceof Error 
          ? error.message 
          : "Error al escalar el ticket. Intenta nuevamente."
      );
      
      // Mantener el modal abierto para que el usuario pueda reintentar
    }
  };

  const handleCancelEscalateTicket = () => {
    setShowEscalateModal(false);
  };

  // Lógica para cargar el ticket y el usuario asociado, habría que reemplazar por llamada a un service o aun endpoint
  useEffect(() => {
    const loadTicketData = async () => {
      if (id) {
        // Usar service en lugar de datos locales directos
        const foundTicket = await getTicketById(id);
        setCurrentTicket(foundTicket);

        if (foundTicket) {
          const userData = await handleFindUser(foundTicket.usuario);
          setUser(userData);
        } 

        setIsLoading(false);
      }
    };

    loadTicketData();
  }, [id]);

  return {
    currentTicket,
    user,
    isLoading,
    showStatusModal,
    pendingStatus,
    showEscalateModal,
    handleStatusChange,
    handleConfirmStatusChange,
    handleCancelStatusChange,
    handleEscalateTicket,
    handleConfirmEscalateTicket,
    handleCancelEscalateTicket
  };
}
