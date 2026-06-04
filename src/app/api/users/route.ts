import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/users - Lấy danh sách người dùng
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone_number: true,
        company_name: true,
        role: true,
        status: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// POST /api/users - Tạo người dùng mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, email, phone_number, company_name, tax_code, role } = body;

    if (!username || !password || !email) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        username,
        password,
        email,
        phone_number: phone_number || null,
        company_name: company_name || null,
        tax_code: tax_code || null,
        role: role || 'retailer',
        status: 'active',
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server hoặc tài khoản đã tồn tại' }, { status: 500 });
  }
}
