export const action = {
  template: (modelName: string, props: any): string => {
    const routeName = modelName.toLowerCase();
    return `
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    get${modelName}s,
    get${modelName}ById,
    create${modelName},
    update${modelName},
    delete${modelName}
  } from "@/lib/services/${routeName}";
   import { I${modelName} } from "@/lib/models/${routeName}";
  
  export async function fetch${modelName}s(): Promise<{
    data: I${modelName}[];
    success: boolean;
    error?: string;
  }> {
    try {
      const ${routeName}s = await get${modelName}s();
      return { data: JSON.parse(JSON.stringify(${routeName}s)), success: true };
    } catch (error: any) {
      return { error: error.message, success: false, data: [] };
    }
  }
  
  export async function fetch${modelName}(id: string): Promise<{
    data?: I${modelName};
    success: boolean;
    error?: string;
  }> {
    try {
      const ${routeName} = await get${modelName}ById(id);
      return { data: JSON.parse(JSON.stringify(${routeName})), success: true };
    } catch (error: any) {
      return { error: error.message, success: false };
    }
  }
  
  export async function create${modelName}Action(data: I${modelName}): Promise<{
    data?: I${modelName};
    success: boolean;
    error?: string;
  }> {
    try {
      const ${routeName} = await create${modelName}(data);
      revalidatePath("/admin/${routeName}s");
      return { data: JSON.parse(JSON.stringify(${routeName})), success: true };
    } catch (error: any) {
      return { error: error.message, success: false };
    }
  }
  
  export async function update${modelName}Action(id: string, data: I${modelName}): Promise<{
    data?: I${modelName};
    success: boolean;
    error?: string;
  }> {
    try {
      const ${routeName} = await update${modelName}(id, data);
      revalidatePath("/admin/${routeName}s");
      revalidatePath("/admin/${routeName}s/[id]", "page");
      return { data: JSON.parse(JSON.stringify(${routeName})), success: true };
    } catch (error: any) {
      return { error: error.message, success: false };
    }
  }
  
  export async function delete${modelName}Action(id: string): Promise<{
    data?: I${modelName};
    success: boolean;
    error?: string;
  }> {
    try {
      const ${routeName} = await delete${modelName}(id);
      revalidatePath("/admin/${routeName}s");
      return { data: JSON.parse(JSON.stringify(${routeName})), success: true };
    } catch (error: any) {
      return { error: error.message, success: false };
    }
  }`;
  },
};
