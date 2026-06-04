'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Kiểu dữ liệu ---
interface Product {
  id: number;
  sku: string;
  name: string;
  wholesale_price: string;
  stock_quantity: number;
  min_order_qty: number;
}

interface User {
  id: number;
  username: string;
  company_name: string | null;
  phone_number: string | null;
}

interface OrderItem {
  product_id: number;
  product_name: string;
  product_sku: string;
  unit_price: number;
  quantity: number;
  stock_quantity: number;
}

export default function NewOrderPage() {
  const router = useRouter();

  // --- Dữ liệu từ server ---
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // --- Form thông tin đơn hàng ---
  const [retailerId, setRetailerId] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [shippingFee, setShippingFee] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cod' | 'credit_debt'>('cod');

  // --- Danh sách sản phẩm trong đơn ---
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // --- Bộ chọn sản phẩm ---
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  // --- Trạng thái submit ---
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch dữ liệu sản phẩm và người dùng
  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/users').then((r) => r.json()),
    ]).then(([p, u]) => {
      setProducts(p);
      setUsers(u);
      setLoadingData(false);
    });
  }, []);

  // Điền thông tin tự động khi chọn khách hàng
  const handleSelectUser = (uid: string) => {
    setRetailerId(uid);
    const user = users.find((u) => u.id === Number(uid));
    if (user) {
      setReceiverName(user.username);
      setReceiverPhone(user.phone_number || '');
    }
  };

  // Thêm sản phẩm vào danh sách
  const handleAddItem = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;

    // Nếu đã có trong danh sách thì tăng số lượng
    const existing = orderItems.find((i) => i.product_id === product.id);
    if (existing) {
      setOrderItems((prev) =>
        prev.map((i) =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + selectedQty }
            : i
        )
      );
    } else {
      setOrderItems((prev) => [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          unit_price: Number(product.wholesale_price),
          quantity: selectedQty,
          stock_quantity: product.stock_quantity,
        },
      ]);
    }
    setSelectedProductId('');
    setSelectedQty(1);
  };

  // Xóa sản phẩm khỏi danh sách
  const handleRemoveItem = (productId: number) => {
    setOrderItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  // Thay đổi số lượng trực tiếp trong bảng
  const handleQtyChange = (productId: number, qty: number) => {
    if (qty < 1) return;
    setOrderItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity: qty } : i))
    );
  };

  // Tính tổng
  const subtotal = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const total = subtotal + Number(shippingFee || 0);

  // Submit tạo đơn hàng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (orderItems.length === 0) {
      setError('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng.');
      return;
    }
    if (!shippingAddress.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailer_id: retailerId || null,
          shipping_address: shippingAddress,
          receiver_name: receiverName,
          receiver_phone: receiverPhone,
          shipping_fee: Number(shippingFee),
          payment_method: paymentMethod,
          items: orderItems.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      router.push('/orders');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
        <div style={{ color: '#6c757d' }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Tiêu đề */}
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h1>Tạo đơn hàng mới</h1>
          <p>Điền thông tin và thêm sản phẩm vào đơn hàng</p>
        </div>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">

          {/* CỘT TRÁI: Thông tin đơn hàng */}
          <div className="col-lg-7">

            {/* Thông tin khách hàng */}
            <div className="content-card mb-4">
              <div className="content-card-header">
                <h5>Thông tin khách hàng</h5>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <label className="form-label-custom">Khách hàng (tùy chọn)</label>
                  <select
                    className="form-control-custom"
                    value={retailerId}
                    onChange={(e) => handleSelectUser(e.target.value)}
                  >
                    <option value="">-- Khách vãng lai --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} {u.company_name ? `(${u.company_name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Tên người nhận</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="09xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label-custom">
                    Địa chỉ giao hàng <span style={{ color: '#c62828' }}>*</span>
                  </label>
                  <textarea
                    className="form-control-custom"
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Thanh toán & Vận chuyển */}
            <div className="content-card mb-4">
              <div className="content-card-header">
                <h5>Thanh toán và Vận chuyển</h5>
              </div>
              <div className="p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Phương thức thanh toán</label>
                    <select
                      className="form-control-custom"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                      required
                    >
                      <option value="cod">Thu tiền khi giao (COD)</option>
                      <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                      <option value="credit_debt">Ghi nợ</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Phí vận chuyển (đ)</label>
                    <input
                      type="number"
                      className="form-control-custom"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(e.target.value)}
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sản phẩm trong đơn */}
            <div className="content-card">
              <div className="content-card-header">
                <h5>Sản phẩm trong đơn</h5>
                <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>{orderItems.length} sản phẩm</span>
              </div>

              {/* Bộ chọn sản phẩm */}
              <div className="p-4" style={{ borderBottom: '1px solid #f0f2f5', background: '#f8f9fd' }}>
                <div className="row g-2 align-items-end">
                  <div className="col">
                    <label className="form-label-custom">Chọn sản phẩm</label>
                    <select
                      className="form-control-custom"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      <option value="">-- Tìm sản phẩm... --</option>
                      {products
                        .filter((p) => p.stock_quantity > 0)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.sku}] {p.name} — {Number(p.wholesale_price).toLocaleString('vi-VN')} đ (còn {p.stock_quantity})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-auto" style={{ minWidth: '100px' }}>
                    <label className="form-label-custom">Số lượng</label>
                    <input
                      type="number"
                      className="form-control-custom"
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn-primary-custom"
                      onClick={handleAddItem}
                      disabled={!selectedProductId}
                    >
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>

              {/* Bảng sản phẩm đã chọn */}
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th style={{ textAlign: 'right' }}>Đơn giá</th>
                      <th style={{ textAlign: 'center', width: '110px' }}>Số lượng</th>
                      <th style={{ textAlign: 'right' }}>Thành tiền</th>
                      <th style={{ textAlign: 'center', width: '60px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#adb5bd' }}>
                          Chưa có sản phẩm nào. Hãy chọn sản phẩm bên trên.
                        </td>
                      </tr>
                    ) : (
                      orderItems.map((item) => (
                        <tr key={item.product_id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6c757d', fontFamily: 'monospace' }}>
                              {item.product_sku}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {item.unit_price.toLocaleString('vi-VN')} đ
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control-custom"
                              value={item.quantity}
                              onChange={(e) => handleQtyChange(item.product_id, Number(e.target.value))}
                              min="1"
                              max={item.stock_quantity}
                              style={{ textAlign: 'center', padding: '5px 8px' }}
                            />
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            {(item.unit_price * item.quantity).toLocaleString('vi-VN')} đ
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.product_id)}
                              className="btn-ghost"
                              style={{ color: '#c62828', padding: '4px 8px' }}
                              title="Xóa khỏi đơn"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Tóm tắt đơn hàng */}
          <div className="col-lg-5">
            <div className="content-card" style={{ position: 'sticky', top: '24px' }}>
              <div className="content-card-header">
                <h5>Tóm tắt đơn hàng</h5>
              </div>
              <div className="p-4">

                {/* Các dòng tổng tiền */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>Tiền hàng</span>
                    <span style={{ fontWeight: 600 }}>{subtotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>Phí vận chuyển</span>
                    <span style={{ fontWeight: 600 }}>{Number(shippingFee || 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div
                    className="d-flex justify-content-between"
                    style={{
                      paddingTop: '12px',
                      borderTop: '2px solid #f0f2f5',
                      fontSize: '1.1rem',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>Tổng cộng</span>
                    <span style={{ fontWeight: 800, color: '#4361ee' }}>
                      {total.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Tóm tắt thông tin */}
                <div
                  style={{
                    background: '#f8f9fd',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '0.82rem',
                    color: '#374151',
                    marginBottom: '16px',
                  }}
                >
                  <div className="mb-2">
                    <span style={{ color: '#6c757d' }}>Phương thức: </span>
                    <strong>
                      {paymentMethod === 'cod'
                        ? 'Thu tiền khi giao (COD)'
                        : paymentMethod === 'bank_transfer'
                        ? 'Chuyển khoản'
                        : 'Ghi nợ'}
                    </strong>
                  </div>
                  <div className="mb-2">
                    <span style={{ color: '#6c757d' }}>Người nhận: </span>
                    <strong>{receiverName || '(chưa điền)'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d' }}>Địa chỉ: </span>
                    <strong>{shippingAddress || '(chưa điền)'}</strong>
                  </div>
                </div>

                {/* Thông báo lỗi */}
                {error && (
                  <div
                    style={{
                      background: '#fce4ec',
                      color: '#c62828',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      marginBottom: '14px',
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Nút tạo đơn */}
                <button
                  type="submit"
                  className="btn-primary-custom w-100 justify-content-center"
                  disabled={submitting}
                  style={{ padding: '12px', fontSize: '0.95rem' }}
                >
                  {submitting ? 'Đang tạo đơn...' : 'Xác nhận tạo đơn hàng'}
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-ghost w-100 justify-content-center mt-2"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
