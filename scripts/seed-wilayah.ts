import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { prisma } from '../lib/prisma';

async function seedWilayah() {
  console.log('=== Starting Wilayah Seeding from prisma/wilayah.sql ===');

  const sqlFilePath = path.join(__dirname, '../prisma/wilayah.sql');
  if (!fs.existsSync(sqlFilePath)) {
    console.error('File not found:', sqlFilePath);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(sqlFilePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const valueRegex = /^\s*\('([^']+)',\s*'((?:''|[^'])*)'\)/;
  let batch: { kode: string; nama: string }[] = [];
  let totalInserted = 0;
  const BATCH_SIZE = 5000;

  for await (const line of rl) {
    const match = line.match(valueRegex);
    if (match) {
      const kode = match[1];
      const nama = match[2].replace(/''/g, "'");
      batch.push({ kode, nama });

      if (batch.length >= BATCH_SIZE) {
        await prisma.wilayah.createMany({
          data: batch,
          skipDuplicates: true,
        });
        totalInserted += batch.length;
        console.log(`Inserted ${totalInserted} wilayah records...`);
        batch = [];
      }
    }
  }

  if (batch.length > 0) {
    await prisma.wilayah.createMany({
      data: batch,
      skipDuplicates: true,
    });
    totalInserted += batch.length;
    console.log(`Inserted final batch. Total: ${totalInserted} wilayah records.`);
  }

  const count = await prisma.wilayah.count();
  console.log(`=== Wilayah Seeding Completed! Total in DB: ${count} ===`);
}

seedWilayah()
  .catch((e) => {
    console.error('Error seeding wilayah:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
