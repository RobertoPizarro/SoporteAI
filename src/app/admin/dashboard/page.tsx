"use client";

import React from "react";
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  FileText,
  Activity,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import ChatHeader from "@/components/chat/chat-header";
import PageAnimations from "@/components/ui/page-animations";

const AdminDashboard = () => {
  const { name, isLoading: userLoading } = useCurrentUser();

  // Loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <ChatHeader role="analyst" />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-700">Cargando...</h2>
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
            Panel de Administración - {name || "Administrador"} 🛡️
          </h2>
          <p className="text-slate-600">
            Gestiona usuarios, configuraciones y monitorea el sistema completo
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Usuarios Totales",
              value: "245",
              icon: Users,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "Analistas Activos",
              value: "18",
              icon: Activity,
              gradient: "from-green-500 to-green-600",
            },
            {
              label: "Tickets del Mes",
              value: "1,234",
              icon: FileText,
              gradient: "from-amber-500 to-amber-600",
            },
            {
              label: "Tiempo Respuesta",
              value: "2.4h",
              icon: BarChart3,
              gradient: "from-purple-500 to-purple-600",
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

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Gestionar Usuarios",
              description: "Administrar cuentas de analistas y colaboradores",
              icon: Users,
              color: "from-blue-500 to-blue-600",
              action: () => console.log("Gestionar usuarios"),
            },
            {
              title: "Configuración del Sistema",
              description: "Ajustes generales y configuraciones avanzadas",
              icon: Settings,
              color: "from-gray-500 to-gray-600",
              action: () => console.log("Configuración"),
            },
            {
              title: "Reportes y Analytics",
              description: "Estadísticas detalladas y análisis de rendimiento",
              icon: BarChart3,
              color: "from-purple-500 to-purple-600",
              action: () => console.log("Reportes"),
            },
            {
              title: "Logs del Sistema",
              description: "Monitorear actividad y errores del sistema",
              icon: FileText,
              color: "from-amber-500 to-amber-600",
              action: () => console.log("Logs"),
            },
            {
              title: "Monitoreo en Tiempo Real",
              description: "Estado actual de servicios y rendimiento",
              icon: Activity,
              color: "from-green-500 to-green-600",
              action: () => console.log("Monitoreo"),
            },
            {
              title: "Seguridad y Permisos",
              description: "Gestión de roles y políticas de seguridad",
              icon: Shield,
              color: "from-red-500 to-red-600",
              action: () => console.log("Seguridad"),
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              onClick={item.action}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;