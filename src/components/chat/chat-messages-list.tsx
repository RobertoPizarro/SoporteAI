
import React, { useState, useRef } from "react";
import { Bot } from "lucide-react";
import FrequentQuestions from "./frequent-questions";
import MessageBubble from "./message-bubble";
import { Message } from "@/types";
import { frequentQuestions } from "@/data/frequent-questions";

interface ChatMessagesListProps {
    messages: Message[];
    role: "client" | "analyst";
    handleQuestionClick?: (question: string) => void;
    isTyping?: boolean;
    showFrequentQuestions?: boolean;
    messagesEndRef?: React.RefObject<HTMLDivElement>;
}

const ChatMessagesList = ({
  messages,
  role,
  handleQuestionClick,
  isTyping,
  showFrequentQuestions,
  messagesEndRef,
}: ChatMessagesListProps) => {
    return (
        <div className="flex-1 overflow-y-auto px-8 min-h-0">
            <div className="max-w-5xl mx-auto py-8">
                {showFrequentQuestions &&
                    messages.length === 0 &&
                    handleQuestionClick && (
                        <FrequentQuestions
                            frequentQuestions={frequentQuestions}
                            handleQuestionClick={handleQuestionClick}
                        />
                    )}

                {messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        isBot={message.type === "bot" || message.type === "ticket"}
                        role={role}
                    />
                ))}

                {isTyping && (
                    <div className="flex justify-start mb-6 animate-slideInUp">
                        <div className="flex items-end">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 animate-pulse">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-gray-100 px-5 py-4 rounded-2xl">
                                <div className="flex space-x-1.5">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatMessagesList;