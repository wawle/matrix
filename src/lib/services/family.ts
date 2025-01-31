
    import { Family, IFamily } from "@/lib/models/family";
    import connectDB from "@/lib/db";
    
    export async function getFamilys(): Promise<IFamily[]> {
      try {
        await connectDB();
        const familys = await Family.find().sort({ createdAt: -1 });
        return familys;
      } catch (error: any) {
        throw new Error(error.message || "Family listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getFamilyById(id: string): Promise<IFamily> {
        try {
        await connectDB();
        const family = await Family.findById(id);
        if (!family) {
          throw new Error("Family bulunamadı");
        }
        return family;
      } catch (error: any) {
        throw new Error(error.message || "Family alınırken bir hata oluştu");
      }
    }
    
    export async function createFamily(data: any): Promise<IFamily> {
      try {
        await connectDB();
        const family = await Family.create(data);
        return family;
      } catch (error: any) {
        throw new Error(error.message || "Family oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateFamily(id: string, data: any): Promise<IFamily> {
      try {
        await connectDB();
        const family = await Family.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!family) {
          throw new Error("Family bulunamadı");
        }
        return family;
      } catch (error: any) {
        throw new Error(error.message || "Family güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteFamily(id: string): Promise<IFamily> {
      try {
        await connectDB();
        const family = await Family.findByIdAndDelete(id);
        if (!family) {
          throw new Error("Family bulunamadı");
        }
        return family;
      } catch (error: any) {
        throw new Error(error.message || "Family silinirken bir hata oluştu");
      }
    }
    