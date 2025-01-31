
    import { Key, IKey } from "@/lib/models/key";
    import connectDB from "@/lib/db";
    
    export async function getKeys(): Promise<IKey[]> {
      try {
        await connectDB();
        const keys = await Key.find().sort({ createdAt: -1 });
        return keys;
      } catch (error: any) {
        throw new Error(error.message || "Key listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getKeyById(id: string): Promise<IKey> {
        try {
        await connectDB();
        const key = await Key.findById(id);
        if (!key) {
          throw new Error("Key bulunamadı");
        }
        return key;
      } catch (error: any) {
        throw new Error(error.message || "Key alınırken bir hata oluştu");
      }
    }
    
    export async function createKey(data: any): Promise<IKey> {
      try {
        await connectDB();
        const key = await Key.create(data);
        return key;
      } catch (error: any) {
        throw new Error(error.message || "Key oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateKey(id: string, data: any): Promise<IKey> {
      try {
        await connectDB();
        const key = await Key.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!key) {
          throw new Error("Key bulunamadı");
        }
        return key;
      } catch (error: any) {
        throw new Error(error.message || "Key güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteKey(id: string): Promise<IKey> {
      try {
        await connectDB();
        const key = await Key.findByIdAndDelete(id);
        if (!key) {
          throw new Error("Key bulunamadı");
        }
        return key;
      } catch (error: any) {
        throw new Error(error.message || "Key silinirken bir hata oluştu");
      }
    }
    