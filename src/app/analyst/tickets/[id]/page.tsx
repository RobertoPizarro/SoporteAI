"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Settings, LogOut, Clock, AlertCircle, CheckCircle2, XCircle, Bot } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';


type Ticket = {
  id: string;
  tipo: string;
  usuario: string;
  asunto: string;
  descripcion: string;
  servicio: string;
  nivel: number;
  estado: string;
  fecha: string;
};


const tickets = [
  {
    id: 'TCK-2025-00001',
    tipo: 'Incidencia',
    usuario: 'María García',
    asunto: 'Dashboard de ventas sin datos actuales',
    descripcion: 'El dashboard principal no muestra los datos de ventas del mes actual',
    servicio: 'Data Science',
    nivel: 2,
    estado: 'En Progreso',
    fecha: '23/08/2025',
  },
  {
    id: 'TCK-2025-00002',
    tipo: 'Requerimiento',
    usuario: 'Carlos López',
    asunto: 'Nuevo reporte de métricas de marketing',
    descripcion: 'Solicitud para crear un reporte automático de métricas de marketing digital',
    servicio: 'Big Data',
    estado: 'Nuevo',
    nivel: 2,
    fecha: '26/08/2025',
  },
  {
    id: 'TCK-2025-00003',
    tipo: 'Incidencia',
    usuario: 'Ana Martínez',
    asunto: 'Error de conexión con la base de datos',
    descripcion: 'Intermitencia en la conexión con la base de datos principal',
    servicio: 'Cloud+Apps',
    estado: 'Resuelto',
    nivel: 2,
    fecha: '21/08/2025',
  },
  {
    id: 'TCK-2025-00004',
    tipo: 'Requerimiento',
    usuario: 'Roberto Silva',
    asunto: 'Análisis de sentimiento de reviews',
    descripcion: 'Implementar análisis de sentimientos para reviews de productos',
    servicio: 'Data Science',
    estado: 'En Progreso',
    nivel: 2,
    fecha: '19/08/2025',
  },
  {
    id: 'TCK-2025-00005',
    tipo: 'Requerimiento',
    usuario: 'Laura Fernández',
    asunto: 'Implementar geolocalización en app móvil',
    descripcion: 'Agregar funcionalidad de geolocalización a la aplicación móvil existente',
    servicio: 'Geo Solutions',
    estado: 'Nuevo',
    nivel: 2,
    fecha: '03/08/2025',
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
  
  const [chatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      message: '¡Hola! Soy el asistente virtual de Analytics Support. Estoy aquí para ayudarte con cualquier consulta o incidencia que tengas con nuestros servicios. Por favor, describe tu problema o requerimiento.'
    },
    {
      id: 2,
      sender: 'user',
      message: 'Hola, soy de la empresa Claro. Tengo problemas con el servicio de GeoPoint.'
    },
    {
      id: 3,
      sender: 'bot',
      message: 'Gracias por contactarnos. Para poder brindarte el mejor soporte y registrar tu consulta correctamente, necesito validar tu identidad. ¿Podrías proporcionarme tu nombre completo o tu DNI, por favor?'
    },
    {
      id: 4,
      sender: 'user',
      message: 'Mi DNI es 75311031'
    },
    {
      id: 5,
      sender: 'bot',
      message: '¡Perfecto, Roberto! He verificado tu identidad exitosamente. Veo que tienes problemas con el servicio de GeoPoint. Para poder asistirte de la mejor manera, ¿podrías proporcionarme más detalles específicos sobre el inconveniente que estás experimentando?'
    },
    {
      id: 6,
      sender: 'user',
      message: 'El servicio de GeoPoint está mostrando mi ubicación en un lugar incorrecto en el mapa. Este problema comenzó desde ayer y no logro entender la causa. La precisión de geolocalización se ha visto comprometida.'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Nuevo': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'En Progreso': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Resuelto': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rechazado': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 relative pb-16">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
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

      <div className="p-6 max-w-7xl mx-auto animate-fade-in-down space-y-6">
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{currentTicket.asunto}</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-emerald-600">{currentTicket.id}</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${currentTicket.tipo === 'Incidencia' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                  {currentTicket.tipo}
                </span>
                <span className="text-xs text-slate-500">{currentTicket.fecha}</span>
              </div>
            </div>
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium border ${getStatusColor(currentTicket.estado)}`}>
              {getStatusIcon(currentTicket.estado)}
              <span>{currentTicket.estado}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 rounded-2xl p-4">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Usuario</label>
              <p className="text-sm font-semibold text-slate-800 mt-1">{currentTicket.usuario}</p>
            </div>
            <div className="bg-slate-50/70 rounded-2xl p-4">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Servicio</label>
              <p className="text-sm font-semibold text-slate-800 mt-1">{currentTicket.servicio}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Descripción</h3>
          <p className="text-slate-600 leading-relaxed">{currentTicket.descripcion}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Gestionar Estado</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-6 text-white flex-shrink-0 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Asistente Virtual</h3>
                  <p className="text-emerald-100 text-sm">Conversación Original</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-xs">Finalizada</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 max-h-96 overflow-y-auto space-y-4 bg-gradient-to-b from-white/50 to-gray-50/50">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex items-end ${msg.sender === 'user' ? 'flex-row-reverse' : ''} max-w-[85%]`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' ? 'ml-3' : 'mr-3'
                  } ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                      : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                  }`}>
                    {msg.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-3xl px-5 py-3 ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                      : 'bg-gradient-to-r from-gray-100 to-emerald-50 border-2 border-emerald-100 text-slate-800'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 border-t border-slate-200/50 bg-slate-50/50 rounded-b-3xl">
            <p className="text-xs text-slate-500 text-center">
              Solo visualización • Conversación finalizada
            </p>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
        © 2025 Analytics. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default TicketDetailsPage;
