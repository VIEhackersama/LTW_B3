'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type OrderStatus = 'pending' | 'approved' | 'shipping' | 'completed' | 'cancelled';
type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';

interface OrderItem {
  id: number;
  quantity: number;
  unit_price: string | number;
  product: { id: number; name: string; sku: string } | null;
}

interface Order {
  id: number;
  retailer_id: number | null;
  shipping_address: string;
  receiver_name: string | null;
  receiver_phone: string | null;
  shipping_fee: string | number;
  total_amount: string | number;
  payment_method: string;
  payment_status: PaymentStatus;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  user: { id: number; username: string; email: string; company_name: string | null } | null;
  orderItems: OrderItem[];
}

const statusLabel: Record<string, string> = {
  pending: 'Chờ xử lý', approved: 'Đã duyệt',
  shipping: 'Đang giao', completed: 'Hoàn tất', cancelled: 'Đã hủy',
};
const statusClass: Record<string, string> = {
  pending: 'warning', approved: 'primary',
  shipping: 'info', completed: 'success', cancelled: 'danger',
};
const paymentLabel: Record<string, string> = {
  unpaid: 'Chưa thanh toán', partially_paid: 'Một phần', paid: 'Đã thanh toán',
};
const paymentClass: Record<string, string> = {
  unpaid: 'danger', partially_paid: 'warning', paid: 'success',
};
const paymentMethodLabel: Record<string, string> = {
  cod: 'Thu tiền khi giao (COD)',
  bank_transfer: 'Chuyển khoản ngân hàng',
  credit_debt: 'Ghi nợ',
};

const ORDER_STATUSES: OrderStatus[] = ['pending', 'approved', 'shipping', 'completed', 'cancelled'];
const PAYMENT_STATUSES: PaymentStatus[] = ['unpaid', 'partially_paid', 'paid'];

