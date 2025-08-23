"use client";

import { LoginForm } from "@/components/analyst/login-form";

export default function AnalystLoginPage() {
    return (
        <div className="relative min-h-screen w-full bg-slate-50 overflow-hidden">
            <div className="absolute top-20 -left-40 w-72 h-72 bg-teal-500/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-10 -right-40 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-green-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-6000"></div>

            <div className="flex items-center justify-center min-h-screen p-4">
                <LoginForm />
            </div>

            <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
                © 2025 Analytics. Todos los derechos reservados.
            </footer>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                .animation-delay-6000 { animation-delay: 6s; }
            `}</style>
        </div>
    )
}
