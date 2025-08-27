"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot, User, Clock, FileText, ShieldAlert, MessageCircle, Plus, Settings} from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { conversationFlow } from '@/data/conversation-flow';
import ChatMessagesList from '@/components/chat/chat-messages-list';
import ChatInput from '@/components/chat/chat-input';
import useChatBot from '@/hooks/use-chat-bot';

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

            <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 flex-shrink-0">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image src="/logo.png" alt="Logo" width={280} height={80} />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-100/50 backdrop-blur-sm border border-slate-200/50 rounded-xl px-3 py-2">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Centro de Soporte Analytics
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <p className="text-xs text-slate-600">Asistente Virtual Inteligente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 min-h-0">
                <div className="w-72 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col flex-shrink-0 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
                    <div className="flex-1 p-4 space-y-6 overflow-y-auto min-h-0">
                        <button
                            onClick={handleNewChat}
                            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">Iniciar Nueva Conversación</span>
                            </div>
                        </button>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-800">Servicios de Analytics:</h4>
                            <div className="space-y-2">
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-sm font-medium text-blue-700">Data Science</div>
                                    <div className="text-xs text-blue-600">Análisis de datos</div>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                    <div className="text-sm font-medium text-green-700">Big Data</div>
                                    <div className="text-xs text-green-600">Procesamiento de datos masivos</div>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="text-sm font-medium text-purple-700">Cloud+Apps</div>
                                    <div className="text-xs text-purple-600">Soluciones en la nube</div>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <div className="text-sm font-medium text-orange-700">Geo Solutions</div>
                                    <div className="text-xs text-orange-600">Servicios de geolocalización</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    <ChatMessagesList
                        messages={messages}
                        role={"user"}
                        handleQuestionClick={handleQuestionClick}
                    />

                    <ChatInput inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
};

export default ChatBot;