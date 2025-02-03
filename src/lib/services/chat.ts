import { Chat, IChat } from "@/lib/models/chat";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getChats = asyncFnService(async (): Promise<IChat[]> => {
  await connectDB();
  const chats = await Chat.find().sort({ createdAt: -1 });
  return chats;
});

export const getChatById = asyncFnService(
  async (id: string): Promise<IChat> => {
    await connectDB();
    const chat = await Chat.findById(id);
    if (!chat) {
      throw new ErrorResponse("Chat bulunamadı", 404);
    }
    return chat;
  }
);

export const createChat = asyncFnService(async (data: any): Promise<IChat> => {
  await connectDB();
  const chat = await Chat.create(data);
  if (!chat) {
    throw new ErrorResponse("Chat oluşturulurken bir hata oluştu", 400);
  }
  return chat;
});

export const updateChat = asyncFnService(
  async (id: string, data: any): Promise<IChat> => {
    await connectDB();
    const chat = await Chat.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!chat) {
      throw new ErrorResponse("Chat bulunamadı", 404);
    }
    return chat;
  }
);

export const deleteChat = asyncFnService(async (id: string): Promise<IChat> => {
  await connectDB();
  const chat = await Chat.findByIdAndDelete(id);
  if (!chat) {
    throw new ErrorResponse("Chat bulunamadı", 404);
  }
  return chat;
});
