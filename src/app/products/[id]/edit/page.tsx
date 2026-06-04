import prisma from '@/lib/prisma';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: Number(id) } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!product) {
    return (
      <div>
        <div className="page-header">
          <h1>Không tìm thấy sản phẩm</h1>
          <p>Sản phẩm với ID #{id} không tồn tại trong hệ thống.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Sửa sản phẩm</h1>
        <p>
          SKU: <strong style={{ fontFamily: 'monospace', color: '#4361ee' }}>{product.sku}</strong>
          {' — '}{product.name}
        </p>
      </div>
      <EditProductForm
        product={{
          ...product,
          wholesale_price: product.wholesale_price.toString(),
        }}
        categories={categories}
      />
    </div>
  );
}
