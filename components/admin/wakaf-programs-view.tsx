'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  Upload,
  MapPin,
  Building2,
  CreditCard,
  Calendar,
  ArrowLeft,
  Receipt,
  DollarSign,
  Tag,
  Eye,
  RefreshCw,
  Landmark,
  Send,
  Download,
  PlusCircle,
  Sliders,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Coins,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export interface ReceiptItem {
  id: string;
  title: string;
  vendor?: string;
  amount: number;
  fileName: string;
  date: string;
  status?: string;
  ocrDetected?: boolean;
  notes?: string;
}

export interface TerminItem {
  id: string;
  programId: string;
  terminKe: string;
  nominal: number;
  targetRekening: string;
  status: string;
  rawStatus?: string;
  adminNotes?: string;
  tanggalPengajuan: string;
  dokumen: string;
  requestedBy?: string;
  approvedBy?: string | null;
}

export interface YieldItem {
  id: string;
  programId: string;
  nominal: number;
  sourceDescription: string;
  recordedAt: string;
}

export interface WakifItem {
  id: string;
  orderId: string;
  programId: string;
  name: string;
  phone: string;
  nominal: number;
  tanggal: string;
  akad: string;
  nomorKwitansi?: string;
  sertifikatNo: string;
  nomorRegistrasiBwi?: string | null;
  statusSertifikat: string;
}

export interface WaqfProgramItem {
  id: string;
  name: string;
  akad: 'Wakaf Uang' | 'Wakaf Melalui Uang';
  kategori: string;
  targetAmount: number;
  collectedAmount: number;
  availableYield?: number;
  distributedYield?: number;
  description: string;
  status: 'Aktif' | 'Menunggu Persetujuan Super Admin' | 'Butuh Revisi' | 'Ditolak' | 'Selesai' | 'Draft';
  rawStatus?: string;
  bannerUrl: string;
  supportingDoc?: string;
  durationStart?: string;
  durationEnd?: string;
  duration?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  bankAccount?: string;
  province: string;
  city: string;
  locationDetail?: string;
  jenisWakaf: 'Wakaf Uang' | 'Wakaf Melalui Uang';
  rawJenisWakaf?: string;
  menerimaWakafBarang: 'Ya' | 'Tidak';
  progressFisik: number;
  receipts: ReceiptItem[];
  terminList?: TerminItem[];
  yieldList?: YieldItem[];
  wakifList?: WakifItem[];
  submitterName?: string;
  submitterRole?: string;
}

interface WakafProgramsViewProps {
  initialPrograms?: WaqfProgramItem[];
  nadzirProfiles?: Array<{
    id: string;
    namaLembaga: string | null;
    namaBank: string | null;
    nomorRekeningBank: string | null;
  }>;
}

