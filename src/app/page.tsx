import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });

  return (
    <div>
      {/* Tiêu đề trang */}
      <div className="page-header">
        <h1>Tổng quan hệ thống</h1>
        <p>Cập nhật tình hình hàng hóa và đơn hàng mới nhất</p>
      </div>

      {/* Thẻ thống kê */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <span className="stat-label">Tổng sản phẩm</span>
              <div className="stat-icon" style={{ background: '#e8eaf6' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  <path d="M12 12v.01"/>
                </svg>
              </div>
            </div>
            <div className="stat-value">{totalProducts}</div>
            <Link href="/products" className="btn-outline-custom mt-3 d-inline-flex">Xem tất cả</Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <span className="stat-label">Tổng đơn hàng</span>
              <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                </svg>
              </div>
            </div>
            <div className="stat-value">{totalOrders}</div>
            <Link href="/orders" className="btn-outline-custom mt-3 d-inline-flex">Xem tất cả</Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <span className="stat-label">Chờ xử lý</span>
              <div className="stat-icon" style={{ background: '#fff8e1' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f57f17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
            </div>
            <div className="stat-value">{pendingOrders}</div>
            <Link href="/orders" className="btn-outline-custom mt-3 d-inline-flex">Xem tất cả</Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-start justify-content-between mb-3">
              <span className="stat-label">Người dùng</span>
              <div className="stat-icon" style={{ background: '#fce4ec' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <div className="stat-value">{totalUsers}</div>
            <Link href="/users" className="btn-outline-custom mt-3 d-inline-flex">Xem tất cả</Link>
          </div>
        </div>
      </div>

      {/* Truy cập nhanh */}
      <div className="content-card">
        <div className="content-card-header">
          <h5>Truy cập nhanh</h5>
        </div>
        <div className="p-4">
          <div className="row g-3">
            <div className="col-md-3">
              <Link href="/products/new" className="btn-primary-custom w-100 justify-content-center">
                + Thêm sản phẩm
              </Link>
            </div>
            <div className="col-md-3">
              <Link href="/categories" className="btn-outline-custom w-100 justify-content-center">
                Quản lý danh mục
              </Link>
            </div>
            <div className="col-md-3">
              <Link href="/orders" className="btn-outline-custom w-100 justify-content-center">
                Danh sách đơn hàng
              </Link>
            </div>
            <div className="col-md-3">
              <Link href="/users" className="btn-outline-custom w-100 justify-content-center">
                Danh sách người dùng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
