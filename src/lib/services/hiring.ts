
    import { Hiring, IHiring } from "@/lib/models/hiring";
    import connectDB from "@/lib/db";
    
    export async function getHirings(): Promise<IHiring[]> {
      try {
        await connectDB();
        const hirings = await Hiring.find().sort({ createdAt: -1 });
        return hirings;
      } catch (error: any) {
        throw new Error(error.message || "Hiring listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getHiringById(id: string): Promise<IHiring> {
        try {
        await connectDB();
        const hiring = await Hiring.findById(id);
        if (!hiring) {
          throw new Error("Hiring bulunamadı");
        }
        return hiring;
      } catch (error: any) {
        throw new Error(error.message || "Hiring alınırken bir hata oluştu");
      }
    }
    
    export async function createHiring(data: any): Promise<IHiring> {
      try {
        await connectDB();
        const hiring = await Hiring.create(data);
        return hiring;
      } catch (error: any) {
        throw new Error(error.message || "Hiring oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateHiring(id: string, data: any): Promise<IHiring> {
      try {
        await connectDB();
        const hiring = await Hiring.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!hiring) {
          throw new Error("Hiring bulunamadı");
        }
        return hiring;
      } catch (error: any) {
        throw new Error(error.message || "Hiring güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteHiring(id: string): Promise<IHiring> {
      try {
        await connectDB();
        const hiring = await Hiring.findByIdAndDelete(id);
        if (!hiring) {
          throw new Error("Hiring bulunamadı");
        }
        return hiring;
      } catch (error: any) {
        throw new Error(error.message || "Hiring silinirken bir hata oluştu");
      }
    }
    