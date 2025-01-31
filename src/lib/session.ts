
import "server-only";
import * as jose from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jose.jwtVerify(session, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function encrypt(token: string) {
  const { payload } = await jose.jwtVerify(token, JWT_SECRET);
  return payload;
}

export const createToken = async (user: any): Promise<string> => {
  const payload = {
    id: user._id,
    email: user.email,
    fullname: user.fullname,
    photo: user.photo,
    role: user.role,
  };

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
};


export async function createSession(token: string) {
  // generate expiresAt from JWT_EXPIRES_IN
  const expiresAt = new Date(Date.now() + JWT_EXPIRES_IN);

  // 1. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
    