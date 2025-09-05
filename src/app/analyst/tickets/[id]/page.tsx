"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import ChatMessagesList from "@/components/chat/chat-messages-list";
import { Ticket, Colaborador } from "@/types";
import ChatHeader from "@/components/chat/chat-header";
import { tickets } from "@/data/tickets";
import ConfirmChange from "@/components/analyst/confirm-change";
import PageAnimations from "@/components/ui/page-animations";
import TicketDetail from "@/components/ticket/ticket-detail";
import TicketManagement from "@/components/ticket/ticket-management";
import { conversationFlow } from "@/data/conversation-flow";
import useTicket from "@/hooks/use-ticket";

const TicketDetailsPage = () => {
  const params = useParams();

  const {
    currentTicket,
    user,
    isLoading,
    showStatusModal,
    pendingStatus,
    handleStatusChange,
    handleConfirmStatusChange,
    handleCancelStatusChange
  } = useTicket(params.id as string);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700">
            Cargando ticket...
          </h2>
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
            <TicketDetail currentTicket={currentTicket} user={user} />

            <TicketManagement
              currentTicket={currentTicket}
              handleStatusChange={handleStatusChange}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <ChatMessagesList
            messages={conversationFlow}
            messagesEndRef={chatEndRef}
            role="analyst"
          />

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
    </div>
  );
};

export default TicketDetailsPage;
