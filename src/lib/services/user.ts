import { User, IUser } from "@/lib/models/user";
import connectDB from "@/lib/db";
import { ErrorResponse } from "../middlewares/error";
import { asyncFnService } from "../middlewares/async";

export const getUsers = asyncFnService(async (): Promise<IUser[]> => {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });
  return users;
});

export const getUserById = asyncFnService(
  async (id: string): Promise<IUser> => {
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      throw new ErrorResponse("User bulunamadı", 404);
    }
    return user;
  }
);

export const createUser = asyncFnService(async (data: any): Promise<IUser> => {
  await connectDB();
  const user = await User.create(data);
  if (!user) {
    throw new ErrorResponse("User oluşturulurken bir hata oluştu", 400);
  }

  return user;
});

export const updateUser = asyncFnService(
  async (id: string, data: any): Promise<IUser> => {
    await connectDB();
    const user: IUser | null = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new ErrorResponse("User bulunamadı", 404);
    }
    return user;
  }
);

export const deleteUser = asyncFnService(async (id: string): Promise<IUser> => {
  await connectDB();
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ErrorResponse("User bulunamadı", 404);
  }
  return user;
});
