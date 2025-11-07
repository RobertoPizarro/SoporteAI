import React from "react";
import { Plus, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarServicesProps {
    handleNewChat: () => void;
}

const SidebarServices = ({ handleNewChat }: SidebarServicesProps) => {
    return (
        <div className="w-72 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col flex-shrink-0 animate-fade-in-down">
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
                    <h4 className="text-sm font-semibold text-gray-800">
                        Servicios de Soporte IA:
                    </h4>
                    <div className="space-y-2">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="text-sm font-medium text-blue-700">
                                Data Science
                            </div>
                            <div className="text-xs text-blue-600">Análisis de datos</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="text-sm font-medium text-green-700">Big Data</div>
                            <div className="text-xs text-green-600">
                                Procesamiento de datos masivos
                            </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="text-sm font-medium text-purple-700">
                                Cloud+Apps
                            </div>
                            <div className="text-xs text-purple-600">
                                Soluciones en la nube
                            </div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                            <div className="text-sm font-medium text-orange-700">
                                Geo Solutions
                            </div>
                            <div className="text-xs text-orange-600">
                                Servicios de geolocalización
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 mt-4"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold">Cerrar sesión</span>
                </button>
            </div>
        </div>
    );
};

export default SidebarServices;