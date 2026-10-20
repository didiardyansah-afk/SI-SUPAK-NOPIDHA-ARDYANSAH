import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BookCheck,
  CalendarDays,
  CheckCircle,
  CheckCircle2,
  FileDown,
  FileText,
  GraduationCap,
  Info,
  Loader2,
  Printer,
  Sparkles,
  Target,
  UserCheck,
} from 'lucide-react';
import { exportSupervisionProgramToPDF } from '../utils/exportPdf';
import { printHtmlElement } from '../utils/printDocument';

export const SupervisionProgram: React.FC = () => {
  const { schoolSettings, teachers, setActiveMenu } = useApp();
  const [isExportingPDF, setIsExportingPDF] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [printFeedback, setPrintFeedback] = React.useState<string | null>(null);

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      exportSupervisionProgramToPDF(teachers, schoolSettings);
      setPrintFeedback('Berkas PDF Jadwal Supervisi berhasil diunduh.');
      setTimeout(() => setPrintFeedback(null), 3500);
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Gagal mengekspor PDF Program Supervisi.');
    } finally {
      setTimeout(() => setIsExportingPDF(false), 600);
    }
  };

  const handlePrintProgram = () => {
    setIsPrinting(true);
    try {
      // 1. Download the official PDF so the user has the file locally
      exportSupervisionProgramToPDF(teachers, schoolSettings);

      // 2. Open clean print dialog for the program
      printHtmlElement(
        '#printable-supervision-program',
        `Program dan Jadwal Supervisi - ${schoolSettings.namaSekolah}`
      );

      setPrintFeedback('Berkas PDF jadwal berhasil diunduh dan dialog cetak telah dibuka!');
      setTimeout(() => setPrintFeedback(null), 4000);
    } catch (err) {
      console.warn('Falling back to standard print:', err);
      window.print();
    } finally {
      setTimeout(() => setIsPrinting(false), 800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action bar (print & info) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print-hide">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Program Supervisi Akademik</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Panduan operasional, tujuan strategis, dan jadwal pelaksanaan supervisi terpadu semester ini.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition disabled:opacity-50"
            title="Unduh Berkas Program & Jadwal dalam Format PDF (jsPDF)"
          >
            {isExportingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>Unduh PDF Jadwal</span>
          </button>

          <button
            onClick={handlePrintProgram}
            disabled={isPrinting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50"
            title="Unduh Berkas PDF dan Buka Dialog Cetak Jadwal"
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

      {/* Print Feedback Notification */}
      {printFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{printFeedback}</span>
        </div>
      )}

      {/* Printable Program Container */}
      <div
        id="printable-supervision-program"
        className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8 printable-report"
      >
        {/* Kop Resmi Program */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex items-center justify-center gap-4">
            {schoolSettings.logoUrl ? (
              <img
                src={schoolSettings.logoUrl}
                alt="Logo Kop"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
            ) : null}

            <div className="text-center flex-1 space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 font-mono">
                {schoolSettings.kopBaris1 || `PEMERINTAH ${(schoolSettings.provinsi || 'PROPINSI JAWA TENGAH').toUpperCase()}`}
              </h3>
              <h2 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                {schoolSettings.kopBaris2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
              </h2>
              <h1 className="text-lg sm:text-2xl font-extrabold text-indigo-950 uppercase tracking-wide">
                {schoolSettings.namaSekolah}
              </h1>
              <p className="text-xs text-slate-600">
                {schoolSettings.alamat}, {schoolSettings.desaKelurahan}, Kec. {schoolSettings.kecamatan}, {schoolSettings.kabupatenKota} - {schoolSettings.kodePos}
              </p>
              <p className="text-[11px] text-slate-500">
                Telp: {schoolSettings.telepon} • Pos-el: {schoolSettings.email} • Laman: {schoolSettings.website}
              </p>
            </div>

            {schoolSettings.logoUrl ? (
              <div className="w-16 sm:w-20 shrink-0 hidden sm:block pointer-events-none" aria-hidden="true" />
            ) : null}
          </div>
          <div className="border-t border-slate-900 mt-2.5 pt-1" />
        </div>

        {/* Judul Dokumen */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Dokumen Resmi Penjaminan Mutu Akademik
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase">
            PROGRAM KERJA SUPERVISI AKADEMIK
          </h2>
          <p className="text-sm font-medium text-slate-600">
            Tahun Pelajaran {schoolSettings.tahunPelajaran} • Semester {schoolSettings.semester}
          </p>
        </div>

        {/* 1. Latar Belakang & Landasan Hukum */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
            I. LATAR BELAKANG & DASAR KEBIJAKAN
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed text-justify">
            Supervisi akademik merupakan serangkaian kegiatan pembinaan dan pendampingan profesional
            yang bertujuan untuk membantu guru mengembangkan kemampuannya dalam mengelola proses
            pembelajaran guna mencapai tujuan pendidikan nasional. Sejalan dengan implementasi
            Kurikulum Nasional terkini, supervisi diarahkan secara khusus pada fasilitasi{' '}
            <strong>Pembelajaran Mendalam (Deep Learning)</strong> yang menekankan pemahaman konsep
            esensial, daya nalar kritis, serta penguatan karakter melalui dimensi{' '}
            <strong>Kokurikuler</strong> yang nyata dan terintegrasi di satuan pendidikan{' '}
            <strong>{schoolSettings.namaSekolah}</strong>.
          </p>
        </div>

        {/* 2. Tujuan Strategis Supervisi */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
            II. TUJUAN STRATEGIS SUPERVISI AKADEMIK
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-1.5">
                <Target className="w-4 h-4 shrink-0" />
                <span>Pembelajaran Mendalam</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meningkatkan kompetensi guru dalam merancang sintaks pembelajaran yang berpusat pada
                murid, inquiry berbasis masalah, dan penanaman konsep bermakna jangka panjang.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1.5">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Penguatan Kokurikuler</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Memastikan pembiasaan nilai-nilai gotong royong, nalar kritis, kemandirian, dan
                kebhinekaan terwujud dalam dinamika kelas maupun proyek kolaboratif murid.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-sm mb-1.5">
                <BookCheck className="w-4 h-4 shrink-0" />
                <span>Asesmen Berkelanjutan</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengembangkan kultur asesmen formatif otentik disertai umpan balik (feedback) seketika
                yang memandu murid mencapai kriteria ketercapaian tujuan pembelajaran (KKTP).
              </p>
            </div>
          </div>
        </div>

        {/* 3. Teknik Supervisi */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
            III. TEKNIK & PENDEKATAN SUPERVISI
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-slate-800 text-sm block mb-1">
                1. Studi Dokumentasi (Pra-Observasi)
              </span>
              <p className="text-slate-600">
                Telaah mendalam terhadap Modul Ajar/RPP meliputi 20 butir komponen indikator dan
                wawancara kesiapan pedagogik sebelum masuk ke ruang kelas.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-slate-800 text-sm block mb-1">
                2. Observasi Kelas Langsung
              </span>
              <p className="text-slate-600">
                Pengamatan interaksi belajar mengajar dengan rubrik standar 1–4 pada aspek
                perencanaan, pembelajaran mendalam, pengelolaan kelas, dan asesmen.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="font-bold text-slate-800 text-sm block mb-1">
                3. Refleksi & Wawancara Pasca-Observasi
              </span>
              <p className="text-slate-600">
                Diskusi kolegial reflektif yang membangun komitmen bersama, apresiasi kekuatan, dan
                rencana tindak lanjut perbaikan terukur.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Jadwal Sistematis Pelaksanaan Supervisi (OTOMATIS SINKRON) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">
              IV. JADWAL SISTEMATIS PELAKSANAAN SUPERVISI AKADEMIK
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full print-hide">
              ✓ Terintegrasi Otomatis dari Data Guru
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Jadwal berikut disusun secara otomatis berdasarkan data guru yang diinput ke dalam sistem
            SI SUPAK. Setiap perubahan jadwal pada guru akan langsung diperbarui secara real-time pada
            tabel ini.
          </p>

          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase tracking-wider text-slate-700">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">No</th>
                  <th className="py-3 px-3">Nama Guru & NIP</th>
                  <th className="py-3 px-3">Mata Pelajaran</th>
                  <th className="py-3 px-2 text-center">Kelas</th>
                  <th className="py-3 px-3 text-center bg-indigo-50/50">Tgl Pra-Obs</th>
                  <th className="py-3 px-3 text-center bg-indigo-100/50">Tgl Observasi</th>
                  <th className="py-3 px-3 text-center bg-indigo-50/50">Tgl Pasca-Obs</th>
                  <th className="py-3 px-3">Supervisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      <p className="font-semibold text-sm">
                        Data jadwal supervisi guru masih kosong.
                      </p>
                      <p className="text-xs mt-1">
                        Silakan input data guru dan tanggal pelaksanaan di menu Data Guru.
                      </p>
                    </td>
                  </tr>
                ) : (
                  teachers.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{t.nama}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          NIP. {t.nip || '-'}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-medium">{t.mapel}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-indigo-700">
                        {t.kelas}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium bg-indigo-50/30">
                        {t.tglPraObservasi || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-indigo-900 bg-indigo-100/30">
                        {t.tglObservasi || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium bg-indigo-50/30">
                        {t.tglPascaObservasi || '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">
                          {schoolSettings.kepalaSekolah}
                        </div>
                        <div className="text-[10px] text-slate-500">Kepala Sekolah</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lembar Pengesahan */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-800">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold mt-1">Pengawas Pembina Sekolah</p>
            <div className="h-16" />
            <p className="font-bold underline text-sm">{schoolSettings.pengawas}</p>
            <p className="font-mono text-slate-500 text-[11px]">
              NIP. {schoolSettings.nipPengawas}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              {schoolSettings.kabupatenKota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-bold mt-1">Kepala Satuan Pendidikan / Supervisor</p>
            <div className="h-16" />
            <p className="font-bold underline text-sm">{schoolSettings.kepalaSekolah}</p>
            <p className="font-mono text-slate-500 text-[11px]">
              NIP. {schoolSettings.nipKepalaSekolah}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
