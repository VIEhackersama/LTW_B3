import prisma from '@/lib/prisma';
import Link from 'next/link';
import OrderDetailContent from './OrderDetailContent';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
      orderItems: { include: { product: true } },
    },
  });

  if (!order) {
    return (
      <div>
        <div className="page-header">
          <h1>Không tìm thấy đơn hàng</h1>
          <p>Đơn hàng #{id} không tồn tại trong hệ thống.</p>
        </div>
        <Link href="/orders" className="btn-primary-custom">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Chuyển đổi Decimal sang string để truyền vào client component
  const serializedOrder = {
    ...order,
    shipping_fee: order.shipping_fee.toString(),
    total_amount: order.total_amount.toString(),
    created_at: order.created_at.toISOString(),
    updated_at: order.updated_at.toISOString(),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      unit_price: item.unit_price.toString(),
    })),
  };

  return (
    <div>
      <div className="page-header d-flex align-items-start justify-content-between">
        <div>
          <h1>Chi tiết đơn hàng #{order.id}</h1>
          <p>
            Ngày tạo: {order.created_at.toLocaleDateString('vi-VN')}
            {' — '}
            Cập nhật lần cuối: {order.updated_at.toLocaleDateString('vi-VN')}
          </p>
        </div>
        <Link href="/orders" className="btn-ghost">
          Quay lại danh sách
        </Link>
      </div>
      <OrderDetailContent order={serializedOrder} />
    </div>
  );
}