export function WakafProgramsView({
  initialPrograms = [],
  nadzirProfiles = [],
}: WakafProgramsViewProps) {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [programs, setPrograms] = useState<WaqfProgramItem[]>(initialPrograms);
  const [activeView, setActiveView] = useState<'main' | 'detail'>('main');
  const [selectedProgId, setSelectedProgId] = useState<string>(
    initialPrograms[0]?.id || ''
  );
  const [workbenchTab, setWorkbenchTab] = useState<'receipts' | 'termin' | 'wakif' | 'bwi'>('receipts');
  const [searchProgramQuery, setSearchProgramQuery] = useState('');
  const [filterAkad, setFilterAkad] = useState<string>('SEMUA');
  const [isLoading, setIsLoading] = useState(false);

  // Sync if initialPrograms update
  useEffect(() => {
    if (initialPrograms && initialPrograms.length > 0) {
      setPrograms(initialPrograms);
      if (!selectedProgId || !initialPrograms.find((p) => p.id === selectedProgId)) {
        setSelectedProgId(initialPrograms[0].id);
      }
    }
  }, [initialPrograms]);

  // Handle URL query parameters for direct tab navigation
  useEffect(() => {
    const viewParam = searchParams.get('view');
    const tabParam = searchParams.get('tab');
    if (viewParam === 'receipts' || tabParam === 'kuitansi' || tabParam === 'audit') {
      setActiveView('detail');
      setWorkbenchTab('receipts');
    } else if (viewParam === 'create') {
      handleOpenAddModal();
    }
  }, [searchParams]);

  // Modal / Form state for Add / Edit Program
  const [showModal, setShowModal] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);

  // State for Disbursement Request Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');

  // State for Rejecting Withdrawal Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // State for Yield Entry Modal (Wakaf Produktif)
  const [showYieldModal, setShowYieldModal] = useState(false);
  const [yieldAmount, setYieldAmount] = useState('');
  const [yieldDescription, setYieldDescription] = useState('');

  // State for Adding Receipt
  const [newReceiptTitle, setNewReceiptTitle] = useState('');
  const [newReceiptVendor, setNewReceiptVendor] = useState('');
  const [newReceiptAmount, setNewReceiptAmount] = useState('');
  const [newReceiptFile, setNewReceiptFile] = useState<string>('Kuitansi_Belanja.jpg');
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);

  // File Input Refs
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const receiptFileInputRef = useRef<HTMLInputElement>(null);

  // Master Data Wilayah (Provinsi -> Kab/Kota Cascade)
  const [provincesList, setProvincesList] = useState<{ kode: string; nama: string }[]>([]);
  const [citiesList, setCitiesList] = useState<{ kode: string; nama: string }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Physical Progress Save State
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [savedProgressMap, setSavedProgressMap] = useState<Record<string, number>>({});

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bannerUrl: '/assets/images/wakaf/wakaf-air-bersih-desa-nurul-amanah.png',
    targetAmount: '',
    duration: '60 Hari',
    bankAccount: 'BSI - 711-889-2234 a.n. YMI ITS',
    province: 'Jawa Timur',
    city: 'Kabupaten Bojonegoro',
    locationDetail: 'Kampus Sukolilo ITS Surabaya',
    jenisWakaf: 'Wakaf Uang' as 'Wakaf Uang' | 'Wakaf Melalui Uang',
    kategori: 'Infrastruktur & Sosial',
    menerimaWakafBarang: 'Ya' as 'Ya' | 'Tidak',
    nadzirProfileId: nadzirProfiles[0]?.id || '',
  });

  // Fetch 38 Provinces on Mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('/api/wilayah?level=provinsi');
        if (res.ok) {
          const json = await res.json();
          const list: { kode: string; nama: string }[] = json.data || [];
          setProvincesList(list);

          // Initial load cities for Jawa Timur (kode: 35) or first province
          const jtimur = list.find((p) => p.nama.toLowerCase().includes('jawa timur')) || list[0];
          if (jtimur) {
            const citiesRes = await fetch(`/api/wilayah?provinsiKode=${jtimur.kode}`);
            if (citiesRes.ok) {
              const citiesJson = await citiesRes.json();
              setCitiesList(citiesJson.data || []);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch provinces:', err);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinsiNama: string) => {
    setFormData((prev) => ({ ...prev, province: provinsiNama, city: '' }));
    const selectedProv = provincesList.find(
      (p) => p.nama.toLowerCase() === provinsiNama.toLowerCase()
    );

    if (selectedProv) {
      setIsLoadingCities(true);
      try {
        const res = await fetch(`/api/wilayah?provinsiKode=${selectedProv.kode}`);
        if (res.ok) {
          const json = await res.json();
          const newCities: { kode: string; nama: string }[] = json.data || [];
          setCitiesList(newCities);
          if (newCities.length > 0) {
            setFormData((prev) => ({ ...prev, city: newCities[0].nama }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      } finally {
        setIsLoadingCities(false);
      }
    } else {
      setCitiesList([]);
    }
  };

  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            bannerUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewReceiptFile(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setReceiptPreviewUrl(event.target!.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreviewUrl(null);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingProgramId(null);
    const defaultProv = provincesList.find((p) => p.nama.toLowerCase().includes('jawa timur')) || provincesList[0];
    const provName = defaultProv?.nama || 'Jawa Timur';

    setFormData({
      name: '',
      description: '',
      bannerUrl: '/assets/images/wakaf/wakaf-air-bersih-desa-nurul-amanah.png',
      targetAmount: '',
      duration: '60 Hari',
      bankAccount: 'BSI - 711-889-2234 a.n. YMI ITS',
      province: provName,
      city: citiesList[0]?.nama || 'Kabupaten Bojonegoro',
      locationDetail: 'Kampus Sukolilo ITS Surabaya',
      jenisWakaf: 'Wakaf Uang',
      kategori: 'Infrastruktur & Sosial',
      menerimaWakafBarang: 'Ya',
      nadzirProfileId: nadzirProfiles[0]?.id || '',
    });

    if (defaultProv) {
      fetch(`/api/wilayah?provinsiKode=${defaultProv.kode}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data && json.data.length > 0) {
            setCitiesList(json.data);
            setFormData((prev) => ({ ...prev, city: json.data[0].nama }));
          }
        })
        .catch(console.error);
    }
    setShowModal(true);
  };

  const handleOpenEditModal = (prog: WaqfProgramItem) => {
    setEditingProgramId(prog.id);
    const progProv = prog.province || 'Jawa Timur';
    setFormData({
      name: prog.name || '',
      description: prog.description || '',
      bannerUrl: prog.bannerUrl || '/assets/images/wakaf/wakaf-air-bersih-desa-nurul-amanah.png',
      targetAmount: (prog.targetAmount || 0).toString(),
      duration: prog.duration || '60 Hari',
      bankAccount: prog.bankAccount || prog.bankName || 'BSI - 711-889-2234 a.n. YMI ITS',
      province: progProv,
      city: prog.city || 'Kabupaten Bojonegoro',
      locationDetail: prog.locationDetail || '',
      jenisWakaf: prog.jenisWakaf || 'Wakaf Uang',
      kategori: prog.kategori || 'Infrastruktur & Sosial',
      menerimaWakafBarang: prog.menerimaWakafBarang || 'Ya',
      nadzirProfileId: nadzirProfiles[0]?.id || '',
    });

    const matchedProv = provincesList.find(
      (p) => p.nama.toLowerCase() === progProv.toLowerCase()
    );
    if (matchedProv) {
      fetch(`/api/wilayah?provinsiKode=${matchedProv.kode}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setCitiesList(json.data);
        })
        .catch(console.error);
    }
    setShowModal(true);
  };

  const handleBadgeClick = (badge: string) => {
    setFormData((prev) => {
      const isNameEmptyOrDefault = !prev.name.trim() || prev.name.startsWith('Program Wakaf ');
      return {
        ...prev,
        name: isNameEmptyOrDefault ? `Program Wakaf ${badge}` : prev.name,
        kategori: badge,
        description: `Program penghimpunan dana wakaf yang difokuskan pada sektor ${badge} untuk kemaslahatan umat.`,
      };
    });
  };

  // 1. CREATE / EDIT PROGRAM (FULLSTACK)
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      const isWakafUang = formData.jenisWakaf === 'Wakaf Uang';
      const targetDanaNum = parseFloat(formData.targetAmount) || 0;
      const durasiNum = parseInt(formData.duration.replace(/\D/g, ''), 10) || 60;

      if (editingProgramId) {
        // PATCH existing program
        const res = await fetch(`/api/admin/wakaf/programs/${editingProgramId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            judul: formData.name,
            kategori: formData.kategori,
            deskripsi: formData.description,
            targetDana: targetDanaNum,
            durasiHari: durasiNum,
            bannerUrl: formData.bannerUrl,
            jenisWakaf: isWakafUang ? 'PRODUKTIF_KEKAL' : 'HABIS_PAKAI',
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Gagal memperbarui program');
        }

        setPrograms((prev) =>
          prev.map((p) =>
            p.id === editingProgramId
              ? {
                  ...p,
                  name: formData.name,
                  description: formData.description,
                  bannerUrl: formData.bannerUrl,
                  targetAmount: targetDanaNum,
                  duration: `${durasiNum} Hari`,
                  jenisWakaf: formData.jenisWakaf,
                  kategori: formData.kategori,
                  akad: formData.jenisWakaf,
                }
              : p
          )
        );

        showToast({
          title: 'Program Berhasil Diperbarui',
          description: `Data program "${formData.name}" berhasil disimpan ke database.`,
          type: 'success',
        });
      } else {
        // POST new program
        const res = await fetch('/api/admin/wakaf/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            judul: formData.name,
            kategori: formData.kategori,
            deskripsi: formData.description,
            targetDana: targetDanaNum,
            durasiHari: durasiNum,
            bannerUrl: formData.bannerUrl,
            jenisWakaf: isWakafUang ? 'PRODUKTIF_KEKAL' : 'HABIS_PAKAI',
            status: 'LIVE',
            nadzirProfileId: formData.nadzirProfileId || undefined,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Gagal menerbitkan program');
        }

        const data = await res.json();
        const createdProg = data.data;

        const newProgItem: WaqfProgramItem = {
          id: createdProg.id,
          name: createdProg.judul,
          akad: formData.jenisWakaf,
          kategori: createdProg.kategori || formData.kategori,
          targetAmount: Number(createdProg.targetDana),
          collectedAmount: 0,
          availableYield: 0,
          distributedYield: 0,
          description: createdProg.deskripsi || formData.description,
          bannerUrl: createdProg.bannerUrl || formData.bannerUrl,
          duration: `${durasiNum} Hari`,
          bankAccount: formData.bankAccount,
          province: formData.province,
          city: formData.city,
          locationDetail: formData.locationDetail,
          jenisWakaf: formData.jenisWakaf,
          rawJenisWakaf: isWakafUang ? 'PRODUKTIF_KEKAL' : 'HABIS_PAKAI',
          menerimaWakafBarang: formData.menerimaWakafBarang,
          progressFisik: 0,
          status: 'Aktif',
          receipts: [],
          terminList: [],
          yieldList: [],
          wakifList: [],
        };

        setPrograms((prev) => [newProgItem, ...prev]);
        setSelectedProgId(newProgItem.id);

        showToast({
          title: 'Program Berhasil Diterbitkan',
          description: `Program "${formData.name}" siap menerima donasi wakaf (Tersimpan di DB & Ledger Pokok Aktif).`,
          type: 'success',
        });
      }

      setShowModal(false);
    } catch (error: any) {
      showToast({
        title: 'Gagal Menyimpan Program',
        description: error.message || 'Terjadi kesalahan sistem',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. DELETE PROGRAM (FULLSTACK)
  const handleDeleteProgram = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus program "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/wakaf/programs/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus program');
      }

      setPrograms((prev) => prev.filter((p) => p.id !== id));
      if (selectedProgId === id) {
        setSelectedProgId(programs.find((p) => p.id !== id)?.id || '');
      }

      showToast({
        title: 'Program Dihapus',
        description: `Program "${name}" telah dihapus permanen dari sistem.`,
        type: 'info',
      });
    } catch (error: any) {
      showToast({
        title: 'Gagal Menghapus',
        description: error.message || 'Program tidak dapat dihapus',
        type: 'error',
      });
    }
  };

  // 3. SLIDER PROGRESS LOCAL CHANGE
  const handleSliderChange = (progId: string, newProgress: number) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === progId ? { ...p, progressFisik: newProgress } : p))
    );
  };

  // 3b. SAVE PHYSICAL PROGRESS SLIDER (FULLSTACK)
  const handleSaveProgressFisik = async (progId: string) => {
    const prog = programs.find((p) => p.id === progId);
    if (!prog) return;

    const newProgress = prog.progressFisik;
    setIsSavingProgress(true);

    try {
      const res = await fetch(`/api/admin/wakaf/programs/${progId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressFisik: newProgress,
          deskripsi: `Pembaruan progres fisik pembangunan lapangan menjadi ${newProgress}%.`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan progres fisik');
      }

      setSavedProgressMap((prev) => ({ ...prev, [progId]: newProgress }));

      showToast({
        title: 'Progres Fisik Tersimpan',
        description: `Progres fisik berhasil diperbarui menjadi ${newProgress}%.`,
        type: 'success',
      });
    } catch (error: any) {
      showToast({
        title: 'Gagal Simpan Progres',
        description: error.message || 'Gagal memperbarui progres fisik di server',
        type: 'error',
      });
    } finally {
      setIsSavingProgress(false);
    }
  };

  // 4. ADD RECEIPT (FULLSTACK)
  const handleAddReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReceiptTitle.trim() || !newReceiptAmount) return;

    const amountNum = parseFloat(newReceiptAmount) || 0;

    try {
      const res = await fetch(`/api/admin/wakaf/programs/${selectedProgId}/receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newReceiptTitle,
          vendor: newReceiptVendor || 'Mitra Pengadaan Lapangan',
          amount: amountNum,
          fileName: newReceiptFile || 'Kuitansi_Belanja.jpg',
          ocrDetected: true,
          notes: 'Diverifikasi langsung oleh Super Admin Amwal.',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menambahkan kuitansi');
      }

      const data = await res.json();
      const newRcp: ReceiptItem = data.data;

      setPrograms((prev) =>
        prev.map((p) =>
          p.id === selectedProgId ? { ...p, receipts: [newRcp, ...p.receipts] } : p
        )
      );

      showToast({
        title: 'Kuitansi Berhasil Dicatat & Diverifikasi',
        description: `Nota "${newReceiptTitle}" sebesar Rp ${amountNum.toLocaleString('id-ID')} telah tersimpan permanen di database.`,
        type: 'success',
      });

      setNewReceiptTitle('');
      setNewReceiptVendor('');
      setNewReceiptAmount('');
      setReceiptPreviewUrl(null);
    } catch (error: any) {
      showToast({
        title: 'Gagal Menambah Kuitansi',
        description: error.message || 'Terjadi kesalahan sistem',
        type: 'error',
      });
    }
  };

  // 5. SUBMIT DISBURSEMENT REQUEST (FULLSTACK)
  const handleWithdrawFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;

    const amountNum = parseFloat(withdrawAmount) || 0;

    try {
      const res = await fetch('/api/admin/withdrawal-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waqfProgramId: selectedProgram.id,
          amount: amountNum,
          peruntukan: withdrawNote || 'Pencairan Termin Lapangan',
          rekeningTujuan: selectedProgram.bankAccount || selectedProgram.bankName || 'BSI Escrow YMI',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal mengajukan penarikan dana');
      }

      const data = await res.json();
      const newRequest = data.data;

      const newTerminItem: TerminItem = {
        id: newRequest.id,
        programId: selectedProgram.id,
        terminKe: newRequest.peruntukan,
        nominal: Number(newRequest.amount),
        targetRekening: newRequest.rekeningTujuan,
        status: 'Menunggu Verifikasi DPS',
        rawStatus: 'PENDING',
        adminNotes: '',
        tanggalPengajuan: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        dokumen: 'SPK_Pencairan_Baru.pdf',
        requestedBy: 'Super Admin',
      };

      setPrograms((prev) =>
        prev.map((p) =>
          p.id === selectedProgram.id
            ? { ...p, terminList: [newTerminItem, ...(p.terminList || [])] }
            : p
        )
      );

      setShowWithdrawModal(false);
      showToast({
        title: 'Pengajuan Penarikan Dana Terkirim',
        description: `Pengajuan Rp ${amountNum.toLocaleString('id-ID')} telah tercatat di sistem pengawasan termin escrow.`,
        type: 'success',
      });

      setWithdrawAmount('');
      setWithdrawNote('');
    } catch (error: any) {
      showToast({
        title: 'Gagal Mengajukan Penarikan',
        description: error.message || 'Terjadi kesalahan sistem',
        type: 'error',
      });
    }
  };

  // 6. APPROVE WITHDRAWAL REQUEST (FULLSTACK)
  const handleApproveWithdrawal = async (withdrawalId: string) => {
    try {
      const res = await fetch(`/api/admin/withdrawal-requests/${withdrawalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyetujui penarikan');
      }

      setPrograms((prev) =>
        prev.map((p) => ({
          ...p,
          terminList: (p.terminList || []).map((t) =>
            t.id === withdrawalId ? { ...t, status: 'Selesai Dicairkan', rawStatus: 'APPROVED' } : t
          ),
        }))
      );

      showToast({
        title: 'Pencairan Dana Disetujui',
        description: 'Pengajuan penarikan dana berhasil disetujui & mutasi kas escrow telah diperbarui.',
        type: 'success',
      });
    } catch (error: any) {
      showToast({
        title: 'Gagal Menyetujui',
        description: error.message || 'Terjadi kesalahan sistem',
        type: 'error',
      });
    }
  };

  // 7. REJECT WITHDRAWAL REQUEST (FULLSTACK)
  const handleRejectWithdrawalConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawalId || !rejectReason.trim()) {
      showToast({
        title: 'Alasan Penolakan Wajib Diisi',
        description: 'Mohon tuliskan alasan audit penolakan termin.',
        type: 'warning',
      });
      return;
    }

    try {
      const res = await fetch(`/api/admin/withdrawal-requests/${selectedWithdrawalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          adminNotes: rejectReason.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menolak penarikan');
      }

      setPrograms((prev) =>
        prev.map((p) => ({
          ...p,
          terminList: (p.terminList || []).map((t) =>
            t.id === selectedWithdrawalId
              ? { ...t, status: 'Ditolak', rawStatus: 'REJECTED', adminNotes: rejectReason.trim() }
              : t
          ),
        }))
      );

      setRejectModalOpen(false);
      setSelectedWithdrawalId(null);
      setRejectReason('');

      showToast({
        title: 'Pengajuan Penarikan Ditolak',
        description: 'Status pengajuan termin telah diperbarui menjadi REJECTED.',
        type: 'info',
      });
    } catch (error: any) {
      showToast({
        title: 'Gagal Menolak',
        description: error.message || 'Terjadi kesalahan sistem',
        type: 'error',
      });
    }
  };

  // 8. RECORD WAQF YIELD ENTRY (FULLSTACK)
  const handleRecordYield = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yieldAmount || !yieldDescription.trim()) return;

    const amountNum = parseFloat(yieldAmount) || 0;

    try {
      const res = await fetch(`/api/admin/wakaf/programs/${selectedProgram.id}/yield-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          sourceDescription: yieldDescription.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal mencatat bagi hasil wakaf');
      }

      const data = await res.json();
      const newEntry = data.data;

      const newYieldItem: YieldItem = {
        id: newEntry.id,
        programId: selectedProgram.id,
        nominal: Number(newEntry.amount),
        sourceDescription: newEntry.sourceDescription,
        recordedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      };

      setPrograms((prev) =>
        prev.map((p) =>
          p.id === selectedProgram.id
            ? {
                ...p,
                availableYield: (p.availableYield || 0) + amountNum,
                yieldList: [newYieldItem, ...(p.yieldList || [])],
              }
            : p
        )
      );

      setShowYieldModal(false);
      setYieldAmount('');
      setYieldDescription('');

      showToast({
        title: 'Bagi Hasil Berhasil Dicatat',
        description: `Surplus hasil investasi sebesar Rp ${amountNum.toLocaleString('id-ID')} telah masuk ke totalHasilAvailable.`,
        type: 'success',
      });
    } catch (error: any) {
      showToast({
        title: 'Gagal Mencatat Bagi Hasil',
        description: error.message || 'Terjadi kesalahan sistem',
        type: 'error',
      });
    }
  };

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchProgramQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchProgramQuery.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchProgramQuery.toLowerCase());
    const matchesAkad = filterAkad === 'SEMUA' || p.jenisWakaf === filterAkad;
    return matchesSearch && matchesAkad;
  });

  const selectedProgram = programs.find((p) => p.id === selectedProgId) || programs[0];

  const currentTerminList = selectedProgram?.terminList || [];
  const currentYieldList = selectedProgram?.yieldList || [];
  const currentWakifList = selectedProgram?.wakifList || [];

  return (
    <div className="space-y-6 px-4 sm:px-6 py-6 max-w-7xl mx-auto font-jakarta">
      {/* ========================================================================= */}
      {/* 1. HALAMAN UTAMA: DAFTAR PROGRAM WAKAF & KELOLA                           */}
      {/* ========================================================================= */}
      {activeView === 'main' && (
        <>
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-800" />
                  Manajemen &amp; Pengawasan Program Wakaf
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Pusat pembuatan program baru, pemantauan slider progres fisik lapangan, upload kuitansi digital, dan tata kelola termin escrow BSI.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2.5 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan Program Baru</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Program Aktif</span>
                  <span className="text-lg font-extrabold text-emerald-950">{programs.length} Proyek</span>
                </div>
                <Layers className="w-7 h-7 text-emerald-600/40" />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase block">Target Penghimpunan</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    Rp {programs.reduce((acc, p) => acc + p.targetAmount, 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <Landmark className="w-7 h-7 text-slate-400/40" />
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase block">Terkumpul Nyata (Ledger Pokok)</span>
                  <span className="text-lg font-extrabold text-amber-950 font-mono">
                    Rp {programs.reduce((acc, p) => acc + p.collectedAmount, 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <DollarSign className="w-7 h-7 text-amber-600/40" />
              </div>
            </div>
          </div>

          {/* Program List Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-800" />
                  Daftar Program Wakaf Terkelola ({filteredPrograms.length} Program)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih program untuk membuka workbench manajemen progres fisik, kuitansi belanja digital, dan termin kas escrow.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari program / lokasi..."
                    value={searchProgramQuery}
                    onChange={(e) => setSearchProgramQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700 w-48 sm:w-56"
                  />
                </div>

                <select
                  value={filterAkad}
                  onChange={(e) => setFilterAkad(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="SEMUA">Semua Akad Wakaf</option>
                  <option value="Wakaf Uang">Wakaf Uang (Produktif)</option>
                  <option value="Wakaf Melalui Uang">Wakaf Melalui Uang (Habis Pakai)</option>
                </select>
              </div>
            </div>

            {/* List of Programs Grid */}
            {filteredPrograms.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Belum ada program wakaf yang cocok dengan kriteria pencarian.</p>
                <p className="text-[11px] text-slate-500 mt-1">Klik tombol &ldquo;Terbitkan Program Baru&rdquo; untuk menambahkan program wakaf pertama.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrograms.map((prog) => {
                  const isSelected = prog.id === selectedProgId;
                  const pct =
                    prog.targetAmount > 0
                      ? Math.min(100, Math.round((prog.collectedAmount / prog.targetAmount) * 100))
                      : 0;

                  return (
                    <div
                      key={prog.id}
                      onClick={() => setSelectedProgId(prog.id)}
                      className={`bg-white border rounded-2xl overflow-hidden p-4 transition flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer ${
                        isSelected
                          ? 'border-[#1B5E20] ring-2 ring-[#1B5E20]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        {/* Banner Image Display */}
                        <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                          <Image
                            src={prog.bannerUrl}
                            alt={prog.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                            {prog.jenisWakaf}
                          </div>
                          <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-800/95 text-white backdrop-blur-xs flex items-center gap-1 shadow-2xs">
                            <Sliders className="w-3 h-3 text-emerald-200" />
                            <span>Fisik: {prog.progressFisik}%</span>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5 leading-snug">
                          {prog.name}
                        </h4>

                        {/* Info Highlights */}
                        <div className="space-y-1.5 text-[11px] text-slate-600 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Target Dana:</span>
                            <strong className="text-slate-900">Rp {prog.targetAmount.toLocaleString('id-ID')}</strong>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Terkumpul:</span>
                            </span>
                            <span className="font-semibold text-emerald-800 flex items-center gap-1">
                              <span>Rp {prog.collectedAmount.toLocaleString('id-ID')}</span>
                              <span className="font-mono text-[10px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                                Dana: {pct}%
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Durasi:</span>
                            <span className="text-slate-700">
                              {prog.durationStart && prog.durationEnd
                                ? `${prog.durationStart} - ${prog.durationEnd}`
                                : prog.duration}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Lokasi:</span>
                            <span className="text-slate-700 truncate max-w-[140px]">{prog.city}, {prog.province}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Rekening:</span>
                            <span className="font-mono text-[10px] text-slate-700">{prog.bankAccount || prog.bankName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                        <span
                          className="text-slate-500 flex items-center gap-1 truncate max-w-[130px]"
                          title={prog.supportingDoc || 'Dokumen_Legalitas.pdf'}
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{prog.supportingDoc || 'Dokumen_Legalitas.pdf'}</span>
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProgId(prog.id);
                              setActiveView('detail');
                            }}
                            className="px-3 py-1.5 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Kelola Progres</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(prog);
                            }}
                            title="Edit Program"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProgram(prog.id, prog.name);
                            }}
                            title="Hapus Program"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. HALAMAN DEDIKASI KELOLA PROGRAM (DETAIL WORKBENCH VIEW)                */}
      {/* ========================================================================= */}
      {activeView === 'detail' && selectedProgram && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Breadcrumb / Back to List Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView('main')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-[#1B5E20]" />
                <span>Kembali ke Daftar Program</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[260px] sm:max-w-md">
                {selectedProgram.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">ID Program:</span>
              <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {selectedProgram.id}
              </span>
            </div>
          </div>

          {/* Workbench: Kelola Per Program Terpilih */}
          <div className="bg-white border-2 border-emerald-800/30 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Program Aktif Terpilih
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedProgram.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID: {selectedProgram.id} • {selectedProgram.city}, {selectedProgram.province} • {selectedProgram.jenisWakaf} • Rekening: {selectedProgram.bankName || selectedProgram.bankAccount}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(selectedProgram.rawJenisWakaf === 'PRODUKTIF_KEKAL' || selectedProgram.jenisWakaf === 'Wakaf Uang') && (
                  <button
                    type="button"
                    onClick={() => setShowYieldModal(true)}
                    className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                    <span>Catat Bagi Hasil Wakaf</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <DollarSign className="w-4 h-4 text-slate-950" />
                  <span>Ajukan Penarikan Dana</span>
                </button>
              </div>
            </div>

            {/* Slider Progres Fisik Pembangunan Proyek (0% - 100%) */}
            {(() => {
              const lastSaved = savedProgressMap[selectedProgram.id] ?? selectedProgram.progressFisik;
              const isDirty = selectedProgram.progressFisik !== lastSaved;

              return (
                <div className="p-5 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-slate-50 border border-emerald-200/80 rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#1B5E20]" />
                      <span className="text-xs font-bold text-slate-900">
                        Slider Progres Fisik Pembangunan Proyek (0% - 100%)
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xl font-extrabold text-[#1B5E20] font-mono">
                        {selectedProgram.progressFisik}%
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-800 text-white font-bold">
                        {selectedProgram.progressFisik >= 80
                          ? 'Tahap Akhir'
                          : selectedProgram.progressFisik >= 50
                          ? 'Konstruksi Berjalan'
                          : 'Fondasi & Awal'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSaveProgressFisik(selectedProgram.id)}
                        disabled={!isDirty || isSavingProgress}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs ${
                          isDirty && !isSavingProgress
                            ? 'bg-[#1B5E20] hover:bg-[#144716] text-white ring-2 ring-emerald-500/40 cursor-pointer animate-pulse'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isSavingProgress ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-800" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{isDirty ? 'Simpan Progres Fisik' : 'Progres Tersimpan'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={selectedProgram.progressFisik}
                    onChange={(e) =>
                      handleSliderChange(selectedProgram.id, parseInt(e.target.value, 10) || 0)
                    }
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B5E20]"
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>0% (Tahap Pengadaan/Perizinan)</span>
                    <span>50% (Pengerjaan Struktur)</span>
                    <span>100% (Serah Terima / Rampung)</span>
                  </div>
                </div>
              );
            })()}

            {/* Sub-Tab Navigation Bar in Program Detail */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setWorkbenchTab('receipts')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'receipts'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Kuitansi Belanja Digital ({selectedProgram.receipts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setWorkbenchTab('termin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'termin'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>
                  Pencairan Termin &amp; Kas Escrow ({currentTerminList.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setWorkbenchTab('wakif')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'wakif'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  Daftar Wakif &amp; Kabar WA ({currentWakifList.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setWorkbenchTab('bwi')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  workbenchTab === 'bwi'
                    ? 'bg-[#1B5E20] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Laporan Semester BWI (UU 41/2004)</span>
              </button>
            </div>

            {/* SUB-TAB 1: KUITANSI BELANJA DIGITAL */}
            {workbenchTab === 'receipts' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleAddReceipt}
                  className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-[#1B5E20]" />
                      <span>Form Unggah Bukti Nota / Kuitansi Belanja Digital</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Verifikasi Dokumen Transparan</span>
                  </div>

                  <input
                    type="file"
                    ref={receiptFileInputRef}
                    accept="image/*,application/pdf"
                    onChange={handleReceiptFileSelect}
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 block mb-1">
                        Nama Nota / Pengeluaran Belanja *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Pengadaan Material Semen & Pasir Cor"
                        value={newReceiptTitle}
                        onChange={(e) => setNewReceiptTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nominal (Rp) *</label>
                      <input
                        type="number"
                        placeholder="5550000"
                        value={newReceiptAmount}
                        onChange={(e) => setNewReceiptAmount(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nama Vendor / Toko</label>
                      <input
                        type="text"
                        placeholder="Contoh: TB Berkah Bangunan Mandiri"
                        value={newReceiptVendor}
                        onChange={(e) => setNewReceiptVendor(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden text-slate-900 bg-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => receiptFileInputRef.current?.click()}
                          className="px-3 py-2 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Pilih File Kuitansi</span>
                        </button>
                        <span className="text-[11px] truncate font-mono text-slate-600 font-semibold grow">
                          {newReceiptFile}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1 border-t border-slate-200">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white font-bold text-xs transition cursor-pointer shadow-xs"
                    >
                      Tambah Kuitansi
                    </button>
                  </div>

                  {receiptPreviewUrl && (
                    <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 flex items-center gap-3">
                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-300 shadow-xs">
                        <Image
                          src={receiptPreviewUrl}
                          alt="Preview Kuitansi"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">Preview Berkas Kuitansi</span>
                        <span className="text-[10px] text-slate-500 font-mono">{newReceiptFile}</span>
                      </div>
                    </div>
                  )}
                </form>

                {/* Table of uploaded receipts */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-slate-600" />
                      Daftar Kuitansi &amp; Nota Belanja Digital Terunggah ({selectedProgram.receipts.length} Berkas)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Total Realisasi Belanja:{' '}
                      <strong>
                        Rp{' '}
                        {selectedProgram.receipts
                          .reduce((acc, r) => acc + r.amount, 0)
                          .toLocaleString('id-ID')}
                      </strong>
                    </span>
                  </div>

                  {selectedProgram.receipts.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                      Belum ada kuitansi yang diunggah untuk program ini. Gunakan formulir di atas untuk mengunggah kuitansi belanja digital.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Judul Pengeluaran / Nota</th>
                            <th className="py-3 px-4">Vendor</th>
                            <th className="py-3 px-4">Tanggal Nota</th>
                            <th className="py-3 px-4">Nominal (Rp)</th>
                            <th className="py-3 px-4">Berkas Lampiran</th>
                            <th className="py-3 px-4 text-center">Status Verifikasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {selectedProgram.receipts.map((rcp) => (
                            <tr key={rcp.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3 px-4 font-bold text-slate-900">
                                {rcp.title}
                              </td>
                              <td className="py-3 px-4 text-slate-600 text-[11px]">
                                {rcp.vendor || '-'}
                              </td>
                              <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                                {rcp.date}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                                Rp {rcp.amount.toLocaleString('id-ID')}
                              </td>
                              <td className="py-3 px-4 text-blue-700 font-mono text-[11px]">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-blue-600" />
                                  {rcp.fileName}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">
                                  {rcp.status || 'Terverifikasi Super Admin'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 2: PENCAIRAN TERMIN & KAS ESCROW */}
            {workbenchTab === 'termin' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Pokok Dana Terkumpul
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono block mt-1">
                      Rp {selectedProgram.collectedAmount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                      Target: Rp {selectedProgram.targetAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Dana Telah Dicairkan
                    </span>
                    <span className="text-sm font-extrabold text-emerald-950 font-mono block mt-1">
                      Rp{' '}
                      {currentTerminList
                        .filter((t) => t.rawStatus === 'APPROVED' || t.status.includes('Selesai'))
                        .reduce((acc, t) => acc + t.nominal, 0)
                        .toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                      {currentTerminList.filter((t) => t.rawStatus === 'APPROVED' || t.status.includes('Selesai')).length} Termin Selesai
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">
                      Hasil Investasi Tersedia
                    </span>
                    <span className="text-sm font-extrabold text-blue-950 font-mono block mt-1">
                      Rp {(selectedProgram.availableYield || 0).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold mt-0.5 block">
                      Tersalurkan: Rp {(selectedProgram.distributedYield || 0).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">
                      Realisasi Belanja Kuitansi
                    </span>
                    <span className="text-sm font-extrabold text-amber-950 font-mono block mt-1">
                      Rp{' '}
                      {selectedProgram.receipts
                        .reduce((acc, r) => acc + r.amount, 0)
                        .toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
                      Tervalidasi Super Admin
                    </span>
                  </div>
                </div>

                {/* Bagi Hasil Wakaf Produktif Section if applicable */}
                {currentYieldList.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-700" />
                      Riwayat Pencatatan Bagi Hasil Wakaf Produktif (WaqfYieldEntry)
                    </h4>
                    <div className="overflow-x-auto border border-emerald-200 bg-white rounded-lg">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-emerald-50/70 text-emerald-900 font-semibold border-b border-emerald-200">
                          <tr>
                            <th className="py-2.5 px-3">Sumber Pendapatan / Usaha</th>
                            <th className="py-2.5 px-3">Tanggal Catat</th>
                            <th className="py-2.5 px-3 text-right">Nominal Hasil (Rp)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-100 text-slate-700">
                          {currentYieldList.map((ye) => (
                            <tr key={ye.id}>
                              <td className="py-2 px-3 font-semibold text-slate-900">{ye.sourceDescription}</td>
                              <td className="py-2 px-3 text-slate-500">{ye.recordedAt}</td>
                              <td className="py-2 px-3 text-right font-bold text-emerald-900 font-mono">
                                + Rp {ye.nominal.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-[#1B5E20]" />
                      Riwayat Pengajuan &amp; Termin Pencairan Dana Proyek ({currentTerminList.length} Pengajuan)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pencairan dana dilakukan bertahap sesuai SPK &amp; Berita Acara Progres Fisik dengan pengawasan DPS &amp; Super Admin.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ajukan Pencairan Termin Baru</span>
                  </button>
                </div>

                {currentTerminList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    Belum ada pengajuan termin pencairan dana untuk program ini.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Tahap / Termin</th>
                          <th className="py-3 px-4">Nominal Pencairan</th>
                          <th className="py-3 px-4">Rekening Tujuan</th>
                          <th className="py-3 px-4">Tgl Pengajuan</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center">Aksi Verifikasi Super Admin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentTerminList.map((t) => {
                          const isPending = t.rawStatus === 'PENDING' || t.status.includes('Menunggu');

                          return (
                            <tr key={t.id} className="hover:bg-slate-50/70 transition">
                              <td className="py-3 px-4 font-bold text-slate-900">
                                {t.terminKe}
                                <span className="block text-[10px] text-slate-400 font-mono font-normal">
                                  ID: {t.id}
                                </span>
                                {t.adminNotes && (
                                  <span className="block text-[10px] text-rose-600 italic mt-0.5">
                                    Catatan: {t.adminNotes}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-extrabold text-slate-900 font-mono">
                                Rp {t.nominal.toLocaleString('id-ID')}
                              </td>
                              <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                                {t.targetRekening}
                              </td>
                              <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                                {t.tanggalPengajuan}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                                    t.status.includes('Selesai') || t.rawStatus === 'APPROVED'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                      : t.status.includes('Ditolak') || t.rawStatus === 'REJECTED'
                                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                                      : 'bg-amber-100 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {isPending ? (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleApproveWithdrawal(t.id)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-2xs cursor-pointer"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Setujui</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedWithdrawalId(t.id);
                                        setRejectReason('');
                                        setRejectModalOpen(true);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                      <span>Tolak</span>
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400 font-medium">Telah Diproses</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 3: DAFTAR WAKIF & KABAR PROGRES WA */}
            {workbenchTab === 'wakif' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-[#1B5E20]" />
                      Daftar Wakif &amp; Layanan Silaturahmi Progres Pembangunan ({currentWakifList.length} Donatur)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Kirim update laporan progres pembangunan {selectedProgram.progressFisik}% langsung ke WhatsApp Wakif dan cetak Akta Ikrar Wakaf (AIW).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast({
                        title: 'Siarkan Progres ke Semua Wakif',
                        description: `Notifikasi WhatsApp update progres fisik ${selectedProgram.progressFisik}% telah dijadwalkan ke ${currentWakifList.length} wakif terdaftar.`,
                        type: 'success',
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Siarkan Update WA ({selectedProgram.progressFisik}%)</span>
                  </button>
                </div>

                {currentWakifList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    Belum ada transaksi wakaf terverifikasi untuk program ini.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Nama Wakif / Donatur</th>
                          <th className="py-3 px-4">Nominal Wakaf</th>
                          <th className="py-3 px-4">Akad Wakaf</th>
                          <th className="py-3 px-4">No. Kwitansi / AIW</th>
                          <th className="py-3 px-4">Status Sertifikat</th>
                          <th className="py-3 px-4 text-center">Aksi Silaturahmi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentWakifList.map((w) => (
                          <tr key={w.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">{w.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {w.phone} • Tgl: {w.tanggal}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                              Rp {w.nominal.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {w.akad}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                              {w.sertifikatNo}
                              {w.nomorKwitansi && (
                                <span className="block text-[10px] text-slate-400">
                                  Kwitansi: {w.nomorKwitansi}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {w.statusSertifikat}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    showToast({
                                      title: 'Notifikasi WhatsApp Dikirim',
                                      description: `Pesan update progres fisik ${selectedProgram.progressFisik}% berhasil dikirim ke ${w.name} (${w.phone}).`,
                                      type: 'success',
                                    })
                                  }
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition shadow-2xs"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Kabar WA</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    showToast({
                                      title: 'Akta Ikrar Wakaf (AIW)',
                                      description: `Membuka sertifikat resmi ${w.sertifikatNo} a.n. ${w.name}...`,
                                      type: 'info',
                                    })
                                  }
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                                >
                                  <FileText className="w-3 h-3 text-slate-500" />
                                  <span>Cetak AIW</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 4: LAPORAN SEMESTER BWI */}
            {workbenchTab === 'bwi' && (
              <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
                      Format Pelaporan Berkala Semesteran Badan Wakaf Indonesia (BWI)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kewajiban pelaporan berkala 6 bulan sekali sesuai amanat UU No. 41 Tahun 2004 &amp; Peraturan BWI No. 4 Tahun 2010.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showToast({
                        title: 'Unduh Laporan BWI',
                        description: 'Menyiapkan berkas PDF Laporan Semester I BWI...',
                        type: 'info',
                      })
                    }
                    className="px-4 py-2 bg-[#1B5E20] hover:bg-[#144716] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Dokumen Laporan BWI (PDF)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Status Nazhir Terdaftar</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      {selectedProgram.bankAccountHolder || 'Yayasan Manarul Ilmi ITS (YMI ITS)'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700">
                      No. Registrasi: BWI.3.1.0028/2024
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">Periode Pelaporan</span>
                    <span className="font-bold text-slate-900 block mt-0.5">
                      Semester I - 2026 (Jan - Jun 2026)
                    </span>
                    <span className="text-[10px] text-slate-500">Status: Lengkap &amp; Siap Submit</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">
                      Pemeriksaan Dewan Pengawas Syariah
                    </span>
                    <span className="font-bold text-emerald-800 block mt-0.5">Opini Syariah Terpenuhi (WTP)</span>
                    <span className="text-[10px] text-slate-500">DPS: Dewan Pengawas Syariah YMI ITS</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Komponen Rekapitulasi Pelaporan:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    <li>
                      Daftar seluruh penghimpunan wakaf uang &amp; wakaf melalui uang:{' '}
                      <strong>Rp {selectedProgram.collectedAmount.toLocaleString('id-ID')}</strong>
                    </li>
                    <li>
                      Realisasi belanja operasional dan fisik proyek:{' '}
                      <strong>
                        Rp{' '}
                        {selectedProgram.receipts
                          .reduce((acc, r) => acc + r.amount, 0)
                          .toLocaleString('id-ID')}
                      </strong>
                    </li>
                    <li>
                      Progres capaian fisik konstruksi: <strong>{selectedProgram.progressFisik}%</strong>
                    </li>
                    <li>
                      Sertifikat Akta Ikrar Wakaf (AIW) terbit:{' '}
                      <strong>{currentWakifList.length} Lembar Resmi</strong>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL FORM PEMBUATAN / EDIT PROGRAM BARU */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-800" />
                  {editingProgramId ? 'Edit Program Wakaf' : 'Form Pembuatan Program Baru'}
                </h3>
                <p className="text-xs text-slate-500">Lengkapi data program untuk diterbitkan di Amwal Platform &amp; PostgreSQL DB</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto grow">
              {/* Filter Badges */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Rekomendasi Kata Kunci Instan:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Infrastruktur & Sosial', 'Pendidikan & Dakwah', 'Kesehatan', 'Air Bersih', 'Agrobisnis', 'Masjid'].map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => handleBadgeClick(badge)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold transition shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>+ {badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Program & Deskripsi */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Nama Program *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Wakaf Pembangunan Gedung Asrama Tahfidz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Deskripsi Lengkap *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan tujuan program, manfaat bagi jamaah/dhuafa, dan rencana alokasi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900"
                />
              </div>

              {/* Nadzir Profile Selector */}
              {nadzirProfiles.length > 0 && (
                <div>
                  <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" /> Lembaga Nadzir Pengelola
                  </label>
                  <select
                    value={formData.nadzirProfileId}
                    onChange={(e) => setFormData({ ...formData, nadzirProfileId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white"
                  >
                    {nadzirProfiles.map((np) => (
                      <option key={np.id} value={np.id}>
                        {np.namaLembaga || 'Yayasan Manarul Ilmi ITS (YMI ITS)'} ({np.namaBank || 'BSI'} - {np.nomorRekeningBank || 'Rekening Operasional'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Unggah Banner dengan Tombol Pilih File & Live Preview Gambar */}
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Eye className="w-4 h-4 text-emerald-800" />
                    <span>Unggah Banner Program &amp; Live Preview Gambar *</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Rekomendasi 1200x630 (16:9)</span>
                </div>

                <input
                  type="file"
                  ref={bannerFileInputRef}
                  accept="image/*"
                  onChange={handleBannerFileSelect}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  <div className="space-y-2">
                    <div
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 p-3.5 rounded-xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group shadow-2xs"
                    >
                      <div className="p-2 rounded-full bg-emerald-100 group-hover:bg-emerald-200 text-emerald-800 transition">
                        <Upload className="w-4 h-4 text-emerald-800" />
                      </div>
                      <div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs inline-block shadow-2xs mb-1">
                          Pilih File Gambar Banner
                        </span>
                        <p className="text-[11px] text-slate-600">
                          Klik untuk memilih dari HP/Komputer atau seret file ke sini
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        PNG, JPG, WEBP (Maks. 5MB)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 shrink-0">Atau Link URL:</span>
                      <input
                        type="text"
                        placeholder="https://domain.com/banner.jpg"
                        value={formData.bannerUrl}
                        onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-800 text-slate-900 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Banner Preview */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-emerald-700" /> Preview Gambar Banner
                      </span>
                      {formData.bannerUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, bannerUrl: '' })}
                          className="text-rose-600 hover:text-rose-800 font-bold text-[10px] cursor-pointer"
                        >
                          Hapus Banner
                        </button>
                      )}
                    </div>

                    {formData.bannerUrl ? (
                      <div className="aspect-[16/9] w-full max-h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
                        <img
                          src={formData.bannerUrl}
                          alt="Preview Banner Program"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => bannerFileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-900 font-bold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 text-emerald-800" /> Ganti Gambar
                          </button>
                        </div>
                        <span className="absolute bottom-2 left-2 bg-slate-900/75 text-white text-[11px] px-2.5 py-1 rounded">
                          Preview Gambar Siap Terbit
                        </span>
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-full max-h-52 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1 text-[11px]">
                        <Eye className="w-6 h-6 text-slate-300" />
                        <span>Belum Ada File Gambar Dipilih</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Target Dana, Durasi, Rekening Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Target Dana (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 500000000"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" /> Durasi Program
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 60 Hari"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" /> Rekening Bank
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: BSI - 711-889-2234 a.n. YMI"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900"
                  />
                </div>
              </div>

              {/* Dropdown: Lokasi, Jenis Wakaf, Kategori */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Pilihan Lokasi &amp; Klasifikasi Program
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Provinsi</label>
                    <select
                      value={formData.province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white"
                    >
                      <option value="">-- Pilih Provinsi --</option>
                      {provincesList.map((p) => (
                        <option key={p.kode} value={p.nama}>
                          {p.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kabupaten / Kota</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      disabled={!formData.province || isLoadingCities}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white disabled:opacity-60"
                    >
                      <option value="">{isLoadingCities ? 'Memuat Kab/Kota...' : '-- Pilih Kabupaten / Kota --'}</option>
                      {citiesList.map((c) => (
                        <option key={c.kode} value={c.nama}>
                          {c.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Detail Alamat / Lokasi</label>
                    <input
                      type="text"
                      placeholder="Kampus Sukolilo ITS Surabaya"
                      value={formData.locationDetail}
                      onChange={(e) => setFormData({ ...formData, locationDetail: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Akad / Jenis Wakaf</label>
                    <select
                      value={formData.jenisWakaf}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jenisWakaf: e.target.value as 'Wakaf Uang' | 'Wakaf Melalui Uang',
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white"
                    >
                      <option value="Wakaf Uang">Wakaf Uang (Produktif Kekal)</option>
                      <option value="Wakaf Melalui Uang">Wakaf Melalui Uang (Habis Pakai)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kategori Program</label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-800 focus:outline-hidden text-slate-900 font-semibold bg-white"
                    >
                      <option value="Infrastruktur & Sosial">Infrastruktur &amp; Sosial</option>
                      <option value="Pendidikan & Dakwah">Pendidikan &amp; Dakwah</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Air Bersih">Air Bersih</option>
                      <option value="Agrobisnis">Agrobisnis</option>
                      <option value="Masjid">Masjid</option>
                      <option value="Wakaf Produktif & Agrobisnis">Wakaf Produktif &amp; Agrobisnis</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isLoading ? 'Menyimpan...' : editingProgramId ? 'Simpan Perubahan' : 'Terbitkan Program'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJUKAN PENARIKAN DANA */}
      {showWithdrawModal && selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                Pengajuan Penarikan Dana Termin
              </h3>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawFunds} className="p-4 sm:p-5 space-y-3 text-xs overflow-y-auto grow">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Program:</span>
                <span className="font-bold text-slate-900 block">{selectedProgram.name}</span>
                <span className="text-slate-500 block mt-1">Rekening Tujuan:</span>
                <span className="font-mono font-bold text-emerald-800 block">
                  {selectedProgram.bankAccount || selectedProgram.bankName || 'BSI Escrow YMI'}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Nominal Penarikan Dana (Rp) *</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 15000000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-900 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Tahap / Peruntukan Alokasi *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Penjelasan peruntukan pencairan (misal: Termin II - Pengadaan Pipa & Pengecoran Lantai)..."
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Kirim Pengajuan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TOLAK PENARIKAN DANA DENGAN ALASAN */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-base text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                Tolak Pengajuan Penarikan Dana
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectWithdrawalConfirm} className="p-4 sm:p-5 space-y-3 text-xs overflow-y-auto grow">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-[11px]">
                Sesuai audit syariah, pengajuan penarikan dana yang ditolak <strong>wajib mencantumkan alasan penolakan</strong> secara transparan.
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Alasan Penolakan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Dokumen BAP progres fisik belum diverifikasi Dewan Pengawas Syariah / Kuitansi belanja belum sesuai..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-hidden text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Konfirmasi Penolakan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CATAT BAGI HASIL WAKAF PRODUKTIF */}
      {showYieldModal && selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-800" />
                Pencatatan Bagi Hasil Wakaf Produktif
              </h3>
              <button
                type="button"
                onClick={() => setShowYieldModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordYield} className="p-4 sm:p-5 space-y-3 text-xs overflow-y-auto grow">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px]">
                Dana hasil usaha/investasi akan dicatat ke <strong>WaqfYieldEntry</strong> dan meng-increment <strong>totalHasilAvailable</strong> pada WaqfPrincipalLedger (pokok dana tetap utuh).
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Nominal Surplus Hasil (Rp) *</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 7500000"
                  value={yieldAmount}
                  onChange={(e) => setYieldAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden text-slate-900 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Sumber Pendapatan / Penjelasan Usaha *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Hasil panen pisang cavendish siklus I atau deviden sewa lahan produktif..."
                  value={yieldDescription}
                  onChange={(e) => setYieldDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowYieldModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1B5E20] hover:bg-[#144716] text-white font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan ke Ledger Hasil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
