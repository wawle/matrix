
"use server";
  
import { revalidatePath } from "next/cache";
  import { 
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  } from "@/lib/services/user";
  
  export async function fetchUsers() {
    try {
      const users = await getUsers();
      return { data: JSON.parse(JSON.stringify(users)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function fetchUser(id: string) {
    try {
      const user = await getUserById(id);
      return { data: JSON.parse(JSON.stringify(user)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function createUserAction(data: any) {
    try {
      const user = await createUser(data);
      revalidatePath("/users");
      return { data: JSON.parse(JSON.stringify(user)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function updateUserAction(id: string, data: any) {
    try {
      const user = await updateUser(id, data);
      revalidatePath("/users");
      revalidatePath("/users/[id]");
      return { data: JSON.parse(JSON.stringify(user)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  
  export async function deleteUserAction(id: string) {
    try {
      const user = await deleteUser(id);
      revalidatePath("/users");
      return { data: JSON.parse(JSON.stringify(user)) };
    } catch (error: any) {
      return { error: error.message };
    }
  }