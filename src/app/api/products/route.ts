import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    
    const whereClause = categoryId ? { category_id: parseInt(categoryId) } : {};
    
    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        sku: body.sku,
        name: body.name,
        wholesale_price: body.wholesale_price,
        min_order_qty: body.min_order_qty,
        stock_quantity: body.stock_quantity,
        status: body.status || 'active',
        category_id: body.category_id,
        manufacturer_name: body.manufacturer_name,
        origin_country: body.origin_country,
        image_url: body.image_url,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi server hoặc SKU đã tồn tại' }, { status: 500 });
  }
}
