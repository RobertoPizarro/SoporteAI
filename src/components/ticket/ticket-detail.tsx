import { Ticket, Colaborador } from "@/types";
import React from "react";

const TicketDetail = ({ currentTicket, user }: { currentTicket: Ticket, user: Colaborador | null }) => {
  return (
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
  );
};

export default TicketDetail;
