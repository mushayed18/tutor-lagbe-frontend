import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Auth Routes (Publicly accessible for unauthenticated users)
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. If user is on an Auth Route
  if (authRoutes.some(route => pathname.startsWith(route))) {
    // If they HAVE a token, redirect away from Login/Register to home
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If NO token, let them see the Auth page
    return NextResponse.next();
  }

  // 3. For ALL other routes (Private by default)
  if (!token) {
    // Redirect to login if trying to access protected content
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// The config remains the same to exclude static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};