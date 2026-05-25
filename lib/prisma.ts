import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '6543';
const dbName = process.env.DB_NAME || 'postgres';

// DATABASE_URL (Port 6543) WAJIB untuk query sehari-hari (Connection Pooling)
const connectionString = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?pgbouncer=true&schema=public`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;