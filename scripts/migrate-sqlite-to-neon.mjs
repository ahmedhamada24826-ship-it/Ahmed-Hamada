import "dotenv/config";
import { PrismaClient as SQLiteClient } from "../node_modules/.prisma/client-sqlite/index.js";
import { PrismaClient as NeonClient } from "@prisma/client";

const sqlite = new SQLiteClient();
const neon = new NeonClient();


async function migrate() {
  console.log("Reading data from SQLite...");

  const data = {
    user: await sqlite.user.findMany(),
    siteSettings: await sqlite.siteSettings.findMany(),
    categories: await sqlite.category.findMany(),
    skills: await sqlite.skill.findMany(),
    services: await sqlite.service.findMany(),
    projects: await sqlite.project.findMany(),
    experiences: await sqlite.experience.findMany(),
    education: await sqlite.education.findMany(),
    certificates: await sqlite.certificate.findMany(),
    statistics: await sqlite.statistic.findMany(),
    navigationItems: await sqlite.navigationItem.findMany(),
    contactMessages: await sqlite.contactMessage.findMany(),
    mediaAssets: await sqlite.mediaAsset.findMany(),
    activityLogs: await sqlite.activityLog.findMany(),
  };

  console.log("Records found:");
  for (const [name, rows] of Object.entries(data)) {
    console.log(`  ${name}: ${rows.length}`);
  }

  console.log("\nWriting data to Neon...");

  for (const row of data.user) {
    await neon.user.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.siteSettings) {
    await neon.siteSettings.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.categories) {
    await neon.category.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.skills) {
    await neon.skill.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.services) {
    await neon.service.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.projects) {
    await neon.project.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.experiences) {
    await neon.experience.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.education) {
    await neon.education.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.certificates) {
    await neon.certificate.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.statistics) {
    await neon.statistic.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.navigationItems) {
    await neon.navigationItem.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.contactMessages) {
    await neon.contactMessage.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.mediaAssets) {
    await neon.mediaAsset.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  for (const row of data.activityLogs) {
    await neon.activityLog.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  console.log("\nMigration completed successfully.");
}

migrate()
  .catch((error) => {
    console.error("\nMigration failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlite.$disconnect();
    await neon.$disconnect();
  });


