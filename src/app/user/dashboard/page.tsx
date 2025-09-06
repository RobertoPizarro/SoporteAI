"use client";

import React from "react";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessagesList from "@/components/chat/chat-messages-list";
import ChatInput from "@/components/chat/chat-input";
import useChatBot from "@/hooks/use-chat-bot";
import SidebarServices from "@/components/user/sidebar-services";
import PageAnimations from "@/components/ui/page-animations";

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
  } = useChatBot();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
      <PageAnimations />
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
