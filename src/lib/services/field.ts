import { Field, IField } from "@/lib/models/field";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getFields = asyncFnService(async (): Promise<IField[]> => {
  await connectDB();
  const fields = await Field.find()
    .select("name type label")
    .sort({ createdAt: -1 });
  return fields;
});

export const getFieldById = asyncFnService(
  async (id: string): Promise<IField> => {
    await connectDB();
    const field = await Field.findById(id);
    if (!field) {
      throw new ErrorResponse("Field bulunamadı", 404);
    }
    return field;
  }
);

export const createField = asyncFnService(
  async (data: any): Promise<IField> => {
    await connectDB();
    const field = await Field.create(data);
    if (!field) {
      throw new ErrorResponse("Field oluşturulurken bir hata oluştu", 500);
    }
    return field;
  }
);

export const updateField = asyncFnService(
  async (id: string, data: any): Promise<IField> => {
    await connectDB();
    const field = await Field.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!field) {
      throw new ErrorResponse("Field bulunamadı", 404);
    }
    return field;
  }
);

export const deleteField = asyncFnService(
  async (id: string): Promise<IField> => {
    await connectDB();
    const field = await Field.findByIdAndDelete(id);
    if (!field) {
      throw new ErrorResponse("Field bulunamadı", 404);
    }
    return field;
  }
);
