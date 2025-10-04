import { Ticket, TicketNivel, EscalationInformation } from "@/types";
import React, { useEffect, useMemo } from "react";

const TicketDetail = ({
  currentTicket,
  escalationInfo
}: {
  currentTicket: Ticket;
  escalationInfo: EscalationInformation | null;
}) => {

  // � Debug: Mostrar información de escalación en consola
  useEffect(() => {
    console.log("🔍 [DEBUG] EscalationInfo recibido:", escalationInfo);
    console.log("🔍 [DEBUG] Ticket actual:", currentTicket.id);
    
    if (escalationInfo) {
      console.log("✅ [DEBUG] SÍ hay información de escalación:", escalationInfo);
    } else {
      console.log("❌ [DEBUG] NO hay información de escalación para este ticket");
    }
  }, [escalationInfo, currentTicket.id]);

  // �🕒 Calcular tiempo de duración después de que se haga la comparación
  const tiempoDuracion = useMemo(() => {


    if (currentTicket.nivel === TicketNivel.BAJO) {
      return 32;
    } else if (currentTicket.nivel === TicketNivel.MEDIO) {
      return 16;
    } else if (currentTicket.nivel === TicketNivel.ALTO) {
      return 8;
    } else if (currentTicket.nivel === TicketNivel.CRITICO) {
      return 4;
    }
    
    // Valor por defecto
    return 0;
  }, [currentTicket.nivel]); // Se recalcula solo cuando cambia el nivel

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {currentTicket.asunto}
        </h2>
        <div className="space-y-4">
          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
            TCK-{currentTicket.id}
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
                Última actualización: {currentTicket.fechaActualizacion}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50/70 rounded-2xl p-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Tiempo de atención
          </label>
          <p className="text-sm font-semibold text-slate-800 mt-2">
            {tiempoDuracion} horas
          </p>
        </div>
        <div className="bg-slate-50/70 rounded-2xl p-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Cliente
          </label>
          <p className="text-sm font-semibold text-slate-800 mt-2">
            {currentTicket.cliente}
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
        <div className="bg-slate-50/70 rounded-2xl p-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Asunto
          </label>
          <p className="text-sm font-semibold text-slate-800 mt-2">
            {currentTicket.asunto}
          </p>
        </div>
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
            {currentTicket.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
