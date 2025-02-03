import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authorize, protect } from "./lib/middlewares/auth";
import { logger } from "./lib/middlewares/logger";
import { errorHandler } from "./lib/middlewares/error";

export async function middleware(request: NextRequest) {
  const chain = chainMiddleware([protect, authorize("admin", "user"), logger]);
  return chain(request);
}

const chainMiddleware = (middlewares: any[]) => {
  return async (request: NextRequest) => {
    let response = NextResponse.next();

    for (const middleware of middlewares) {
      try {
        response = (await middleware(request, response)) || response;
      } catch (error) {
        return errorHandler(error);
      }
    }

    return response;
  };
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
