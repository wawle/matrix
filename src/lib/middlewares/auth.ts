import { asyncHandler } from "./async";
import { NextRequest, NextResponse } from "next/server";
import { ErrorResponse } from "./error";
import { decrypt } from "../session";


// Protect routes
export const protect = asyncHandler(async (req: NextRequest, res: NextResponse, next: any) => {
  let token;

  if (
    req.headers.get("Authorization") &&
    req.headers.get("Authorization")?.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.get("Authorization")?.split(' ')[1];
    // Set token from cookie
  }
  else if (req.cookies.get("token")?.value) {
    token = req.cookies.get("token")?.value;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = await decrypt(token);

    if (!decoded) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    (req as any).user = decoded;

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: any, res: NextResponse, next: any) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};