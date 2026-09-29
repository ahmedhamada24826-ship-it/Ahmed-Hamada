import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function fixCategories() {
  const categories = await prisma.category.findMany();
  const catMap = new Map();
  for (const c of categories) {
    catMap.set(c.nameEn.toLowerCase(), c.id);
    catMap.set(c.nameAr.toLowerCase(), c.id);
  }

  const projects = await prisma.project.findMany();
  for (const p of projects) {
    const matchedId = catMap.get(p.categoryName?.toLowerCase());
    if (matchedId) {
      await prisma.project.update({
        where: { id: p.id },
        data: { categoryId: matchedId },
      });
      console.log(`Updated project "${p.titleEn}" with categoryId: ${matchedId}`);
    }
  }

  const skills = await prisma.skill.findMany();
  for (const s of skills) {
    const matchedId = catMap.get(s.categoryName?.toLowerCase());
    if (matchedId) {
      await prisma.skill.update({
        where: { id: s.id },
        data: { categoryId: matchedId },
      });
      console.log(`Updated skill "${s.nameEn}" with categoryId: ${matchedId}`);
    }
  }
}

fixCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
