import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import React from "react";
import { TicketStatus } from "@/types";

export const getStatusIcon = (estado: string): React.ReactElement => {
  switch (estado) {
    case TicketStatus.NUEVO:
      return <AlertCircle className="w-4 h-4" />;
    case TicketStatus.EN_PROGRESO:
      return <Clock className="w-4 h-4" />;
    case TicketStatus.RESUELTO:
      return <CheckCircle2 className="w-4 h-4" />;
    case TicketStatus.RECHAZADO:
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

// Función para obtener los colores de los estados
export const getStatusColorButton = (
  estado: string,
  isDisabled: boolean,
  isCurrentStatus: boolean
) => {
  const baseColors: Record<
    string,
    { normal: string; current: string; disabled: string }
  > = {
    [TicketStatus.NUEVO]: {
      normal: "bg-blue-50 text-blue-700 border border-blue-200",
      current:
        "bg-blue-50 text-blue-700 border-2 border-blue-400 ring-2 ring-blue-200",
      disabled: "bg-gray-50 text-gray-400 border border-gray-200",
    },
    [TicketStatus.EN_PROGRESO]: {
      normal: "bg-amber-50 text-amber-700 border border-amber-200",
      current:
        "bg-amber-50 text-amber-700 border-2 border-amber-400 ring-2 ring-amber-200",
      disabled: "bg-gray-50 text-gray-400 border border-gray-200",
    },
    [TicketStatus.RESUELTO]: {
      normal: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      current:
        "bg-emerald-50 text-emerald-700 border-2 border-emerald-400 ring-2 ring-emerald-200",
      disabled: "bg-gray-50 text-gray-400 border border-gray-200",
    },
    [TicketStatus.RECHAZADO]: {
      normal: "bg-red-50 text-red-700 border border-red-200",
      current:
        "bg-red-50 text-red-700 border-2 border-red-400 ring-2 ring-red-200",
      disabled: "bg-gray-50 text-gray-400 border border-gray-200",
    },
  };

  const colors = baseColors[estado] || {
    normal: "bg-gray-50 text-gray-700 border border-gray-200",
    current:
      "bg-gray-50 text-gray-700 border-2 border-gray-400 ring-2 ring-gray-200",
    disabled: "bg-gray-50 text-gray-400 border border-gray-200",
  };

  if (isDisabled) return colors.disabled;
  if (isCurrentStatus) return colors.current;
  return colors.normal;
};

export const getStatusColor = (estado: string): string => {
  switch (estado) {
    case TicketStatus.NUEVO:
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case TicketStatus.EN_PROGRESO:
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case TicketStatus.RESUELTO:
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case TicketStatus.RECHAZADO:
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

// CORREGIDO: Solo usando colores Tailwind válidos
export const getStatusColorDisabled = (estado: string): string => {
  switch (estado) {
    case TicketStatus.NUEVO:
      return "bg-gray-50 text-gray-400 border border-gray-200";
    case TicketStatus.EN_PROGRESO:
      return "bg-gray-50 text-gray-400 border border-gray-200";
    case TicketStatus.RESUELTO:
      return "bg-gray-50 text-gray-400 border border-gray-200";
    case TicketStatus.RECHAZADO:
      return "bg-gray-50 text-gray-400 border border-gray-200";
    default:
      return "bg-gray-50 text-gray-400 border border-gray-200";
  }
};

export const getStatusBadge = (estado: string): string => {
  const styles: Record<string, string> = {
    [TicketStatus.NUEVO]: "bg-blue-50 text-blue-700 border border-blue-200",
    [TicketStatus.EN_PROGRESO]: "bg-amber-50 text-amber-700 border border-amber-200",
    [TicketStatus.RESUELTO]: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    [TicketStatus.RECHAZADO]: "bg-red-50 text-red-700 border border-red-200",
  };
  return styles[estado] || "bg-gray-50 text-gray-700 border border-gray-200";
};

export const getStatusColorBG = (estado: string): string => {
  const styles: Record<string, string> = {
    [TicketStatus.NUEVO]: "bg-blue-400",
    [TicketStatus.EN_PROGRESO]: "bg-amber-400",
    [TicketStatus.RESUELTO]: "bg-emerald-400",
    [TicketStatus.RECHAZADO]: "bg-red-400",
  };
  return styles[estado] || "bg-gray-400";
};

export const getPriorityIndicator = (nivel: number): string => {
  const colors: Record<number, string> = {
    1: "bg-emerald-400",
    2: "bg-amber-400",
    3: "bg-red-400",
  };
  return colors[nivel] || "bg-gray-300";
};
