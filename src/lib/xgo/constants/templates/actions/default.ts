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
  delete${modelName},
} from "@/lib/services/${routeName}";
import { I${modelName} } from "@/lib/models/${routeName}";

export async function fetch${modelName}s(): Promise<{
  data: {
    data: I${modelName}[];
    total: number;
    pageCount: number;
    pagination: { next?: { page: number; limit: number } };
  };
  error?: any;
  success: boolean;
}> {
  try {
    const ${routeName}s = await get${modelName}s();
    return { data: ${routeName}s, success: true };
  } catch (error: any) {
    return {
      error: error.message,
      success: false,
      data: { data: [], total: 0, pageCount: 0, pagination: {} },
    };
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

export async function create${modelName}Action(data: any): Promise<{
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

export async function update${modelName}Action(
  id: string,
  data: any
): Promise<{
  data?: I${modelName};
  success: boolean;
  error?: string;
}> {
  try {
    const ${routeName} = await update${modelName}(id, data);
    revalidatePath("/admin/${routeName}s");

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
}
`;
  },
};
