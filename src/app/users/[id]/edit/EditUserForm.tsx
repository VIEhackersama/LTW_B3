'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  company_name: string | null;
  tax_code: string | null;
  role: string;
  status: string;
}

export default function EditUserForm({ user }: { user: User }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    email: user.email,
    phone_number: user.phone_number || '',
    company_name: user.company_name || '',
    tax_code: user.tax_code || '',
    role: user.role,
    status: user.status,
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        email: form.email,
        phone_number: form.phone_number || null,
        company_name: form.company_name || null,
        tax_code: form.tax_code || null,
        role: form.role,
        status: form.status,
      };
      if (form.newPassword) body.password = form.newPassword;

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Lỗi cập nhật người dùng');
      setSuccess('Cập nhật thành công!');
      setForm((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.username}" không?\nHành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Lỗi xóa người dùng');
      router.push('/users');
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
          {/* Thông tin đăng nhập */}
          <div className="content-card mb-4">
            <div className="content-card-header">
              <h5>Thông tin đăng nhập</h5>
            </div>
            <div className="p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Tên đăng nhập</label>
                  <input
                    className="form-control-custom"
                    value={user.username}
                    disabled
                    style={{ background: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#6c757d', fontSize: '0.75rem' }}>
                    Tên đăng nhập không thể thay đổi
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
                  />
                </div>

                {/* Đổi mật khẩu (tùy chọn) */}
                <div className="col-12">
                  <div style={{
                    padding: '12px 14px', background: '#f8f9fd',
                    borderRadius: '8px', marginBottom: '4px',
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                      Đổi mật khẩu (để trống nếu không muốn thay đổi)
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label-custom">Mật khẩu mới</label>
                        <input
                          name="newPassword"
                          type="password"
                          className="form-control-custom"
                          value={form.newPassword}
                          onChange={handleChange}
                          placeholder="Tối thiểu 6 ký tự"
                          minLength={form.newPassword ? 6 : undefined}
                          autoComplete="new-password"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-custom">Xác nhận mật khẩu</label>
                        <input
                          name="confirmPassword"
                          type="password"
                          className="form-control-custom"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="Nhập lại mật khẩu mới"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin doanh nghiệp */}
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
              {success && (
                <div style={{
                  background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px',
                  padding: '10px 14px', fontSize: '0.85rem', marginBottom: '14px',
                  fontWeight: 600,
                }}>
                  {success}
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
                  background: 'transparent', border: '1.5px solid #c62828',
                  borderRadius: '8px', padding: '9px 18px', fontSize: '0.85rem',
                  fontWeight: 600, color: '#c62828', width: '100%',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.6 : 1, transition: 'all 0.18s',
                }}
              >
                {deleting ? 'Đang xóa...' : 'Xóa người dùng'}
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
