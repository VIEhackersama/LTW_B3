import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt_token')?.value;
  const path = request.nextUrl.pathname;

  // Cẩn thận với các file tĩnh, ảnh...
  if (
    path === '/login' || 
    path === '/register' || 
    path.startsWith('/api/auth') || 
    path.startsWith('/_next') || 
    path === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);

    if (path === '/waiting-approval') {
       if (payload.status === 'active' && payload.role === 'admin') {
           return NextResponse.redirect(new URL('/', request.url));
       }
       return NextResponse.next();
    }

    if (payload.status === 'pending' || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/waiting-approval', request.url));
    }

  } catch (err) {
    // Token lỗi hoặc hết hạn
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('jwt_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
