"use server";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/lib/schemas/auth";
import { login, register } from "@/lib/services/auth";
import { createToken, createSession, deleteSession } from "@/lib/session";
import { IUser } from "@/lib/models/user";

export async function loginAction(data: LoginFormValues): Promise<{
  success: boolean;
  token?: string;
  user?: IUser;
  error?: string;
}> {
  try {
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: result.error.message };
    }

    const user = await login(data);

    if (!user) {
      return { success: false, error: "Kullanıcı bulunamadı" };
    }

    const token = await createToken(user);

    if (!token) {
      return { success: false, error: "Token oluşturulamadı" };
    }

    await createSession(token);

    return { success: true, token, user };
  } catch (error) {
    console.log(error);

    return { success: false, error: "Login failed" };
  }
}

export async function registerAction(data: RegisterFormValues): Promise<{
  success: boolean;
  user?: IUser;
  token?: string;
  error?: string;
}> {
  try {
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: result.error.message };
    }

    const user = await register(data);

    if (!user) {
      return { success: false, error: "Kullanıcı oluşturulamadı" };
    }

    const token = await createToken(user);

    if (!token) {
      return { success: false, error: "Token oluşturulamadı" };
    }

    await createSession(token);

    return { success: true, token, user };
  } catch (error) {
    return { success: false, error: "Register failed" };
  }
}

export async function logoutAction() {
  await deleteSession();
  return { success: true };
}
