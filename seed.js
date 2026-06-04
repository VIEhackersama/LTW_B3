const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('adminadmin', 10);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.user.deleteMany({ where: { username: 'admin1' } });
    await prisma.user.create({
      data: {
        username: 'admin1',
        password: hash,
        email: 'admin1@ltw.com',
        role: 'admin',
        status: 'active'
      }
    });
    console.log('Deleted and recreated admin1 successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
