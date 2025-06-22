import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/landing'];
const privatePaths = ['/admin'];
const authPaths = ['/admin/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy token từ cookie JWT
  const accessToken = request.cookies.get('fruitsflow-authentication')?.value;

  // 1. Nếu truy cập trang cần auth mà không có token
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !pathname.startsWith('/admin/login') &&
    !accessToken
  ) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. Nếu đã đăng nhập, ngăn truy cập trang auth
  if (authPaths.some((path) => pathname.startsWith(path)) && accessToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
