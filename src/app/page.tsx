'use client'
import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="text-center mb-16 pb-4 animate-fade-in-down">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-transparent mb-4 bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 pb-2">
          Servicios de Agente Soporte IA
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Accede a nuestras herramientas especializadas según tu rol.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <Link href="/user/login" className="group block">
          <Card className="h-full rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-gray-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-2xl hover:border-purple-200/80 dark:hover:border-purple-900/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white shadow-md">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-semibold text-foreground">Soy Usuario</h2>
                    <p className="text-muted-foreground">¿Necesitas ayuda o tienes una solicitud?</p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <p className="mb-6 text-muted-foreground text-sm">
                Interactúa con nuestro chatbot para reportar incidencias o solicitar requerimientos en los servicios de analytics.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <Badge variant="outline" className="bg-blue-100/50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200/80 dark:border-blue-500/30">Data Science</Badge>
                <Badge variant="outline" className="bg-blue-100/50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200/80 dark:border-blue-500/30">Big Data</Badge>
                <Badge variant="outline" className="bg-blue-100/50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200/80 dark:border-blue-500/30">Geo Solutions</Badge>
                <Badge variant="outline" className="bg-blue-100/50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200/80 dark:border-blue-500/30">Cloud+Apps</Badge>
              </div>
              <Button className="w-full font-bold text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                Obtener Soporte <Zap className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analyst/login" className="group block">
          <Card className="h-full rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-gray-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-2xl hover:border-green-200/80 dark:hover:border-green-900/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <CardContent className="p-8">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg text-white shadow-md">
                      <BarChart className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-headline font-semibold text-foreground">Soy Analista</h2>
                      <p className="text-muted-foreground">Gestiona tus tickets</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-secondary transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <p className="mb-6 text-muted-foreground text-sm">
                Accede a tus tickets asignados, realiza seguimiento del estado y brinda soluciones efectivas a nuestros usuarios.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                 <Badge variant="outline" className="bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200/80 dark:border-green-500/30">Gestión de Tickets</Badge>
                 <Badge variant="outline" className="bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200/80 dark:border-green-500/30">Seguimiento</Badge>
                 <Badge variant="outline" className="bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200/80 dark:border-green-500/30">Análisis</Badge>
              </div>
              <Button className="w-full font-bold text-lg py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                Iniciar Sesión <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </main>
  );
}
