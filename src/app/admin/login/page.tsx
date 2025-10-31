"use client";

import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
    return (
        <div className="relative min-h-screen w-full bg-slate-50 overflow-hidden">
            <div className="flex items-center justify-center min-h-screen p-4">
                <LoginForm />
            </div>

            <footer className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500">
                © 2025 Analytics. Todos los derechos reservados.
            </footer>
        </div>
    )
}