
    import { Chat, IChat } from "@/lib/models/chat";
    import connectDB from "@/lib/db";
    
    export async function getChats(): Promise<IChat[]> {
      try {
        await connectDB();
        const chats = await Chat.find().sort({ createdAt: -1 });
        return chats;
      } catch (error: any) {
        throw new Error(error.message || "Chat listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getChatById(id: string): Promise<IChat> {
        try {
        await connectDB();
        const chat = await Chat.findById(id);
        if (!chat) {
          throw new Error("Chat bulunamadı");
        }
        return chat;
      } catch (error: any) {
        throw new Error(error.message || "Chat alınırken bir hata oluştu");
      }
    }
    
    export async function createChat(data: any): Promise<IChat> {
      try {
        await connectDB();
        const chat = await Chat.create(data);
        return chat;
      } catch (error: any) {
        throw new Error(error.message || "Chat oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateChat(id: string, data: any): Promise<IChat> {
      try {
        await connectDB();
        const chat = await Chat.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!chat) {
          throw new Error("Chat bulunamadı");
        }
        return chat;
      } catch (error: any) {
        throw new Error(error.message || "Chat güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteChat(id: string): Promise<IChat> {
      try {
        await connectDB();
        const chat = await Chat.findByIdAndDelete(id);
        if (!chat) {
          throw new Error("Chat bulunamadı");
        }
        return chat;
      } catch (error: any) {
        throw new Error(error.message || "Chat silinirken bir hata oluştu");
      }
    }
    