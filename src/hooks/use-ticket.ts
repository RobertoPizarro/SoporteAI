import { useState, useEffect } from "react";
import { Ticket, Colaborador } from "@/types";
import { getTicketById, getUserById } from "@/services/ticket.service"; // updateTicketStatus, escalateTicket

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

  const handleConfirmStatusChange = () => {
    if (currentTicket && pendingStatus) {
      setCurrentTicket({ ...currentTicket, estado: pendingStatus });
      setShowStatusModal(false);
      setPendingStatus(null);
    }
  };

  const handleCancelStatusChange = () => {
    setShowStatusModal(false);
    setPendingStatus(null);
  };

  const handleEscalateTicket = () => {
    setShowEscalateModal(true);
  };

  const handleConfirmEscalateTicket = (reason: string) => {
    console.log(`Escalando ticket ${currentTicket?.id} con razón: ${reason}`);
    // Aquí puedes agregar la lógica para escalar el ticket
    // Por ejemplo, llamar a una API o actualizar el estado del ticket
    setShowEscalateModal(false);
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
