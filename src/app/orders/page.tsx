import prisma from "@/lib/prisma";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  pending: 'Chờ xử lý',
  approved: 'Đã duyệt',
  shipping: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
};

const statusClass: Record<string, string> = {
  pending: 'warning',
  approved: 'primary',
  shipping: 'info',
  completed: 'success',
  cancelled: 'danger',
};

const paymentStatusLabel: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  partially_paid: 'Thanh toán một phần',
  paid: 'Đã thanh toán',
};

const paymentStatusClass: Record<string, string> = {
  unpaid: 'danger',
  partially_paid: 'warning',
  paid: 'success',
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div>
      <div className="page-header">
        <h1>Đơn hàng</h1>
        <p>Theo dõi và quản lý toàn bộ đơn hàng của hệ thống</p>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th style={{ textAlign: 'right' }}>Tổng tiền</th>
                <th style={{ textAlign: 'center' }}>Thanh toán</th>
                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#4361ee' }}>#{order.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.receiver_name || order.user?.username || 'Khách vãng lai'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6c757d' }}>{order.receiver_phone || order.user?.phone_number || ''}</div>
                    </td>
                    <td style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                      {order.created_at.toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {Number(order.total_amount).toLocaleString('vi-VN')} đ
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge-status ${paymentStatusClass[order.payment_status]}`}>
                        {paymentStatusLabel[order.payment_status]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge-status ${statusClass[order.status]}`}>
                        {statusLabel[order.status]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link href={`/orders/${order.id}`} className="btn-ghost">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
