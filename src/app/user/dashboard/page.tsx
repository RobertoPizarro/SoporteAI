"use client";

import React from "react";
import ChatHeader from "@/components/chat/chat-header";
import { conversationFlow } from "@/data/conversation-flow";
import ChatMessagesList from "@/components/chat/chat-messages-list";
import ChatInput from "@/components/chat/chat-input";
import useChatBot from "@/hooks/use-chat-bot";
import SidebarServices from "@/components/user/sidebar-services";

const ChatBot = () => {
  const {
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
  } = useChatBot(conversationFlow);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.4s ease-out;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(-20px);
        }

        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <ChatHeader role="client" />

      <div className="flex flex-1 min-h-0">
        <SidebarServices handleNewChat={handleNewChat} />

        <div className="flex-1 flex flex-col min-w-0">
          <ChatMessagesList
            messages={messages}
            role={"client"}
            handleQuestionClick={handleQuestionClick}
            isTyping={isTyping}
            showFrequentQuestions={showFrequentQuestions}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
