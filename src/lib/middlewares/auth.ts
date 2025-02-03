import { asyncHandler } from "./async";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "./error";
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

    try {
      // Verify token
      const decoded = await decrypt(token);
      const isAuth = Boolean(decoded?.id);

      if (isAuth && isPublicPath) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (!isAuth && !isApiPath) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (!decoded) {
        throw new ErrorResponse("Not authorized to access this route", 401);
      }

      req.headers.set("user", JSON.stringify(decoded));
      return next(req);
    } catch (err) {
      throw new ErrorResponse("Not authorized to access this route", 401);
    }
  }
);

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return asyncHandler(async (req: any) => {
    const user = JSON.parse(req.headers?.get("user") || "{}");
    if (!roles.includes(user.role)) {
      throw new ErrorResponse(
        `User role ${user.role} is not authorized to access this route`,
        403
      );
    }
    return NextResponse.next({ request: req });
  });
};
