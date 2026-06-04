const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Sửa lỗi ngày 0000-00-00 trong bảng orders
    const result = await prisma.$executeRawUnsafe(`
      UPDATE orders 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE updated_at < '1000-01-01' OR updated_at IS NULL;
    `);
    console.log("Đã fix xong lỗi ngày tháng trong DB. Số dòng được sửa:", result);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
