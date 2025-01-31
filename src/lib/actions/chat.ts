
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getChats,
    getChatById,
    createChat,
    updateChat,
    deleteChat
  } from "@/lib/services/chat";
  
  export async function fetchChats() {
    try {
      const chats = await getChats();
      return { data: JSON.parse(JSON.stringify(chats)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchChat(id: string) {
    try {
      const chat = await getChatById(id);
      return { data: JSON.parse(JSON.stringify(chat)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createChatAction(data: any) {
    try {
      const chat = await createChat(data);
      revalidatePath("/chats");
      return { data: JSON.parse(JSON.stringify(chat)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateChatAction(id: string, data: any) {
    try {
      const chat = await updateChat(id, data);
      revalidatePath("/chats");
      revalidatePath("/chats/[id]");
      return { data: JSON.parse(JSON.stringify(chat)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteChatAction(id: string) {
    try {
      const chat = await deleteChat(id);
      revalidatePath("/chats");
      return { data: JSON.parse(JSON.stringify(chat)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }