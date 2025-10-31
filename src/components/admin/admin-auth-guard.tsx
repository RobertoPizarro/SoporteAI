"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth");
      const adminEmail = localStorage.getItem("adminEmail");

      if (adminAuth === "true" && adminEmail === "admin@soporteai.com") {
        setIsAuthorized(true);
      } else {
        // Redirigir a login si no está autorizado
        router.push("/admin/login");
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-700">Verificando permisos...</h2>
          <p className="text-slate-500">Un momento por favor</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Se redirige en el useEffect
  }

  return <>{children}</>;
}