import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/orders - Lấy danh sách đơn hàng
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, orderItems: { include: { product: true } } },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// POST /api/orders - Tạo đơn hàng mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      retailer_id,
      shipping_address,
      receiver_name,
      receiver_phone,
      shipping_fee,
      payment_method,
      items, // [{ product_id, quantity, unit_price }]
    } = body;

    if (!shipping_address || !payment_method || !items || items.length === 0) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Tính tổng tiền hàng
    const subtotal = items.reduce(
      (sum: number, item: { quantity: number; unit_price: number }) =>
        sum + item.quantity * item.unit_price,
      0
    );
    const fee = Number(shipping_fee) || 0;
    const total_amount = subtotal + fee;

    // Tạo đơn hàng và các order_items trong một transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          retailer_id: retailer_id ? Number(retailer_id) : null,
          shipping_address,
          receiver_name: receiver_name || null,
          receiver_phone: receiver_phone || null,
          shipping_fee: fee,
          total_amount,
          payment_method,
          payment_status: 'unpaid',
          status: 'pending',
          orderItems: {
            create: items.map((item: { product_id: number; quantity: number; unit_price: number }) => ({
              product_id: Number(item.product_id),
              quantity: Number(item.quantity),
              unit_price: Number(item.unit_price),
            })),
          },
        },
        include: { orderItems: true },
      });

      // Trừ tồn kho cho từng sản phẩm
      for (const item of items) {
        await tx.product.update({
          where: { id: Number(item.product_id) },
          data: { stock_quantity: { decrement: Number(item.quantity) } },
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 });
  }
}
