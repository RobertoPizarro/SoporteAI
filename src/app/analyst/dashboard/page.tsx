"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Ticket } from "@/types";
import { getTickets } from "@/services/ticket.service";
import ChatHeader from "@/components/chat/chat-header";
import PageAnimations from "@/components/ui/page-animations";
import TicketList from "@/components/ticket/ticket-list";

const AnalystDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tickets al montar el componente
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setIsLoading(true);
        const ticketsData = await getTickets();
        console.log("🎫 Tickets data received:", ticketsData);
        if (ticketsData) {
          console.log("🎫 First ticket structure:", ticketsData[0]);
          setTickets(ticketsData);
        }
      } catch (error) {
        console.error("Error cargando tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter =
      selectedFilter === "Todos" || ticket?.estado === selectedFilter;
    const matchesSearch =
      (ticket?.asunto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ticket?.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket?.usuario || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <ChatHeader role="analyst" />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-700">Cargando tickets...</h2>
            <p className="text-slate-500">Un momento por favor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 relative pb-16">
      <PageAnimations />
      <ChatHeader role="analyst" />

      <main className="px-6 py-8 max-w-7xl mx-auto animate-fade-in-down">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Bienvenido, Juan 👋
          </h2>
          <p className="text-slate-600">
            Aquí tienes un resumen de tus tickets asignados hoy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Tickets",
              value: tickets.length,
              icon: FileText,
              gradient: "from-slate-500 to-slate-600",
            },
            {
              label: "Nuevos",
              value: tickets.filter((t) => t.estado === "Nuevo").length,
              icon: AlertCircle,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "En Progreso",
              value: tickets.filter((t) => t.estado === "En Progreso").length,
              icon: Clock,
              gradient: "from-amber-500 to-amber-600",
            },
            {
              label: "Finalizados",
              value: tickets.filter((t) => t.estado === "Finalizado").length,
              icon: CheckCircle,
              gradient: "from-emerald-500 to-emerald-600",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-sm`}
                >
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
                <span className="text-sm font-medium text-slate-700">
                  {selectedFilter}
                </span>
                <ChevronDown
                  className={`w-4 h-4 ml-2 text-slate-400 transition-transform duration-200 ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 py-2 z-50">
                  {[
                    "Todos",
                    "Nuevo",
                    "En Progreso", 
                    "Finalizado",
                    "Rechazado",
                  ].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors rounded-lg mx-2 ${
                        selectedFilter === filter
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-slate-700 hover:bg-slate-50"
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
          <TicketList filteredTickets={filteredTickets} />
        </div>
      </main>
    </div>
  );
};

export default AnalystDashboard;
