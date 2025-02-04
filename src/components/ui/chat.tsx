import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
import { Send, Plus, File, Image as ImageIcon, X } from "lucide-react";
import { Textarea } from "./textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachments?: FileAttachment[];
}

interface ChatProps {
  messages: Message[];
  isLoading?: boolean;
  onSendMessage: (message: string, attachments?: File[]) => void;
  userPhotoUrl?: string;
  assistantPhotoUrl?: string;
  userName?: string;
  assistantName?: string;
}

export function Chat({
  messages,
  isLoading,
  onSendMessage,
  userPhotoUrl,
  assistantPhotoUrl,
  userName = "Sen",
  assistantName = "Asistan",
}: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = React.useState("");
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(input, attachments);
      setInput("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const validateAndAddFiles = (files: File[]) => {
    const newFiles = files.filter((newFile) => {
      const isDuplicate = attachments.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.type === newFile.type
      );
      return !isDuplicate;
    });

    if (newFiles.length !== files.length) {
      toast.warning("Bazı dosyalar eklenemedi", {
        description: "Aynı isim ve tipteki dosyalar zaten eklenmiş durumda.",
        duration: 3000,
      });
    }

    if (newFiles.length > 0) {
      setAttachments((prev) => [...prev, ...newFiles]);
      toast.success("Dosyalar eklendi", {
        description: `${newFiles.length} dosya başarıyla eklendi.`,
        duration: 2000,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndAddFiles(files);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const isImageFile = (type: string) => type.startsWith("image/");

  const handleDragEnter = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      validateAndAddFiles(files);
      textareaRef.current?.focus();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const renderAttachment = (attachment: FileAttachment) => {
    if (isImageFile(attachment.type)) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer group">
              <Image
                src={attachment.url}
                alt={attachment.name}
                className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                width={200}
                height={200}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl flex flex-col items-center justify-center">
            <DialogTitle>{attachment.name}</DialogTitle>
            <Image
              src={attachment.url}
              alt={attachment.name}
              width={500}
              height={200}
              className="rounded-lg"
            />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
      >
        <File className="w-4 h-4" />
        <span className="text-sm truncate">{attachment.name}</span>
      </a>
    );
  };

  return (
    <div className="flex h-[92vh]">
      {/* Ana Sohbet Alanı */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="p-4">
            <div className="max-w-3xl mx-auto space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 rounded-lg ${
                    message.role === "assistant"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } ${message.role === "assistant" ? "p-2" : "p-2 bg-sidebar"}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        message.role === "assistant"
                          ? assistantPhotoUrl
                          : userPhotoUrl
                      }
                    />
                    <AvatarFallback>
                      {message.role === "assistant"
                        ? assistantName.charAt(0)
                        : userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 ${
                      message.role === "user" ? "max-w-[50%] ml-auto" : ""
                    }`}
                  >
                    <div
                      className={`font-semibold mb-1 text-sm ${
                        message.role === "user" ? "text-right" : ""
                      }`}
                    >
                      {message.role === "assistant" ? assistantName : userName}
                    </div>
                    {message.content && (
                      <div
                        className={`text-sm leading-6 ${
                          message.role === "user" ? "text-right" : ""
                        }`}
                      >
                        {message.content}
                      </div>
                    )}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex justify-end items-center"
                          >
                            {renderAttachment(attachment)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-6 bg-sidebar py-8 px-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={assistantPhotoUrl} />
                    <AvatarFallback>{assistantName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[300px]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Input Alanı */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-muted p-2 rounded-lg"
                  >
                    {isImageFile(file.type) ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : (
                      <File className="w-4 h-4" />
                    )}
                    <span className="text-sm truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                placeholder="Bir mesaj gönderin... (Enter tuşu gönderir, Shift+Enter yeni satır) Dosyaları sürükleyip bırakabilirsiniz"
                className={cn(
                  "pr-24 bg-sidebar rounded-lg",
                  isDragging && "border-2 border-dashed border-primary"
                )}
                disabled={isLoading}
                rows={3}
              />
              {isDragging && (
                <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="text-sm text-primary font-medium">
                    Dosyaları buraya bırakın
                  </div>
                </div>
              )}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  disabled={
                    isLoading || (!input.trim() && attachments.length === 0)
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
