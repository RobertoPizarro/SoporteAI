import React from "react";
import { Ticket } from "@/types";

const SidebarTicket = ({
  currentTicket,
  handleStatusChange,
}) => {
  return (
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
  );
};

export default SidebarTicket;
