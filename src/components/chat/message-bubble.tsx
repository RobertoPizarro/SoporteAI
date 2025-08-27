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

  const handleSpeak = () => {
    if (!isSpeaking) {
      setIsSpeaking(true);
      speakText(message.content as string, "es-ES", () => setIsSpeaking(false));
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
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
                <button
                  title="Copiar mensaje"
                  className="hover:bg-slate-200 rounded-full p-1 transition-colors"
                >
                  <Copy
                    className="w-4 h-4"
                    onClick={() => copyText(message.content as string)}
                  />
                </button>
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
