import { User } from "@/lib/models/user";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginFormValues, RegisterFormValues } from "@/lib/schemas/auth";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const login = asyncFnService(async (data: LoginFormValues) => {
  await connectDB();
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    throw new ErrorResponse("Kullanıcı bulunamadı", 404);
  }

  const isPasswordCorrect = await bcrypt.compare(data.password, user.password);

  if (!isPasswordCorrect) {
    throw new ErrorResponse("Şifre yanlış", 401);
  }

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
});

export const register = asyncFnService(async (data: RegisterFormValues) => {
  await connectDB();

  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new ErrorResponse("Kullanıcı zaten mevcut", 400);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashedPassword });

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
});

export const getMe = asyncFnService(async (id: string) => {
  await connectDB();
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ErrorResponse("Kullanıcı bulunamadı", 404);
  }

  return user;
});

export const logout = asyncFnService(async () => {
  await connectDB();
  return { success: true };
});

export const comparePassword = asyncFnService(
  async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
  }
);
