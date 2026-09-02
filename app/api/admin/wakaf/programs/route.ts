import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { WaqfType, WaqfStatus, VerificationStatus, Prisma } from '@/app/generated/prisma/client';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createProgramSchema = z.object({
  judul: z.string().min(1, 'Judul program wajib diisi'),
  kategori: z.string().optional().default('Sosial & Pendidikan'),
  deskripsi: z.string().optional().default(''),
  targetDana: z.number().positive('Target dana harus lebih besar dari 0'),
  durasiHari: z.number().int().positive().optional().default(60),
  bannerUrl: z.string().optional().or(z.literal('')),
  jenisWakaf: z.nativeEnum(WaqfType).optional().default(WaqfType.HABIS_PAKAI),
  status: z.nativeEnum(WaqfStatus).optional().default(WaqfStatus.LIVE),
  nadzirProfileId: z.string().optional(),
  progressFisik: z.number().min(0).max(100).optional().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' }, { status: 401 });
    }

    const programs = await prisma.waqfProgram.findMany({
      include: {
        principalLedger: true,
        nadzirProfile: {
          select: {
            id: true,
            namaLembaga: true,
            namaBank: true,
            nomorRekeningBank: true,
            statusVerifikasi: true,
          },
        },
        progressReports: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: {
                name: true,
                role: true,
              },
            },
          },
        },
        withdrawalRequests: {
          orderBy: { createdAt: 'desc' },
          include: {
            requestedBy: {
              select: {
                name: true,
                phone: true,
              },
            },
            approvedBy: {
              select: {
                name: true,
              },
            },
          },
        },
        yieldEntries: {
          orderBy: { recordedAt: 'desc' },
        },
        waqfOrders: {
          where: {
            status: 'TERVERIFIKASI',
          },
          include: {
            wakif: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
            transaction: {
              include: {
                certificate: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: programs }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/admin/wakaf/programs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak. Peran ADMIN diperlukan.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createProgramSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      judul,
      kategori,
      deskripsi,
      targetDana,
      durasiHari,
      bannerUrl,
      jenisWakaf,
      status,
      nadzirProfileId: customNadzirId,
      progressFisik,
    } = parsed.data;

    // Resolve Nadzir Profile
    let nadzirId = customNadzirId;
    if (!nadzirId) {
      const verifiedNadzir = await prisma.nadzirProfile.findFirst({
        where: { statusVerifikasi: VerificationStatus.VERIFIED },
      });
      if (!verifiedNadzir) {
        // Fallback to any nadzir or create system default
        const anyNadzir = await prisma.nadzirProfile.findFirst();
        if (anyNadzir) {
          nadzirId = anyNadzir.id;
        } else {
          return NextResponse.json(
            { error: 'Belum ada profil Nadzir terdaftar di sistem. Buat profil Nadzir terlebih dahulu.' },
            { status: 400 }
          );
        }
      } else {
        nadzirId = verifiedNadzir.id;
      }
    }

    // Atomic creation of WaqfProgram, WaqfPrincipalLedger, and initial ProgressReport
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const program = await tx.waqfProgram.create({
        data: {
          nadzirProfileId: nadzirId!,
          judul,
          kategori,
          deskripsi,
          targetDana,
          durasiHari,
          bannerUrl: bannerUrl || '/assets/images/wakaf/wakaf-pembangunan-masjid-al-furqon.png',
          jenisWakaf,
          status,
        },
      });

      const ledger = await tx.waqfPrincipalLedger.create({
        data: {
          waqfProgramId: program.id,
          pokokDanaTerkumpul: 0,
          totalHasilAvailable: 0,
          hasilInvestasiTersalurkan: 0,
        },
      });

      let initialReport = null;
      if (progressFisik > 0) {
        initialReport = await tx.programProgressReport.create({
          data: {
            waqfProgramId: program.id,
            persentaseFisik: progressFisik,
            deskripsi: 'Inisialisasi progres awal program oleh Admin.',
            createdById: session.userId,
            kuitansiUrls: [],
          },
        });
      }

      return {
        ...program,
        principalLedger: ledger,
        progressReports: initialReport ? [initialReport] : [],
      };
    });

    return NextResponse.json(
      { message: 'Program wakaf berhasil diterbitkan', data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/admin/wakaf/programs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
