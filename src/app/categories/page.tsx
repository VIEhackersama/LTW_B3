import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { id: 'desc' }
  });

  async function addCategory(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    if (name?.trim()) {
      await prisma.category.create({ data: { name: name.trim() } });
      revalidatePath("/categories");
    }
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (id) {
      await prisma.category.delete({ where: { id } });
      revalidatePath("/categories");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Danh mục</h1>
        <p>Phân loại sản phẩm theo nhóm hàng hóa</p>
      </div>

      <div className="row g-4">
        {/* Form thêm danh mục */}
        <div className="col-md-4">
          <div className="content-card h-100">
            <div className="content-card-header">
              <h5>Thêm danh mục mới</h5>
            </div>
            <div className="p-4">
              <form action={addCategory}>
                <div className="mb-3">
                  <label className="form-label-custom">Tên danh mục</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control-custom"
                    required
                    placeholder="Ví dụ: Điện tử, Thực phẩm..."
                  />
                </div>
                <button type="submit" className="btn-primary-custom w-100 justify-content-center">
                  Thêm danh mục
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bảng danh mục */}
        <div className="col-md-8">
          <div className="content-card">
            <div className="content-card-header">
              <h5>Danh sách danh mục</h5>
              <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>{categories.length} danh mục</span>
            </div>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên danh mục</th>
                    <th style={{ textAlign: 'center' }}>Số sản phẩm</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#6c757d', padding: '32px' }}>
                        Chưa có danh mục nào.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id}>
                        <td style={{ color: '#adb5bd', fontSize: '0.82rem' }}>#{cat.id}</td>
                        <td style={{ fontWeight: 600 }}>{cat.name}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="badge-status primary">{cat._count.products} sản phẩm</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <form action={deleteCategory} style={{ display: 'inline' }}>
                            <input type="hidden" name="id" value={cat.id} />
                            <button type="submit" className="btn-ghost" style={{ color: '#c62828' }}>
                              Xóa
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
