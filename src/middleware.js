import { NextResponse } from 'next/server';
import { getSession, withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

/**
 * Middleware to protect routes with Auth0 authentication and ADMIN role validation
 */
export default withMiddlewareAuthRequired(async function middleware(request) {
  try {
    // Get the user session
    const res = NextResponse.next();
    const session = await getSession(request, res);

    if (!session?.user) {
      // No user session, redirect to login
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }

    // Check if user has ADMIN role and ACTIVE status
    const userRoles = session.user['https://pdxartwalks.com/roles'] || session.user['https://cityartwalks.com/roles'] || session.user.roles || [];
    const userStatus = session.user['https://pdxartwalks.com/status'] || session.user['https://cityartwalks.com/status'] || session.user.status;
    
    const isAdmin = userRoles.includes('ADMIN'); // Only exact match "ADMIN"
    const isActive = userStatus === 'ACTIVE'; // Only exact match "ACTIVE"
    
    if (!isAdmin) {
      console.log('❌ Access denied - user does not have ADMIN role');
      return NextResponse.redirect(new URL('/api/auth/logout?returnTo=' + encodeURIComponent(request.url), request.url));
    }
    
    if (!isActive) {
      console.log('❌ Access denied - user status is not ACTIVE');
      return NextResponse.redirect(new URL('/api/auth/logout?returnTo=' + encodeURIComponent(request.url), request.url));
    }

    // User is authenticated and has ADMIN role, continue
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }
});

// Configure which routes the middleware runs on
export const config = {
  // Match all routes except API, static files, and public assets
  matcher: [
    /*
     * Match all request paths except:
     * - /api routes (API routes)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     * - Files with extensions (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};