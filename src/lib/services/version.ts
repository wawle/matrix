
    import { Version, IVersion } from "@/lib/models/version";
    import connectDB from "@/lib/db";
    
    export async function getVersions(): Promise<IVersion[]> {
      try {
        await connectDB();
        const versions = await Version.find().sort({ createdAt: -1 });
        return versions;
      } catch (error: any) {
        throw new Error(error.message || "Version listesi alınırken bir hata oluştu");
      }
    }
    
      export async function getVersionById(id: string): Promise<IVersion> {
        try {
        await connectDB();
        const version = await Version.findById(id);
        if (!version) {
          throw new Error("Version bulunamadı");
        }
        return version;
      } catch (error: any) {
        throw new Error(error.message || "Version alınırken bir hata oluştu");
      }
    }
    
    export async function createVersion(data: any): Promise<IVersion> {
      try {
        await connectDB();
        const version = await Version.create(data);
        return version;
      } catch (error: any) {
        throw new Error(error.message || "Version oluşturulurken bir hata oluştu");
      }
    }
    
    export async function updateVersion(id: string, data: any): Promise<IVersion> {
      try {
        await connectDB();
        const version = await Version.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!version) {
          throw new Error("Version bulunamadı");
        }
        return version;
      } catch (error: any) {
        throw new Error(error.message || "Version güncellenirken bir hata oluştu");
      }
    }
    
    export async function deleteVersion(id: string): Promise<IVersion> {
      try {
        await connectDB();
        const version = await Version.findByIdAndDelete(id);
        if (!version) {
          throw new Error("Version bulunamadı");
        }
        return version;
      } catch (error: any) {
        throw new Error(error.message || "Version silinirken bir hata oluştu");
      }
    }
    