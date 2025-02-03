import { User, IUser } from "@/lib/models/user";
import connectDB from "@/lib/db";

export async function getUsers(): Promise<IUser[]> {
  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    return users;
  } catch (error: any) {
    throw new Error(error.message || "User listesi alınırken bir hata oluştu");
  }
}

export async function getUserById(id: string): Promise<IUser> {
  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User bulunamadı");
    }
    return user;
  } catch (error: any) {
    throw new Error(error.message || "User alınırken bir hata oluştu");
  }
}

export async function createUser(data: any): Promise<IUser> {
  try {
    await connectDB();
    const user = await User.create(data);
    return user;
  } catch (error: any) {
    throw new Error(error.message || "User oluşturulurken bir hata oluştu");
  }
}

export async function updateUser(id: string, data: any): Promise<IUser> {
  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new Error("User bulunamadı");
    }
    return user;
  } catch (error: any) {
    throw new Error(error.message || "User güncellenirken bir hata oluştu");
  }
}

export async function deleteUser(id: string): Promise<IUser> {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error("User bulunamadı");
    }
    return user;
  } catch (error: any) {
    throw new Error(error.message || "User silinirken bir hata oluştu");
  }
}
