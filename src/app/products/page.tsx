import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div>
      <div className="page-header d-flex align-items-start justify-content-between">
        <div>
          <h1>Sản phẩm</h1>
          <p>Quản lý toàn bộ danh sách sản phẩm trong kho</p>
        </div>
        <Link href="/products/new" className="btn-primary-custom">
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th style={{ textAlign: 'right' }}>Giá sỉ</th>
                <th style={{ textAlign: 'center' }}>Tồn kho</th>
                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
                    Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: '#4361ee', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                        {product.sku}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>
                      {product.category?.name
                        ? <span className="badge-status info">{product.category.name}</span>
                        : <span style={{ color: '#adb5bd', fontStyle: 'italic', fontSize: '0.8rem' }}>Không có</span>}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {Number(product.wholesale_price).toLocaleString('vi-VN')} đ
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge-status ${product.stock_quantity > 0 ? 'success' : 'danger'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge-status ${product.status === 'active' ? 'success' : 'gray'}`}>
                        {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link href={`/products/${product.id}/edit`} className="btn-ghost">
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
