"use client";
import React, { useState } from "react";
import { Chat, Message } from "@/components/ui/chat";
import { executeAgentAction } from "@/lib/actions/agent";
import { toast } from "sonner";
import { defaultMessages as defaultMessagesData } from "@/lib/constants/data";
import { ISession } from "@/lib/models/session";
import { SessionNav } from "./session-nav";

interface Props {
  agentId: string;
  sessionId: string;
  defaultMessages: Message[];
  sessions: ISession[];
}

const Client = ({
  agentId,
  sessionId,
  defaultMessages = defaultMessagesData,
  sessions,
}: Props) => {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>("");

  const handleSendMessage = async (content: string, files?: File[]) => {
    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      attachments: files
        ? await Promise.all(
            files.map(async (file) => ({
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              type: file.type,
              url: URL.createObjectURL(file),
              size: file.size,
            }))
          )
        : undefined,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Loading durumunu başlat
    setIsLoading(true);
    setStreamingContent("");

    try {
      // Asistan yanıtını ekle (streaming için boş başlat)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "system",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // API çağrısı
      const response = await executeAgentAction(
        agentId,
        sessionId,
        {
          message: content,
          attachments: files || [],
        },
        (chunk: string) => {
          setStreamingContent((prev) => prev + chunk);
        }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Yanıtı güncelle
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: response.data || "" }
            : msg
        )
      );
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
      toast.error("Mesaj gönderilemedi", {
        description: error instanceof Error ? error.message : "Bir hata oluştu",
      });
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  return (
    <div className="flex h-[92vh]">
      <SessionNav sessions={sessions} />
      <Chat
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        userName="Kullanıcı"
        assistantName="AI Asistan"
        userPhotoUrl="/avatars/user.png"
        assistantPhotoUrl="/avatars/assistant.png"
        streamingContent={streamingContent}
      />
    </div>
  );
};

export default Client;
