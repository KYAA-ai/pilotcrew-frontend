import { type Message, generateId } from "ai";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import apiClient from "./api";

export type Chat = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Array<Message>;
  userId: string;
};

export type User = {
  id: string;
  name: string;
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const fetcher = async (url: string) => {
  console.log("Fetching data from:", url);
  const res = await apiClient.get(url);

  if (!res.status.toString().startsWith("2")) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.data;
    error.status = res.status;

    throw error;
  }

  return res.data.history;
};

export function convertToUIMessages(
  messages: Array<Message>,
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {

    let textContent = "";

    if (typeof message.content === "string") {
      textContent = message.content;
    // } else if (Array.isArray(message.content)) {
    //   for (const content of message.content) {
    //     if (content.type === "text") {
    //       textContent += content.text;
    //     }
    //   }
    }

    chatMessages.push({
      id: generateId(),
      role: message.role,
      content: textContent,
    });

    return chatMessages;
  }, []);
}


export function getTitleFromChat(chat: Chat) {
  const messages = convertToUIMessages(chat.messages as Array<Message>);
  const firstMessage = messages[0];

  if (!firstMessage) {
    return "Untitled";
  }

  return firstMessage.content;
}
