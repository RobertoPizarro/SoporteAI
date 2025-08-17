import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Paperclip, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const messages = [
  {
    sender: "ai",
    text: "¡Hola Juan! He detectado que tu solicitud es sobre el Portal Web y el asunto es \"Recuperación de contraseña\". ¿Podrías explicarme con más detalle qué ocurre? Por ejemplo, ¿no recibes el correo, te marca error al restablecer o no recuerdas datos de acceso?",
  },
  {
    sender: "user",
    text: "No he recibido el correo para recuperar mi contraseña.",
  },
]

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-full bg-card">
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
          <Input placeholder="Escribe tu mensaje..." className="pr-24" />
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2 flex items-center">
            <Button size="sm">
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
