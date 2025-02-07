import { Model, IModel } from "@/lib/models/model";
import connectDB from "@/lib/db";
import { Field } from "../models/field";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getModels = asyncFnService(
  async (query: any): Promise<IModel[]> => {
    await connectDB();
    const models = await Model.find(query).populate({
      path: "fields",
      model: Field,
    });
    return models;
  }
);

export const getModelById = asyncFnService(
  async (id: string): Promise<IModel> => {
    await connectDB();
    const model = await Model.findById(id).populate({
      path: "fields",
      model: Field,
    });
    if (!model) {
      throw new ErrorResponse("Model bulunamadı", 404);
    }
    return model;
  }
);

export const createModel = asyncFnService(
  async (data: any): Promise<IModel> => {
    await connectDB();
    const model = await Model.create(data);
    if (!model) {
      throw new ErrorResponse("Model oluşturulurken bir hata oluştu", 500);
    }
    return model;
  }
);

export const updateModel = asyncFnService(
  async (id: string, data: any): Promise<IModel> => {
    await connectDB();
    const model = await Model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!model) {
      throw new ErrorResponse("Model bulunamadı", 404);
    }
    return model;
  }
);

export const deleteModel = asyncFnService(
  async (id: string): Promise<IModel> => {
    await connectDB();
    const model = await Model.findByIdAndDelete(id);
    if (!model) {
      throw new ErrorResponse("Model bulunamadı", 404);
    }
    return model;
  }
);
