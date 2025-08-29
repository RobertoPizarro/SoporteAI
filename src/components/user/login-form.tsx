"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { User, ArrowRight } from "lucide-react";
import Link from "next/link";
import GoogleIcon from "../icons/google-icon"

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {



            // Aca va la logica?



            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push("/user/dashboard");
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <Card className="w-full max-w-sm shadow-2xl rounded-3xl overflow-hidden animate-fade-in-down border-none bg-white/80 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center text-white">
                    <div className="mx-auto w-20 h-20 mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <User className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">¡Bienvenido!</h2>
                    <p className="text-sm opacity-90 mt-1">Portal de Usuarios</p>
                </div>

                <CardContent className="p-8 space-y-6 bg-white">
                    <div className="text-center space-y-4">

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

                    </div>

                    <div className="text-center text-xs text-gray-500 space-y-2">
                        <p>
                            Al continuar, aceptas nuestros{' '}
                            <Link href="#" className="text-blue-600 hover:underline">
                                Términos de Servicio
                            </Link>{' '}
                            y{' '}
                            <Link href="#" className="text-blue-600 hover:underline">
                                Política de Privacidad
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}