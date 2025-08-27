import { Message } from "@/types";
import { Bot, User } from "lucide-react";
import TicketCard from "./ticket-card";

const MessageBubble = ({
  message,
  isBot,
}: {
  message: Message;
  isBot: boolean;
}) => (
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
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div
        className={`px-5 py-4 rounded-2xl max-w-2xl ${
          isBot
            ? "bg-gray-100 text-gray-800"
            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        }`}
      >
        {typeof message.content === "string" ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <TicketCard ticket={message.content} />
        )}
      </div>
    </div>
  </div>
);

export default MessageBubble;