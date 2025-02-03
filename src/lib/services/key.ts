import { Key, IKey } from "@/lib/models/key";
import connectDB from "@/lib/db";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const getKeys = asyncFnService(async (): Promise<IKey[]> => {
  await connectDB();
  const keys = await Key.find().sort({ createdAt: -1 });
  return keys;
});

export const getKeyById = asyncFnService(async (id: string): Promise<IKey> => {
  await connectDB();
  const key = await Key.findById(id);
  if (!key) {
    throw new ErrorResponse("Key bulunamadı", 404);
  }
  return key;
});

export const createKey = asyncFnService(async (data: any): Promise<IKey> => {
  await connectDB();
  const key = await Key.create(data);
  if (!key) {
    throw new ErrorResponse("Key oluşturulurken bir hata oluştu", 500);
  }
  return key;
});

export const updateKey = asyncFnService(
  async (id: string, data: any): Promise<IKey> => {
    await connectDB();
    const key = await Key.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!key) {
      throw new ErrorResponse("Key bulunamadı", 404);
    }
    return key;
  }
);

export const deleteKey = asyncFnService(async (id: string): Promise<IKey> => {
  await connectDB();
  const key = await Key.findByIdAndDelete(id);
  if (!key) {
    throw new ErrorResponse("Key bulunamadı", 404);
  }
  return key;
});
