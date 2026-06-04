import prisma from "@/lib/prisma";
import Link from "next/link";

const roleLabel: Record<string, string> = { admin: 'Admin', retailer: 'Nhà bán lẻ' };
const roleClass: Record<string, string> = { admin: 'danger', retailer: 'primary' };

const statusLabel: Record<string, string> = { pending: 'Chờ duyệt', active: 'Hoạt động', banned: 'Bị cấm' };
const statusClass: Record<string, string> = { pending: 'warning', active: 'success', banned: 'danger' };

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' }
  });

  return (
    <div>
      <div className="page-header d-flex align-items-start justify-content-between">
        <div>
          <h1>Người dùng</h1>
          <p>Quản lý tài khoản khách hàng và nhà bán lẻ</p>
        </div>
        <Link href="/users/new" className="btn-primary-custom">
          + Thêm người dùng
        </Link>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tài khoản</th>
                <th>Email</th>
                <th>SĐT</th>
                <th style={{ textAlign: 'center' }}>Vai trò</th>
                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
                    Chưa có người dùng nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ color: '#adb5bd', fontSize: '0.82rem' }}>#{user.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{user.username}</div>
                      {user.company_name && (
                        <div style={{ fontSize: '0.78rem', color: '#6c757d' }}>{user.company_name}</div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{user.email}</td>
                    <td style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                      {user.phone_number || <span style={{ fontStyle: 'italic', color: '#adb5bd' }}>N/A</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge-status ${roleClass[user.role]}`}>
                        {roleLabel[user.role]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge-status ${statusClass[user.status]}`}>
                        {statusLabel[user.status]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link href={`/users/${user.id}/edit`} className="btn-ghost">
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
