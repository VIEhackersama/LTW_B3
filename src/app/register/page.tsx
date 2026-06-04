'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (data.password !== data.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData || 'Lỗi đăng ký');
      }

      setSuccess('Đăng ký thành công! Bạn có thể quay lại trang đăng nhập.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '60px auto', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>Đăng ký tài khoản</h2>
      
      {error && (
        <div style={{ background: '#fce4ec', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label-custom">Tên đăng nhập <span style={{color:'red'}}>*</span></label>
            <input name="username" required className="form-control-custom" />
          </div>
          <div className="col-md-6">
            <label className="form-label-custom">Mật khẩu <span style={{color:'red'}}>*</span></label>
            <input type="password" name="password" required className="form-control-custom" />
          </div>
          <div className="col-md-6">
            <label className="form-label-custom">Xác nhận mật khẩu <span style={{color:'red'}}>*</span></label>
            <input type="password" name="confirmPassword" required className="form-control-custom" />
          </div>
          <div className="col-12">
            <label className="form-label-custom">Email <span style={{color:'red'}}>*</span></label>
            <input type="email" name="email" required className="form-control-custom" />
          </div>
          <div className="col-12">
            <label className="form-label-custom">Số điện thoại</label>
            <input name="phone_number" className="form-control-custom" />
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary-custom w-100 justify-content-center mt-4" style={{ padding: '12px' }}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
        <Link href="/login" style={{ color: '#4361ee', textDecoration: 'none', fontWeight: 500 }}>
          Đã có tài khoản? Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