export default function OrderDetailContent({ order: initialOrder }: { order: Order }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateStatus = async (field: 'status' | 'payment_status', value: string) => {
    setUpdating(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error('Lỗi cập nhật trạng thái');
      const updated = await res.json();
      setOrder((prev) => ({ ...prev, ...updated }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa đơn hàng #${order.id} không?\nHành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Lỗi xóa đơn hàng');
      router.push('/orders');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setDeleting(false);
    }
  };

  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity, 0
  );

  return (
    <div className="row g-4">
      {/* CỘT TRÁI: Chi tiết đơn hàng */}
      <div className="col-lg-8">
        {/* Thông tin giao hàng */}
        <div className="content-card mb-4">
          <div className="content-card-header">
            <h5>Thông tin giao hàng</h5>
          </div>
          <div className="p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Người nhận</div>
                <div style={{ fontWeight: 600 }}>{order.receiver_name || '(Không có)'}</div>
              </div>
              <div className="col-md-6">
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Số điện thoại</div>
                <div style={{ fontWeight: 600 }}>{order.receiver_phone || '(Không có)'}</div>
              </div>
              <div className="col-12">
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Địa chỉ giao hàng</div>
                <div style={{ fontWeight: 500 }}>{order.shipping_address}</div>
              </div>
              {order.user && (
                <div className="col-12">
                  <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Tài khoản khách hàng</div>
                  <div style={{ fontWeight: 500 }}>
                    {order.user.username}
                    {order.user.company_name && <span style={{ color: '#6c757d' }}> ({order.user.company_name})</span>}
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Phương thức thanh toán</div>
                <div style={{ fontWeight: 500 }}>{paymentMethodLabel[order.payment_method] || order.payment_method}</div>
              </div>
              <div className="col-md-6">
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginBottom: '4px' }}>Ngày đặt hàng</div>
                <div style={{ fontWeight: 500 }}>
                  {new Date(order.created_at).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="content-card">
          <div className="content-card-header">
            <h5>Danh sách sản phẩm</h5>
            <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>{order.orderItems.length} sản phẩm</span>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th style={{ textAlign: 'center' }}>Số lượng</th>
                  <th style={{ textAlign: 'right' }}>Đơn giá</th>
                  <th style={{ textAlign: 'right' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#adb5bd' }}>
                      Không có sản phẩm nào trong đơn hàng.
                    </td>
                  </tr>
                ) : (
                  order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.product?.name || '(Sản phẩm đã xóa)'}</div>
                        {item.product?.sku && (
                          <div style={{ fontSize: '0.75rem', color: '#6c757d', fontFamily: 'monospace' }}>
                            {item.product.sku}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge-status primary">{item.quantity}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {Number(item.unit_price).toLocaleString('vi-VN')} đ
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {(Number(item.unit_price) * item.quantity).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', padding: '14px 22px', color: '#6c757d', fontSize: '0.875rem' }}>
                    Tiền hàng
                  </td>
                  <td style={{ textAlign: 'right', padding: '14px 22px', fontWeight: 600 }}>
                    {subtotal.toLocaleString('vi-VN')} đ
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', padding: '4px 22px', color: '#6c757d', fontSize: '0.875rem' }}>
                    Phí vận chuyển
                  </td>
                  <td style={{ textAlign: 'right', padding: '4px 22px', fontWeight: 600 }}>
                    {Number(order.shipping_fee).toLocaleString('vi-VN')} đ
                  </td>
                </tr>
                <tr style={{ borderTop: '2px solid #f0f2f5' }}>
                  <td colSpan={3} style={{ textAlign: 'right', padding: '14px 22px', fontWeight: 700 }}>
                    Tổng cộng
                  </td>
                  <td style={{ textAlign: 'right', padding: '14px 22px', fontWeight: 800, fontSize: '1.1rem', color: '#4361ee' }}>
                    {Number(order.total_amount).toLocaleString('vi-VN')} đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Trạng thái và thao tác */}
      <div className="col-lg-4">
        <div className="content-card" style={{ position: 'sticky', top: '24px' }}>
          <div className="content-card-header">
            <h5>Trạng thái đơn hàng</h5>
          </div>
          <div className="p-4">
            {error && (
              <div style={{
                background: '#fce4ec', color: '#c62828', borderRadius: '8px',
                padding: '10px 14px', fontSize: '0.85rem', marginBottom: '14px',
              }}>
                {error}
              </div>
            )}

            {/* Trạng thái xử lý */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label-custom">Trạng thái đơn hàng</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleUpdateStatus('status', s)}
                    disabled={updating || order.status === s}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      border: order.status === s ? 'none' : '1.5px solid #e4e7ec',
                      background: order.status === s ? '#4361ee' : 'transparent',
                      color: order.status === s ? '#fff' : '#374151',
                      fontWeight: order.status === s ? 600 : 400,
                      cursor: order.status === s ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s',
                      opacity: updating && order.status !== s ? 0.5 : 1,
                    }}
                  >
                    <span>{statusLabel[s]}</span>
                    {order.status === s && (
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Hiện tại</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Trạng thái thanh toán */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label-custom">Trạng thái thanh toán</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PAYMENT_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleUpdateStatus('payment_status', s)}
                    disabled={updating || order.payment_status === s}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      border: order.payment_status === s ? 'none' : '1.5px solid #e4e7ec',
                      background: order.payment_status === s ? '#2e7d32' : 'transparent',
                      color: order.payment_status === s ? '#fff' : '#374151',
                      fontWeight: order.payment_status === s ? 600 : 400,
                      cursor: order.payment_status === s ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s',
                      opacity: updating && order.payment_status !== s ? 0.5 : 1,
                    }}
                  >
                    <span>{paymentLabel[s]}</span>
                    {order.payment_status === s && (
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Hiện tại</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: '#f0f2f5', margin: '4px 0 14px' }} />

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: 'transparent', border: '1.5px solid #c62828', borderRadius: '8px',
                padding: '9px 18px', fontSize: '0.85rem', fontWeight: 600, color: '#c62828',
                cursor: deleting ? 'not-allowed' : 'pointer', width: '100%', transition: 'all 0.18s',
                opacity: deleting ? 0.6 : 1,
              }}
            >
              {deleting ? 'Đang xóa...' : 'Xóa đơn hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
