import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Paperclip, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const messages = [
  {
    sender: "ai",
    text: "¡Hola! Soy tu asistente de Soporte AI. He recibido tu solicitud. ¿Podrías darme más detalles sobre el problema?",
  },
  {
    sender: "user",
    text: "Sí, claro. Cuando intento conectarme a la red WiFi de la oficina, me aparece un error de 'autenticación fallida'.",
  },
  {
    sender: "ai",
    text: "Entendido. ¿Has intentado olvidar la red y volver a conectarte introduciendo la contraseña de nuevo? A veces eso soluciona el problema.",
  },
    {
    sender: "user",
    text: "No lo he intentado. Lo haré ahora mismo.",
  },
]

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold font-headline">Support AI Assistant</h3>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="AI" data-ai-hint="robot avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md rounded-lg p-3 shadow-sm ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person" />
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-card">
        <div className="relative">
          <Input placeholder="Escribe tu mensaje..." className="pr-32" />
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Paperclip className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
