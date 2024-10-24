import { auth } from "@/libs/auth";

import { NextRequest, NextResponse } from "next/server";
import { pathToRegexp } from "path-to-regexp";

import createMiddleware from 'next-intl/middleware';
import { cookies } from "next/headers";
import { locales, defaultLocale } from "./i18n";

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: "as-needed"
});

const localePath = `(${locales.join("|")})`

const checkPathname = (pathnames: string[], pathname: string): boolean => {
    return pathnames.some(path => pathToRegexp(path).test(pathname))
}

export default async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const session = await auth()
    const currentLocale = cookies().get('NEXT_LOCALE')?.value || defaultLocale

    const shouldSkipMiddleware = checkPathname([
        `/${localePath}/images/:path*`,
        '/images/:path*',
        '/api/:path*',
        '/_next/:path*',
        '/manifest.webmanifest',
        '/favicon.ico'
    ], pathname)

    if (shouldSkipMiddleware) {
        return;
    }

    const isProtectedWithoutSession = checkPathname([
        '/',
        `/${localePath}`,
        '/profile',
        `/${localePath}/profile`,
    ], pathname) && !session

    const isProtectedWithSession = checkPathname([
        '/login',
        `/${localePath}/login`,
        '/register',
        `/${localePath}/register`,
    ], pathname) && session

    const isInternationalizedPathname = checkPathname([
        '/:path*',
        `/${localePath}/:path*`
    ], pathname)

    if (isProtectedWithSession) {
        return NextResponse.redirect(new URL(`/${currentLocale}`, req.url))
    }

    if (isProtectedWithoutSession) {
        return NextResponse.redirect(new URL(`/${currentLocale}/login`, req.url))
    }

    if (isInternationalizedPathname) {
        return intlMiddleware(req)
    }
}