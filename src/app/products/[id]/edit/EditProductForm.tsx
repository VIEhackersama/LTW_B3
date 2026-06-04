'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category { id: number; name: string; }
interface Product {
  id: number;
  sku: string;
  name: string;
  wholesale_price: string | number;
  min_order_qty: number;
  stock_quantity: number;
  status: string;
  category_id: number | null;
  manufacturer_name: string | null;
  origin_country: string | null;
  image_url: string | null;
}

export default function EditProductForm({ product, categories }: { product: Product; categories: Category[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: product.name,
    wholesale_price: String(product.wholesale_price),
    min_order_qty: String(product.min_order_qty),
    stock_quantity: String(product.stock_quantity),
    category_id: product.category_id ? String(product.category_id) : '',
    manufacturer_name: product.manufacturer_name || '',
    origin_country: product.origin_country || '',
    image_url: product.image_url || '',
    status: product.status,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          wholesale_price: Number(form.wholesale_price),
          min_order_qty: Number(form.min_order_qty),
          stock_quantity: Number(form.stock_quantity),
          status: form.status,
          category_id: form.category_id ? Number(form.category_id) : null,
          manufacturer_name: form.manufacturer_name || null,
          origin_country: form.origin_country || null,
          image_url: form.image_url || null,
        }),
      });
      if (!res.ok) throw new Error('Lỗi cập nhật sản phẩm');
      router.push('/products');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}" không?\nHành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Lỗi xóa sản phẩm');
      router.push('/products');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setDeleting(false);
    }
  };

  return (
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
                  <label className="form-label-custom">Mã SKU</label>
                  <input
                    className="form-control-custom"
                    value={product.sku}
                    disabled
                    style={{ background: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#6c757d', fontSize: '0.75rem' }}>SKU không thể thay đổi</small>
                </div>
                <div className="col-md-8">
                  <label className="form-label-custom">
                    Tên sản phẩm <span style={{ color: '#c62828' }}>*</span>
                  </label>
                  <input name="name" className="form-control-custom" value={form.name} onChange={handleChange} required />
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
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Tồn kho</label>
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
                  <select name="category_id" className="form-control-custom" value={form.category_id} onChange={handleChange}>
                    <option value="">-- Không có danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Trạng thái</label>
                  <select name="status" className="form-control-custom" value={form.status} onChange={handleChange}>
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
              <h5>Thao tác</h5>
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
                {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <div style={{ height: '1px', background: '#f0f2f5', margin: '14px 0' }} />
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
                {deleting ? 'Đang xóa...' : 'Xóa sản phẩm'}
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
  );
}
