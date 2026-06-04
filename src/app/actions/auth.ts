'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) return { error: 'Vui lòng nhập đủ thông tin' };

  try {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      cache: 'no-store'
    });

    if (!res.ok) {
      return { error: 'Tài khoản hoặc mật khẩu không đúng' };
    }

    const data = await res.json();
    
    (await cookies()).set('jwt_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    // Check role and status
    if (data.status === 'pending' || data.role !== 'admin') {
      return { redirectUrl: '/waiting-approval' };
    }
    return { redirectUrl: '/' };

  } catch (err: any) {
    return { error: 'Lỗi kết nối đến server' };
  }
}

export async function logoutAction() {
  (await cookies()).delete('jwt_token');
  redirect('/login');
}
