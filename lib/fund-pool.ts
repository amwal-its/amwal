import { Prisma } from '../app/generated/prisma/client';
import type { ZakatType } from '../app/generated/prisma/enums';

// Pemetaan jenis zakat → kode FundPool (ZAKAT_MAAL / ZAKAT_FITRAH)
export function fundPoolKodeByZakat(jenisZakat: ZakatType): string {
  return jenisZakat === 'FITRAH' ? 'ZAKAT_FITRAH' : 'ZAKAT_MAAL';
}

export async function incrementFundPool(
  tx: Prisma.TransactionClient,
  jenisZakat: ZakatType,
  amount: Prisma.Decimal | number
) {
  const kode = fundPoolKodeByZakat(jenisZakat);
  const nama = kode === 'ZAKAT_FITRAH' ? 'Pool Zakat Fitrah' : 'Pool Zakat Maal';
  const decimalAmount = amount instanceof Prisma.Decimal ? amount : new Prisma.Decimal(amount);

  return tx.fundPool.upsert({
    where: { kode },
    create: {
      kode,
      nama,
      balance: decimalAmount,
      totalDistributed: new Prisma.Decimal(0),
    },
    update: {
      balance: { increment: decimalAmount },
    },
  });
}
