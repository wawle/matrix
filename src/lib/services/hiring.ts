import { Hiring, IHiring } from "@/lib/models/hiring";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getHirings = asyncFnService(async (): Promise<IHiring[]> => {
  await connectDB();
  const hirings = await Hiring.find().sort({ createdAt: -1 });
  return hirings;
});

export const getHiringById = asyncFnService(
  async (id: string): Promise<IHiring> => {
    await connectDB();
    const hiring = await Hiring.findById(id);
    if (!hiring) {
      throw new ErrorResponse("Hiring bulunamadı", 404);
    }
    return hiring;
  }
);

export const createHiring = asyncFnService(
  async (data: any): Promise<IHiring> => {
    await connectDB();
    const hiring = await Hiring.create(data);
    if (!hiring) {
      throw new ErrorResponse("Hiring oluşturulurken bir hata oluştu", 500);
    }
    return hiring;
  }
);

export const updateHiring = asyncFnService(
  async (id: string, data: any): Promise<IHiring> => {
    await connectDB();
    const hiring = await Hiring.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!hiring) {
      throw new ErrorResponse("Hiring bulunamadı", 404);
    }
    return hiring;
  }
);

export const deleteHiring = asyncFnService(
  async (id: string): Promise<IHiring> => {
    await connectDB();
    const hiring = await Hiring.findByIdAndDelete(id);
    if (!hiring) {
      throw new ErrorResponse("Hiring bulunamadı", 404);
    }
    return hiring;
  }
);
