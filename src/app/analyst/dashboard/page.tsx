"use client";

import React, { useState } from 'react';
import { ChevronDown, User, LogOut, Search, Filter, Eye, Settings, Bell, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AnalystDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusBadge = (estado: string) => {
    const styles: { [key: string]: string } = {
      'Nuevo': 'bg-blue-50 text-blue-700 border border-blue-200',
      'En Progreso': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Resuelto': 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    };
    return styles[estado] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getStatusIcon = (estado: string) => {
    switch(estado) {
      case 'Nuevo': return <AlertCircle className="w-3 h-3" />;
      case 'En Progreso': return <Clock className="w-3 h-3" />;
      case 'Resuelto': return <CheckCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getPriorityIndicator = (nivel: number) => {
    const colors: { [key: number]: string } = {
      1: 'bg-emerald-400',
      2: 'bg-amber-400', 
      3: 'bg-red-400'
    };
    return colors[nivel] || 'bg-gray-300';
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = selectedFilter === 'Todos' || ticket.estado === selectedFilter;
    const matchesSearch = ticket.asunto.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 relative pb-16">
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
      `}</style>

      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
              <Image src="/logo.png" alt="Logo" width={280} height={80} />
          </Link>
          
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

      <main className="px-6 py-8 max-w-7xl mx-auto animate-fade-in-down">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Bienvenido, Juan 👋
          </h2>
          <p className="text-slate-600">Aquí tienes un resumen de tus tickets asignados hoy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Tickets', value: tickets.length, icon: FileText, gradient: 'from-slate-500 to-slate-600' },
            { label: 'Nuevos', value: tickets.filter(t => t.estado === 'Nuevo').length, icon: AlertCircle, gradient: 'from-blue-500 to-blue-600' },
            { label: 'En Progreso', value: tickets.filter(t => t.estado === 'En Progreso').length, icon: Clock, gradient: 'from-amber-500 to-amber-600' },
            { label: 'Resueltos', value: tickets.filter(t => t.estado === 'Resuelto').length, icon: CheckCircle, gradient: 'from-emerald-500 to-emerald-600' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] mb-6 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por ID, asunto o usuario..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl hover:bg-slate-200/80 transition-all duration-200 backdrop-blur-sm"
              >
                <Filter className="w-4 h-4 mr-2 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{selectedFilter}</span>
                <ChevronDown className={`w-4 h-4 ml-2 text-slate-400 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 z-50">
                  {['Todos', 'Nuevo', 'En Progreso', 'Resuelto'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors rounded-lg mx-2 ${
                        selectedFilter === filter 
                          ? 'bg-emerald-50 text-emerald-700 font-medium' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredTickets.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No se encontraron tickets</h3>
              <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            filteredTickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Priority Indicator */}
                    <div className={`w-1 h-16 ${getPriorityIndicator(ticket.nivel)} rounded-full`}></div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                          {ticket.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusBadge(ticket.estado)}`}
                        >
                          {getStatusIcon(ticket.estado)}
                          {ticket.estado}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {ticket.tipo}
                        </span>
                      </div>

                      <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">
                        {ticket.asunto}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>👤 {ticket.usuario}</span>
                        <span>🔧 {ticket.servicio}</span>
                        <span>📅 {ticket.fecha}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="ml-4" size="sm">
                    <Link
                      href={`/analyst/tickets/${ticket.id}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
        © 2025 Analytics. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default AnalystDashboard;