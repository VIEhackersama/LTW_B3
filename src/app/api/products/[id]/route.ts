import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id]
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    if (!product) return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// PATCH /api/products/[id]
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        wholesale_price: body.wholesale_price !== undefined ? Number(body.wholesale_price) : undefined,
        min_order_qty: body.min_order_qty !== undefined ? Number(body.min_order_qty) : undefined,
        stock_quantity: body.stock_quantity !== undefined ? Number(body.stock_quantity) : undefined,
        status: body.status,
        category_id: body.category_id !== undefined ? (body.category_id ? Number(body.category_id) : null) : undefined,
        manufacturer_name: body.manufacturer_name !== undefined ? body.manufacturer_name : undefined,
        origin_country: body.origin_country !== undefined ? body.origin_country : undefined,
        image_url: body.image_url !== undefined ? body.image_url : undefined,
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi xóa sản phẩm' }, { status: 500 });
  }
}
