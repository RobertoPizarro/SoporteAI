import React from "react";
import { Ticket } from "@/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { Eye} from "lucide-react";
import {
  getStatusIcon,
  getStatusBadge,
  getStatusColorBG,
} from "@/lib/colorUtils";

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  return (
    <div
      key={ticket.id}
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div
            className={`w-1 h-16 ${getStatusColorBG(
              ticket.estado
            )} rounded-full`}
          ></div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                TCK-{ticket.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  ticket.estado === "Rechazado" 
                    ? "bg-red-100 text-red-800 border border-red-200" // 🔴 Forzar rojo para Rechazado
                    : getStatusBadge(ticket.estado)
                }`}
              >
                {getStatusIcon(ticket.estado)}
                {ticket.estado}
              </span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                {ticket.tipo}
              </span>
            </div>

            <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">
              {ticket.asunto}
            </h3>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>👤 {ticket.usuario}</span>
              <span>🔧 {ticket.servicio}</span>
              <span>📅 {ticket.fechaCreacion}</span>
            </div>
          </div>
        </div>

        <Button asChild className="ml-4" size="sm">
          <Link
            href={`/analyst/tickets/${ticket.id}`}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TicketCard;
