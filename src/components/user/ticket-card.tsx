import React from "react";
import {
  FileText,
  CheckCircle,
  Hash,
  ShieldAlert,
  User,
  UserCog,
  Sparkles,
  ArrowBigUp,
  Clock,
  Calendar,
} from "lucide-react";
import { Ticket } from "@/types";

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  // Función para capitalizar texto
  const capitalize = (text: string | number | null | undefined): string => {
    if (!text) return '';
    const str = String(text);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Parsear información del usuario si viene como string JSON
  const getUserName = (usuario: any): string => {
    if (typeof usuario === 'string') {
      try {
        const parsed = JSON.parse(usuario.replace(/'/g, '"'));
        return parsed.name || parsed.email || 'Usuario no especificado';
      } catch (error) {
        return usuario;
      }
    }
    return usuario?.name || usuario?.email || 'Usuario no especificado';
  };

  const userName = getUserName(ticket.usuario);

  return (
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg animate-slideInUp">
    <div className="flex items-center mb-4">
      <FileText className="w-6 h-6 text-blue-600 mr-3" />
      <h3 className="text-lg font-bold text-gray-800">
        Ticket de Soporte Generado
      </h3>
      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
    </div>

    <div className="space-y-3">
      <div className="flex items-center">
        <Hash className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 w-20">ID:</span>
        <span className="text-sm font-semibold text-blue-600">{ticket.id}</span>
      </div>

      <div className="flex items-center">
        <ShieldAlert className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 w-20">Tipo:</span>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 border-orange-200 rounded-full text-sm font-medium ">
          {capitalize(ticket.tipo)}
        </span>
      </div>

      <div className="flex items-center">
        <User className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 w-20">Usuario:</span>
        <span className="text-sm text-gray-700">{userName}</span>
      </div>

      <div className="flex items-center">
        <UserCog className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 w-20">Analista:</span>
        <span className="text-sm text-gray-700">{ticket.analista || 'Por asignar'}</span>
      </div>

      <div className="flex items-start">
        <FileText className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
        <span className="text-sm text-gray-600 w-20">Asunto:</span>
        <span className="text-sm font-medium">{capitalize(ticket.asunto)}</span>
      </div>

      <div className="flex items-center">
        <Sparkles className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 w-20">Servicio:</span>
        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-cyan-100 text-green-700 rounded-full text-sm font-medium">
          {ticket.servicio}
        </span>
      </div>

      <div className="flex items-center">
        <ArrowBigUp className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 w-20">Nivel:</span>
        <span className="text-sm text-gray-700">{capitalize(ticket.nivel)}</span>
      </div>

      <div className="flex items-center">
        <Clock className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 w-20">Estado:</span>
        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {capitalize(ticket.estado)}
        </span>
      </div>

      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 w-20">Fecha:</span>
        <span className="text-sm text-gray-700">{ticket.fechaCreacion}</span>
      </div>
    </div>
  </div>
  );
};

export default TicketCard;
