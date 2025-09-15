import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import { sendMessage } from "@/services/chat.service";
import { resetChat } from "@/services/chat.service";

export default function useChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFrequentQuestions, setShowFrequentQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: Date.now() + Math.random() },
    ]);
    setShowFrequentQuestions(false);
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (textToSend) {
      const userMessage: Message = {
        type: "user",
        content: textToSend,
        id: Date.now(),
      };
      addMessage(userMessage);
      setInputValue("");
      setIsTyping(true);
      setShowFrequentQuestions(false);
      try {
        const response = await sendMessage(textToSend);
        
        console.log("🔍 RESPONSE FROM SERVICE:", response);
        console.log("🔍 Type:", typeof response);
        
        // Manejar respuesta de ticket desde el backend
        let processedContent = response;
        
        if (typeof response === 'object' && response.type === 'ticket') {
          // El backend devolvió la estructura completa de ticket
          processedContent = response.ticket;
          console.log("🎫 USING BACKEND TICKET OBJECT:", processedContent);
        } else if (typeof response === 'string' && response.includes('He generado el ticket')) {
          // Fallback: parsear del texto (por compatibilidad)
          const ticketMatch = response.match(/ticket #?(\d+)/);
          if (ticketMatch) {
            const ticketId = parseInt(ticketMatch[1]);
            const ticketObject = {
              id: ticketId,
              asunto: 'Ticket creado desde chat',
              tipo: 'Solicitud',
              nivel: 'Medio',
              estado: 'abierto',
              fecha_creacion: new Date().toISOString(),
            };
            processedContent = ticketObject;
            console.log("🎫 FALLBACK TICKET CREATED:", ticketObject);
          }
        }

        const botMessage: Message = {
          type: "bot",
          content: processedContent,
        };
        addMessage(botMessage);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        const errorMessage: Message = {
          type: "bot",
          content:
            "Lo siento, tuve un problema para conectarme. Por favor, intenta de nuevo más tarde.",
        };
        addMessage(errorMessage);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleNewChat = async () => {
    try {
        await resetChat();
        setMessages([]);
        setInputValue("");
        setShowFrequentQuestions(true);
        console.log("Nueva conversación iniciada");
    } catch (error) {
        console.error("Error al reiniciar conversación:", error);
    }
  };

  const handleQuestionClick = (question: string) => {
    const userMessage: Message = {
      type: "user",
      content: question,
      id: Date.now(),
    };
    handleSendMessage(userMessage.content as string);
  };

  return {
    messages,
    inputValue,
    isTyping,
    showFrequentQuestions,
    setInputValue,
    handleSendMessage,
    handleNewChat,
    handleQuestionClick,
    messagesEndRef,
  };
}
