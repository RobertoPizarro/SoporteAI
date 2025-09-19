import React, { useState } from "react";
import { Mic, Send, Lock } from "lucide-react";

interface ChatInputProps {
    handleSendMessage: (message: string) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
    isChatBlocked?: boolean;
}

const ChatInput = ({
       handleSendMessage,
       inputValue,
       setInputValue,
       isChatBlocked = false,
   }: ChatInputProps) => {

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isChatBlocked) {
            handleSendMessage(inputValue);
        }
    };

    const handleSendClick = () => {
        if (!isChatBlocked) {
            handleSendMessage(inputValue);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6 flex-shrink-0 animate-fade-in-down">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => !isChatBlocked && setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                                isChatBlocked
                                    ? "Chat cerrado - Ticket creado exitosamente"
                                    : "Escribe tu mensaje..."
                            }
                            disabled={isChatBlocked}
                            className={`w-full px-5 py-4 border rounded-2xl transition-all duration-300 pr-14 text-sm ${
                                isChatBlocked
                                    ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-white border-gray-300 focus:border-blue-500 focus:outline-none"
                            }`}
                        />
                        <button
                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 transition-colors ${
                                isChatBlocked
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-400 hover:text-blue-600"
                            }`}
                            disabled={isChatBlocked}
                        >
                            {isChatBlocked ? (
                                <Lock className="w-5 h-5" />
                            ) : (
                                <Mic className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <button
                        onClick={handleSendClick}
                        disabled={isChatBlocked}
                        className={`px-6 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-2 ${
                            isChatBlocked
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700"
                        }`}
                    >
                        {isChatBlocked ? (
                            <>
                                <Lock className="w-5 h-5" />
                                <span>Bloqueado</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Enviar</span>
                            </>
                        )}
                    </button>
                </div>

                {isChatBlocked && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-700 text-sm">
                            <Lock className="w-4 h-4" />
                            <span>
                                El chat ha sido cerrado porque se creó un ticket de soporte.
                                Para continuar chateando, inicia una nueva conversación.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInput;