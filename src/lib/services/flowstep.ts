
    import { FlowStep, IFlowStep } from "@/lib/models/flowstep";
    import connectDB from "@/lib/db";
    
    export async function getFlowSteps(): Promise<IFlowStep[]> {
      try {
        await connectDB();
        const flowsteps = await FlowStep.find().sort({ createdAt: -1 });
        return flowsteps;
      } catch (error: any) {
        throw new Error(error.message || "FlowStep listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getFlowStepById(id: string): Promise<IFlowStep> {
        try {
        await connectDB();
        const flowstep = await FlowStep.findById(id);
        if (!flowstep) {
          throw new Error("FlowStep bulunamadı");
        }
        return flowstep;
      } catch (error: any) {
        throw new Error(error.message || "FlowStep alınırken bir hata oluştu");
      }
    }
    
    export async function createFlowStep(data: any): Promise<IFlowStep> {
      try {
        await connectDB();
        const flowstep = await FlowStep.create(data);
        return flowstep;
      } catch (error: any) {
        throw new Error(error.message || "FlowStep oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateFlowStep(id: string, data: any): Promise<IFlowStep> {
      try {
        await connectDB();
        const flowstep = await FlowStep.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!flowstep) {
          throw new Error("FlowStep bulunamadı");
        }
        return flowstep;
      } catch (error: any) {
        throw new Error(error.message || "FlowStep güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteFlowStep(id: string): Promise<IFlowStep> {
      try {
        await connectDB();
        const flowstep = await FlowStep.findByIdAndDelete(id);
        if (!flowstep) {
          throw new Error("FlowStep bulunamadı");
        }
        return flowstep;
      } catch (error: any) {
        throw new Error(error.message || "FlowStep silinirken bir hata oluştu");
      }
    }
    