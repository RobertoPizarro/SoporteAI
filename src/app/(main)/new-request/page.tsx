"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ChatInterface from "@/components/chat-interface"
import { Ticket } from "lucide-react"

export default function NewRequestPage() {
  const [isCreated, setIsCreated] = useState(false)
  const [subject, setSubject] = useState("")
  const [area, setArea] = useState("")
  const [ticketDetails, setTicketDetails] = useState({
      number: "TKT-004",
      subject: "",
      area: "",
      date: new Date().toLocaleDateString(),
      status: "New",
  })

  const handleCreateRequest = () => {
    if (subject && area) {
      setTicketDetails(prev => ({ ...prev, subject, area }));
      setIsCreated(true)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full items-start">
      <Card className="flex flex-col animate-in fade-in-50">
        <CardHeader>
          <CardTitle className="font-headline">{isCreated ? "Detalles de la Solicitud" : "Nueva Solicitud"}</CardTitle>
          <CardDescription>
            {isCreated
              ? "Tu solicitud ha sido creada. Ya puedes chatear con nuestro asistente."
              : "Describe tu problema para crear una nueva solicitud de soporte."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {!isCreated ? (
            <form onSubmit={(e) => { e.preventDefault(); handleCreateRequest(); }} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  placeholder="Ej: No puedo acceder a la red WiFi"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Aplicación / Área</Label>
                <Select onValueChange={setArea} value={area} required>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Selecciona un área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Redes">Redes e Internet</SelectItem>
                    <SelectItem value="Software">Software y Aplicaciones</SelectItem>
                    <SelectItem value="Hardware">Hardware y Equipos</SelectItem>
                    <SelectItem value="Cuentas">Cuentas y Accesos</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Crear Solicitud
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-sm animate-in fade-in-50">
                <div className="flex"><strong className="w-32 text-muted-foreground">Ticket N°:</strong> {ticketDetails.number}</div>
                <div className="flex"><strong className="w-32 text-muted-foreground">Asunto:</strong> {ticketDetails.subject}</div>
                <div className="flex"><strong className="w-32 text-muted-foreground">Área:</strong> {ticketDetails.area}</div>
                <div className="flex"><strong className="w-32 text-muted-foreground">Fecha:</strong> {ticketDetails.date}</div>
                <div className="flex items-center"><strong className="w-32 text-muted-foreground">Estado:</strong> <span className="text-white bg-destructive px-2 py-0.5 rounded-full text-xs font-semibold">{ticketDetails.status}</span></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="flex flex-col h-[75vh] animate-in fade-in-50 delay-150">
        {!isCreated ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
                <Ticket className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold text-foreground font-headline">Estamos preparando tu solicitud</h3>
                <p>
                    Por favor, espera la confirmación para empezar a chatear.
                </p>
            </div>
        ) : (
          <ChatInterface />
        )}
      </Card>
    </div>
  )
}
