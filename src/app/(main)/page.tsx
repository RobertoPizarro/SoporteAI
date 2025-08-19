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
import { MessageSquare, User, LogOut, CheckCircle2, Clock, Check, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

const faqItems = [
  {
    question: "¿Cómo restablezco mi contraseña?",
    answer: "En el Portal Web, ve a Ajustes > Seguridad y selecciona \"Olvidé mi contraseña\". Recibirás un correo para continuar.",
  },
  {
    question: "Mi usuario está bloqueado",
    answer: "Verificaremos tu identidad y podremos desbloquearlo desde el chat de soporte.",
  },
  {
    question: "¿Dónde veo mis solicitudes?",
    answer: "En \"Mis Solicitudes\" encontrarás el historial y estado de cada caso.",
  },
]

const openRequests = [
  { id: "TCK-2025-00005", subject: "Error al iniciar sesión en SSO", application: "SSO", status: "Abierta", updated: "Actualizado hace 2h", variant: "secondary" as const, icon: <RefreshCw className="h-3 w-3" /> },
  { id: "TCK-2025-00189", subject: "Reporte de pagos incompleto", application: "Pagos", status: "Resuelta", updated: "Actualizado ayer", variant: "default" as const, icon: <CheckCircle2 className="h-3 w-3" /> },
  { id: "TCK-2025-00188", subject: "No se cargan métricas", application: "Analytics", status: "Resuelta", updated: "Actualizado hace 3 días", variant: "secondary" as const, icon: <RefreshCw className="h-3 w-3" /> },
]

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 animate-in fade-in-50">
        <main className="flex-1 bg-background">
            <div className="max-w-5xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-bold font-headline">Hola, Juan Pérez. ¿En qué te podemos ayudar?</h1>
                    <div className="mt-6">
                        <Link href="/new-request">
                            <Button size="lg">
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Iniciar Nueva Solicitud
                            </Button>
                        </Link>
                    </div>
                </div>

                <section className="mt-16">
                    <h2 className="text-2xl font-bold font-headline mb-4">Preguntas Frecuentes</h2>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </section>

                <section className="mt-16">
                    <h2 className="text-2xl font-bold font-headline mb-4">Solicitudes abiertas</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {openRequests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/my-requests/${encodeURIComponent(request.id)}?subject=${encodeURIComponent(request.subject)}&application=${encodeURIComponent(request.application)}&status=${encodeURIComponent(request.status)}`}
                    >
                      <Card className="hover:border-primary transition-colors">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <p className="font-semibold">{request.id}</p>
                              <Badge 
                                variant={request.status === "Resuelta" ? "success" : "open"} 
                                className="gap-1.5"
                              >
                                {request.status === "Abierta" && <Clock className="h-3 w-3" />}
                                {request.status === "Resuelta" && <Check className="h-3 w-3" />}
                                {request.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Asunto</p>
                              <p className="text-sm">{request.subject}</p>
                            </div>
                            <p className="text-xs text-muted-foreground text-right">{request.updated}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                    </div>
                </section>
            </div>
        </main>
    </div>
  )
}
