/// big thanks : https://github.com/prisma/prisma/discussions/19669#discussioncomment-12852313
import { PrismaClient } from 'generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  /// CREATE ACCOUNT ADMIN
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'Admin',
      profile: {
        create: {
          name: 'Admin',
          phoneNumber: '6281213221343',
        },
      },
    },
  });
  /// CREATE ACCOUNT CUSTOMER
  await prisma.user.create({
    data: {
      email: 'nur.hamsah.cash@gmail.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'Customer',
      profile: {
        create: {
          name: 'Nurhamsah',
          phoneNumber: '6281213221343',
        },
      },
    },
  });
  /// CREATE PRODUCT CATEGORY
  await prisma.productCategory.create({
    data: {
      name: "Book's",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
