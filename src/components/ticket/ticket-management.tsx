import React from "react";
import { Ticket } from "@/types";
import { getStatusIcon, getStatusColor } from "@/lib/colorUtils";

const TicketManagement = ({
  currentTicket,
  handleStatusChange,
}: {
  currentTicket: Ticket;
  handleStatusChange: (status: string) => void;
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        Gestión de Estado
      </h3>
      <div>
        <div className="grid grid-cols-2 gap-3">
          {["Nuevo", "En Progreso", "Resuelto", "Rechazado"].map((status) => (
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
          ))}
        </div>
      </div>
      <button className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
        Escalar ticket
      </button>
    </div>
  );
};

export default TicketManagement;
