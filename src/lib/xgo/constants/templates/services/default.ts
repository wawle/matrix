export const service = {
  template: (modelName: string, props: any): string => {
    const routeName = modelName.toLowerCase();
    return `
    import { ${modelName}, I${modelName} } from "@/lib/models/${routeName}";
    import connectDB from "@/lib/db";
    
    export async function get${modelName}s(): Promise<I${modelName}[]> {
      try {
        await connectDB();
        const ${routeName}s = await ${modelName}.find().sort({ createdAt: -1 });
        return ${routeName}s;
      } catch (error: any) {
        throw new Error(error.message || "${modelName} listesi alınırken bir hata oluştu");
      }
    }
    
      export async function get${modelName}ById(id: string): Promise<I${modelName}> {
        try {
        await connectDB();
        const ${routeName} = await ${modelName}.findById(id);
        if (!${routeName}) {
          throw new Error("${modelName} bulunamadı");
        }
        return ${routeName};
      } catch (error: any) {
        throw new Error(error.message || "${modelName} alınırken bir hata oluştu");
      }
    }
    
    export async function create${modelName}(data: any): Promise<I${modelName}> {
      try {
        await connectDB();
        const ${routeName} = await ${modelName}.create(data);
        return ${routeName};
      } catch (error: any) {
        throw new Error(error.message || "${modelName} oluşturulurken bir hata oluştu");
      }
    }
    
    export async function update${modelName}(id: string, data: any): Promise<I${modelName}> {
      try {
        await connectDB();
        const ${routeName} = await ${modelName}.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (!${routeName}) {
          throw new Error("${modelName} bulunamadı");
        }
        return ${routeName};
      } catch (error: any) {
        throw new Error(error.message || "${modelName} güncellenirken bir hata oluştu");
      }
    }
    
    export async function delete${modelName}(id: string): Promise<I${modelName}> {
      try {
        await connectDB();
        const ${routeName} = await ${modelName}.findByIdAndDelete(id);
        if (!${routeName}) {
          throw new Error("${modelName} bulunamadı");
        }
        return ${routeName};
      } catch (error: any) {
        throw new Error(error.message || "${modelName} silinirken bir hata oluştu");
      }
    }
    `;
  },
};
