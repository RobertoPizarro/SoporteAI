import React from "react";
import { Ticket, TicketStatus } from "@/types";
import { getStatusIcon, getStatusColorButton } from "@/lib/colorUtils";
import { CheckCircle2, XCircle, AlertTriangle, Settings, ArrowUp } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

const TicketManagement = ({
  currentTicket,
  handleStatusChange,
  onEscalateTicket,
  onModifyTicket,
}: {
  currentTicket: Ticket;
  handleStatusChange: (status: string) => void;
  onEscalateTicket: () => void;
  onModifyTicket: () => void;
}) => {
  // 🔥 Usar el hook para obtener datos del usuario actual
  const { nivel, isAnalista, isLoading } = useCurrentUser();

  // Función para verificar si el botón de escalar debe estar deshabilitado
  const isEscalateDisabled = () => {
    // Si el ticket está cerrado
    if (isTicketClosed()) return true;

    // Si no es analista, no puede escalar
    if (!isAnalista) return true;

    // Si es analista nivel 4 (máximo), no puede escalar más
    if (nivel === 4) return true;

    return false;
  };

  const isModificationDisabled = () => {
    // Si el ticket está cerrado
    if (isTicketClosed()) return true;
  }

  // Función para obtener el mensaje del botón escalar
  const getEscalateButtonText = () => {
    if (isLoading) return "Cargando...";
    if (isTicketClosed()) return "Escalar ticket";
    if (!isAnalista) return "Escalar ticket";
    if (nivel === 4) return "Nivel máximo alcanzado";
    return "Escalar ticket";
  };
  // Función para determinar si un estado está deshabilitado
  const isStatusDisabled = (targetStatus: string) => {
    const currentStatus = currentTicket.estado;

    switch (currentStatus) {
      case TicketStatus.NUEVO:
        // Desde "Nuevo" solo puede ir a "En Progreso"
        return targetStatus !== TicketStatus.EN_PROGRESO;

      case TicketStatus.EN_PROGRESO:
        // Desde "En Progreso" puede ir a "Resuelto" o "Rechazado"
        return ![TicketStatus.RESUELTO, TicketStatus.RECHAZADO].includes(
          targetStatus as TicketStatus
        );

      case TicketStatus.RESUELTO:
      case TicketStatus.RECHAZADO:
        // Estados finales: no pueden cambiar a ningún otro estado
        return true;

      default:
        return false;
    }
  };

  // Función para determinar si el ticket está en estado final
  const isTicketClosed = () => {
    return [TicketStatus.RESUELTO, TicketStatus.RECHAZADO].includes(
      currentTicket.estado as TicketStatus
    );
  };

  // Función para obtener el mensaje y estilo del aviso
  const getClosedTicketAlert = () => {
    const currentStatus = currentTicket.estado;

    switch (currentStatus) {
      case TicketStatus.RESUELTO:
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          message: "Este ticket ya ha sido resuelto satisfactoriamente",
          bgColor: "bg-emerald-50 border-emerald-200",
          textColor: "text-emerald-800",
          accentColor: "border-l-emerald-500",
        };
      case TicketStatus.RECHAZADO:
        return {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          message:
            "Este ticket ha sido rechazado y no requiere acciones adicionales",
          bgColor: "bg-red-50 border-red-200",
          textColor: "text-red-800",
          accentColor: "border-l-red-500",
        };
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        Gestión de Estado
      </h3>

      {/* Aviso para tickets en estado final */}
      {isTicketClosed() && (
        <div
          className={`
          ${getClosedTicketAlert()?.bgColor} ${
            getClosedTicketAlert()?.textColor
          }
          border ${getClosedTicketAlert()?.accentColor} border-l-4
          rounded-lg p-4 mb-6 backdrop-blur-sm
          animate-in slide-in-from-top-2 duration-300
        `}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getClosedTicketAlert()?.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">
                {getClosedTicketAlert()?.message}
              </p>
              <p className="text-xs opacity-75 mt-1">
                Los botones de cambio de estado están deshabilitados para este
                ticket.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(TicketStatus).map((status) => {
            const isDisabled = isStatusDisabled(status);
            const isCurrentStatus = currentTicket.estado === status;

            return (
              <button
                key={status}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleStatusChange(status)}
                className={`
                  flex items-center justify-center space-x-2 py-3 px-4 rounded-xl 
                  font-medium text-sm transition-all duration-300
                  ${getStatusColorButton(status, isDisabled, isCurrentStatus)}
                  ${
                    isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : isCurrentStatus
                      ? "shadow-md"
                      : "hover:shadow-md transform hover:scale-105"
                  }
                `}
              >
                <span className={isDisabled ? "opacity-50" : ""}>
                  {getStatusIcon(status)}
                </span>
                <span>{status}</span>
              </button>
            );
          })}
        </div>
      </div>
      <button
        disabled={isModificationDisabled()}
        onClick={onModifyTicket}
        className={`w-full py-3 px-4 mt-6 font-semibold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
          isModificationDisabled()
            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-none"
            : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-xl hover:scale-105"
        }`}
      >
        <Settings className="w-4 h-4" />
        Modificar nivel de ticket
      </button>
      <button
        disabled={isEscalateDisabled()}
        onClick={onEscalateTicket}
        className={`w-full py-3 px-4 mt-6 font-semibold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
          isEscalateDisabled()
            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-none"
            : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-xl hover:scale-105"
        }`}
      >
        {/* 🔥 Mostrar ícono de advertencia si es nivel máximo */}
        {nivel === 4 && !isTicketClosed() && (
          <AlertTriangle className="w-4 h-4" />
        )}
        {<ArrowUp className="w-4 h-4" />}
        {getEscalateButtonText()}
      </button>
    </div>
  );
};

export default TicketManagement;
