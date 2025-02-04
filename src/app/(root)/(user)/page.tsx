"use client";
import React, { useState } from "react";
import { Chat, Message } from "@/components/ui/chat";

const defaultMessages: Message[] = [
  {
    id: "1",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "Merhaba, neler yapabilirsiniz?",
    role: "user" as const,
    timestamp: new Date(),
  },
  {
    id: "3",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "4",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "5",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "6",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "7",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "8",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "9",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "10",
    content: "Merhaba, neler yapabilirsiniz?",
    role: "user" as const,
    timestamp: new Date(),
  },
  {
    id: "11",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "12",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "13",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "14",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "15",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
  {
    id: "16",
    content: "Merhaba, nasıl yardımcı olabilirim?",
    role: "assistant" as const,
    timestamp: new Date(),
  },
];

const HomePage = () => {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      // Burada API çağrısı yapılabilir
      // Örnek bir gecikme simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Asistan yanıtını ekle
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Bu bir örnek yanıttır. Gerçek bir API yanıtı ile değiştirilmelidir.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Mesaj gönderme hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Chat
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      userName="Kullanıcı"
      assistantName="AI Asistan"
      userPhotoUrl="/avatars/user.png"
      assistantPhotoUrl="/avatars/assistant.png"
    />
  );
};

export default HomePage;
