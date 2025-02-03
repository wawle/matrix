import { Family, IFamily } from "@/lib/models/family";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getFamilys = asyncFnService(async (): Promise<IFamily[]> => {
  await connectDB();
  const familys = await Family.find().sort({ createdAt: -1 });
  return familys;
});

export const getFamilyById = asyncFnService(
  async (id: string): Promise<IFamily> => {
    await connectDB();
    const family = await Family.findById(id);
    if (!family) {
      throw new ErrorResponse("Family bulunamadı", 404);
    }
    return family;
  }
);

export const createFamily = asyncFnService(
  async (data: any): Promise<IFamily> => {
    await connectDB();
    const family = await Family.create(data);
    if (!family) {
      throw new ErrorResponse("Family oluşturulurken bir hata oluştu", 500);
    }
    return family;
  }
);

export const updateFamily = asyncFnService(
  async (id: string, data: any): Promise<IFamily> => {
    await connectDB();
    const family = await Family.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!family) {
      throw new ErrorResponse("Family bulunamadı", 404);
    }
    return family;
  }
);

export const deleteFamily = asyncFnService(
  async (id: string): Promise<IFamily> => {
    await connectDB();
    const family = await Family.findByIdAndDelete(id);
    if (!family) {
      throw new ErrorResponse("Family bulunamadı", 404);
    }
    return family;
  }
);
