import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import React from "react";

export const getStatusIcon = (estado: string): React.ReactElement => {
  switch (estado) {
    case "Nuevo":
      return <AlertCircle className="w-4 h-4" />;
    case "En Progreso":
      return <Clock className="w-4 h-4" />;
    case "Resuelto":
      return <CheckCircle2 className="w-4 h-4" />;
    case "Rechazado":
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
    Nuevo: {
      normal: "bg-blue-50 text-blue-700 border border-blue-200",
      current:
        "bg-blue-50 text-blue-700 border-2 border-blue-400 ring-2 ring-blue-200",
      disabled: "bg-gray-50 text-gray-400 border border-gray-200",
    },
    "En Progreso": {
      normal: "bg-amber-50 text-amber-700 border border-amber-200",
      current:
        "bg-amber-50 text-amber-700 border-2 border-amber-400 ring-2 ring-amber-200",
      disabled: "bg-gray-50 text-gray-400 border border-gray-200",
    },
    Resuelto: {
      normal: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      current:
        "bg-emerald-50 text-emerald-700 border-2 border-emerald-400 ring-2 ring-emerald-200",
      disabled: "bg-gray-50 text-gray-400 border border-gray-200",
    },
    Rechazado: {
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
    case "Nuevo":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "En Progreso":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Resuelto":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Rechazado":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

// CORREGIDO: Solo usando colores Tailwind válidos
export const getStatusColorDisabled = (estado: string): string => {
  switch (estado) {
    case "Nuevo":
      return "bg-gray-50 text-gray-400 border border-gray-200";
    case "En Progreso":
      return "bg-gray-50 text-gray-400 border border-gray-200";
    case "Resuelto":
      return "bg-gray-50 text-gray-400 border border-gray-200";
    case "Rechazado":
      return "bg-gray-50 text-gray-400 border border-gray-200";
    default:
      return "bg-gray-50 text-gray-400 border border-gray-200";
  }
};

export const getStatusBadge = (estado: string): string => {
  const styles: Record<string, string> = {
    Nuevo: "bg-blue-50 text-blue-700 border border-blue-200",
    "En Progreso": "bg-amber-50 text-amber-700 border border-amber-200",
    Resuelto: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Rechazado: "bg-red-50 text-red-700 border border-red-200",
  };
  return styles[estado] || "bg-gray-50 text-gray-700 border border-gray-200";
};

export const getStatusColorBG = (estado: string): string => {
  const styles: Record<string, string> = {
    Nuevo: "bg-blue-400",
    "En Progreso": "bg-amber-400",
    Resuelto: "bg-emerald-400",
    Rechazado: "bg-red-400",
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
