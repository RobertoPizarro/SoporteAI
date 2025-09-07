import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";

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

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage: Message = {
        type: "user",
        content: inputValue,
        id: Date.now(),
      };
      addMessage(userMessage);
      setInputValue("");
      setIsTyping(true);
      setShowFrequentQuestions(false);

      try {
        const response = await fetch("http://127.0.0.1:5000/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mensaje: inputValue }),
        });

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        const data = await response.json();

        const botMessage: Message = {
          type: "bot",
          content: data.respuesta,
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

  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    setShowFrequentQuestions(true);
  };

  const handleQuestionClick = (question: string) => {
    const userMessage: Message = {
        type: "user",
        content: question,
        id: Date.now()
    };
    addMessage(userMessage);
    setInputValue(question);
     setTimeout(() => {
       handleSendMessage();
     }, 100);
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
