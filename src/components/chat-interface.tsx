"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"

interface Message {
  sender: "ai" | "user"
  text: string
}

const initialMessages: Message[] = [
  {
    sender: "ai",
    text: "¡Hola Juan! He detectado que tu solicitud es sobre el Portal Web y el asunto es \"Recuperación de contraseña\". ¿Podrías explicarme con más detalle qué ocurre? Por ejemplo, ¿no recibes el correo, te marca error al restablecer o no recuerdas datos de acceso?",
  },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input.trim() }])
      setInput("")
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage()
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-card">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 flex items-center justify-center bg-muted rounded-full">
                  <Icons.logo className="h-5 w-5 text-foreground" />
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
                <Avatar className="h-8 w-8 flex items-center justify-center bg-muted rounded-full">
                  <User className="h-5 w-5 text-foreground" />
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-card">
        <div className="relative">
          <Input
            placeholder="Escribe tu mensaje..."
            className="pr-24"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2 flex items-center">
            <Button size="sm" onClick={handleSendMessage}>
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
