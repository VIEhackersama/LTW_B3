'use client';
import { logoutAction } from '@/app/actions/auth';

export default function WaitingApprovalPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', padding: '40px', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
      <h1 style={{ color: '#f59f00', marginBottom: '20px' }}>Chờ phê duyệt</h1>
      <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: '30px', lineHeight: '1.6' }}>
        Tài khoản của bạn đã được ghi nhận nhưng hiện tại chưa được cấp quyền truy cập. 
        Vui lòng chờ Quản trị viên (Admin) phê duyệt hoặc liên hệ với bộ phận hỗ trợ.
      </p>
      <form action={logoutAction}>
        <button type="submit" className="btn-primary-custom" style={{ padding: '10px 24px' }}>
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
