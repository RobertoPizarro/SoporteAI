"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Settings, LogOut, Clock, AlertCircle, CheckCircle2, XCircle, Bot, Copy, Volume2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Message } from "@/types";
import { useParams } from 'next/navigation';
import { speakText, copyText } from '@/lib/utils';
import { Ticket } from '@/types';
import MessageBubble from '@/components/chat/message-bubble';


const tickets: Ticket[] = [
    {
        id: 'TCK-2025-00001',
        tipo: 'Incidencia',
        usuario: 'María García',
        analista: 'Juan Pérez',
        asunto: 'Dashboard de ventas sin datos actuales',
        servicio: 'Data Science',
        nivel: 2,
        estado: 'En Progreso',
        fechaCreacion: '23/08/2025',
        actualizacion: 'Hace 2 horas',
    },
    {
        id: 'TCK-2025-00002',
        tipo: 'Requerimiento',
        usuario: 'Carlos López',
        analista: 'Juan Pérez',
        asunto: 'Nuevo reporte de métricas de marketing',
        servicio: 'Big Data',
        nivel: 2,
        estado: 'Nuevo',
        fechaCreacion: '26/08/2025',
        actualizacion: 'Hace 2 horas',
    },
    {
        id: 'TCK-2025-00003',
        tipo: 'Incidencia',
        usuario: 'Ana Martínez',
        analista: 'Juan Pérez',
        asunto: 'Error de conexión con la base de datos',
        servicio: 'Cloud+Apps',
        nivel: 2,
        estado: 'Resuelto',
        fechaCreacion: '21/08/2025',
        actualizacion: 'Hace 5 horas',
    },
    {
        id: 'TCK-2025-00004',
        tipo: 'Requerimiento',
        usuario: 'Roberto Silva',
        analista: 'Juan Pérez',
        asunto: 'Análisis de sentimiento de reviews',
        servicio: 'Data Science',
        nivel: 2,
        estado: 'En Progreso',
        fechaCreacion: '19/08/2025',
        actualizacion: 'Hace 3 días',
    },
    {
        id: 'TCK-2025-00005',
        tipo: 'Requerimiento',
        usuario: 'Laura Fernández',
        analista: 'Juan Pérez',
        asunto: 'Implementar geolocalización en app móvil',
        servicio: 'Geo Solutions',
        nivel: 2,
        estado: 'Rechazado',
        fechaCreacion: '03/08/2025',
        actualizacion: 'Hace 6 días',
    }
];

