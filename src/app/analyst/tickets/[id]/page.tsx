"use client";

import React, { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatMessagesList from "@/components/chat/chat-messages-list";
import ChatHeader from "@/components/chat/chat-header";
import ConfirmChange from "@/components/analyst/confirm-change";
import EscalateTicketModal from "@/components/analyst/escalate-ticket-modal";
import ModifyTicketModal from "@/components/analyst/modify-ticket-modal";
import PageAnimations from "@/components/ui/page-animations";
import TicketDetail from "@/components/ticket/ticket-detail";
import TicketManagement from "@/components/ticket/ticket-management";
import { getChatByTicket } from "@/services/chat.service";
import useTicket from "@/hooks/use-ticket";

const TicketDetailsPage = () => {
  const params = useParams();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(true);

  const {
    currentTicket,
    escalationInfo,
    isLoading,
    showStatusModal,
    pendingStatus,
    showEscalateModal,
    showModifyModal,
    handleStatusChange,
    handleModifyTicket,
    handleConfirmStatusChange,
    handleCancelStatusChange,
    handleEscalateTicket,
    handleConfirmEscalateTicket,
    handleCancelEscalateTicket,
    handleConfirmModifyTicket,
    handleCancelModifyTicket,
    handleGetEscalatedTickets,
  } = useTicket(params.id as string);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 🔍 DEBUG: Intentar cargar información de escalación automáticamente
  useEffect(() => {
    const loadEscalationInfo = async () => {
      if (currentTicket && handleGetEscalatedTickets) {
        try {
          await handleGetEscalatedTickets();
        } catch (error) {
        }
      }
    };

    loadEscalationInfo();
  }, [currentTicket?.id]); // Solo depende del ID del ticket, no de la función

  // Cargar mensajes del chat cuando se carga el ticket
  useEffect(() => {
    const loadChatMessages = async () => {
      if (!params.id) return;
      
      try {
        setIsChatLoading(true);
        const messages = await getChatByTicket(params.id as string);
        setChatMessages(messages);
      } catch (error) {
        console.error("❌ Error cargando chat:", error);
        setChatMessages([]); // Chat vacío en caso de error
      } finally {
        setIsChatLoading(false);
      }
    };

    loadChatMessages();
  }, [params.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-700">
            Cargando información del ticket...
          </h2>
          <p className="text-slate-500">Un momento por favor</p>
        </div>
      </div>
    );
  }

  if (!currentTicket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700">
            Ticket no encontrado
          </h2>
          <p className="text-slate-500">El ticket solicitado no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
      <PageAnimations />
      <ChatHeader role="analyst" />
      <div className="flex flex-1 min-h-0 animate-fade-in-down">
        <div className="w-[32rem] bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-8 space-y-8">
            <TicketDetail currentTicket={currentTicket} escalationInfo={escalationInfo}/>

            <TicketManagement
              currentTicket={currentTicket}
              handleStatusChange={handleStatusChange}
              onEscalateTicket={handleEscalateTicket}
              onModifyTicket={handleModifyTicket}
            />
            
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {isChatLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm text-slate-500">Cargando conversación...</p>
              </div>
            </div>
          ) : (
            <ChatMessagesList
              messages={chatMessages}
              messagesEndRef={chatEndRef}
              role="analyst"
            />
          )}

          <div className="p-6 border-t border-slate-200/50 bg-slate-50/50 flex-shrink-0">
            <div className="text-center">
              <p className="text-xs text-slate-500">
                Solo visualización • Esta conversación ha terminado
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConfirmChange
        isOpen={showStatusModal}
        currentStatus={currentTicket?.estado || ""}
        newStatus={pendingStatus || ""}
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
      />
      <EscalateTicketModal
        isOpen={showEscalateModal}
        ticketId={currentTicket?.id || ""}
        onConfirm={handleConfirmEscalateTicket}
        onCancel={handleCancelEscalateTicket}
      />
      <ModifyTicketModal
        isOpen={showModifyModal}
        ticketId={currentTicket?.id || ""}
        currentLevel={currentTicket?.nivel || ""}
        onConfirm={handleConfirmModifyTicket}
        onCancel={handleCancelModifyTicket}
      />
    </div>
  );
};

export default TicketDetailsPage;
