import { User } from "@/lib/models/user";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";
import { LoginFormValues, RegisterFormValues } from "@/lib/schemas/auth";
import { asyncFnService } from "../middlewares/async";
import { ErrorResponse } from "../middlewares/error";

export const login = asyncFnService(async (data: LoginFormValues) => {
  try {
    await connectDB();
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new ErrorResponse("Kullanıcı bulunamadı", 404);
    }
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new ErrorResponse("Şifre yanlış", 401);
    }
    return user;
  } catch (error: any) {
    throw new ErrorResponse(error.message || "Login hatası", 401);
  }
});

export const register = asyncFnService(async (data: RegisterFormValues) => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw new ErrorResponse("Kullanıcı zaten mevcut", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({ ...data, password: hashedPassword });

    return user;
  } catch (error: any) {
    throw new ErrorResponse(error.message || "Register hatası", 400);
  }
});

export const getMe = asyncFnService(async (id: string) => {
  try {
    await connectDB();
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new ErrorResponse("Kullanıcı bulunamadı", 404);
    }
    return user;
  } catch (error: any) {
    throw new ErrorResponse(error.message || "Get me hatası", 404);
  }
});

export const logout = asyncFnService(async () => {
  try {
    await connectDB();
    return { success: true };
  } catch (error: any) {
    throw new ErrorResponse(error.message || "Logout hatası", 400);
  }
});

export const comparePassword = asyncFnService(
  async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
  }
);
