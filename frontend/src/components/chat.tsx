import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ChatMessage, ServerMessage } from "@/types/message";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "./hooks/useSocket";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle incoming WebSocket messages
  const handleSocketMessage = useCallback((msg: ServerMessage) => {
    if (msg.type === "connection") {
      setUserId(msg.userId);
    } else if (msg.type === "chat") {
      setMessages((prev) => [...prev, msg]);
    }
  }, []);

  const { sendMessage } = useSocket(handleSocketMessage);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-2">
      <Card className="flex h-150 w-125 flex-col p-4">
        {/* User ID display */}
        <div className="mb-2 text-sm text-gray-500">Your ID: {userId}</div>

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-2">
            {messages.map((msg, index) => {
              const isOwn = msg.userId === userId;
              return (
                <div
                  key={index}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-md px-3 py-1 ${
                      isOwn
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="mb-1 text-xs font-semibold">
                      {isOwn ? "You" : msg.userId.slice(0, 6)}
                    </div>
                    {msg.message}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input fixed at bottom */}
        <div className="mt-2 flex gap-2">
          <Input
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </Card>
    </div>
  );
}
