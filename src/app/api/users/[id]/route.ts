import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/users/[id]
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        email: true,
        phone_number: true,
        company_name: true,
        tax_code: true,
        role: true,
        status: true,
        created_at: true,
      },
    });
    if (!user) return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// PATCH /api/users/[id]
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.email !== undefined)        data.email        = body.email;
    if (body.phone_number !== undefined)  data.phone_number  = body.phone_number || null;
    if (body.company_name !== undefined)  data.company_name  = body.company_name || null;
    if (body.tax_code !== undefined)      data.tax_code      = body.tax_code || null;
    if (body.role !== undefined)          data.role          = body.role;
    if (body.status !== undefined)        data.status        = body.status;
    if (body.password)                    data.password      = body.password;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true, username: true, email: true, phone_number: true,
        company_name: true, tax_code: true, role: true, status: true, created_at: true,
      },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 });
  }
}

// DELETE /api/users/[id]
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi xóa người dùng' }, { status: 500 });
  }
}
