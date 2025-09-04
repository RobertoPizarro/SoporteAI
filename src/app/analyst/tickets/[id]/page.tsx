"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Message } from "@/types";
import { useParams } from "next/navigation";
import ChatMessagesList from "@/components/chat/chat-messages-list";
import { Ticket, Colaborador } from "@/types";
import ChatHeader from "@/components/chat/chat-header";
import { tickets } from "@/data/tickets";
import ConfirmChange from "@/components/analyst/confirm-change";
import PageAnimations from "@/components/ui/page-animations";


const TicketDetailsPage = () => {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<Colaborador | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  async function handleFindUser(userId: string): Promise<Colaborador | null> {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) {
        return null;
      }
      return (await res.json()) as Colaborador;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  useEffect(() => {
    const loadTicketData = async () => {
      if (params.id) {
        const foundTicket = tickets.find((t) => t.id === params.id) || null;
        setCurrentTicket(foundTicket);
        
        if (foundTicket) {
          const userData = await handleFindUser(foundTicket.usuario);
          setUser(userData);
        }
        
        setIsLoading(false);
      }
    };

    loadTicketData();
  }, [params.id]);

  const [chatMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "¡Hola! Soy el asistente virtual de Analytics Support. Estoy aquí para ayudarte con cualquier consulta o incidencia que tengas con nuestros servicios. Por favor, describe tu problema o requerimiento.",
    },
    {
      id: 2,
      type: "user",
      content:
        "Hola, soy de la empresa Claro. Tengo problemas con el servicio de GeoPoint.",
    },
    {
      id: 3,
      type: "bot",
      content:
        "Gracias por contactarnos. Para poder brindarte el mejor soporte y registrar tu consulta correctamente, necesito validar tu identidad. ¿Podrías proporcionarme tu nombre completo o tu DNI, por favor?",
    },
    {
      id: 4,
      type: "user",
      content: "Mi DNI es 75311031",
    },
    {
      id: 5,
      type: "bot",
      content:
        "¡Perfecto, Roberto! He verificado tu identidad exitosamente. Veo que tienes problemas con el servicio de GeoPoint. Para poder asistirte de la mejor manera, ¿podrías proporcionarme más detalles específicos sobre el inconveniente que estás experimentando?",
    },
    {
      id: 6,
      type: "user",
      content:
        "El servicio de GeoPoint está mostrando mi ubicación en un lugar incorrecto en el mapa. Este problema comenzó desde ayer y no logro entender la causa. La precisión de geolocalización se ha visto comprometida.",
    },
    {
      id: 7,
      type: "bot",
      content:
        "Entiendo perfectamente la situación, Roberto. Los problemas de precisión en geolocalización pueden afectar significativamente las operaciones. Procederé inmediatamente a crear un ticket de soporte para que nuestro equipo técnico especializado pueda atender tu caso con la prioridad que requiere.",
    },
    {
      id: 8,
      type: "bot",
      content:
        "He generado tu ticket de soporte. A continuación te muestro los detalles para tu confirmación:",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Nuevo":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "En Progreso":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Resuelto":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Rechazado":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "Nuevo":
        return <AlertCircle className="w-4 h-4" />;
      case "En Progreso":
        return <Clock className="w-4 h-4" />;
      case "Resuelto":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Rechazado":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  {currentTicket.asunto}
                </h2>
                <div className="space-y-4">
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                    {currentTicket.id}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium border bg-orange-100 text-orange-700 border-orange-200 px-3 py-2 rounded-full">
                      {currentTicket.tipo}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500">
                      <div className="bg-slate-100 px-3 py-2 rounded-lg">
                        Creación: {currentTicket.fechaCreacion}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      <div className="bg-slate-100 px-3 py-2 rounded-lg">
                        Última actualización: {currentTicket.actualizacion}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50/70 rounded-2xl p-4">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Usuario
                  </label>
                  <p className="text-sm font-semibold text-slate-800 mt-2">
                    {currentTicket.usuario}
                  </p>
                </div>
                <div className="bg-slate-50/70 rounded-2xl p-4">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Correo
                  </label>
                  <p className="text-sm font-semibold text-slate-800 mt-2">
                    {user?.correo || "Correo no disponible"}
                  </p>
                </div>
                <div className="bg-slate-50/70 rounded-2xl p-4">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Servicio
                  </label>
                  <p className="text-sm font-semibold text-slate-800 mt-2">
                    {currentTicket.servicio}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">
                Gestión de Estado
              </h3>
              <div>
                <div className="grid grid-cols-2 gap-3">
                  {["Nuevo", "En Progreso", "Resuelto", "Rechazado"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                          currentTicket.estado === status
                            ? getStatusColor(status) + " shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {getStatusIcon(status)}
                        <span>{status}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <ChatMessagesList
            messages={chatMessages}
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