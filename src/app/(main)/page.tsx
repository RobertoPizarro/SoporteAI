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
import { MessageSquare, User, LogOut, CheckCircle2, RefreshCw } from "lucide-react"
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
    answer: "Ve a Ajustes > Seguridad y selecciona \"Olvidé mi contraseña\". Recibirás un correo para continuar.",
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
  { id: "#10234", subject: "Problemas para iniciar sesión", status: "En Progreso", updated: "Actualizado hace 2 h", variant: "secondary" as const, icon: <RefreshCw className="h-3 w-3" /> },
  { id: "#10212", subject: "Solicitud de desbloqueo de usuario", status: "Resuelto", updated: "Actualizado ayer", variant: "default" as const, icon: <CheckCircle2 className="h-3 w-3" /> },
  { id: "#10190", subject: "Error al cargar reportes", status: "En Progreso", updated: "Actualizado hace 3 d", variant: "secondary" as const, icon: <RefreshCw className="h-3 w-3" /> },
]

const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Nueva Solicitud", href: "/new-request" },
    { label: "Mis Solicitudes", href: "/my-requests" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 animate-in fade-in-50">
        <header className="flex items-center h-20 px-4 md:px-8 bg-card border-b">
             <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <Icons.logo className="h-6 w-6 text-foreground" />
                <span className="font-bold font-headline text-lg">Soporte</span>
            </Link>
            <nav className="ml-10 hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-8">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`transition-colors text-base font-medium ${item.href === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {item.href === '/' ? (
                            <Button size="sm" className="px-4 py-2 h-auto">
                                {item.label}
                            </Button>
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </Link>
                ))}
            </nav>
            <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="h-4 w-4" />
                      Juan Pérez
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                     <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Cerrar Sesión</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="flex-1 bg-background px-4 md:px-8 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-bold font-headline">Hola, Juan Pérez. ¿En qué te podemos ayudar?</h1>
                    <div className="mt-6">
                        <Link href="/new-request">
                            <Button size="lg">
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Iniciar Nueva Conversación
                            </Button>
                        </Link>
                    </div>
                </div>

                <section className="mt-16">
                    <h2 className="text-2xl font-bold font-headline mb-4">Preguntas Frecuentes</h2>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline font-semibold">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </section>

                <section className="mt-16">
                    <h2 className="text-2xl font-bold font-headline mb-4">Solicitudes abiertas</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {openRequests.map((request) => (
                         <Link href="#" key={request.id}>
                            <Card className="hover:border-primary transition-colors">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <p className="font-semibold">{request.id}</p>
                                        <Badge variant={request.variant} className="gap-1.5">
                                            {request.icon}
                                            {request.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Asunto</p>
                                        <p className="font-semibold text-sm">{request.subject}</p>
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
