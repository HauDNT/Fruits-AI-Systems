import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

const publicPaths = ['/landing'];
const userPaths = ['/home'];
const adminPaths = ['/admin'];
const authPaths = ['/login', '/register', '/admin/login'];

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Lấy cookie và parse nếu nó là JSON
    const authCookie = request.cookies.get('eduflexhub-authentication')?.value;
    let accessToken, role;

    if (authCookie) {
        try {
            const parsedCookie = JSON.parse(authCookie);
            accessToken = parsedCookie.accessToken;
            role = parsedCookie.role;
        } catch (error) {
            console.error('Error parsing auth cookie:', error);
        }
    }

    // 1. Nếu truy cập trang cần auth mà không có token
    if (userPaths.some((path) => pathname.startsWith(path)) && !accessToken) {
        return NextResponse.redirect(new URL('/landing', request.url));
    }

    if (
        adminPaths.some((path) => pathname.startsWith(path)) &&
        !pathname.startsWith('/admin/login') &&
        !accessToken
    ) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // 2. Nếu đã đăng nhập, ngăn truy cập trang auth
    if (authPaths.some((path) => pathname.startsWith(path)) && accessToken) {
        if (role === 'Admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else if (role === 'Teacher' || role === 'Student') {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    // 3. Ngăn user/admin truy cập nhầm dashboard
    if (accessToken) {
        if (userPaths.some((path) => pathname.startsWith(path)) && role === 'Admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        if (adminPaths.some((path) => pathname.startsWith(path)) && (role === 'Teacher' || role === 'Student')) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    // 4. Cho phép tiếp tục nếu không vi phạm rule nào
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Match tất cả trừ API và static files
};