
    import { Field, IField } from "@/lib/models/field";
    import connectDB from "@/lib/db";
    
    export async function getFields(): Promise<IField[]> {
      try {
        await connectDB();
        const fields = await Field.find().sort({ createdAt: -1 });
        return fields;
      } catch (error: any) {
        throw new Error(error.message || "Field listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getFieldById(id: string): Promise<IField> {
        try {
        await connectDB();
        const field = await Field.findById(id);
        if (!field) {
          throw new Error("Field bulunamadı");
        }
        return field;
      } catch (error: any) {
        throw new Error(error.message || "Field alınırken bir hata oluştu");
      }
    }
    
    export async function createField(data: any): Promise<IField> {
      try {
        await connectDB();
        const field = await Field.create(data);
        return field;
      } catch (error: any) {
        throw new Error(error.message || "Field oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateField(id: string, data: any): Promise<IField> {
      try {
        await connectDB();
        const field = await Field.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!field) {
          throw new Error("Field bulunamadı");
        }
        return field;
      } catch (error: any) {
        throw new Error(error.message || "Field güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteField(id: string): Promise<IField> {
      try {
        await connectDB();
        const field = await Field.findByIdAndDelete(id);
        if (!field) {
          throw new Error("Field bulunamadı");
        }
        return field;
      } catch (error: any) {
        throw new Error(error.message || "Field silinirken bir hata oluştu");
      }
    }
    