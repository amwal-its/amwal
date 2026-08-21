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
  return tx.fundPool.update({
    where: { kode },
    data: { balance: { increment: amount } },
  });
}
