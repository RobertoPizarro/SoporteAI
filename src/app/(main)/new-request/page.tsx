"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Hourglass, Clock, MessageSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import ChatInterface from "@/components/chat-interface"

export default function NewRequestPage() {
  const [isCreated, setIsCreated] = useState(false)
  const [subject, setSubject] = useState("")
  const [area, setArea] = useState("")

  const handleCreateRequest = () => {
    if (subject && area) {
      setIsCreated(true)
    }
  }

  if (isCreated) {
    const ticketDetails = {
      number: "TCK-2025-00421",
      subject: subject,
      area: area,
      date: "17 Ago 2025, 10:24",
      status: "Abierto",
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
                            <p className="font-semibold text-sm">#{ticketDetails.number}</p>
                        </div>
                        <div className="space-y-1 rounded-md border p-2">
                            <p className="text-xs text-muted-foreground">Asunto</p>
                            <p className="font-semibold text-sm">{ticketDetails.subject}</p>
                        </div>
                        <div className="space-y-1 rounded-md border p-2">
                            <p className="text-xs text-muted-foreground">Aplicación / Área</p>
                            <p className="font-semibold text-sm">{ticketDetails.area}</p>
                        </div>
                        <div className="space-y-1 rounded-md border p-2">
                            <p className="text-xs text-muted-foreground">Fecha de creación</p>
                            <p className="font-semibold text-sm">{ticketDetails.date}</p>
                        </div>
                        <div className="space-y-1 rounded-md border p-2">
                            <p className="text-xs text-muted-foreground">Estado</p>
                            <Badge variant="outline" className="gap-1.5 font-semibold text-sm">
                                <Clock className="h-3 w-3" />
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
                            <CardDescription>Ticket #{ticketDetails.number} • {ticketDetails.area}</CardDescription>
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
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <Card className="animate-in fade-in-50">
        <CardHeader>
          <CardTitle className="font-headline text-lg">Nueva solicitud</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCreateRequest()
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Textarea
                id="subject"
                placeholder="Describe brevemente tu problema"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="h-24"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Aplicación / Área</Label>
              <Select onValueChange={setArea} value={area} required>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Portal Web">Portal Web</SelectItem>
                  <SelectItem value="SSO">SSO</SelectItem>
                  <SelectItem value="Pagos">Pagos</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Ejemplos: Portal Web, SSO, Pagos, Analytics
              </p>
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full">
                Crear solicitud
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Se creará el ticket y se abrirá el chat automáticamente.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="animate-in fade-in-50 delay-150">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline text-lg">Asistente Inteligente de Soporte</CardTitle>
                    <CardDescription>Esperando creación de ticket</CardDescription>
                </div>
                <Badge variant="outline" className="gap-2">
                    <Hourglass className="h-3 w-3" />
                    En espera
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="p-8 rounded-lg border bg-background text-center">
                    <p>
                        Estamos preparando tu solicitud. Aguarda la confirmación para comenzar a chatear.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
