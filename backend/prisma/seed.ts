import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

const prisma: PrismaService = new PrismaClient();
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
  const category = ['Books', 'Course', 'Flowers', 'Tools'];
  const productCategory = await prisma.productCategory.createManyAndReturn({
    data: category.map((item) => ({ name: item })),
  });
  /// CREATE PRODUCT DUMMY
  await prisma.product.createMany({
    data: Array(50)
      .fill('')
      .map((_, index) => {
        const randomCategory =
          productCategory[
            Math.floor(Math.random() * (productCategory.length - 1))
          ];
        return {
          name: `Product ${index}`,
          sellPrice: 100 * (index + 1),
          stock: 100,
          buyPrice: 100 * (index + 1) - 50,
          selled: 0,
          desc: 'this is desc product',
          productCategoryId: randomCategory.id,
        };
      }),
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
