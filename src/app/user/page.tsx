"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot, User, Clock, FileText, ShieldAlert, MessageCircle, Plus, Settings} from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import TicketCard from '@/components/user/ticket-card';
import MessageBubble from '@/components/user/message-bubble';
import {Message } from '@/types';

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showFrequentQuestions, setShowFrequentQuestions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const conversationFlow: Message[] = [
        {
            type: 'user',
            content: 'Hola'
        },
        {
            type: 'bot',
            content: '¡Hola! Soy el asistente virtual de Analytics Support. Estoy aquí para ayudarte con cualquier consulta o incidencia que tengas con nuestros servicios. Por favor, describe tu problema o requerimiento.',
            delay: 1000
        },
        {
            type: 'user',
            content: 'Soy de la empresa Claro. Tengo problemas con el servicio de GeoPoint.'
        },
        {
            type: 'bot',
            content: 'Gracias por contactarnos. Para poder brindarte el mejor soporte y registrar tu consulta correctamente, necesito validar tu identidad. ¿Podrías proporcionarme tu nombre completo o tu DNI, por favor?',
            delay: 1500
        },
        {
            type: 'user',
            content: 'Mi DNI es 75311031'
        },
        {
            type: 'bot',
            content: '¡Perfecto, Roberto! He verificado tu identidad exitosamente. Veo que tienes problemas con el servicio de GeoPoint. Para poder asistirte de la mejor manera, ¿podrías proporcionarme más detalles específicos sobre el inconveniente que estás experimentando?',
            delay: 1500
        },
        {
            type: 'user',
            content: 'El servicio de GeoPoint está mostrando mi ubicación en un lugar incorrecto del mapa. Este problema comenzó desde ayer y no logro entender la causa. La precisión de geolocalización se ha visto comprometida.'
        },
        {
            type: 'bot',
            content: 'Entiendo perfectamente la situación, Roberto. Los problemas de precisión en geolocalización pueden afectar significativamente las operaciones. Procederé inmediatamente a crear un ticket de soporte para que nuestro equipo técnico especializado pueda atender tu caso con la prioridad que requiere.',
            delay: 2000
        },
        {
            type: 'bot',
            content: 'He generado tu ticket de soporte. A continuación te muestro los detalles para tu confirmación:',
            delay: 1000
        },
        {
            type: 'ticket',
            content: {
                id: 'TCK-2025-00847',
                tipo: 'Incidencia',
                usuario: 'Roberto Pizarro',
                analista: 'Juan Pérez',
                asunto: 'Error de Precisión en el Servicio GeoPoint para la Empresa Claro',
                servicio: 'Geo Solutions',
                nivel: 2,
                estado: 'Nuevo',
                fechaCreacion: '22/08/2025',
                actualizacion: ' ',
            },
            delay: 1500
        },
        {
            type: 'user',
            content: 'Sí, está correcto. Confirmo todos los datos del ticket.'
        },
        {
            type: 'bot',
            content: '¡Excelente! Tu ticket ha sido registrado exitosamente en nuestro sistema. Nuestro equipo de especialistas en Geo Solutions ya ha sido notificado y comenzarán a trabajar en tu caso. Te recomendamos ingresar nuevamente en aproximadamente 30 minutos para consultar el progreso de tu incidencia. ¡Gracias por confiar en Analytics Support!',
            delay: 2000
        }
    ];

    const frequentQuestions = [
        {
            icon: Settings,
            text: '¿Qué puede hacer este asistente?',
            description: 'Conoce todas las funcionalidades disponibles'
        },
        {
            icon: Clock,
            text: '¿Cuánto tarda en responder?',
            description: 'Información sobre tiempos de respuesta'
        },
        {
            icon: ShieldAlert,
            text: '¿Cómo se gestiona mi privacidad?',
            description: 'Políticas de seguridad y privacidad'
        },
        {
            icon: FileText,
            text: '¿Como puedo ver mis tickets?',
            description: 'Simplemente consulta al chatbot'
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (messages.length > 0) return;

        let step = 0;
        let mounted = true;

        const showNextMessage = () => {
            if (!mounted) return;
            if (step < conversationFlow.length) {
                const nextMessage = conversationFlow[step];

                if (step === 0) {
                    setTimeout(() => {
                        if (!mounted) return;
                        setShowFrequentQuestions(false);
                    }, 2000);
                }

                if (nextMessage.type === "bot" || nextMessage.type === "ticket") {
                    setIsTyping(true);
                    setTimeout(() => {
                        if (!mounted) return;
                        setIsTyping(false);
                        addMessage(nextMessage);
                        step++;
                        setTimeout(showNextMessage, nextMessage.delay || 1000);
                    }, nextMessage.delay || 1000);
                } else {
                    addMessage(nextMessage);
                    step++;
                    setTimeout(showNextMessage, 500);
                }
            }
        };

        setTimeout(showNextMessage, 3000);

        return () => {
            mounted = false;
        };
    }, []);

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, { ...message, id: Date.now() + Math.random() }]);
        setShowFrequentQuestions(false);
    };

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const userMessage: Message = {
                type: "user",
                content: inputValue,
                id: Date.now()
            };
            setMessages(prev => [...prev, userMessage]);
            setInputValue('');
            setIsTyping(false);
            setShowFrequentQuestions(false);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setInputValue('');
        setIsTyping(false);
        setShowFrequentQuestions(true);
    };

    const handleQuestionClick = (question: string) => {
        setInputValue(question);
        setTimeout(() => {
            handleSendMessage();
        }, 100);
    };

    const FrequentQuestions = () => (
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in-down">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Hola, soy tu Asistente Virtual
                </h2>
                <p className="text-gray-600 text-lg">
                    Estoy aquí para ayudarte con cualquier consulta o incidencia. ¿En qué puedo asistirte?
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {frequentQuestions.map((question, index) => {
                    const IconComponent = question.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => handleQuestionClick(question.text)}
                            className="group p-6 bg-white rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-left"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center transition-colors">
                                    <IconComponent className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 transition-colors">
                                        {question.text}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {question.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
            <style jsx>{`
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
            `}</style>

            <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 flex-shrink-0">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image src="/logo.png" alt="Logo" width={280} height={80} />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-100/50 backdrop-blur-sm border border-slate-200/50 rounded-xl px-3 py-2">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Centro de Soporte Analytics
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <p className="text-xs text-slate-600">Asistente Virtual Inteligente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 min-h-0">
                <div className="w-72 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col flex-shrink-0 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
                    <div className="flex-1 p-4 space-y-6 overflow-y-auto min-h-0">
                        <button
                            onClick={handleNewChat}
                            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">Iniciar Nueva Conversación</span>
                            </div>
                        </button>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-800">Servicios de Analytics:</h4>
                            <div className="space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-sm font-medium text-blue-700">Data Science</div>
                                    <div className="text-xs text-blue-600">Análisis de datos</div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                    <div className="text-sm font-medium text-green-700">Big Data</div>
                                    <div className="text-xs text-green-600">Procesamiento de datos masivos</div>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="text-sm font-medium text-purple-700">Cloud+Apps</div>
                                    <div className="text-xs text-purple-600">Soluciones en la nube</div>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <div className="text-sm font-medium text-orange-700">Geo Solutions</div>
                                    <div className="text-xs text-orange-600">Servicios de geolocalización</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 overflow-y-auto px-8 min-h-0">
                        <div className="max-w-5xl mx-auto py-8 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                            {showFrequentQuestions && messages.length === 0 && <FrequentQuestions />}

                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isBot={message.type === 'bot' || message.type === 'ticket'}
                                />
                            ))}

                            {isTyping && (
                                <div className="flex justify-start mb-6 animate-slideInUp">
                                    <div className="flex items-end">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 animate-pulse">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="bg-gray-100 px-5 py-4 rounded-2xl">
                                            <div className="flex space-x-1.5">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6 flex-shrink-0 animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Escribe tu mensaje..."
                                        className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 pr-14 text-sm"
                                    />
                                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>Enviar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;