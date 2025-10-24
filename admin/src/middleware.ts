import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the auth token from cookies
  const token = request.cookies.get("auth-storage")?.value;

  // Parse the token to check if user is authenticated
  let isAuthenticated = false;
  if (token) {
    try {
      const authData = JSON.parse(token);
      isAuthenticated = authData?.state?.isAuthenticated === true;
    } catch (error) {
      // Invalid token, treat as unauthenticated
      isAuthenticated = false;
    }
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // For the root path, let the client-side handle the redirect
  // This prevents hydration issues
  if (pathname === "/") {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
