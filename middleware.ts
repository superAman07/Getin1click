import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;
    const isAuthPage = pathname.startsWith('/auth');
    const isAdminDashboard = pathname.startsWith('/admin');
    const isProfessionalRoute = pathname.startsWith('/professional');
    const isCustomerRoute = pathname.startsWith('/customer');
    const isOnboardingPage = pathname === '/professional/onboarding';

    if (token) {
        const isProfessional = token.role === 'PROFESSIONAL';
        const onboardingComplete = token.onboardingComplete as boolean;

        if (isProfessional && !onboardingComplete) {
            if (isProfessionalRoute && !isOnboardingPage) {
                return NextResponse.redirect(new URL('/professional/onboarding', req.url));
            }
        }

        if (isProfessional && onboardingComplete && isOnboardingPage) {
            return NextResponse.redirect(new URL('/professional/dashboard', req.url));
        }

        if (token.role === 'ADMIN') {
            if (!isAdminDashboard) {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
        } else if (token.role === 'CUSTOMER') {
            if (pathname === '/') {
                return NextResponse.redirect(new URL('/customer/home', req.url));
            }
            if (isAuthPage) {
                return NextResponse.redirect(new URL('/customer/home', req.url));
            }
            if (isAdminDashboard || isProfessionalRoute) {
                return NextResponse.redirect(new URL('/customer/home', req.url));
            }
        }
    }
    if (!token && (isAdminDashboard || isCustomerRoute || (isProfessionalRoute && !isOnboardingPage))) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:webp|png|svg|jpg|jpeg|gif)$).*)',],
};