import React, { useState } from "react";
import { Mic, Send } from "lucide-react";

interface ChatInput {
  handleSendMessage: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const ChatInput = ({
  handleSendMessage,
  inputValue,
  setInputValue,
}: ChatInput) => {
  return (
    <div
      className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6 flex-shrink-0 animate-fade-in-down"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Escribe tu mensaje..."
              className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 pr-14 text-sm"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
