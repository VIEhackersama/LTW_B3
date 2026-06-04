'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    sku: '',
    name: '',
    wholesale_price: '',
    min_order_qty: '1',
    stock_quantity: '0',
    category_id: '',
    manufacturer_name: '',
    origin_country: '',
    image_url: '',
    status: 'active',
  });

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(setCategories);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          wholesale_price: Number(form.wholesale_price),
          min_order_qty: Number(form.min_order_qty),
          stock_quantity: Number(form.stock_quantity),
          category_id: form.category_id ? Number(form.category_id) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra');
      }
      router.push('/products');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header d-flex align-items-start justify-content-between">
        <div>
          <h1>Thêm sản phẩm mới</h1>
          <p>Điền đầy đủ thông tin sản phẩm để thêm vào kho hàng</p>
        </div>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* CỘT TRÁI */}
          <div className="col-lg-8">
            <div className="content-card mb-4">
              <div className="content-card-header">
                <h5>Thông tin cơ bản</h5>
              </div>
              <div className="p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label-custom">
                      Mã SKU <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      name="sku"
                      className="form-control-custom"
                      value={form.sku}
                      onChange={handleChange}
                      required
                      placeholder="VD: SP-DT-001"
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label-custom">
                      Tên sản phẩm <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      name="name"
                      className="form-control-custom"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Tên sản phẩm..."
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">
                      Giá sỉ (đ) <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      name="wholesale_price"
                      type="number"
                      className="form-control-custom"
                      value={form.wholesale_price}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Tồn kho ban đầu</label>
                    <input
                      name="stock_quantity"
                      type="number"
                      className="form-control-custom"
                      value={form.stock_quantity}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">SL đặt tối thiểu</label>
                    <input
                      name="min_order_qty"
                      type="number"
                      className="form-control-custom"
                      value={form.min_order_qty}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Danh mục</label>
                    <select
                      name="category_id"
                      className="form-control-custom"
                      value={form.category_id}
                      onChange={handleChange}
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Trạng thái</label>
                    <select
                      name="status"
                      className="form-control-custom"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="active">Đang bán</option>
                      <option value="inactive">Ngừng bán</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="content-card-header">
                <h5>Thông tin bổ sung</h5>
              </div>
              <div className="p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Nhà sản xuất</label>
                    <input
                      name="manufacturer_name"
                      className="form-control-custom"
                      value={form.manufacturer_name}
                      onChange={handleChange}
                      placeholder="Tên hãng..."
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Xuất xứ</label>
                    <input
                      name="origin_country"
                      className="form-control-custom"
                      value={form.origin_country}
                      onChange={handleChange}
                      placeholder="Việt Nam, Nhật Bản..."
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">URL hình ảnh</label>
                    <input
                      name="image_url"
                      className="form-control-custom"
                      value={form.image_url}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="col-lg-4">
            <div className="content-card" style={{ position: 'sticky', top: '24px' }}>
              <div className="content-card-header">
                <h5>Lưu sản phẩm</h5>
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
                <button
                  type="submit"
                  className="btn-primary-custom w-100 justify-content-center"
                  disabled={submitting}
                  style={{ padding: '12px' }}
                >
                  {submitting ? 'Đang lưu...' : 'Thêm sản phẩm'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-ghost w-100 justify-content-center mt-2"
                >
                  Hủy bỏ
                </button>
                <div style={{
                  marginTop: '16px', padding: '12px', background: '#f8f9fd',
                  borderRadius: '8px', fontSize: '0.8rem', color: '#6c757d',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Lưu ý:</div>
                  <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: '1.8' }}>
                    <li>Mã SKU phải là duy nhất</li>
                    <li>Giá sỉ phải lớn hơn 0</li>
                    <li>Tồn kho có thể cập nhật sau</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