const TicketDetailsPage = () => {
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            const foundTicket = tickets.find(t => t.id === params.id) || null;
            setCurrentTicket(foundTicket);
        }
    }, [params.id]);

    const [chatMessages] = useState<Message[]>([
        {
            id: 1,
            type: "bot",
            content: "¡Hola! Soy el asistente virtual de Analytics Support. Estoy aquí para ayudarte con cualquier consulta o incidencia que tengas con nuestros servicios. Por favor, describe tu problema o requerimiento."
        },
        {
            id: 2,
            type: "user",
            content: "Hola, soy de la empresa Claro. Tengo problemas con el servicio de GeoPoint."
        },
        {
            id: 3,
            type: "bot",
            content: "Gracias por contactarnos. Para poder brindarte el mejor soporte y registrar tu consulta correctamente, necesito validar tu identidad. ¿Podrías proporcionarme tu nombre completo o tu DNI, por favor?"
        },
        {
            id: 4,
            type: "user",
            content: "Mi DNI es 75311031"
        },
        {
            id: 5,
            type: "bot",
            content: "¡Perfecto, Roberto! He verificado tu identidad exitosamente. Veo que tienes problemas con el servicio de GeoPoint. Para poder asistirte de la mejor manera, ¿podrías proporcionarme más detalles específicos sobre el inconveniente que estás experimentando?"
        },
        {
            id: 6,
            type: "user",
            content: "El servicio de GeoPoint está mostrando mi ubicación en un lugar incorrecto en el mapa. Este problema comenzó desde ayer y no logro entender la causa. La precisión de geolocalización se ha visto comprometida."
        },
        {
            id: 7,
            type: "bot",
            content: "Entiendo perfectamente la situación, Roberto. Los problemas de precisión en geolocalización pueden afectar significativamente las operaciones. Procederé inmediatamente a crear un ticket de soporte para que nuestro equipo técnico especializado pueda atender tu caso con la prioridad que requiere."
        },
        {
            id: 8,
            type: "bot",
            content: "He generado tu ticket de soporte. A continuación te muestro los detalles para tu confirmación:"
        }
    ]);

    const chatEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'Nuevo': return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'En Progreso': return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'Resuelto': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'Rechazado': return 'bg-red-50 text-red-700 border border-red-200';
            default: return 'bg-gray-50 text-gray-700 border border-gray-200';
        }
    };

    const getStatusIcon = (estado: string) => {
        switch (estado) {
            case 'Nuevo': return <AlertCircle className="w-4 h-4" />;
            case 'En Progreso': return <Clock className="w-4 h-4" />;
            case 'Resuelto': return <CheckCircle2 className="w-4 h-4" />;
            case 'Rechazado': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const handleStatusChange = (newStatus: string) => {
        if (currentTicket) {
            setCurrentTicket({ ...currentTicket, estado: newStatus });
        }
    };

    if (!currentTicket) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-700">Cargando ticket...</h2>
                    <p className="text-slate-500">O el ticket no fue encontrado.</p>
                </div>
            </div>
        );
    }

    

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
            <style jsx>{`
                .animate-fade-in-down {
                    animation: fadeInDown 0.6s ease-out forwards;
                    opacity: 0;
                    transform: translateY(-20px);
                }

                @keyframes fadeInDown {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slideInUp {
                    animation: slideInUp 0.4s ease-out;
                }
            `}</style>

            <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 flex-shrink-0 sticky top-0 z-40">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image src="/logo.png" alt="Logo" width={280} height={80} />
                        </Link>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-3 hover:bg-slate-50 rounded-2xl px-4 py-2.5 transition-all duration-300 group border border-transparent hover:border-slate-200"
                        >
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-700">Juan Pérez</p>
                                <p className="text-xs text-slate-500">Analista Senior</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
                                <a href="#" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-lg mx-2">
                                    <User className="w-4 h-4 mr-3 text-slate-400" />
                                    Perfil
                                </a>
                                <a href="#" className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-lg mx-2">
                                    <Settings className="w-4 h-4 mr-3 text-slate-400" />
                                    Configuración
                                </a>
                                <hr className="my-2 border-slate-200" />
                                <Link href="/analyst/login" className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2">
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Cerrar sesión
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 min-h-0 animate-fade-in-down">
                <div className="w-[32rem] bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col flex-shrink-0 overflow-y-auto">
                    <div className="p-8 space-y-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">{currentTicket.asunto}</h2>
                                <div className="space-y-4">
                                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">{currentTicket.id}</span>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm font-medium border bg-orange-100 text-orange-700 border-orange-200 px-3 py-2 rounded-full">{currentTicket.tipo}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-xs text-slate-500">
                                            <div className="bg-slate-100 px-3 py-2 rounded-lg">Creación: {currentTicket.fechaCreacion}</div>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <div className="bg-slate-100 px-3 py-2 rounded-lg">Última actualización: {currentTicket.actualizacion}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50/70 rounded-2xl p-4">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Usuario</label>
                                    <p className="text-sm font-semibold text-slate-800 mt-2">{currentTicket.usuario}</p>
                                </div>
                                <div className="bg-slate-50/70 rounded-2xl p-4">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Servicio</label>
                                    <p className="text-sm font-semibold text-slate-800 mt-2">{currentTicket.servicio}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                            <h3 className="text-lg font-semibold text-slate-800 mb-6">Gestión de Estado</h3>
|
                            <div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Nuevo', 'En Progreso', 'Resuelto', 'Rechazado'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(status)}
                                            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                                                currentTicket.estado === status
                                                    ? getStatusColor(status) + ' shadow-md'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                                            }`}
                                        >
                                            {getStatusIcon(status)}
                                            <span>{status}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 overflow-y-auto px-8 min-h-0 bg-gradient-to-b from-white/50 to-gray-50/50">
                        <div className="max-w-5xl mx-auto py-8">
                            {chatMessages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isBot={message.type === 'bot' || message.type === 'ticket'}
                                    role={"analyst"}
                                />
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-200/50 bg-slate-50/50 flex-shrink-0">
                        <div className="text-center">
                            <p className="text-xs text-slate-500">Solo visualización • Esta conversación ha terminado</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailsPage;