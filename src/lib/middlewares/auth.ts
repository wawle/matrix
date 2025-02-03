import { asyncHandler } from "./async";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "./error";
import { decrypt } from "../session";

const PUBLIC_PATHS = ["/login", "/register", "/api/login", "/api/register"];

// Protect routes
export const protect = asyncHandler(
  async (req: NextRequest, res: NextResponse, next: any) => {
    const { pathname } = req.nextUrl;
    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    const isApiPath = pathname.startsWith("/api/");

    if (isPublicPath) {
      return NextResponse.next();
    }

    let token;

    if (
      req.headers.get("Authorization") &&
      req.headers.get("Authorization")?.startsWith("Bearer")
    ) {
      // Set token from Bearer token in header
      token = req.headers.get("Authorization")?.split(" ")[1];
      // Set token from cookie
    } else if (req.cookies.get("token")?.value) {
      token = req.cookies.get("token")?.value;
    }

    // Make sure token exists
    if (!token && !isPublicPath) {
      return errorHandler({
        message: "Not authorized to access this route",
        statusCode: 401,
      });
    }

    try {
      // Verify token
      const decoded = await decrypt(token);
      const isAuth = Boolean(decoded?.id);

      if (!isAuth && !isApiPath) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (!decoded) {
        return errorHandler({
          message: "Not authorized to access this route",
          statusCode: 401,
        });
      }

      if (isAuth && isPublicPath) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      req.headers.set("user", JSON.stringify(decoded));
    } catch (err) {
      return errorHandler({
        message: "Not authorized to access this route",
        statusCode: 401,
      });
    }
  }
);

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: any, res: NextResponse, next: any) => {
    const user = JSON.parse(req.headers?.get("user") || "{}");
    if (!roles.includes(user.role)) {
      return errorHandler({
        message: `User role ${user.role} is not authorized to access this route`,
        statusCode: 403,
      });
    }
  };
};
