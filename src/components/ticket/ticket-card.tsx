import React from "react";
import { Ticket } from "@/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { Eye, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

const TicketCard = ({ticket}: {ticket: Ticket}) => {
  const getStatusColor = (estado: string) => {
    const styles: { [key: string]: string } = {
      Nuevo: "bg-blue-400 ",
      "En Progreso": "bg-amber-400  ",
      Resuelto: "bg-emerald-400 ",
      Rechazado: "bg-red-400  ",
    };
    return styles[estado] || "bg-gray-50 text-gray-700 border border-gray-200";
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "Nuevo":
        return <AlertCircle className="w-3 h-3" />;
      case "En Progreso":
        return <Clock className="w-3 h-3" />;
      case "Resuelto":
        return <CheckCircle className="w-3 h-3" />;
      case "Rechazado":
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusBadge = (estado: string) => {
    const styles: { [key: string]: string } = {
      'Nuevo': 'bg-blue-50 text-blue-700 border border-blue-200',
      'En Progreso': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Resuelto': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Rechazado': 'bg-red-50 text-red-700 border border-red-200'
    };
    return styles[estado] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  return (
    <div
      key={ticket.id}
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div
            className={`w-1 h-16 ${getStatusColor(ticket.estado)} rounded-full`}
          ></div>
          {/** Colores, cambiar si se toma en importancia el nivel de los tickets */}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {ticket.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadge(
                  ticket.estado
                )}`}
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
