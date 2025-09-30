import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // const isAdmin = token?.role === 'ADMIN';
    // const isAuthPage = pathname.startsWith('/auth');
    // const isAdminDashboard = pathname.startsWith('/admin');
    const isAuthPage = pathname.startsWith('/auth');
    const isAdminDashboard = pathname.startsWith('/admin');
    const isProfessionalRoute = pathname.startsWith('/professional');
    const isOnboardingPage = pathname === '/professional/onboarding';

    if (token) {
        const isProfessional = token.role === 'PROFESSIONAL';
        const onboardingComplete = token.onboardingComplete as boolean;

        // If a professional has NOT completed onboarding
        if (isProfessional && !onboardingComplete) {
            // And they are trying to access any professional page EXCEPT the onboarding page
            if (isProfessionalRoute && !isOnboardingPage) {
                // Force them back to the onboarding wizard
                return NextResponse.redirect(new URL('/professional/onboarding', req.url));
            }
        }

        // If a professional HAS completed onboarding and tries to visit the wizard again
        if (isProfessional && onboardingComplete && isOnboardingPage) {
            // Send them to their dashboard
            return NextResponse.redirect(new URL('/professional/dashboard', req.url));
        }

        // Existing admin and customer logic...
        if (token.role === 'ADMIN') {
            if (!isAdminDashboard) {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
        } else if (token.role === 'CUSTOMER') {
            if (isAuthPage) {
                return NextResponse.redirect(new URL('/', req.url));
            }
            if (isAdminDashboard) {
                return NextResponse.redirect(new URL('/', req.url));
            }
        }
    }

    // if (isAdmin) {
    //     if (!isAdminDashboard) {
    //         return NextResponse.redirect(new URL('/admin', req.url));
    //     }
    // }

    // else if (token && !isAdmin) {
    //     if (isAuthPage) {
    //         return NextResponse.redirect(new URL('/', req.url));
    //     }
    //     if (isAdminDashboard) {
    //         return NextResponse.redirect(new URL('/', req.url));
    //     }
    // }
    if (!token && (isAdminDashboard || isProfessionalRoute)) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    // matcher: [
    //     /*
    //      * Match all request paths except for the ones starting with:
    //      * - api (API routes)
    //      * - _next/static (static files)
    //      * - _next/image (image optimization files)
    //      * - favicon.ico (favicon file)
    //      */
    //     '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // ],
    matcher: ['/admin/:path*', '/professional/:path*', '/auth/:path*'],
};