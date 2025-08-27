import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  User,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";

const ChatHeader = ({ role }: { role: "client" | "analyst" }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false); /// Borrar
  return (
    <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 flex-shrink-0">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={280} height={80} />
          </Link>
        </div>
        {role === "client" ? (
          <div className="flex items-center gap-3 bg-slate-100/50 backdrop-blur-sm border border-slate-200/50 rounded-xl px-3 py-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Centro de Soporte Analytics
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-xs text-slate-600">
                  Asistente Virtual Inteligente
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 hover:bg-slate-50 rounded-2xl px-4 py-2.5 transition-all duration-300 group border border-transparent hover:border-slate-200"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">
                  Juan Pérez
                </p>
                <p className="text-xs text-slate-500">Analista Senior</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
                <a
                  href="#"
                  className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-lg mx-2"
                >
                  <User className="w-4 h-4 mr-3 text-slate-400" />
                  Perfil
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-lg mx-2"
                >
                  <Settings className="w-4 h-4 mr-3 text-slate-400" />
                  Configuración
                </a>
                <hr className="my-2 border-slate-200" />
                <Link
                  href="/analyst/login"
                  className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Cerrar sesión
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
