import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  CheckCircle2,
  FileCheck2,
  FileSpreadsheet,
  GraduationCap,
  Printer,
  Sparkles,
  TrendingUp,
  User,
  Download,
  FileDown,
  Loader2,
} from 'lucide-react';
import { exportSupervisionReportToPDF } from '../utils/exportPdf';
import { printHtmlElement } from '../utils/printDocument';

export const SupervisionReport: React.FC = () => {
  const { schoolSettings, teachers, selectedTeacherId, setSelectedTeacherId } = useApp();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printFeedback, setPrintFeedback] = useState<string | null>(null);

  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const handleExportPDF = () => {
    if (!activeTeacher) return;
    setIsExportingPDF(true);
    try {
      exportSupervisionReportToPDF(activeTeacher, schoolSettings);
      setPrintFeedback('Berkas PDF resmi berhasil diunduh.');
      setTimeout(() => setPrintFeedback(null), 3500);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Gagal mengekspor PDF. Pastikan data laporan lengkap.');
    } finally {
      setTimeout(() => setIsExportingPDF(false), 600);
    }
  };

  const handlePrintDocument = () => {
    if (!activeTeacher) return;
    setIsPrinting(true);
    try {
      // 1. Download official PDF so the user has the file locally
      exportSupervisionReportToPDF(activeTeacher, schoolSettings);

      // 2. Open clean print dialog
      printHtmlElement(
        '#printable-supervision-report',
        `Laporan Supervisi - ${activeTeacher.nama}`
      );

      setPrintFeedback('Berkas PDF berhasil diunduh dan dialog cetak dokumen telah dibuka!');
      setTimeout(() => setPrintFeedback(null), 4000);
    } catch (err) {
      console.warn('Falling back to standard print:', err);
      window.print();
    } finally {
      setTimeout(() => setIsPrinting(false), 800);
    }
  };

  const praData = activeTeacher?.praObservasiData;
  const obsData = activeTeacher?.observasiData;
  const pascaData = activeTeacher?.pascaObservasiData;

  // Calculate final combined score
  const praScore = praData?.skorPersentase || (activeTeacher?.status === 'Selesai' ? 92 : 0);
  const obsScore = obsData?.persentase || (activeTeacher?.status === 'Selesai' ? 91.7 : 0);
  const finalScore =
    praScore > 0 && obsScore > 0
      ? Number(((praScore * 0.4 + obsScore * 0.6)).toFixed(1))
      : obsScore || praScore || 0;

  const getPredikat = (score: number) => {
    if (score >= 86) return { label: 'Sangat Baik (A)', color: 'text-emerald-700 bg-emerald-50' };
    if (score >= 71) return { label: 'Baik (B)', color: 'text-indigo-700 bg-indigo-50' };
    if (score >= 56) return { label: 'Cukup (C)', color: 'text-amber-700 bg-amber-50' };
    return { label: 'Perlu Bimbingan (D)', color: 'text-rose-700 bg-rose-50' };
  };

  const predikatObj = getPredikat(finalScore);

  const handleDownloadReport = () => {
    if (!activeTeacher) return;
    const reportText = `LAPORAN HASIL SUPERVISI AKADEMIK
SATUAN PENDIDIKAN: ${schoolSettings.namaSekolah}
==================================================
Identitas Guru:
Nama Guru: ${activeTeacher.nama}
NIP: ${activeTeacher.nip || '-'}
Pangkat/Gol: ${activeTeacher.pangkatGolongan}
Mata Pelajaran: ${activeTeacher.mapel}
Kelas: ${activeTeacher.kelas}
Materi Pokok: ${activeTeacher.materiPokok || '-'}
Semester/TP: ${schoolSettings.semester} / ${schoolSettings.tahunPelajaran}

Rekapitulasi Nilai Supervisi:
1. Pra-Observasi (Telaah Modul Ajar): ${praScore}%
2. Observasi Kelas (Pembelajaran Mendalam): ${obsScore}%
3. Nilai Akhir Supervisi: ${finalScore}% (${predikatObj.label})

Analisis Kelebihan Perencanaan & Pelaksanaan:
${praData?.kelebihan || 'Perencanaan pembelajaran terstruktur sistematis.'}
${obsData?.catatanSupervisor || 'Pelaksanaan pembelajaran kondusif dan interaktif.'}

Rekomendasi Perbaikan:
${praData?.rekomendasi || obsData?.rekomendasi || 'Tingkatkan pemberian umpan balik langsung dan penguatan diferensiasi produk.'}

Tindak Lanjut yang Disepakati:
${obsData?.tindakLanjut || pascaData?.kesepakatanBersama || 'Mengembangkan instrumen asesmen formatif alternatif.'}

Mengetahui,
Pengawas Pembina: ${schoolSettings.pengawas} (NIP. ${schoolSettings.nipPengawas})
Kepala Satuan Pendidikan: ${schoolSettings.kepalaSekolah} (NIP. ${schoolSettings.nipKepalaSekolah})
Guru Yang Disupervisi: ${activeTeacher.nama} (NIP. ${activeTeacher.nip || '-'})`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Supervisi_${activeTeacher.nama.replace(/\s+/g, '_')}_${schoolSettings.tahunPelajaran.replace(/\//g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Print hide) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print-hide">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Laporan Hasil Supervisi Akademik</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Laporan formal komprehensif siap cetak dan ekspor dengan tanda tangan dinamis Kepala
            Sekolah & Pengawas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Teacher Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Pilih Guru:</span>
            <select
              value={activeTeacher?.id || ''}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama} ({t.mapel})
                </option>
              ))}
            </select>
          </div>

          {/* Direct jsPDF Download Button */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition disabled:opacity-50"
            title="Unduh Dokumen Laporan Resmi dalam Format PDF (jsPDF)"
          >
            {isExportingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>Unduh PDF Langsung</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            title="Download Format Teks Ringkasan"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Teks</span>
          </button>

          <button
            onClick={handlePrintDocument}
            disabled={isPrinting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            title="Unduh Berkas PDF dan Buka Dialog Cetak Dokumen"
          >
            {isPrinting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Print / Download Notification Feedback */}
      {printFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{printFeedback}</span>
        </div>
      )}

      {/* Formal Printable Document View */}
      {activeTeacher ? (
        <div
          id="printable-supervision-report"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6 printable-report"
        >
          {/* 1. KOP SURAT DINAMIS RESMI */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-center gap-4">
              {schoolSettings.logoUrl ? (
                <img
                  src={schoolSettings.logoUrl}
                  alt="Logo Kop"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
                />
              ) : null}

              <div className="text-center flex-1 space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-600 font-mono">
                  {schoolSettings.kopBaris1 || `PEMERINTAH ${(schoolSettings.provinsi || 'PROPINSI JAWA TENGAH').toUpperCase()}`}
                </h4>
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                  {schoolSettings.kopBaris2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                </h3>
                <h2 className="text-lg sm:text-2xl font-black text-indigo-950 uppercase tracking-wide">
                  {schoolSettings.namaSekolah}
                </h2>
                <p className="text-xs text-slate-600">
                  {schoolSettings.alamat}, {schoolSettings.desaKelurahan}, Kec. {schoolSettings.kecamatan}, {schoolSettings.kabupatenKota} - {schoolSettings.kodePos}
                </p>
                <p className="text-[11px] text-slate-500">
                  Telepon: {schoolSettings.telepon} • Pos-el: {schoolSettings.email} • Website: {schoolSettings.website}
                </p>
              </div>

              {schoolSettings.logoUrl ? (
                <div className="w-16 sm:w-20 shrink-0 hidden sm:block pointer-events-none" aria-hidden="true" />
              ) : null}
            </div>
            <div className="border-t border-slate-900 mt-2.5 pt-0.5" />
          </div>

          {/* Judul Laporan */}
          <div className="text-center space-y-1 pt-1">
            <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 underline underline-offset-4">
              LAPORAN HASIL SUPERVISI AKADEMIK
            </h3>
            <p className="text-xs font-semibold text-slate-600">
              Nomor: 421.3 / SUPAK / {new Date().getFullYear()} / {schoolSettings.semester.toUpperCase()}
            </p>
          </div>

          {/* Identitas Guru Terpadu */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              A. Identitas Guru & Pelaksanaan Supervisi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-800">
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium">Nama Lengkap Guru</span>
                <span className="font-bold text-slate-900">: {activeTeacher.nama}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium">NIP / NUPTK</span>
                <span className="font-mono">: {activeTeacher.nip || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium">Pangkat / Golongan</span>
                <span>: {activeTeacher.pangkatGolongan || 'Penata / III-c'}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium">Mata Pelajaran</span>
                <span className="font-semibold text-indigo-900">: {activeTeacher.mapel}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium">Kelas / Semester</span>
                <span>: Kelas {activeTeacher.kelas} / Semester {schoolSettings.semester}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium">Tahun Pelajaran</span>
                <span>: {schoolSettings.tahunPelajaran}</span>
              </div>
              <div className="flex sm:col-span-2">
                <span className="w-36 text-slate-500 font-medium shrink-0">Materi Pokok</span>
                <span className="font-medium italic">: {activeTeacher.materiPokok || 'Pembelajaran Berpusat pada Murid'}</span>
              </div>
              <div className="flex sm:col-span-2">
                <span className="w-36 text-slate-500 font-medium shrink-0">Tanggal Pelaksanaan</span>
                <span>
                  : Pra ({activeTeacher.tglPraObservasi || '-'}) • Observasi Kelas ({activeTeacher.tglObservasi || '-'}) • Pasca ({activeTeacher.tglPascaObservasi || '-'})
                </span>
              </div>
            </div>
          </div>

          {/* Rekapitulasi Skor & Capaian Kinerja */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              B. Rekapitulasi Kuantitatif Hasil Supervisi
            </h4>
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left text-slate-800">
                <thead className="bg-slate-100 font-bold uppercase text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3">Komponen Supervisi Akademik</th>
                    <th className="py-2.5 px-3 text-center w-28">Skor (%)</th>
                    <th className="py-2.5 px-3 text-center w-28">Bobot</th>
                    <th className="py-2.5 px-3 text-center w-28">Skor Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2 px-3 text-center font-semibold text-slate-500">1</td>
                    <td className="py-2 px-3">Telaah Dokumen Perangkat (Pra-Observasi)</td>
                    <td className="py-2 px-3 text-center font-semibold">{praScore}%</td>
                    <td className="py-2 px-3 text-center">40%</td>
                    <td className="py-2 px-3 text-center font-bold">{(praScore * 0.4).toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-center font-semibold text-slate-500">2</td>
                    <td className="py-2 px-3">
                      Observasi Kelas (Pembelajaran Mendalam & Dimensi Kokurikuler)
                    </td>
                    <td className="py-2 px-3 text-center font-semibold">{obsScore}%</td>
                    <td className="py-2 px-3 text-center">60%</td>
                    <td className="py-2 px-3 text-center font-bold">{(obsScore * 0.6).toFixed(1)}</td>
                  </tr>
                  <tr className="bg-indigo-50/60 font-bold">
                    <td colSpan={4} className="py-2.5 px-3 text-right uppercase">
                      Nilai Total Supervisi Akademik
                    </td>
                    <td className="py-2.5 px-3 text-center text-indigo-900 text-sm font-extrabold">
                      {finalScore}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Predikat box */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">
                Kualifikasi Kinerja Guru:
              </span>
              <span className={`px-3 py-1 rounded-lg font-extrabold text-sm ${predikatObj.color}`}>
                {predikatObj.label}
              </span>
            </div>
          </div>

          {/* Analisis Temuan: Kelebihan & Kekurangan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              C. Analisis Temuan Supervisi
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Kekuatan / Kelebihan */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Kelebihan & Kekuatan Teramati
                </span>
                <p className="text-slate-700 leading-relaxed text-justify">
                  {praData?.kelebihan || obsData?.catatanSupervisor ||
                    'Guru menyusun rancangan modul ajar secara sistematis, penguasaan materi esensial sangat baik, serta mampu menciptakan iklim belajar yang inklusif dan memantik nalar kritis murid.'}
                </p>
              </div>

              {/* Hal yang perlu ditingkatkan */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <span className="font-bold text-amber-950 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Hal yang Perlu Ditingkatkan
                </span>
                <p className="text-slate-700 leading-relaxed text-justify">
                  {praData?.perluDitingkatkan ||
                    'Penguatan variasi diferensiasi produk tugas murid serta optimalisasi manajemen alokasi waktu sesi presentasi kelompok dan penarikan kesimpulan.'}
                </p>
              </div>
            </div>
          </div>

          {/* Rekomendasi & Tindak Lanjut Spesifik */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              D. Rekomendasi Perbaikan & Rencana Tindak Lanjut
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-justify text-slate-700">
              <div>
                <strong className="text-slate-900 block mb-0.5">Rekomendasi Supervisor:</strong>
                <p>
                  {obsData?.rekomendasi || praData?.rekomendasi ||
                    'Guru disarankan memperkaya instrumen asesmen formatif seketika (immediate feedback), menerapkan metode presentasi interaktif seperti rotasi kelompok (gallery walk), serta memperkuat integrasi dimensi Kokurikuler.'}
                </p>
              </div>
              <div>
                <strong className="text-slate-900 block mb-0.5">Kesepakatan Komitmen Tindak Lanjut:</strong>
                <p>
                  {pascaData?.kesepakatanBersama || obsData?.tindakLanjut ||
                    'Guru dan Supervisor sepakat untuk melaksanakan tindak lanjut perbaikan melalui keikutsertaan aktif dalam Komunitas Belajar (Kombel) sekolah serta mengimplementasikan diferensiasi produk pada siklus pembelajaran berikutnya.'}
                </p>
              </div>
            </div>
          </div>

          {/* 4. TANDA TANGAN RESMI (Nama & NIP Kepala Sekolah, Pengawas, dan Guru) */}
          <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs text-slate-800">
            <div>
              <p className="text-slate-500">Guru Yang Disupervisi,</p>
              <div className="h-16" />
              <p className="font-bold underline text-xs">{activeTeacher.nama}</p>
              <p className="font-mono text-slate-500 text-[10px]">
                NIP. {activeTeacher.nip || '-'}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-bold">Pengawas Pembina Sekolah</p>
              <div className="h-14" />
              <p className="font-bold underline text-xs">{schoolSettings.pengawas}</p>
              <p className="font-mono text-slate-500 text-[10px]">
                NIP. {schoolSettings.nipPengawas}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                {schoolSettings.kabupatenKota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="font-bold">Kepala Sekolah / Supervisor</p>
              <div className="h-14" />
              <p className="font-bold underline text-xs">{schoolSettings.kepalaSekolah}</p>
              <p className="font-mono text-slate-500 text-[10px]">
                NIP. {schoolSettings.nipKepalaSekolah}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          Belum ada data guru yang dipilih.
        </div>
      )}
    </div>
  );
};
