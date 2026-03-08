import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ServerMessage } from "@/types/message";
import { useState } from "react";
import { useSocket } from "./hooks/useSocket";

export default function Chat() {
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const { sendMessage } = useSocket((msg) => {
    if (msg.type === "connection") {
      setUserId(msg.userId);
    }

    if (msg.type === "chat") {
      setMessages((prev) => [...prev, msg]);
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="flex h-150 w-125 flex-col gap-4 p-4">
        <div className="text-sm text-gray-500">Your ID: {userId}</div>

        <ScrollArea className="flex-1 rounded-md border p-3">
          <div className="flex flex-col gap-2">
            {messages.map((msg, index) => {
              if (msg.type === "chat") {
                return (
                  <div key={index} className="text-sm">
                    <span className="font-semibold">{msg.userId}:</span>{" "}
                    {msg.message}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button onClick={handleSend}>Send</Button>
        </div>
      </Card>
    </div>
  );
}
