"use client";

import React, { useState } from 'react';
import {
    ChevronDown, Search, Filter, Eye,  FileText, Clock, CheckCircle, AlertCircle,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { tickets } from '@/data/tickets';
import ChatHeader from '@/components/chat/chat-header';
import TicketCard from '@/components/ticket/ticket-card';


const AnalystDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');


  const getStatusBadge = (estado: string) => {
    const styles: { [key: string]: string } = {
      'Nuevo': 'bg-blue-50 text-blue-700 border border-blue-200',
      'En Progreso': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Resuelto': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Rechazado': 'bg-red-50 text-red-700 border border-red-200'
    };
    return styles[estado] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getStatusColor = (estado: string) => {
    const styles: { [key: string]: string } = {
      Nuevo: "bg-blue-400 ",
      "En Progreso": "bg-amber-400  ",
      Resuelto: "bg-emerald-400 ",
      Rechazado: "bg-red-400  ",
    };
    return styles[estado] || "bg-gray-50 text-gray-700 border border-gray-200";
  };

  const getStatusIcon = (estado: string) => {
    switch(estado) {
      case 'Nuevo': return <AlertCircle className="w-3 h-3" />;
      case 'En Progreso': return <Clock className="w-3 h-3" />;
      case 'Resuelto': return <CheckCircle className="w-3 h-3" />;
      case 'Rechazado': return <XCircle className="w-3 h-3" />;
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

      <ChatHeader role="analyst"/>

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
                  {['Todos', 'Nuevo', 'En Progreso', 'Resuelto', 'Rechazado'].map((filter) => (
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
          {/* Importar aacá el Ticket List */}
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
              <TicketCard ticket={ticket}/>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalystDashboard;