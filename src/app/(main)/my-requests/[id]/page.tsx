"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ChatInterface from "@/components/chat-interface"
import { Clock, Check, MessageSquare } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function RequestDetailPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams()
    const subject = searchParams.get("subject") || "Sin asunto"
    const application = searchParams.get("application") || "Sin aplicación"
    const status = searchParams.get("status") || "Abierta"
  
    const ticketDetails = {
      number: params.id,
      subject,
      area: application,
      date: "26 Oct 2023, 14:30",
      status,
    }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in-50">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Detalle de la solicitud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1 rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">N° de Ticket</p>
                        <p className="font-normal text-sm">{ticketDetails.number}</p>
                    </div>
                    <div className="space-y-1 rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">Asunto</p>
                        <p className="font-normal text-sm">{ticketDetails.subject}</p>
                    </div>
                    <div className="space-y-1 rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">Aplicación / Área</p>
                        <p className="font-normal text-sm">{ticketDetails.area}</p>
                    </div>
                    <div className="space-y-1 rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">Fecha de creación</p>
                        <p className="font-normal text-sm">{ticketDetails.date}</p>
                    </div>
                    <div className="space-y-1 rounded-md border p-2">
                        <p className="text-xs text-muted-foreground">Estado</p>
                        <Badge 
                            variant={ticketDetails.status === "Resuelta" ? "success" : "open"} 
                            className="gap-1.5 font-semibold text-sm"
                        >
                            {ticketDetails.status === "Abierta" && <Clock className="h-3 w-3" />}
                            {ticketDetails.status === "Resuelta" && <Check className="h-3 w-3" />}
                            {ticketDetails.status}
                        </Badge>
                        </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
             <Card className="flex flex-col h-[75vh]">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-headline">Asistente Inteligente de Soporte</CardTitle>
                        <CardDescription>Ticket {ticketDetails.number} • {ticketDetails.area}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="gap-1.5 text-sm">
                        <MessageSquare className="h-3 w-3" />
                        Activa
                    </Badge>
                </CardHeader>
                <ChatInterface />
             </Card>
        </div>
    </div>
  )
}
