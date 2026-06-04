import prisma from '@/lib/prisma';
import EditUserForm from './EditUserForm';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      username: true,
      email: true,
      phone_number: true,
      company_name: true,
      tax_code: true,
      role: true,
      status: true,
      created_at: true,
    },
  });

  if (!user) {
    return (
      <div>
        <div className="page-header">
          <h1>Không tìm thấy người dùng</h1>
          <p>Người dùng với ID #{id} không tồn tại trong hệ thống.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Sửa người dùng</h1>
        <p>
          Tài khoản: <strong style={{ color: '#4361ee' }}>{user.username}</strong>
          {' — '}Ngày tạo: {user.created_at.toLocaleDateString('vi-VN')}
        </p>
      </div>
      <EditUserForm user={user} />
    </div>
  );
}
