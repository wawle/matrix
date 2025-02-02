export const authService = {
  template: (name: string, props: any) => {
    return `
import { User } from "@/lib/models/user";
import connectDB from "@/lib/db";
import bcrypt from 'bcryptjs';
import { LoginFormValues, RegisterFormValues } from "@/lib/schemas/auth";

export async function login(data: LoginFormValues) {
  try {
    await connectDB();
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }
    const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Şifre yanlış");
    }
    return user;
  } catch (error: any) {
    throw new Error(error.message || "Login hatası");
  }
}


export async function register(data: RegisterFormValues) {
  try {
    await connectDB();

   const existingUser = await User.findOne({ email: data.email });

   if (existingUser) {
    throw new Error("Kullanıcı zaten mevcut");
   }

   const hashedPassword = await bcrypt.hash(data.password, 10);

   const user = await User.create({ ...data, password: hashedPassword });

    return user;
  } catch (error: any) {
    throw new Error(error.message || "Register hatası");
  }
}

export async function getMe(id: string) {
  try {
    await connectDB();
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }
    return user;
  } catch (error: any) {
    throw new Error(error.message || "Get me hatası");
  }
}

export async function logout() {
  try {
    await connectDB();
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Logout hatası");
  }
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}
    `;
  },
};
