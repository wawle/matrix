export const service = {
  template: (modelName: string, props: any): string => {
    const routeName = modelName.toLowerCase();
    return `
import { ${modelName}, I${modelName} } from "@/lib/models/${routeName}";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { listing } from "../middlewares/listing";

export const get${modelName}s = asyncFnService(
  async (
    queryParams: any
  ): Promise<{
    data: I${modelName}[];
    total: number;
    pageCount: number;
    pagination: { next?: { page: number; limit: number } };
  }> => {
    await connectDB();
    const ${routeName}s = await listing<I${modelName}>(${modelName}, queryParams);
    return ${routeName}s;
  }
);

export const get${modelName}ById = asyncFnService(
  async (id: string): Promise<I${modelName}> => {
    await connectDB();
    const ${routeName} = await ${modelName}.findById(id)
    if (!${routeName}) {
      throw new Error("${routeName} bulunamadı");
    }
    return ${routeName};
  }
);

export const create${modelName} = asyncFnService(
  async (data: any): Promise<I${modelName}> => {
    await connectDB();
    const ${routeName} = await ${modelName}.create(data);
    if (!${routeName}) {
      throw new Error("${routeName} oluşturulurken bir hata oluştu");
    }
    return ${routeName};
  }
);

export const update${modelName} = asyncFnService(
  async (id: string, data: any): Promise<I${modelName}> => {
    await connectDB();
    const ${routeName} = await ${modelName}.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!${routeName}) {
      throw new Error("${routeName} güncellenirken bir hata oluştu");
    }
    return ${routeName};
  }
);

export const delete${modelName} = asyncFnService(
  async (id: string): Promise<I${modelName}> => {
    await connectDB();
    const ${routeName} = await ${modelName}.findByIdAndDelete(id);
    if (!${routeName}) {
      throw new Error("${routeName} bulunamadı");
    }
    return ${routeName};
  }
);
    `;
  },
};
