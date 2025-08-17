import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ChatInterface from "@/components/chat-interface"

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch request details based on params.id
  const ticketDetails = {
    number: params.id,
    subject: "Problema de acceso a la VPN",
    area: "Redes e Internet",
    date: "2023-10-26",
    status: "In Progress",
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full items-start">
      <Card className="animate-in fade-in-50">
        <CardHeader>
          <CardTitle className="font-headline">Detalles de la Solicitud</CardTitle>
          <CardDescription>
            Información detallada del Ticket N° {ticketDetails.number}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center text-sm"><strong className="w-40 text-muted-foreground">Ticket N°:</strong><span>{ticketDetails.number}</span></div>
            <div className="flex items-start text-sm"><strong className="w-40 text-muted-foreground">Asunto:</strong><span className="flex-1">{ticketDetails.subject}</span></div>
            <div className="flex items-center text-sm"><strong className="w-40 text-muted-foreground">Área:</strong><span>{ticketDetails.area}</span></div>
            <div className="flex items-center text-sm"><strong className="w-40 text-muted-foreground">Fecha de creación:</strong><span>{ticketDetails.date}</span></div>
            <div className="flex items-center text-sm"><strong className="w-40 text-muted-foreground">Estado:</strong>
                <Badge variant={ticketDetails.status === 'In Progress' ? 'secondary' : 'default'} className="text-xs">{ticketDetails.status}</Badge>
            </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col h-[75vh] animate-in fade-in-50 delay-150">
        <ChatInterface />
      </Card>
    </div>
  )
}
