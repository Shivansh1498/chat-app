import { useEffect, useRef } from "react";
import type { ServerMessage } from "@/types/message";

export function useSocket(onMessage: (msg: ServerMessage) => void) {
  const socketRef = useRef<WebSocket | null>(null);
  const messageHandlerRef = useRef(onMessage);

  // keep latest callback
  useEffect(() => {
    messageHandlerRef.current = onMessage;
  }, [onMessage]);

  // create socket only once
  useEffect(() => {
    const socket = new WebSocket(
      import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3001"
    );

    socket.onopen = () => {
      console.log("Connected to websocket");
    };

    socket.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);

      // always call latest handler
      messageHandlerRef.current(data);
    };

    socket.onclose = () => {
      console.log("Socket closed");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (!socketRef.current) return;

    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  return { sendMessage };
}
