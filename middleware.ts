import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    if (token && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    //   const isProtectedRoute = !pathname.startsWith('/auth') && !pathname.startsWith('/api') && pathname !== '/favicon.ico';

    //   if (!token && isProtectedRoute) {
    //     return NextResponse.redirect(new URL('/auth/login', req.url));
    //   }

    return NextResponse.next();
}

// This config specifies which paths the middleware should run on.
// We are essentially protecting everything except for the auth page itself
// when the user is not logged in.
export const config = {
    //   matcher: [
    //     /*
    //      * Match all request paths except for the ones starting with:
    //      * - _next/static (static files)
    //      * - _next/image (image optimization files)
    //      * - favicon.ico (favicon file)
    //      * We want the middleware to run on the auth page to handle the redirect for logged-in users.
    //      */
    //     '/((?!_next/static|_next/image).*)',
    //   ],
    matcher: ['/auth/:path*'],
};