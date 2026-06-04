'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GrantAdminButton({ userId, currentRole, currentStatus }: { userId: number, currentRole: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Nếu đã là admin active thì không hiện nút
  if (currentRole === 'admin' && currentStatus === 'active') return null;

  const handleGrant = async () => {
    if (!confirm('Bạn có chắc chắn muốn cấp quyền Admin và Kích hoạt tài khoản này?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', status: 'active' })
      });
      if (res.ok) {
        router.refresh(); // Tải lại danh sách từ server component
      } else {
        alert('Có lỗi xảy ra khi cấp quyền');
      }
    } catch (e) {
      alert('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleGrant} disabled={loading} className="btn-primary-custom" style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '8px', background: '#10b981', border: 'none' }}>
      {loading ? 'Đang xử lý...' : 'Grant Admin'}
    </button>
  );
}
