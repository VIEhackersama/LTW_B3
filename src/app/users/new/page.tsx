'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewUserPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone_number: '',
    company_name: '',
    tax_code: '',
    role: 'retailer',
    status: 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          email: form.email,
          phone_number: form.phone_number || null,
          company_name: form.company_name || null,
          tax_code: form.tax_code || null,
          role: form.role,
          status: form.status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra');
      }
      router.push('/users');
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
          <h1>Thêm người dùng mới</h1>
          <p>Tạo tài khoản cho quản trị viên hoặc nhà bán lẻ</p>
        </div>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* CỘT TRÁI */}
          <div className="col-lg-8">
            {/* Thông tin đăng nhập */}
            <div className="content-card mb-4">
              <div className="content-card-header">
                <h5>Thông tin đăng nhập</h5>
              </div>
              <div className="p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">
                      Tên đăng nhập <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      name="username"
                      className="form-control-custom"
                      value={form.username}
                      onChange={handleChange}
                      required
                      placeholder="vd: nguyen_van_a"
                      autoComplete="off"
                    />
                    <small style={{ color: '#6c757d', fontSize: '0.75rem' }}>
                      Chỉ dùng chữ thường, số và dấu gạch dưới
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">
                      Email <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="form-control-custom"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">
                      Mật khẩu <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      name="password"
                      type="password"
                      className="form-control-custom"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">
                      Xác nhận mật khẩu <span style={{ color: '#c62828' }}>*</span>
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      className="form-control-custom"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin cá nhân / doanh nghiệp */}
            <div className="content-card">
              <div className="content-card-header">
                <h5>Thông tin doanh nghiệp</h5>
              </div>
              <div className="p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Số điện thoại</label>
                    <input
                      name="phone_number"
                      className="form-control-custom"
                      value={form.phone_number}
                      onChange={handleChange}
                      placeholder="09xxxxxxxx"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Mã số thuế</label>
                    <input
                      name="tax_code"
                      className="form-control-custom"
                      value={form.tax_code}
                      onChange={handleChange}
                      placeholder="Mã số thuế doanh nghiệp"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Tên công ty / cửa hàng</label>
                    <input
                      name="company_name"
                      className="form-control-custom"
                      value={form.company_name}
                      onChange={handleChange}
                      placeholder="Tên doanh nghiệp hoặc cửa hàng..."
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
                <h5>Phân quyền và trạng thái</h5>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <label className="form-label-custom">Vai trò</label>
                  <select name="role" className="form-control-custom" value={form.role} onChange={handleChange}>
                    <option value="retailer">Nhà bán lẻ</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label-custom">Trạng thái tài khoản</label>
                  <select name="status" className="form-control-custom" value={form.status} onChange={handleChange}>
                    <option value="active">Hoạt động</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="banned">Bị cấm</option>
                  </select>
                </div>

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
                  {submitting ? 'Đang tạo...' : 'Tạo người dùng'}
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
                    <li>Tên đăng nhập và email phải là duy nhất</li>
                    <li>Mật khẩu lưu dạng văn bản thường</li>
                    <li>Vai trò Admin có toàn quyền hệ thống</li>
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
