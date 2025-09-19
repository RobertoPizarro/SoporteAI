import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import { sendMessage } from "@/services/chat.service";
import { resetChat } from "@/services/chat.service";

export default function useChatBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showFrequentQuestions, setShowFrequentQuestions] = useState(true);
    const [isChatBlocked, setIsChatBlocked] = useState(false); // Nuevo estado para bloqueo
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // No persistir el estado de bloqueo - recargar página = nueva conversación

    const addMessage = (message: Message) => {
        setMessages((prev) => [
            ...prev,
            { ...message, id: Date.now() + Math.random() },
        ]);
        setShowFrequentQuestions(false);
    };

    const blockChat = () => {
        setIsChatBlocked(true);
        console.log("💬 Chat bloqueado - Ticket creado");
    };

    const unblockChat = () => {
        setIsChatBlocked(false);
        console.log("💬 Chat desbloqueado - Nueva conversación");
    };

    const handleSendMessage = async (messageText?: string) => {
        // No permitir enviar mensajes si el chat está bloqueado
        if (isChatBlocked) {
            console.log("💬 Mensaje bloqueado - Chat cerrado por ticket activo");
            return;
        }

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

                let processedContent = response;
                let shouldBlockChat = false;

                // Detectar si se creó un ticket
                if (typeof response === 'object' && response.type === 'ticket_created') {
                    // El backend devolvió un ticket creado
                    processedContent = response.ticket;
                    shouldBlockChat = true;
                    console.log("🎫 TICKET CREATED - BLOCKING CHAT:", processedContent);
                } else if (typeof response === 'object' && response.type === 'ticket') {
                    // Formato anterior por compatibilidad
                    processedContent = response.ticket;
                    shouldBlockChat = true;
                    console.log("🎫 TICKET (OLD FORMAT) - BLOCKING CHAT:", processedContent);
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
                            estado: 'aceptado', // Estado por defecto según el backend
                            fecha_creacion: new Date().toISOString(),
                        };
                        processedContent = ticketObject;
                        shouldBlockChat = true;
                        console.log("🎫 FALLBACK TICKET CREATED - BLOCKING CHAT:", ticketObject);
                    }
                }

                const botMessage: Message = {
                    type: shouldBlockChat ? "ticket" : "bot",
                    content: processedContent,
                };

                addMessage(botMessage);

                // Bloquear el chat si se creó un ticket
                if (shouldBlockChat) {
                    blockChat();
                }

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
            unblockChat(); // Desbloquear el chat al iniciar nueva conversación
            console.log("Nueva conversación iniciada - Chat desbloqueado");
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
        isChatBlocked,
        setInputValue,
        handleSendMessage,
        handleNewChat,
        handleQuestionClick,
        messagesEndRef,
    };
}