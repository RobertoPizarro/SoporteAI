import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

export const getStatusIcon = (estado: string) => {
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

export const getStatusColor = (estado: string) => {
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
