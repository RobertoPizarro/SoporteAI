import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";

export default function useChatBot(conversationFlow: Message[]) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFrequentQuestions, setShowFrequentQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Función para hacer scroll al final del chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll automático al final
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Flujo de conversación automatizado (opcional)
  useEffect(() => {
    if (messages.length > 0) return;
    let step = 0;
    let mounted = true;
    const showNextMessage = () => {
      if (!mounted) return;
      if (step < conversationFlow.length) {
        const nextMessage = conversationFlow[step];
        if (step === 0) {
          setTimeout(() => {
            if (!mounted) return;
            setShowFrequentQuestions(false);
          }, 2000);
        }
        if (nextMessage.type === "bot" || nextMessage.type === "ticket") {
          setIsTyping(true);
          setTimeout(() => {
            if (!mounted) return;
            setIsTyping(false);
            addMessage(nextMessage);
            step++;
            setTimeout(showNextMessage, nextMessage.delay || 1000);
          }, nextMessage.delay || 1000);
        } else {
          addMessage(nextMessage);
          step++;
          setTimeout(showNextMessage, 500);
        }
      }
    };
    setTimeout(showNextMessage, 3000);
    return () => {
      mounted = false;
    };
  }, []);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, { ...message, id: Date.now() + Math.random() }]);
    setShowFrequentQuestions(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage: Message = {
        type: "user",
        content: inputValue,
        id: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(false);
      setShowFrequentQuestions(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    setShowFrequentQuestions(true);
  };

  const handleQuestionClick = (question: string) => {
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
    scrollToBottom,
  };
}
