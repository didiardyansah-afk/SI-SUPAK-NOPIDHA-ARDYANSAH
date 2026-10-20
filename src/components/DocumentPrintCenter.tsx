import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  FileDown,
  Download,
  CheckCircle2,
  FileText,
  CalendarDays,
  FileSpreadsheet,
  FileCheck2,
  Target,
  Sparkles,
  School,
  User,
  ArrowRight,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import {
  exportSupervisionReportToPDF,
  exportSupervisionProgramToPDF,
  exportPraObservasiToPDF,
  exportObservasiToPDF,
  exportPascaObservasiToPDF,
  exportTindakLanjutToPDF,
  exportTeacherDocumentToPDF,
} from '../utils/exportPdf';
import { printHtmlElement } from '../utils/printDocument';
import { DEVELOPER_INFO } from '../data/defaultData';

export const DocumentPrintCenter: React.FC = () => {
  const {
    schoolSettings,
    teachers,
    selectedTeacherId,
    setSelectedTeacherId,
    tindakLanjutList,
  } = useApp();

  const [selectedDocType, setSelectedDocType] = useState<
    'laporan' | 'program' | 'pra' | 'observasi' | 'pasca' | 'tindak-lanjut' | 'perangkat'
  >('laporan');

  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      if (selectedDocType === 'laporan' && activeTeacher) {
        exportSupervisionReportToPDF(activeTeacher, schoolSettings);
      } else if (selectedDocType === 'program') {
        exportSupervisionProgramToPDF(teachers, schoolSettings);
      } else if (selectedDocType === 'pra' && activeTeacher) {
        exportPraObservasiToPDF(activeTeacher, schoolSettings);
      } else if (selectedDocType === 'observasi' && activeTeacher) {
        exportObservasiToPDF(activeTeacher, schoolSettings);
      } else if (selectedDocType === 'pasca' && activeTeacher) {
        exportPascaObservasiToPDF(activeTeacher, schoolSettings);
      } else if (selectedDocType === 'tindak-lanjut') {
        exportTindakLanjutToPDF(tindakLanjutList, teachers, schoolSettings);
      } else if (selectedDocType === 'perangkat' && activeTeacher) {
        const docItem = activeTeacher.documents?.[selectedDocumentIndex] || {
          id: '1',
          name: `Modul_Ajar_${activeTeacher.mapel}.pdf`,
          type: 'Modul Ajar',
          size: '1.2 MB',
          uploadDate: new Date().toLocaleDateString('id-ID'),
        };
        exportTeacherDocumentToPDF(activeTeacher, docItem, schoolSettings);
      }

      setFeedbackMsg('Berkas PDF resmi berhasil diekspor dan diunduh ke komputer Anda!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Gagal mengekspor PDF. Pastikan data lengkap.');
    } finally {
      setTimeout(() => setIsExportingPDF(false), 500);
    }
  };

  const handlePrintOnly = () => {
    setIsPrinting(true);
    try {
      printHtmlElement(
        '#printable-center-document',
        `SI SUPAK - Cetak Dokumen - ${activeTeacher ? activeTeacher.nama : schoolSettings.namaSekolah}`
      );
      setFeedbackMsg('Dialog cetak dokumen berhasil dibuka. Dokumen siap dicetak ke printer atau Simpan sebagai PDF.');
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      console.warn('Fallback print:', err);
      window.print();
    } finally {
      setTimeout(() => setIsPrinting(false), 600);
    }
  };

  const handleDownloadAndPrint = () => {
    setIsPrinting(true);
    setIsExportingPDF(true);
    try {
      // 1. Trigger official PDF download
      handleExportPDF();

      // 2. Open print dialog immediately
      setTimeout(() => {
        printHtmlElement(
          '#printable-center-document',
          `SI SUPAK - Cetak Dokumen - ${activeTeacher ? activeTeacher.nama : schoolSettings.namaSekolah}`
        );
        setFeedbackMsg('File PDF berhasil diunduh dan dialog cetak dokumen langsung dibuka!');
        setTimeout(() => setFeedbackMsg(null), 4000);
        setIsPrinting(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setIsPrinting(false);
      setIsExportingPDF(false);
    }
  };

  // Calculations for active teacher report
  const praData = activeTeacher?.praObservasiData;
  const obsData = activeTeacher?.observasiData;
  const pascaData = activeTeacher?.pascaObservasiData;

  const praScore = praData?.skorPersentase || (activeTeacher?.status === 'Selesai' ? 92 : 0);
  const obsScore = obsData?.persentase || (activeTeacher?.status === 'Selesai' ? 91.7 : 0);
  const finalScore =
    praScore > 0 && obsScore > 0
      ? Number((praScore * 0.4 + obsScore * 0.6).toFixed(1))
      : obsScore || praScore || 0;

  const getPredikat = (score: number) => {
    if (score >= 86) return 'Sangat Baik (A)';
    if (score >= 71) return 'Baik (B)';
    if (score >= 56) return 'Cukup (C)';
    return 'Perlu Bimbingan (D)';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print-hide">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-600" />
            Pusat Cetak Dokumen & Ekspor PDF
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cetak dokumen secara langsung atau unduh format PDF resmi ber-Kop Surat lengkap dengan
            tanda tangan Kepala Sekolah dan Pengawas Pembina.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition disabled:opacity-50"
            title="Unduh file dokumen dalam format PDF (jsPDF)"
          >
            {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span>Unduh PDF Resmi</span>
          </button>

          <button
            onClick={handlePrintOnly}
            disabled={isPrinting}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
            title="Buka dialog cetak dokumen (Print ke printer fisik atau simpan PDF)"
          >
            {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            <span>Cetak Dokumen</span>
          </button>

          <button
            onClick={handleDownloadAndPrint}
            disabled={isPrinting || isExportingPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            title="Unduh berkas PDF sekaligus buka jendela cetak ke printer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh & Cetak Sekaligus</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in print-hide">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Workspace: Left (Selection & Settings) + Right (A4 Print Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4 print-hide">
          {/* Document Type Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              1. Pilih Jenis Dokumen
            </h3>

            <div className="space-y-1.5">
              {[
                {
                  id: 'laporan',
                  label: 'Laporan Hasil Supervisi Guru',
                  desc: 'Format formal nilai gabungan, temuan & 3 TTD',
                  icon: FileSpreadsheet,
                  color: 'text-indigo-600',
                },
                {
                  id: 'pra',
                  label: 'Instrumen Pra-Observasi',
                  desc: 'Telaah 20 Komponen Modul Ajar & Wawancara',
                  icon: FileText,
                  color: 'text-sky-600',
                },
                {
                  id: 'observasi',
                  label: 'Instrumen Observasi Kelas',
                  desc: 'Rubrik Pembelajaran Mendalam & Diferensiasi',
                  icon: FileCheck2,
                  color: 'text-emerald-600',
                },
                {
                  id: 'pasca',
                  label: 'Instrumen Pasca-Observasi',
                  desc: 'Lembar Refleksi, Umpan Balik & Tindak Lanjut',
                  icon: Target,
                  color: 'text-amber-600',
                },
                {
                  id: 'program',
                  label: 'Program Kerja & Jadwal Supervisi',
                  desc: 'Tabel sinkron jadwal seluruh guru & supervisor',
                  icon: CalendarDays,
                  color: 'text-purple-600',
                },
                {
                  id: 'tindak-lanjut',
                  label: 'Program Tindak Lanjut & Evaluasi',
                  desc: 'Rencana aksi pembinaan & monitoring target',
                  icon: Sparkles,
                  color: 'text-teal-600',
                },
                {
                  id: 'perangkat',
                  label: 'Lembar Pengesahan Perangkat Ajar',
                  desc: 'Pengesahan Modul Ajar / RPP terunggah guru',
                  icon: FolderOpen,
                  color: 'text-rose-600',
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedDocType === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDocType(item.id as any)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-white shadow-2xs mt-0.5 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teacher Selector Card (If applicable) */}
          {selectedDocType !== 'program' && selectedDocType !== 'tindak-lanjut' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-indigo-600" />
                2. Pilih Guru Yang Disupervisi
              </h3>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {teachers.map((t) => {
                  const isSelected = activeTeacher?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTeacherId(t.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 font-bold text-indigo-900 shadow-2xs'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold truncate">{t.nama}</p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {t.mapel} • Kelas {t.kelas}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                          t.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-selector for uploaded documents */}
              {selectedDocType === 'perangkat' && activeTeacher && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Pilih File Perangkat:
                  </label>
                  {activeTeacher.documents && activeTeacher.documents.length > 0 ? (
                    <select
                      value={selectedDocumentIndex}
                      onChange={(e) => setSelectedDocumentIndex(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none"
                    >
                      {activeTeacher.documents.map((d, idx) => (
                        <option key={d.id} value={idx}>
                          {d.name} ({d.type})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-[11px] text-amber-600 italic">
                      Belum ada dokumen yang diunggah untuk guru ini.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Print Summary Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <School className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Identitas Kop Cetak</h4>
            </div>
            <div className="text-xs space-y-1.5 text-slate-300">
              <p>
                <span className="text-slate-400">Kop Atas:</span>{' '}
                <span className="font-semibold text-white">
                  {schoolSettings.kopBaris1 || 'PEMERINTAH PROPINSI JAWA TENGAH'}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Sekolah:</span>{' '}
                <span className="font-semibold text-white">{schoolSettings.namaSekolah}</span>
              </p>
              <p>
                <span className="text-slate-400">Logo Kop:</span>{' '}
                <span className="font-semibold text-white">
                  {schoolSettings.logoUrl ? 'Logo Aktif Terpasang' : 'Tanpa Logo (Default)'}
                </span>
              </p>
              <p>
                <span className="text-slate-400">Supervisor:</span>{' '}
                <span className="font-semibold text-white">{schoolSettings.kepalaSekolah}</span>
              </p>
            </div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              Ubah kop surat atau logo di menu <strong>Pengaturan Sekolah</strong>.
            </p>
          </div>
        </div>

        {/* Right Preview Column (8 cols): True A4 Paper Canvas */}
        <div className="lg:col-span-8">
          <div className="bg-slate-200/80 p-3 sm:p-6 rounded-2xl border border-slate-300/80 overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-600 print-hide px-1">
              <span className="font-semibold flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-indigo-600" />
                Pratinjau Dokumen Siap Cetak (A4 Portrait)
              </span>
              <span className="text-[11px] bg-white px-2.5 py-0.5 rounded-full border border-slate-300 shadow-2xs font-bold text-slate-700">
                Skala Cetak 100%
              </span>
            </div>

            {/* A4 Container */}
            <div
              id="printable-center-document"
              className="bg-white mx-auto shadow-xl p-8 sm:p-12 text-slate-900 border border-slate-300 min-h-[1050px] max-w-[800px] text-xs leading-relaxed space-y-6"
              style={{ minHeight: '297mm' }}
            >
              {/* --- OFFICIAL KOP SURAT DINAMIS --- */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex items-center justify-between gap-4">
                  {schoolSettings.logoUrl ? (
                    <img
                      src={schoolSettings.logoUrl}
                      alt="Logo Resmi"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-16 sm:w-20 shrink-0 hidden sm:block" />
                  )}

                  <div className="text-center flex-1 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-700 font-mono">
                      {schoolSettings.kopBaris1 ||
                        `PEMERINTAH ${(schoolSettings.provinsi || 'PROPINSI JAWA TENGAH').toUpperCase()}`}
                    </h4>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase">
                      {schoolSettings.kopBaris2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                    </h3>
                    <h2 className="text-base sm:text-xl font-black text-indigo-950 uppercase tracking-wide">
                      {schoolSettings.namaSekolah}
                    </h2>
                    <p className="text-[11px] text-slate-600">
                      {schoolSettings.alamat}, Kec. {schoolSettings.kecamatan},{' '}
                      {schoolSettings.kabupatenKota} - {schoolSettings.kodePos}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Telepon: {schoolSettings.telepon} • Pos-el: {schoolSettings.email} • Website:{' '}
                      {schoolSettings.website}
                    </p>
                  </div>

                  <div className="w-16 sm:w-20 shrink-0 hidden sm:block pointer-events-none" />
                </div>
                {/* Official Double Border Line */}
                <div className="border-t border-slate-900 mt-2.5 pt-0.5" />
              </div>

              {/* --- DYNAMIC BODY BASED ON SELECTED DOC TYPE --- */}
              {selectedDocType === 'laporan' && activeTeacher && (
                <div className="space-y-5">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      LAPORAN HASIL SUPERVISI AKADEMIK
                    </h3>
                    <p className="text-xs text-slate-500">
                      Nomor: 421.3 / SUPAK / {new Date().getFullYear()} /{' '}
                      {schoolSettings.semester.toUpperCase()}
                    </p>
                  </div>

                  {/* Section A: Identitas */}
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                      A. Identitas Guru & Pelaksanaan
                    </h4>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="w-40 py-1 font-semibold text-slate-600">Nama Lengkap Guru</td>
                          <td className="py-1 font-bold text-slate-900">: {activeTeacher.nama}</td>
                          <td className="w-36 py-1 font-semibold text-slate-600">Kelas / Semester</td>
                          <td className="py-1">: Kelas {activeTeacher.kelas} / {schoolSettings.semester}</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-1 font-semibold text-slate-600">NIP / NUPTK</td>
                          <td className="py-1">: {activeTeacher.nip || '-'}</td>
                          <td className="py-1 font-semibold text-slate-600">Tahun Pelajaran</td>
                          <td className="py-1">: {schoolSettings.tahunPelajaran}</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-1 font-semibold text-slate-600">Mata Pelajaran</td>
                          <td className="py-1 font-bold text-indigo-900">: {activeTeacher.mapel}</td>
                          <td className="py-1 font-semibold text-slate-600">Materi Pokok</td>
                          <td className="py-1">: {activeTeacher.materiPokok || 'Pembelajaran Mendalam'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-semibold text-slate-600">Jadwal Pelaksanaan</td>
                          <td colSpan={3} className="py-1 text-slate-700">
                            : Pra ({activeTeacher.tglPraObservasi || '-'}) | Observasi ({activeTeacher.tglObservasi || '-'}) | Pasca ({activeTeacher.tglPascaObservasi || '-'})
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Section B: Nilai Kuantitatif */}
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                      B. Rekapitulasi Nilai Supervisi Akademik
                    </h4>
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-slate-300 p-2 w-10">No</th>
                          <th className="border border-slate-300 p-2 text-left">Komponen Supervisi</th>
                          <th className="border border-slate-300 p-2 w-24">Skor (%)</th>
                          <th className="border border-slate-300 p-2 w-20">Bobot</th>
                          <th className="border border-slate-300 p-2 w-24">Nilai Akhir</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-2 text-center">1</td>
                          <td className="border border-slate-300 p-2 font-medium">Telaah Modul Ajar (Pra-Observasi)</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{praScore}%</td>
                          <td className="border border-slate-300 p-2 text-center">40%</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{(praScore * 0.4).toFixed(1)}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 text-center">2</td>
                          <td className="border border-slate-300 p-2 font-medium">Observasi Kelas (Pembelajaran Mendalam)</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{obsScore}%</td>
                          <td className="border border-slate-300 p-2 text-center">60%</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{(obsScore * 0.6).toFixed(1)}</td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td colSpan={4} className="border border-slate-300 p-2 text-right">TOTAL NILAI AKHIR SUPERVISI:</td>
                          <td className="border border-slate-300 p-2 text-center text-indigo-900 font-black">{finalScore}%</td>
                        </tr>
                        <tr className="bg-emerald-50 text-emerald-900 font-bold">
                          <td colSpan={5} className="border border-slate-300 p-2 text-center">
                            Predikat Kualifikasi Kinerja Guru: {getPredikat(finalScore)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Section C: Temuan & Rekomendasi */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-300 p-3 rounded-lg">
                      <h5 className="font-bold text-[11px] uppercase text-emerald-900 mb-1">
                        Kelebihan & Kekuatan:
                      </h5>
                      <p className="text-[11px] text-slate-700">
                        {praData?.kelebihan || obsData?.catatanSupervisor || 'Perencanaan pembelajaran sistematis, iklim kelas interaktif dan berpusat pada murid.'}
                      </p>
                    </div>
                    <div className="border border-slate-300 p-3 rounded-lg">
                      <h5 className="font-bold text-[11px] uppercase text-indigo-900 mb-1">
                        Rekomendasi Perbaikan:
                      </h5>
                      <p className="text-[11px] text-slate-700">
                        {obsData?.rekomendasi || praData?.rekomendasi || 'Tingkatkan umpan balik formatif seketika dan diferensiasi produk tugas murid.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PROGRAM & JADWAL */}
              {selectedDocType === 'program' && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      PROGRAM KERJA & JADWAL SUPERVISI AKADEMIK
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tahun Pelajaran {schoolSettings.tahunPelajaran} • Semester {schoolSettings.semester}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Program supervisi akademik pada satuan pendidikan {schoolSettings.namaSekolah} bertujuan menjamin mutu pembelajaran berbasis Kurikulum Nasional dengan fokus pada Pembelajaran Mendalam dan penguatan karakter kokurikuler.
                  </p>

                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-1.5 w-8">No</th>
                        <th className="border border-slate-300 p-1.5 text-left">Nama Guru & NIP</th>
                        <th className="border border-slate-300 p-1.5 text-left">Mapel</th>
                        <th className="border border-slate-300 p-1.5 w-12">Kelas</th>
                        <th className="border border-slate-300 p-1.5 w-20">Pra-Obs</th>
                        <th className="border border-slate-300 p-1.5 w-20">Observasi</th>
                        <th className="border border-slate-300 p-1.5 w-20">Pasca-Obs</th>
                        <th className="border border-slate-300 p-1.5">Supervisor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((t, idx) => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 p-1.5 font-bold">
                            {t.nama}
                            <span className="block text-[9px] font-normal text-slate-500">NIP. {t.nip || '-'}</span>
                          </td>
                          <td className="border border-slate-300 p-1.5">{t.mapel}</td>
                          <td className="border border-slate-300 p-1.5 text-center">{t.kelas}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-medium">{t.tglPraObservasi || '-'}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-bold text-indigo-900">{t.tglObservasi || '-'}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-medium">{t.tglPascaObservasi || '-'}</td>
                          <td className="border border-slate-300 p-1.5 text-[10px]">{schoolSettings.kepalaSekolah}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PRA-OBSERVASI */}
              {selectedDocType === 'pra' && activeTeacher && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      INSTRUMEN PRA-OBSERVASI (TELAAH MODUL AJAR)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Guru: {activeTeacher.nama} • Mapel: {activeTeacher.mapel} (Kelas {activeTeacher.kelas})
                    </p>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold">
                        <th className="border border-slate-300 p-1.5 w-8 text-center">No</th>
                        <th className="border border-slate-300 p-1.5 text-left">Komponen Modul Ajar</th>
                        <th className="border border-slate-300 p-1.5 w-28 text-center">Keterlaksanaan</th>
                        <th className="border border-slate-300 p-1.5 text-left">Catatan Telaah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeTeacher.praObservasiData?.items || []).slice(0, 10).map((item, idx) => (
                        <tr key={item.id}>
                          <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 p-1.5 font-medium">{item.komponen}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">
                            {item.ada ? 'Ada / Lengkap' : 'Belum Ada'}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-slate-600">{item.catatan || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* OBSERVASI KELAS */}
              {selectedDocType === 'observasi' && activeTeacher && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      INSTRUMEN OBSERVASI KELAS (PEMBELAJARAN MENDALAM)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Guru: {activeTeacher.nama} • Pelaksanaan: {activeTeacher.tglObservasi || '-'}
                    </p>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold">
                        <th className="border border-slate-300 p-1.5 w-8 text-center">No</th>
                        <th className="border border-slate-300 p-1.5 text-left">Aspek Pengamatan</th>
                        <th className="border border-slate-300 p-1.5 text-left">Indikator Kinerja</th>
                        <th className="border border-slate-300 p-1.5 w-16 text-center">Skor (1-4)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeTeacher.observasiData?.items || []).slice(0, 8).map((item, idx) => (
                        <tr key={item.id}>
                          <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 p-1.5 font-bold">{item.namaKategori}</td>
                          <td className="border border-slate-300 p-1.5">{item.indikator}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-black text-indigo-900">
                            {item.skor}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PASCA OBSERVASI */}
              {selectedDocType === 'pasca' && activeTeacher && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      INSTRUMEN PASCA-OBSERVASI & REFLEKSI GURU
                    </h3>
                    <p className="text-xs text-slate-500">
                      Umpan Balik Konstruktif & Komitmen Rencana Tindak Lanjut
                    </p>
                  </div>

                  <div className="border border-slate-300 p-3 rounded-lg space-y-2">
                    <h5 className="font-bold text-xs uppercase text-indigo-900">
                      Kesepakatan Komitmen Tindak Lanjut:
                    </h5>
                    <p className="text-xs text-slate-700">
                      {activeTeacher.pascaObservasiData?.kesepakatanBersama ||
                        'Guru dan supervisor bersepakat melaksanakan penguatan diferensiasi produk tugas melalui bimbingan klinis dan keikutsertaan aktif di Komunitas Belajar (Kombel) sekolah.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TINDAK LANJUT */}
              {selectedDocType === 'tindak-lanjut' && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      PROGRAM TINDAK LANJUT & EVALUASI SUPERVISI
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tahun Pelajaran {schoolSettings.tahunPelajaran} • Semester {schoolSettings.semester}
                    </p>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-1.5 w-8">No</th>
                        <th className="border border-slate-300 p-1.5 text-left">Nama Guru</th>
                        <th className="border border-slate-300 p-1.5 text-left">Bentuk Pembinaan</th>
                        <th className="border border-slate-300 p-1.5 w-24">Target Waktu</th>
                        <th className="border border-slate-300 p-1.5 w-20">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tindakLanjutList.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 p-1.5 font-bold">{item.namaGuru}</td>
                          <td className="border border-slate-300 p-1.5">{item.bentukTindakLanjut}</td>
                          <td className="border border-slate-300 p-1.5 text-center">{item.targetWaktu}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PERANGKAT AJAR */}
              {selectedDocType === 'perangkat' && activeTeacher && (
                <div className="space-y-4">
                  <div className="text-center space-y-0.5">
                    <h3 className="text-base font-bold text-slate-900 uppercase">
                      LEMBAR PENGESAHAN DOKUMEN PERANGKAT AJAR
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verifikasi Kelayakan Dokumen Kurikulum Nasional Satuan Pendidikan
                    </p>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <tbody>
                      <tr className="border-b border-slate-300">
                        <td className="p-2 font-bold w-48 bg-slate-50">Nama Berkas Perangkat</td>
                        <td className="p-2 font-bold text-indigo-900">
                          {activeTeacher.documents?.[selectedDocumentIndex]?.name ||
                            `Modul_Ajar_${activeTeacher.mapel}.pdf`}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="p-2 font-bold bg-slate-50">Kategori Perangkat</td>
                        <td className="p-2">
                          {activeTeacher.documents?.[selectedDocumentIndex]?.type || 'Modul Ajar'}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="p-2 font-bold bg-slate-50">Guru Pengampu</td>
                        <td className="p-2 font-bold">{activeTeacher.nama} (NIP. {activeTeacher.nip || '-'})</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="p-2 font-bold bg-slate-50">Mata Pelajaran & Kelas</td>
                        <td className="p-2">{activeTeacher.mapel} • Kelas {activeTeacher.kelas}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold bg-slate-50">Status Verifikasi</td>
                        <td className="p-2 text-emerald-800 font-bold">
                          Telah diverifikasi dan disahkan untuk pelaksanaan pembelajaran di kelas.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* --- OFFICIAL SIGNATURE SECTION (3 KOLOM RESMI) --- */}
              <div className="pt-6 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {/* Col 1 */}
                  <div className="space-y-16">
                    <div>
                      <p className="font-semibold text-slate-600">Guru Yang Disupervisi,</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 underline">
                        {activeTeacher ? activeTeacher.nama : 'Guru Pengampu'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        NIP. {activeTeacher?.nip || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="space-y-16">
                    <div>
                      <p className="font-semibold text-slate-600">Mengetahui,</p>
                      <p className="text-[11px] text-slate-500">Pengawas Pembina Sekolah</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 underline">{schoolSettings.pengawas}</p>
                      <p className="text-[10px] text-slate-500">NIP. {schoolSettings.nipPengawas}</p>
                    </div>
                  </div>

                  {/* Col 3 */}
                  <div className="space-y-16">
                    <div>
                      <p className="text-slate-600">
                        {schoolSettings.kabupatenKota},{' '}
                        {new Date().toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-[11px] text-slate-500">Kepala Satuan Pendidikan</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 underline">
                        {schoolSettings.kepalaSekolah}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        NIP. {schoolSettings.nipKepalaSekolah}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Official Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <p>
                  SI SUPAK v2.0 • Inovasi Pengembang: {DEVELOPER_INFO.nama}, {DEVELOPER_INFO.gelar} (
                  {DEVELOPER_INFO.jabatan})
                </p>
                <p>Dokumen Resmi Penjaminan Mutu Satuan Pendidikan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
