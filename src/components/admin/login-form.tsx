"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Shield, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import GoogleIcon from "../icons/google-icon"

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/admin/dashboard");
    }

    const handleGoogleLogin = async () => {
            setIsLoading(true);
            try {
                // Marcar intención de rol antes de redirigir a Google
                if (typeof window !== "undefined") {
                    localStorage.setItem("loginRole", "admin");
                }
                await signIn("google", { prompt: "select_account", callbackUrl: "/admin/dashboard" });
            } catch (error) {
                console.error("Error al iniciar sesión con Google:", error);
            } finally {
                setIsLoading(false);
            }
        };

    return (
        <div className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <Card className="w-full max-w-sm shadow-2xl rounded-3xl overflow-hidden animate-fade-in-down border-none bg-white/80 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-center text-white">
                    <div className="mx-auto w-20 h-20 mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">¡Bienvenido!</h2>
                    <p className="text-sm opacity-90 mt-1">Panel de Administración</p>
                    <p className="text-xs opacity-80 mt-2">Acceso exclusivo para administradores</p>
                </div>
                
                <CardContent className="p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@empresa.com"
                                    className="pl-4 pr-10 py-3 border-slate-300 focus:border-orange-400 focus:ring-orange-400 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-4 pr-10 py-3 border-slate-300 focus:border-orange-400 focus:ring-orange-400 rounded-xl"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Iniciar Sesión
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-300" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-slate-500">O continúa con</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 border border-slate-300 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mr-2"></div>
                        ) : (
                            <GoogleIcon className="mr-2 h-5 w-5" />
                        )}
                        {isLoading ? "Conectando..." : "Google"}
                    </Button>

                    <p className="text-center text-sm text-slate-500">
                        <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors">
                            ← Volver al inicio
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}