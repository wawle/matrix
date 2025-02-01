import { Model, IModel } from "@/lib/models/model";
import connectDB from "@/lib/db";
import { Field } from "../models/field";

export async function getModels(query: any): Promise<IModel[]> {
  try {
    await connectDB();
    const models = await Model.find(query)
      .populate({
        path: "fields",
        model: Field,
      })
      .sort({ createdAt: -1 });
    return models;
  } catch (error: any) {
    throw new Error(error.message || "Model listesi alınırken bir hata oluştu");
  }
}

export async function getModelById(id: string): Promise<IModel> {
  try {
    await connectDB();
    const model = await Model.findById(id).populate({
      path: "fields",
      model: Field,
    });
    if (!model) {
      throw new Error("Model bulunamadı");
    }
    return model;
  } catch (error: any) {
    throw new Error(error.message || "Model alınırken bir hata oluştu");
  }
}

export async function createModel(data: any): Promise<IModel> {
  try {
    await connectDB();
    const model = await Model.create(data);
    return model;
  } catch (error: any) {
    throw new Error(error.message || "Model oluşturulurken bir hata oluştu");
  }
}

export async function updateModel(id: string, data: any): Promise<IModel> {
  try {
    await connectDB();
    const model = await Model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!model) {
      throw new Error("Model bulunamadı");
    }
    return model;
  } catch (error: any) {
    throw new Error(error.message || "Model güncellenirken bir hata oluştu");
  }
}

export async function deleteModel(id: string): Promise<IModel> {
  try {
    await connectDB();
    const model = await Model.findByIdAndDelete(id);
    if (!model) {
      throw new Error("Model bulunamadı");
    }
    return model;
  } catch (error: any) {
    throw new Error(error.message || "Model silinirken bir hata oluştu");
  }
}
