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
                console.log("🔍 EXACT RESPONSE TEXT:", JSON.stringify(response));

                // Solo detectar si se creó un ticket para bloquear el chat
                let shouldBlockChat = false;

                if (typeof response === 'string') {
                    // 🔍 DEBUGGING: Mostrar el texto completo para análisis
                    console.log("📝 STRING RESPONSE - ANALYZING FOR TICKET:");
                    console.log("  Full text:", response);
                    console.log("  Contains 'ticket':", response.toLowerCase().includes('ticket'));
                    console.log("  Contains 'generado':", response.toLowerCase().includes('generado'));
                    console.log("  Contains 'creado':", response.toLowerCase().includes('creado'));
                    
                    // Múltiples patrones de detección de ticket
                    const ticketPatterns = [
                        /he generado el ticket/i,
                        /ticket.*creado/i,
                        /creado.*ticket/i,
                        /ticket #?(\d+)/i,
                        /generado.*ticket/i,
                        /nuevo ticket/i
                    ];
                    
                    for (const pattern of ticketPatterns) {
                        const match = response.match(pattern);
                        if (match) {
                            console.log(`✅ PATTERN MATCHED: ${pattern}`, match);
                            shouldBlockChat = true;
                            console.log("🎫 TICKET DETECTED IN STRING - BLOCKING CHAT");
                            break;
                        }
                    }
                    
                    if (!shouldBlockChat) {
                        console.log("❌ NO TICKET PATTERNS FOUND IN STRING");
                    }
                } else {
                    console.log("❌ RESPONSE IS NOT STRING - CHAT REMAINS OPEN");
                }

                console.log("🔒 SHOULD BLOCK CHAT:", shouldBlockChat);

                const botMessage: Message = {
                    type: shouldBlockChat ? "ticket" : "bot",
                    content: response, // Usar directamente el string response
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