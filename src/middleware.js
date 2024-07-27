import { NextResponse } from 'next/server';

export function middleware(request) {
    // console.log("Hi How are you ??");

    const authToken = request.cookies.get("authToken")?.value;
    const { pathname } = request.nextUrl;

    const isLoginOrSignup = pathname === "/login" || pathname === "/signup";
    const isTaskPage = pathname === "/addtask" || pathname === "/showtask" || pathname === "/Dashboard";

    if (authToken) {
        // Redirect logged-in users away from login and signup pages
        if (isLoginOrSignup) {
            return NextResponse.redirect(new URL('/Dashboard', request.url));
        }
    } else {
        // Redirect non-logged-in users from task pages to login
        if (isTaskPage) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next(); // Continue to the requested page if no redirect conditions are met
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
