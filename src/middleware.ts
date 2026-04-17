import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// JWT token decode helper — returns payload if valid, null otherwise
function decodeToken(token: string): { exp?: number; role?: string; username?: string } | null {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get('access_token')?.value;
  const payload = token ? decodeToken(token) : null;

  // Protected pages that require authentication
  const protectedPages = [
    '/dashboard',
    '/profile',
    '/my-bookings',
    '/admin-dashboard',
    '/list-your-boat',
    '/payment'
  ];

  // Pages that require admin role
  const adminPages = ['/admin-dashboard', '/list-your-boat'];

  // Check if current page is protected
  const isProtectedPage = protectedPages.some(page => pathname.startsWith(page));
  const isAdminPage = adminPages.some(page => pathname.startsWith(page));

  // If trying to access a protected page without valid token, redirect to login
  if (isProtectedPage) {
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If trying to access admin page without admin role, redirect to home
    if (isAdminPage && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If user is authenticated and trying to access login/signup, redirect to home
  if (payload && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};