'use client';

import { loginAction } from '@/app/actions/auth';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(null, formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.redirectUrl) {
        window.location.href = res.redirectUrl;
      }
    } catch (err) {
      setError('Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>Đăng nhập hệ thống</h2>
      {error && (
        <div style={{ background: '#fce4ec', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label className="form-label-custom">Tên đăng nhập</label>
          <input name="username" required className="form-control-custom" placeholder="Nhập tên đăng nhập" />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label-custom">Mật khẩu</label>
          <input type="password" name="password" required className="form-control-custom" placeholder="Nhập mật khẩu" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary-custom w-100 justify-content-center" style={{ padding: '12px' }}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
        <Link href="/register" style={{ color: '#4361ee', textDecoration: 'none', fontWeight: 500 }}>
          Chưa có tài khoản? Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
