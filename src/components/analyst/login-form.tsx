"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import GoogleIcon from "../icons/google-icon"

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/analyst/dashboard");
    }

    const handleGoogleLogin = async () => {
            setIsLoading(true);
            try {
                await signIn("google", {prompt: "select_account", callbackUrl: "/analyst/dashboard"});
            } catch (error) {
                console.error("Error al iniciar sesión con Google:", error);
            } finally {
                setIsLoading(false);
            }
        };

    return (
        <div className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <Card className="w-full max-w-sm shadow-2xl rounded-3xl overflow-hidden animate-fade-in-down border-none bg-white/80 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center text-white">
                    <div className="mx-auto w-20 h-20 mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <User className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">¡Bienvenido!</h2>
                    <p className="text-sm opacity-90 mt-1">Portal de Analistas</p>
                    <p className="text-xs opacity-80 mt-2">Inicia sesión para acceder al dashboard</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="p-8 space-y-6 bg-white">
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="username" type="text" placeholder="Nombre" required className="pl-12 h-12 rounded-xl bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="pl-12 pr-12 h-12 rounded-xl bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        
                        <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1">
                            Iniciar Sesión <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>


                        <Button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full h-14 text-lg font-semibold rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                                    Iniciando sesión...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <GoogleIcon />
                                    <span className="ml-3">Continuar con Google</span>
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </div>
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            ¿Problemas para acceder?{' '}
                            <Link href="#" className="font-medium text-emerald-600 hover:underline">
                                Contacta soporte
                            </Link>
                        </p>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
