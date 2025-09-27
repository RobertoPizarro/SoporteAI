import React, { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';

interface ModifyTicketModalProps {
    isOpen: boolean;
    ticketId: string;
    currentLevel: string;
    onConfirm: (newLevel: string) => void;
    onCancel: () => void;
}

const ModifyTicketModal: React.FC<ModifyTicketModalProps> = ({
    isOpen,
    ticketId,
    currentLevel,
    onConfirm,
    onCancel,
}) => {
    const [newLevel, setNewLevel] = useState('');

    // Helper para capitalizar la primera letra
    const capitalize = (text: string) => {
        if (!text) return text;
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };


    const levels = [
        { value: 'bajo', label: 'Bajo' },
        { value: 'medio', label: 'Medio' },
        { value: 'alto', label: 'Alto' },
        { value: 'crítico', label: 'Crítico' },
    ];

    // 🔍 DEBUG: Monitorear cambios en los estados
    useEffect(() => {
        const isDisabled = !newLevel || newLevel === currentLevel;
        console.log("🔍 MODAL DEBUG:", {
            newLevel: `"${newLevel}"`,
            currentLevel: `"${currentLevel}"`,
            isNewLevelEmpty: !newLevel,
            isSameLevel: newLevel === currentLevel,
            isDisabled
        });
    }, [newLevel, currentLevel]);

    const handleConfirm = () => {
        if (!newLevel || newLevel === currentLevel) {
            console.log("🚫 Validación fallida:", { newLevel, currentLevel });
            return; // No permite confirmar sin nivel válido
        }
        console.log("✅ Confirmando cambio:", { newLevel, currentLevel });
        onConfirm(newLevel);
        setNewLevel(''); // Limpiar el campo después de confirmar
    };

    const handleCancel = () => {
        setNewLevel(''); // Limpiar el campo al cancelar
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
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                        Modificar Nivel del Ticket
                    </h3>
                    <p className="text-sm opacity-90">
                        Cambia el nivel de prioridad de este ticket
                    </p>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <p className="text-sm text-slate-600 mb-2">
                            <strong>Nivel actual:</strong> 
                            <span className="ml-2 px-2 py-1 rounded-lg text-xs font-medium border bg-slate-100 text-slate-800 border-slate-200">
                                {capitalize(currentLevel)}
                            </span>
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Nuevo nivel:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {levels.map((level) => {
                                const isCurrentLevel = level.value === currentLevel;
                                const isSelected = newLevel === level.value;
                                
                                return (
                                    <button
                                        key={level.value}
                                        type="button"
                                        disabled={isCurrentLevel}
                                        onClick={() => {
                                            console.log("🔘 Botón clickeado:", level.value, "isCurrentLevel:", isCurrentLevel);
                                            if (!isCurrentLevel) {
                                                setNewLevel(level.value);
                                                console.log("✅ Nivel seleccionado:", level.value);
                                            }
                                        }}
                                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                                            isCurrentLevel
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                                                : isSelected
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200 scale-105'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:scale-105'
                                        }`}
                                    >
                                        {level.label}
                                        {isCurrentLevel && (
                                            <span className="ml-2 text-xs">(Actual)</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>



                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!newLevel || newLevel === currentLevel}
                            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
                                !newLevel || newLevel === currentLevel
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white hover:scale-105 shadow-lg'
                            }`}
                        >
                            Confirmar 
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleCancel}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                    <X className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ModifyTicketModal;