import { useState } from "react";
import { Message } from "@/types";
import { Bot, User, Copy, Volume2, Square } from "lucide-react";
import TicketCard from "../user/ticket-card";
import { copyText, speakText } from "@/lib/utils";

const MessageBubble = ({
  message,
  isBot,
  role,
}: {
  message: Message;
  isBot: boolean;
  role: "client" | "analyst";
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSpeak = () => {
    if (!isSpeaking) {
      setIsSpeaking(true);
      speakText(message.content as string, "es-ES", () => setIsSpeaking(false));
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = () => {
    copyText(message.content as string);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={`flex ${
        isBot ? "justify-start" : "justify-end"
      } mb-6 animate-slideInUp`}
    >
      <div
        className={`flex max-w-4xl ${
          isBot ? "flex-row" : "flex-row-reverse"
        } items-end`}
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isBot ? "mr-3" : "ml-3"
          }`}
        >
          {isBot ? (
            <div
              className={`w-full h-full rounded-full flex items-center justify-center ${
                role === "client"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600"
              }`}
            >
              <Bot className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div
              className={`w-full h-full rounded-full flex items-center justify-center ${
                role === "client"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600"
              }`}
            >
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div
          className={`px-5 py-4 rounded-2xl max-w-2xl ${
            isBot
              ? "bg-gray-100 text-gray-800"
              : role === "client"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
          }`}
        >
          {typeof message.content === "string" ? (
            <>
              <p className="text-sm leading-relaxed">{message.content}</p>

              <div className="flex gap-2 mt-2">
                <div className="relative">
                  <button
                    title="Copiar mensaje"
                    className={`hover:bg-slate-200 rounded-full p-1 transition-all duration-200 ${
                      isCopied ? "scale-95 bg-green-100" : ""
                    }`}
                    onClick={handleCopy}
                  >
                    <Copy
                      className={`w-4 h-4 transition-colors duration-200 ${
                        isCopied ? "text-green-600" : ""
                      }`}
                    />
                  </button>
                  {isCopied && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div
                        className={`relative text-white text-xs px-3 py-2 rounded-lg shadow-xl
                          ${
                            role === "client"
                              ? "bg-gradient-to-r from-blue-500 to-purple-600"
                              : role === "analyst"
                              ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                              : "bg-gray-900"
                          }
                        `}
                      >
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          Mensaje copiado
                        </span>
                        {/* Flecha del tooltip */}
                        <div
                          className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent
                          ${
                            role === "client"
                              ? "border-t-blue-500"
                              : role === "analyst"
                              ? "border-t-emerald-500"
                              : "border-t-gray-900"
                          }
                        `}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {isSpeaking ? (
                  <button
                    title="Detener lectura"
                    className="hover:bg-slate-200 rounded-full p-1 transition-colors"
                    onClick={handleSpeak}
                  >
                    <Square className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    title="Leer en voz alta"
                    className="hover:bg-slate-200 rounded-full p-1 transition-colors"
                    onClick={handleSpeak}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <TicketCard ticket={message.content} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
