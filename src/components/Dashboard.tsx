import React from 'react';
import { useApp } from '../context/AppContext';
import { DEVELOPER_INFO } from '../data/defaultData';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  GraduationCap,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Printer,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    schoolSettings,
    teachers,
    setActiveMenu,
    setSelectedTeacherId,
    setCurrentInstrumentTab,
    setIsDevModalOpen,
  } = useApp();

  // Statistics calculation
  const totalGuru = teachers.length;
  const selesai = teachers.filter((t) => t.status === 'Selesai').length;
  const sedangBerjalan = teachers.filter((t) => t.status === 'Sedang Berjalan').length;
  const belum = teachers.filter((t) => t.status === 'Belum').length;

  const percentSelesai = totalGuru > 0 ? Math.round((selesai / totalGuru) * 100) : 0;

  // Average score of completed observations
  const completedWithScore = teachers.filter((t) => t.observasiData?.persentase);
  const avgScore =
    completedWithScore.length > 0
      ? (
          completedWithScore.reduce((acc, t) => acc + (t.observasiData?.persentase || 0), 0) /
          completedWithScore.length
        ).toFixed(1)
      : '0';

  // Gather upcoming agenda
  const agendaList: {
    teacherId: string;
    nama: string;
    mapel: string;
    kelas: string;
    tahap: string;
    tanggal: string;
    tab: 'pra' | 'observasi' | 'pasca';
  }[] = [];

  teachers.forEach((t) => {
    if (t.tglPraObservasi && !t.praObservasiData) {
      agendaList.push({
        teacherId: t.id,
        nama: t.nama,
        mapel: t.mapel,
        kelas: t.kelas,
        tahap: 'Pra-Observasi',
        tanggal: t.tglPraObservasi,
        tab: 'pra',
      });
    }
    if (t.tglObservasi && !t.observasiData) {
      agendaList.push({
        teacherId: t.id,
        nama: t.nama,
        mapel: t.mapel,
        kelas: t.kelas,
        tahap: 'Observasi Kelas',
        tanggal: t.tglObservasi,
        tab: 'observasi',
      });
    }
    if (t.tglPascaObservasi && !t.pascaObservasiData) {
      agendaList.push({
        teacherId: t.id,
        nama: t.nama,
        mapel: t.mapel,
        kelas: t.kelas,
        tahap: 'Pasca-Observasi',
        tanggal: t.tglPascaObservasi,
        tab: 'pasca',
      });
    }
  });

  // Sort upcoming by date
  agendaList.sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  return (
    <div className="space-y-6">
      {/* 2. Panduan Pengisian Identitas (Warning box if using default template) */}
      {!schoolSettings.isCustomized && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-200/80 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-amber-950">
                Identitas sekolah masih menggunakan data contoh
              </h4>
              <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                Silakan masukkan Nama Sekolah, Kepala Sekolah, Pengawas Pembina, dan NIP resmi Anda
                agar otomatis muncul di seluruh instrumen dan kop laporan.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveMenu('pengaturan')}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-600/20 transition"
          >
            <span>Isi Identitas Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Sistem Informasi Supervisi Akademik (SI SUPAK)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Portal Supervisi Akademik
          </h2>
          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
            Mendukung Kepala Sekolah dan Pengawas Pembina dalam penjaminan mutu pedagogik berbasis
            prinsip <strong>Pembelajaran Mendalam</strong> dan penguatan dimensi{' '}
            <strong>Kokurikuler</strong> di satuan pendidikan Anda.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
              <GraduationCap className="w-4 h-4 text-sky-300" />
              {schoolSettings.namaSekolah}
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
              <Calendar className="w-4 h-4 text-emerald-300" />
              Semester {schoolSettings.semester} {schoolSettings.tahunPelajaran}
            </span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 1. Dashboard Eksekutif: Ringkasan statistik supervisi */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Guru */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Guru
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalGuru}</div>
          <p className="text-xs text-slate-500 mt-1">Sasaran supervisi semester ini</p>
        </div>

        {/* Selesai */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Selesai
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">{selesai}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentSelesai}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700">
              {percentSelesai}%
            </span>
          </div>
        </div>

        {/* Sedang Berjalan */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sedang Berjalan
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-700">{sedangBerjalan}</div>
          <p className="text-xs text-slate-500 mt-1">Tahap Pra atau Observasi</p>
        </div>

        {/* Belum Supervisi */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Belum Supervisi
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-700">{belum}</div>
          <p className="text-xs text-slate-500 mt-1">Menunggu jadwal pelaksanaan</p>
        </div>
      </div>

      {/* Main Grid: Agenda Kegiatan Mendatang & Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agenda Kegiatan Mendatang (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Agenda Kegiatan Mendatang
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Jadwal tahapan supervisi guru yang siap dilaksanakan
              </p>
            </div>
            <button
              onClick={() => setActiveMenu('program')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
            >
              Lihat Seluruh Jadwal
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {agendaList.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500/60" />
              <p className="text-sm font-medium text-slate-600">
                Semua agenda supervisi yang dijadwalkan telah terlaksana dengan baik!
              </p>
              <p className="text-xs text-slate-400">
                Buka menu Data Guru untuk menambah guru atau jadwal baru.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {agendaList.slice(0, 5).map((item, idx) => (
                <div
                  key={`${item.teacherId}-${item.tahap}-${idx}`}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{item.nama}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                          {item.kelas}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {item.mapel} •{' '}
                        <span className="font-semibold text-indigo-600">{item.tahap}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {item.tanggal}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTeacherId(item.teacherId);
                        setCurrentInstrumentTab(item.tab);
                        setActiveMenu('instrumen');
                      }}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                    >
                      Buka Form
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Ringkasan Nilai & Atribusi Pengembang */}
        <div className="space-y-6">
          {/* Nilai Rata-rata */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Capaian Kinerja Guru
            </h4>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-slate-900">{avgScore}</span>
              <span className="text-sm font-semibold text-slate-500">/ 100 Rata-rata Skor</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Berdasarkan observasi kelas dengan fokus Pembelajaran Mendalam dan dimensi Kokurikuler
              pada {completedWithScore.length} guru yang telah selesai.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setActiveMenu('laporan')}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>Lihat Laporan Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveMenu('cetak')}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Pusat Cetak Dokumen & Ekspor</span>
              </button>
            </div>
          </div>

          {/* Profil Pengembang Card (Requested attribution) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden border border-indigo-800/60">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Inovasi Pengembang
              </span>
              <button
                onClick={() => setIsDevModalOpen(true)}
                className="text-xs text-indigo-300 hover:text-white underline underline-offset-2"
              >
                Detail
              </button>
            </div>
            <h4 className="font-extrabold text-base text-white tracking-tight">
              {DEVELOPER_INFO.nama}, {DEVELOPER_INFO.gelar}
            </h4>
            <p className="text-xs text-indigo-200 mt-1 font-medium">
              {DEVELOPER_INFO.jabatan}
            </p>
            <p className="text-[11px] text-slate-400 mt-3 border-t border-indigo-800/80 pt-2.5 leading-relaxed">
              Didedikasikan untuk standarisasi supervisi akademik kepala sekolah dan pengawas di
              seluruh Indonesia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
