import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, HelpCircle } from "lucide-react"

const faqItems = [
  {
    question: "¿Cómo puedo restablecer mi contraseña?",
    answer: "Para restablecer tu contraseña, ve a la página de inicio de sesión y haz clic en '¿Olvidaste tu contraseña?'. Sigue las instrucciones para crear una nueva.",
  },
  {
    question: "¿Dónde puedo ver el estado de mis solicitudes?",
    answer: "Puedes ver todas tus solicitudes y su estado actual en la sección 'Mis Solicitudes' en el menú de navegación principal.",
  },
  {
    question: "¿Cómo creo una nueva solicitud de soporte?",
    answer: "Haz clic en 'Nueva Solicitud' en el menú principal. Completa el formulario con los detalles de tu problema y nuestro equipo se pondrá en contacto.",
  },
]

const openRequests = [
  { id: "TKT-001", subject: "Problema de acceso a la VPN", status: "In Progress" },
  { id: "TKT-002", subject: "Fallo en la impresora de la oficina", status: "In Progress" },
  { id: "TKT-003", subject: "No puedo acceder a mi correo electrónico", status: "New" },
]

export default function HomePage() {
  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Hola, Juan Pérez</h1>
          <p className="text-muted-foreground">¿En qué podemos ayudarte hoy?</p>
        </div>
        <Link href="/new-request">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Start New Conversation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4">
             <HelpCircle className="w-8 h-8 text-primary" />
            <div>
                <CardTitle>Preguntas Frecuentes</CardTitle>
                <CardDescription>
                Encuentra respuestas rápidas a las preguntas más comunes.
                </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Solicitudes Abiertas</CardTitle>
            <CardDescription>
              Un vistazo rápido a tus solicitudes activas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openRequests.map((request) => (
                <Link href={`/my-requests/${request.id}`} key={request.id} className="block">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div>
                        <p className="font-semibold">{request.subject}</p>
                        <p className="text-sm text-muted-foreground">{request.id}</p>
                    </div>
                    <Badge variant={request.status === 'New' ? 'destructive' : 'secondary'}>{request.status}</Badge>
                    </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
