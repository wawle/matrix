"use server";

import { revalidatePath } from "next/cache";
import {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
} from "@/lib/services/session";
import { ISession } from "../models/session";

export async function fetchSessions() {
  try {
    const sessions = await getSessions();
    return { data: JSON.parse(JSON.stringify(sessions)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function fetchSession(
  id: string
): Promise<{ data?: ISession; error?: any; success: boolean }> {
  try {
    const session = await getSessionById(id);
    return { data: JSON.parse(JSON.stringify(session)), success: true };
  } catch (error: any) {
    return { error: error.message, success: false };
  }
}

export async function createSessionAction(data: any) {
  try {
    const session = await createSession(data);
    revalidatePath("/sessions");
    return { data: JSON.parse(JSON.stringify(session)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateSessionAction(id: string, data: any) {
  try {
    const session = await updateSession(id, data);
    revalidatePath("/sessions");
    revalidatePath("/sessions/[id]");
    return { data: JSON.parse(JSON.stringify(session)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteSessionAction(id: string) {
  try {
    const session = await deleteSession(id);
    revalidatePath("/sessions");
    return { data: JSON.parse(JSON.stringify(session)) };
  } catch (error: any) {
    return { error: error.message };
  }
}
