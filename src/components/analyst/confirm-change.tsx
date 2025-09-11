import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { getStatusIcon, getStatusColor } from "@/lib/colorUtils";
import { TicketStatus } from "@/types"

interface ConfirmChangeProps {
  isOpen: boolean;
  currentStatus: string;
  newStatus: string;
  onConfirm: (summary?: string) => void;
  onCancel: () => void;
}

const ConfirmChange: React.FC<ConfirmChangeProps> = ({
  isOpen,
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
}) => {
  const [summary, setSummary] = useState("");

  const handleConfirm = () => {
    // Verificar si es un estado que requiere resumen
    if (newStatus === TicketStatus.RESUELTO || newStatus === TicketStatus.RECHAZADO) {
      if (!summary.trim()) {
        return; // No permite confirmar sin resumen
      }
      onConfirm(summary);
    } else {
      onConfirm();
    }
    // Limpiar resumen después de confirmar
    setSummary("");
  };

  const handleCancel = () => {
    setSummary(""); // Limpiar resumen al cancelar
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleCancel}
      />

      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-none max-w-md w-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-down">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center text-white rounded-t-3xl">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Confirmar Cambio</h3>
          <p className="text-sm opacity-90">
            ¿Estás seguro que deseas cambiar el estado del ticket?
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-100 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`${getStatusColor(currentStatus)}`}>
                  {getStatusIcon(currentStatus)}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {currentStatus}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-slate-400">
                <span className="text-xl">→</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`${getStatusColor(newStatus)}`}>
                  {getStatusIcon(newStatus)}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {newStatus}
                </span>
              </div>
            </div>
          </div>

          {(newStatus === TicketStatus.RESUELTO || newStatus === TicketStatus.RECHAZADO) && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                Descripción del cierre <span className="text-red-500">*</span>
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe brevemente el motivo de este cambio de estado..."
                className={`w-full h-24 p-4 bg-slate-50 border-2 rounded-xl text-sm resize-none focus:outline-none focus:bg-white transition-all duration-300 ${
                  (newStatus === TicketStatus.RESUELTO || newStatus === TicketStatus.RECHAZADO) && !summary.trim()
                    ? "border-red-300 focus:border-red-500"
                    : "border-slate-200 focus:border-emerald-500"
                }`}
                required
              />
              {(newStatus === TicketStatus.RESUELTO || newStatus === TicketStatus.RECHAZADO) && !summary.trim() && (
                <p className="text-xs text-red-500 mt-1">
                  La descripción del cierre es obligatoria
                </p>
              )}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 px-4 bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-slate-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={(newStatus === TicketStatus.RESUELTO || newStatus === TicketStatus.RECHAZADO) && !summary.trim()}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:-translate-y-1 ${
                (newStatus === TicketStatus.RESUELTO || newStatus === TicketStatus.RECHAZADO) && !summary.trim()
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:opacity-90"
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmChange;
