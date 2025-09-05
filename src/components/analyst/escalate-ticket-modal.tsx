import React, { useState } from 'react';
import { X, ArrowUp } from 'lucide-react';

interface EscalateTicketModalProps {
    isOpen: boolean;
    ticketId: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}

const EscalateTicketModal: React.FC<EscalateTicketModalProps> = ({
    isOpen,
    ticketId,
    onConfirm,
    onCancel,
}) => {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) {
            return; // No permite confirmar sin razón
        }
        onConfirm(reason);
        setReason(''); // Limpiar el campo después de confirmar
    };

    const handleCancel = () => {
        setReason(''); // Limpiar el campo al cancelar
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
                        <ArrowUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                        Escalar Ticket
                    </h3>
                    <p className="text-sm opacity-90">
                        ¿Estás seguro que deseas escalar este ticket a un analista de nivel superior?
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-slate-100 rounded-2xl p-4">
                        <div className="text-center">
                            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                                Ticket: {ticketId}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-700">
                            Razón de escalamiento <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explica por qué necesitas escalar este ticket (complejidad técnica, permisos especiales, etc.)..."
                            className={`w-full h-28 p-4 bg-slate-50 border-2 rounded-xl text-sm resize-none focus:outline-none focus:bg-white transition-all duration-300 ${
                                !reason.trim() 
                                    ? 'border-red-300 focus:border-red-500' 
                                    : 'border-slate-200 focus:border-emerald-500'
                            }`}
                            required
                        />
                        {!reason.trim() && (
                            <p className="text-xs text-red-500 mt-1">
                                La razón del escalamiento es obligatoria
                            </p>
                        )}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-700">
                            <strong>Nota:</strong> Una vez escalado, el ticket será asignado a un analista senior y no podrás modificarlo hasta que sea reasignado.
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleCancel}
                            className="flex-1 py-3 px-4 bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-slate-300 hover:shadow-lg transform hover:-translate-y-1"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!reason.trim()}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:-translate-y-1 ${
                                !reason.trim()
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:opacity-90'
                            }`}
                        >
                            Escalar Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EscalateTicketModal;
