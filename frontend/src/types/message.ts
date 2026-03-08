export interface ChatMessage {
  type: "chat";
  userId: string;
  message: string;
}

export interface ConnectionMessage {
  type: "connection";
  userId: string;
}

export type ServerMessage = ChatMessage | ConnectionMessage;
