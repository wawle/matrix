import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { encrypt } from "@/lib/session";

export const authSession = cache(
  async (): Promise<{
    id: string;
    fullname: string;
    email: string;
    photo: string;
    role: string;
  }> => {
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
    console.log(user);
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
  }
);
