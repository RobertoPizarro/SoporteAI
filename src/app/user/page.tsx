"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot, User, CheckCircle, Clock, FileText, Hash, Calendar, Sparkles, ShieldAlert, Album, ArrowBigUp, MessageCircle } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

type Ticket = {
  id: string
  tipo: string
  usuario: string
  asunto: string
  description: string
  servicio: string
  nivel: number
  estado: string
  fecha: string
}

type Message = {
  id?: number
  type: "bot" | "user" | "ticket"
  content: string | Ticket
  delay?: number
  trigger?: boolean
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const conversationFlow: Message[] = [
    {
      type: 'bot',
      content: '¡Hola! Soy el asistente virtual de Analytics Support. Estoy aquí para ayudarte con cualquier consulta o incidencia que tengas con nuestros servicios. Por favor, describe tu problema o requerimiento.',
      delay: 1000
    },
    {
      type: 'user',
      content: 'Hola, soy de la empresa Claro. Tengo problemas con el servicio de GeoPoint.',
      trigger: true
    },
    {
      type: 'bot',
      content: 'Gracias por contactarnos. Para poder brindarte el mejor soporte y registrar tu consulta correctamente, necesito validar tu identidad. ¿Podrías proporcionarme tu nombre completo o tu DNI, por favor?',
      delay: 1500
    },
    {
      type: 'user',
      content: 'Mi DNI es 75311031',
      trigger: true
    },
    {
      type: 'bot',
      content: '¡Perfecto, Roberto! He verificado tu identidad exitosamente. Veo que tienes problemas con el servicio de GeoPoint. Para poder asistirte de la mejor manera, ¿podrías proporcionarme más detalles específicos sobre el inconveniente que estás experimentando?',
      delay: 1500
    },
    {
      type: 'user',
      content: 'El servicio de GeoPoint está mostrando mi ubicación en un lugar incorrecto del mapa. Este problema comenzó desde ayer y no logro entender la causa. La precisión de geolocalización se ha visto comprometida.',
      trigger: true
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
        asunto: 'Error de Precisión en Servicio GeoPoint',
        description: 'El servicio de GeoPoint muestra una ubicación incorrecta en el mapa.',
        servicio: 'Geo Solutions',
        nivel: 2,
        estado: 'Nuevo',
        fecha: '22/08/2025',
      },
      delay: 1500
    },
    {
      type: 'user',
      content: 'Sí, está correcto. Confirmo todos los datos del ticket.',
      trigger: true
    },
    {
      type: 'bot',
      content: '¡Excelente! Tu ticket ha sido registrado exitosamente en nuestro sistema. Nuestro equipo de especialistas en Geo Solutions ya ha sido notificado y comenzarán a trabajar en tu caso. Te recomendamos ingresar nuevamente en aproximadamente 30 minutos para consultar el progreso de tu incidencia. ¡Gracias por confiar en Analytics Support!',
      delay: 2000
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
          setTimeout(showNextMessage, nextMessage.delay || 500);
        }
      }
    };
  
    showNextMessage();
  
    return () => {
      mounted = false;
    };
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, { ...message, id: Date.now() + Math.random() }]);
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
    }
  };

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg animate-slideInUp">
      <div className="flex items-center mb-4">
        <FileText className="w-6 h-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-bold text-gray-800">Ticket de Soporte Generado</h3>
        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <Hash className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 w-20">ID:</span>
          <span className="font-semibold text-blue-600">{ticket.id}</span>
        </div>

        <div className="flex items-center">
          <ShieldAlert className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 w-20">Tipo:</span>
          <span className="font-medium">{ticket.tipo}</span>
        </div>
        
        <div className="flex items-center">
          <User className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 w-20">Usuario:</span>
          <span className="font-medium">{ticket.usuario}</span>
        </div>
        
        <div className="flex items-start">
          <FileText className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
          <span className="text-sm text-gray-600 w-20">Asunto:</span>
          <span className="font-medium">{ticket.asunto}</span>
        </div>
        
        <div className="flex items-start">
          <Album className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
          <span className="text-sm text-gray-600 w-20">Descrip:</span>
          <span className="text-sm text-gray-700">{ticket.description}</span>
        </div>

        <div className="flex items-center">
          <ArrowBigUp className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 w-20">Nivel:</span>
          <span className="text-sm text-gray-700">{ticket.nivel}</span>
        </div>
        
        <div className="flex items-center">
          <Sparkles className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 w-20">Servicio:</span>
          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-cyan-100 text-green-700 rounded-full text-sm font-medium">{ticket.servicio}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 w-20">Estado:</span>
          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 rounded-full text-sm font-medium">{ticket.estado}</span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 w-20">Fecha:</span>
          <span className="text-sm text-gray-700">{ticket.fecha}</span>
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message, isBot }: { message: Message; isBot: boolean }) => (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-6 animate-slideInUp`}>
      <div className={`flex max-w-4xl ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end`}>
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isBot ? 'mr-4' : 'ml-4'} shadow-lg`}>
          {isBot ? (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <div className={`px-6 py-4 rounded-3xl shadow-lg ${
          isBot 
            ? 'bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-blue-100' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }`}>
          {typeof message.content === "string" ? (
            <p className={`text-sm leading-relaxed ${isBot ? 'text-gray-800' : 'text-white'}`}>
              {message.content}
            </p>
          ) : (
            <TicketCard ticket={message.content} />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 relative pb-16">
      <style jsx>{`
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(-20px);
        }
        
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={280} height={80} />
            </Link>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-100/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl px-4 py-2">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Centro de Soporte Analytics
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-sm text-slate-600">Asistente Virtual Inteligente</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto animate-fade-in-down" style={{ animationDelay: '200ms' }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] overflow-hidden h-[calc(100vh-180px)] flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 text-white flex-shrink-0 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Asistente Virtual</h3>
                  <p className="text-blue-100">Estoy aquí para ayudarte. Describe tu problema o requerimiento.</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">En línea</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-gradient-to-b from-white/50 to-gray-50/50">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 animate-pulse">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 rounded-3xl border-2 border-blue-100">
                    <div className="flex space-x-2">
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

          <div className="bg-slate-50/50 backdrop-blur-sm border-t border-slate-200/50 p-6 flex-shrink-0 rounded-b-3xl">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className="w-full px-6 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 pr-24 shadow-sm"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2 shadow-md"
              >
                <Send className="w-5 h-5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
        © 2025 Analytics. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default ChatBot;
