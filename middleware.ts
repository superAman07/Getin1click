import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    const isAdmin = token?.role === 'ADMIN';
    const isAuthPage = pathname.startsWith('/auth');
    const isAdminDashboard = pathname.startsWith('/admin');

    if (isAdmin) {
        if (!isAdminDashboard) {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
    } 
    
    else if (token && !isAdmin) {
        if (isAuthPage) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        if (isAdminDashboard) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
    else if (!token) {
        if (isAdminDashboard) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
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