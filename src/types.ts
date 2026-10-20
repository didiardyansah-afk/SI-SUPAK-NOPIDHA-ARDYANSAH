export interface SchoolSettings {
  namaSekolah: string;
  npsn: string;
  akreditasi: string;
  statusSekolah: string;
  jenjang: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  pengawas: string;
  nipPengawas: string;
  kopBaris1?: string;
  kopBaris2?: string;
  logoUrl?: string;
  semester: 'Ganjil' | 'Genap';
  tahunPelajaran: string;
  isCustomized: boolean;
}

export interface DeveloperInfo {
  nama: string;
  gelar: string;
  jabatan: string;
  sekolah: string;
  kabupaten: string;
  provinsi: string;
}

export interface TeacherDocument {
  id: string;
  name: string;
  type: 'Modul Ajar' | 'RPP' | 'Bahan Ajar' | 'LKPD' | 'Instrumen Asesmen' | 'Lainnya';
  size: string;
  uploadDate: string;
  dataUrl?: string;
}

export interface PraObservasiItem {
  id: number;
  komponen: string;
  indikator: string;
  ada: boolean | null;
  catatan: string;
}

export interface PraObservasiWawancara {
  id: number;
  pertanyaan: string;
  respon: string;
}

export interface PraObservasiData {
  tanggal: string;
  kelas: string;
  materiPokok: string;
  items: PraObservasiItem[];
  wawancara: PraObservasiWawancara[];
  kelebihan: string;
  perluDitingkatkan: string;
  rekomendasi: string;
  catatanSupervisor: string;
  skorPersentase: number;
  predikat: string;
  savedAt?: string;
}

export interface ObservasiItem {
  id: string;
  kategori: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  namaKategori: string;
  indikator: string;
  skor: number; // 1 to 4
  buktiPembelajaran: string;
  catatan: string;
}

export interface ObservasiData {
  tanggal: string;
  kelas: string;
  materiPokok: string;
  items: ObservasiItem[];
  skorTotal: number;
  skorMaksimal: number;
  persentase: number;
  predikat: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  catatanSupervisor: string;
  rekomendasi: string;
  tindakLanjut: string;
  savedAt?: string;
}

export interface PascaObservasiData {
  tanggal: string;
  kelas: string;
  materiPokok: string;
  refleksiGuru: {
    id: number;
    pertanyaan: string;
    respon: string;
  }[];
  umpanBalik: {
    id: number;
    aspek: string;
    apresiasi: string;
    areaPengembangan: string;
  }[];
  rencanaTindakLanjut: {
    id: number;
    aspek: string;
    tindakLanjut: string;
    penanggungJawab: string;
    waktuPelaksanaan: string;
  }[];
  catatanSupervisor: string;
  kesepakatanBersama: string;
  savedAt?: string;
}

export interface Teacher {
  id: string;
  nama: string;
  nip: string;
  pangkatGolongan: string;
  mapel: string;
  kelas: string;
  materiPokok: string;
  tglPraObservasi: string;
  tglObservasi: string;
  tglPascaObservasi: string;
  status: 'Belum' | 'Sedang Berjalan' | 'Selesai';
  documents: TeacherDocument[];
  praObservasiData?: PraObservasiData;
  observasiData?: ObservasiData;
  pascaObservasiData?: PascaObservasiData;
}

export interface TindakLanjutProgram {
  id: string;
  teacherId: string;
  namaGuru: string;
  mapel: string;
  aspekPengembangan: string;
  bentukTindakLanjut: string;
  targetWaktu: string;
  penanggungJawab: string;
  evaluasiHasil: string;
  status: 'Direncanakan' | 'Dalam Proses' | 'Tercapai';
}
