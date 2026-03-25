import { PrismaClient } from '@prisma/client';
import { CATEGORIES } from './types';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { color: cat.color, emoji: cat.emoji },
      create: {
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        emoji: cat.emoji,
      },
    });
  }

  console.log(`Seeded ${CATEGORIES.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
