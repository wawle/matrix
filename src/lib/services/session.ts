import { Session, ISession } from "@/lib/models/session";
import connectDB from "@/lib/db";
import { asyncFnService } from "@/lib/middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getSessions = asyncFnService(async (): Promise<ISession[]> => {
  await connectDB();
  const sessions = await Session.find().sort({ createdAt: -1 });
  return sessions;
});

export const getSessionById = asyncFnService(
  async (id: string): Promise<ISession> => {
    await connectDB();
    const session = await Session.findById(id);
    if (!session) {
      throw new ErrorResponse("Session bulunamadı", 404);
    }
    return session;
  }
);

export const createSession = asyncFnService(
  async (data: any): Promise<ISession> => {
    await connectDB();
    const session = await Session.create(data);
    if (!session) {
      throw new ErrorResponse("Session oluşturulurken bir hata oluştu", 400);
    }
    return session;
  }
);

export const updateSession = asyncFnService(
  async (id: string, data: any): Promise<ISession> => {
    await connectDB();
    const session = await Session.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!session) {
      throw new ErrorResponse("Session bulunamadı", 404);
    }
    return session;
  }
);

export const deleteSession = asyncFnService(
  async (id: string): Promise<ISession> => {
    await connectDB();
    const session = await Session.findByIdAndDelete(id);
    if (!session) {
      throw new ErrorResponse("Session bulunamadı", 404);
    }
    return session;
  }
);
