import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ticket, EscalationInformation } from "@/types";
import { getTicketById, updateTicketStatus, escalateTicket, updateTicketLevel, getEscalatedTickets } from "@/services/ticket.service";

export default function useTicket(id: string) {
  const router = useRouter();
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [escalationInfo, setEscalationInfo] = useState<EscalationInformation | null>(null);
  const [isLoadingEscalation, setIsLoadingEscalation] = useState(false);

  const handleGetEscalatedTickets = async (): Promise<EscalationInformation | null> => {
    if (!currentTicket) {
      console.error("No hay ticket para obtener información de escalación");
      return null;
    }

    try {
      setIsLoadingEscalation(true);
      console.log(`Obteniendo información de escalación para ticket ${currentTicket.id}`);
      
      const escalationData = await getEscalatedTickets(currentTicket.id);
      
      if (escalationData) {
        console.log("✅ Información de escalación obtenida:", escalationData);
        setEscalationInfo(escalationData);
        return escalationData;
      }
      
      return null;
    } catch (error) {
      console.error("Error al obtener información de escalación:", error);
      
      // Solo loggeamos el error, sin mostrar alert molesto
      // Si es necesario mostrar al usuario, se puede hacer en el componente que llama esta función
      
      return null;
    } finally {
      setIsLoadingEscalation(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (currentTicket && newStatus !== currentTicket.estado) {
      setPendingStatus(newStatus);
      setShowStatusModal(true);
    }
  };

  const handleModifyTicket = () => {
    setShowModifyModal(true);
  };

  const handleConfirmModifyTicket = async (newLevel: string) => {
    if (!currentTicket) {
      console.error("No hay ticket para modificar");
      return;
    }

    try {
      console.log(`Modificando nivel del ticket ${currentTicket.id} de "${currentTicket.nivel}" a "${newLevel}"`);
      
      // 🚀 Llamar al service para modificar el nivel del ticket
      const result = await updateTicketLevel(currentTicket.id, newLevel);
      
      if (result) {
        console.log("✅ Nivel del ticket modificado exitosamente:", result);
        
        // Actualizar el ticket con la respuesta del backend
        setCurrentTicket(result);
        
        // Cerrar el modal
        setShowModifyModal(false);
        
        // Opcional: Mostrar mensaje de éxito
        // alert(`Nivel del ticket cambiado de "${currentTicket.nivel}" a "${newLevel}"`);
      }
      
    } catch (error) {
      console.error("Error al modificar el nivel del ticket:", error);
      
      // Mostrar error al usuario
      alert(
        error instanceof Error 
          ? error.message 
          : "Error al modificar el nivel del ticket. Intenta nuevamente."
      );
      
      // Mantener el modal abierto para que el usuario pueda reintentar
    }
  };

  const handleCancelModifyTicket = () => {
    setShowModifyModal(false);
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
        
        // 🚀 Redireccionar al dashboard después de escalar
        console.log("🏠 Redirigiendo al dashboard...");
        router.push("/analyst/dashboard");
        
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

  // Lógica para cargar el ticket
  useEffect(() => {
    const loadTicketData = async () => {
      if (id) {
        // Usar service en lugar de datos locales directos
        const foundTicket = await getTicketById(id);
        setCurrentTicket(foundTicket);
        setIsLoading(false);
      }
    };

    loadTicketData();
  }, [id]);

  return {
    currentTicket,
    isLoading,
    showStatusModal,
    pendingStatus,
    showEscalateModal,
    showModifyModal,
    escalationInfo,
    isLoadingEscalation,
    handleStatusChange,
    handleModifyTicket,
    handleConfirmStatusChange,
    handleCancelStatusChange,
    handleEscalateTicket,
    handleConfirmEscalateTicket,
    handleCancelEscalateTicket,
    handleConfirmModifyTicket,
    handleCancelModifyTicket,
    handleGetEscalatedTickets
  };
}
