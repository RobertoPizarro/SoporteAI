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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Hourglass, Clock, Check, MessageSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import ChatInterface from "@/components/chat-interface"

export default function NewRequestPage() {
  const [isCreated, setIsCreated] = useState(false)
  const [subject, setSubject] = useState("")
  const [application, setapplication] = useState("")

  const handleCreateRequest = () => {
    if (subject && application) {
      setIsCreated(true)
    }
  }

  if (isCreated) {
    const ticketDetails = {
      number: "TCK-2025-00421",
      subject: subject,
      area: application,
      date: "20/08/2025",
      status: "Abierta",
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
              <Select onValueChange={setapplication} value={application} required>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Portal Web" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Portal Web</SelectItem>
                  <SelectItem value="SSO" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">SSO</SelectItem>
                  <SelectItem value="Pagos" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Pagos</SelectItem>
                  <SelectItem value="Analytics" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Analytics</SelectItem>
                  <SelectItem value="Otro" className="hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Button type="submit" className="w-full">
                Crear solicitud
              </Button>
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
            <CardContent >
                <div className="p-8 rounded-lg border bg-background text-center">
                    <p>
                        Esperando confirmación...
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
