
    import { Session, ISession } from "@/lib/models/session";
    import connectDB from "@/lib/db";
    
    export async function getSessions(): Promise<ISession[]> {
      try {
        await connectDB();
        const sessions = await Session.find().sort({ createdAt: -1 });
        return sessions;
      } catch (error: any) {
        throw new Error(error.message || "Session listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getSessionById(id: string): Promise<ISession> {
        try {
        await connectDB();
        const session = await Session.findById(id);
        if (!session) {
          throw new Error("Session bulunamadı");
        }
        return session;
      } catch (error: any) {
        throw new Error(error.message || "Session alınırken bir hata oluştu");
      }
    }
    
    export async function createSession(data: any): Promise<ISession> {
      try {
        await connectDB();
        const session = await Session.create(data);
        return session;
      } catch (error: any) {
        throw new Error(error.message || "Session oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateSession(id: string, data: any): Promise<ISession> {
      try {
        await connectDB();
        const session = await Session.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!session) {
          throw new Error("Session bulunamadı");
        }
        return session;
      } catch (error: any) {
        throw new Error(error.message || "Session güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteSession(id: string): Promise<ISession> {
      try {
        await connectDB();
        const session = await Session.findByIdAndDelete(id);
        if (!session) {
          throw new Error("Session bulunamadı");
        }
        return session;
      } catch (error: any) {
        throw new Error(error.message || "Session silinirken bir hata oluştu");
      }
    }
    