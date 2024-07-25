import { NextResponse } from 'next/server';

export function middleware(request) {
    console.log("Hi How are you ??");

    const authToken = request.cookies.get("authToken")?.value;
    const isLoginOrSignup = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup";

    if (authToken && isLoginOrSignup) { 
        return NextResponse.redirect(new URL('/Dashboard', request.url));
    } else if (!authToken && !isLoginOrSignup) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next(); // Continue without redirect if none of the conditions match
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/signup",
        "/addtask",
        "/showtask",
        "/api/:path*",
        "/Dashboard/:path*",
    ],
};
