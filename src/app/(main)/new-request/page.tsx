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
import { Hourglass } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function NewRequestPage() {
  const [isCreated, setIsCreated] = useState(false)
  const [subject, setSubject] = useState("")
  const [area, setArea] = useState("")

  const handleCreateRequest = () => {
    if (subject && area) {
      setIsCreated(true)
    }
  }

  // This part will be shown after the request is created.
  // For now, it's hidden and will be triggered by `handleCreateRequest`.
  if (isCreated) {
    // We can redirect or show a different component here.
    // For now, let's imagine it redirects to the ticket detail page.
    // To implement this fully, we would need routing logic.
    return (
        <div>Request Created! Redirecting...</div>
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
