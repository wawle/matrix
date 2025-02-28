import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { encrypt } from "@/lib/session";

export interface IAuthSession {
  id: string;
  fullname: string;
  email: string;
  photo: string;
  role: string;
}

export const authSession = cache(async (): Promise<IAuthSession> => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return {
      id: "",
      fullname: "",
      email: "",
      photo: "",
      role: "",
    };
  }

  const user = await encrypt(token);
  if (!user) {
    return {
      id: "",
      fullname: "",
      email: "",
      photo: "",
      role: "",
    };
  }

  return {
    id: (user?.id as string) || "",
    fullname: (user?.fullname as string) || "",
    email: (user?.email as string) || "",
    photo: (user?.photo as string) || "",
    role: (user?.role as string) || "",
  };
});
