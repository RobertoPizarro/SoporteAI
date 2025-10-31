"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Building2,
  Users,
  UserCog,
} from "lucide-react";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import ChatHeader from "@/components/chat/chat-header";
import PageAnimations from "@/components/ui/page-animations";
import PromptManager from "@/components/admin/prompt-manager";
import ServicesManager from "@/components/admin/services-manager";
import ClientsManager from "@/components/admin/clients-manager";
import AnalystsManager from "@/components/admin/analysts-manager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("prompt");

  const tabs = [
    { id: "prompt", label: "Configurar Prompt", icon: MessageSquare },
    { id: "clients", label: "Gestionar Clientes", icon: Users },
    { id: "services", label: "Gestionar Servicios", icon: Building2 },

    { id: "analysts", label: "Gestionar Analistas", icon: UserCog },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "prompt":
        return <PromptManager />;
      case "services":
        return <ServicesManager />;
      case "clients":
        return <ClientsManager />;
      case "analysts":
        return <AnalystsManager />;
      default:
        return <PromptManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 relative pb-16">
      <PageAnimations />
      <ChatHeader role="admin" />

      <main className="px-6 py-8 max-w-7xl mx-auto animate-fade-in-down">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Panel de Administración 🛡️
          </h2>
          <p className="text-slate-600">
            Gestiona prompts, servicios, clientes y analistas del sistema
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white/50 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                  activeTab === tab.id
                    ? "bg-white shadow-md text-slate-800 border border-white/80"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white/30"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido dinámico */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const AdminDashboardWithAuth = () => {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  );
};

export default AdminDashboardWithAuth;