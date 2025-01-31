
    import { FlowSession, IFlowSession } from "@/lib/models/flowsession";
    import connectDB from "@/lib/db";
    
    export async function getFlowSessions(): Promise<IFlowSession[]> {
      try {
        await connectDB();
        const flowsessions = await FlowSession.find().sort({ createdAt: -1 });
        return flowsessions;
      } catch (error: any) {
        throw new Error(error.message || "FlowSession listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getFlowSessionById(id: string): Promise<IFlowSession> {
        try {
        await connectDB();
        const flowsession = await FlowSession.findById(id);
        if (!flowsession) {
          throw new Error("FlowSession bulunamadı");
        }
        return flowsession;
      } catch (error: any) {
        throw new Error(error.message || "FlowSession alınırken bir hata oluştu");
      }
    }
    
    export async function createFlowSession(data: any): Promise<IFlowSession> {
      try {
        await connectDB();
        const flowsession = await FlowSession.create(data);
        return flowsession;
      } catch (error: any) {
        throw new Error(error.message || "FlowSession oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateFlowSession(id: string, data: any): Promise<IFlowSession> {
      try {
        await connectDB();
        const flowsession = await FlowSession.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!flowsession) {
          throw new Error("FlowSession bulunamadı");
        }
        return flowsession;
      } catch (error: any) {
        throw new Error(error.message || "FlowSession güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteFlowSession(id: string): Promise<IFlowSession> {
      try {
        await connectDB();
        const flowsession = await FlowSession.findByIdAndDelete(id);
        if (!flowsession) {
          throw new Error("FlowSession bulunamadı");
        }
        return flowsession;
      } catch (error: any) {
        throw new Error(error.message || "FlowSession silinirken bir hata oluştu");
      }
    }
    