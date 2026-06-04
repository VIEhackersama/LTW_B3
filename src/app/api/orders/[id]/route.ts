import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/orders/[id]
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
    });
    if (!order) return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// PATCH /api/orders/[id] - Cập nhật trạng thái đơn hàng
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        status: body.status,
        payment_status: body.payment_status,
      },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 });
  }
}

// DELETE /api/orders/[id]
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.order.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi xóa đơn hàng' }, { status: 500 });
  }
}
