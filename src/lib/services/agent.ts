
    import { Agent, IAgent } from "@/lib/models/agent";
    import connectDB from "@/lib/db";
    
    export async function getAgents(): Promise<IAgent[]> {
      try {
        await connectDB();
        const agents = await Agent.find().sort({ createdAt: -1 });
        return agents;
      } catch (error: any) {
        throw new Error(error.message || "Agent listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getAgentById(id: string): Promise<IAgent> {
        try {
        await connectDB();
        const agent = await Agent.findById(id);
        if (!agent) {
          throw new Error("Agent bulunamadı");
        }
        return agent;
      } catch (error: any) {
        throw new Error(error.message || "Agent alınırken bir hata oluştu");
      }
    }
    
    export async function createAgent(data: any): Promise<IAgent> {
      try {
        await connectDB();
        const agent = await Agent.create(data);
        return agent;
      } catch (error: any) {
        throw new Error(error.message || "Agent oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateAgent(id: string, data: any): Promise<IAgent> {
      try {
        await connectDB();
        const agent = await Agent.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!agent) {
          throw new Error("Agent bulunamadı");
        }
        return agent;
      } catch (error: any) {
        throw new Error(error.message || "Agent güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteAgent(id: string): Promise<IAgent> {
      try {
        await connectDB();
        const agent = await Agent.findByIdAndDelete(id);
        if (!agent) {
          throw new Error("Agent bulunamadı");
        }
        return agent;
      } catch (error: any) {
        throw new Error(error.message || "Agent silinirken bir hata oluştu");
      }
    }
    