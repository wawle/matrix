"use server";

import { revalidatePath } from "next/cache";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/services/user";
import { IUser } from "../models/user";

export async function fetchUsers(): Promise<{
  data: IUser[];
  error?: any;
  success: boolean;
}> {
  try {
    const users = await getUsers();
    return { data: JSON.parse(JSON.stringify(users)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false, data: [] };
  }
}

export async function fetchUser(id: string): Promise<{
  data?: IUser;
  error?: any;
  success: boolean;
}> {
  try {
    const user = await getUserById(id);
    return { data: JSON.parse(JSON.stringify(user)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false, data: undefined };
  }
}

export async function createUserAction(data: any): Promise<{
  data?: IUser;
  error?: any;
  success: boolean;
}> {
  try {
    const user = await createUser(data);
    revalidatePath("/users");
    return { data: JSON.parse(JSON.stringify(user)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false, data: undefined };
  }
}

export async function updateUserAction(
  id: string,
  data: any
): Promise<{
  data?: IUser;
  error?: any;
  success: boolean;
}> {
  try {
    const user = await updateUser(id, data);
    revalidatePath("/users");
    revalidatePath("/users/[id]");
    return { data: JSON.parse(JSON.stringify(user)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false, data: undefined };
  }
}

export async function deleteUserAction(id: string): Promise<{
  data?: IUser;
  error?: any;
  success: boolean;
}> {
  try {
    const user = await deleteUser(id);
    revalidatePath("/users");
    return { data: JSON.parse(JSON.stringify(user)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false, data: undefined };
  }
}
