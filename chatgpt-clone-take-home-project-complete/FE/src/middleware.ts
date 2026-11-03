import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user is on the root path
  if (request.nextUrl.pathname === "/") {
    // Redirect to /chat
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // Continue with the request for all other paths
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: "/",
};
