import React from "react";
import { Ticket, TicketStatus } from "@/types";
import { getStatusIcon, getStatusColorButton } from "@/lib/colorUtils";

const TicketManagement = ({
  currentTicket,
  handleStatusChange,
  onEscalateTicket,
}: {
  currentTicket: Ticket;
  handleStatusChange: (status: string) => void;
  onEscalateTicket: () => void;
}) => {
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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        Gestión de Estado
      </h3>
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
        onClick={onEscalateTicket}
        className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
      >
        Escalar ticket
      </button>
    </div>
  );
};

export default TicketManagement;
