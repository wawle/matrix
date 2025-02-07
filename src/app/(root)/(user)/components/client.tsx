"use client";
import React, { useState } from "react";
import { Chat, Message } from "@/components/ui/chat";
import { executeAgentAction } from "@/lib/actions/agent";
import { toast } from "sonner";
import { IAuthSession } from "@/lib/dal";

interface Props {
  user: IAuthSession;
}

const Client = ({ user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>("");

  const handleSendMessage = async (content: string, files?: File[]) => {
    // Kullanıcı mesajını ekle
    const userMessage: Message = {
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

    // Loading durumunu başlat
    setIsLoading(true);
    setStreamingContent("");

    try {
      // API çağrısı
      const response = await executeAgentAction(
        "agent-id", // alfred
        "session-id", // new session
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
    <Chat
      messages={[]}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      userName={user.fullname}
      assistantName="Alfred"
      userPhotoUrl={user.photo}
      assistantPhotoUrl="/avatars/assistant.png"
      streamingContent={streamingContent}
    />
  );
};

export default Client;
