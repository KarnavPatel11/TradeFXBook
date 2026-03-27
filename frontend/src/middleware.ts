import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes require authentication
const protectedRoutes = ['/app', '/dashboard', '/settings', '/journal', '/analytics', '/community'];
// Auth routes shouldn't be accessible if already logged in
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  // In Next.js middleware, we can't easily check our custom backend's httpOnly refresh token or the localStorage.
  // We can only check cookies available to the frontend.
  // The best way to handle auth in Next.js + external Express is to rely on client-side protection or NextAuth.
  // Since we use Zustand and full custom JWT, middleware will just do basic checks based on generic cookie presence if we had one.
  
  // For this architecture (localStorage token + httpOnly refresh), 
  // we will do the heavy auth guarding client-side via a higher order component or layout hook inside /app/layout.tsx
  // This middleware is kept minimal to avoid false positives.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
