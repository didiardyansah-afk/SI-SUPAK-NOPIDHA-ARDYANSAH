import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherDocument } from '../types';
import {
  Download,
  FileCheck2,
  FilePlus,
  FileText,
  FolderOpen,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  User,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Printer,
  FileDown,
} from 'lucide-react';
import { exportTeacherDocumentToPDF } from '../utils/exportPdf';
import { printHtmlElement } from '../utils/printDocument';

export const TeacherDocuments: React.FC = () => {
  const {
    teachers,
    schoolSettings,
    selectedTeacherId,
    setSelectedTeacherId,
    uploadTeacherDocument,
    deleteTeacherDocument,
    setActiveMenu,
  } = useApp();

  const [searchTeacher, setSearchTeacher] = useState('');
  const [docType, setDocType] = useState<TeacherDocument['type']>('Modul Ajar');
  const [docName, setDocName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Active teacher
  const activeTeacher =
    teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!docName) {
        setDocName(file.name);
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher) return;

    setIsUploading(true);
    const fileName =
      docName ||
      (selectedFile ? selectedFile.name : `Perangkat_${docType}_${activeTeacher.mapel}.pdf`);
    const fileSize = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : '1.5 MB';

    setTimeout(() => {
      uploadTeacherDocument(activeTeacher.id, {
        name: fileName,
        type: docType,
        size: fileSize,
      });
      setIsUploading(false);
      setDocName('');
      setSelectedFile(null);
    }, 300);
  };

  const handleSimulateDownload = (doc: TeacherDocument) => {
    // Export official PDF for the document
    if (activeTeacher) {
      exportTeacherDocumentToPDF(activeTeacher, doc, schoolSettings);
    } else {
      const content = `Dokumen Perangkat: ${doc.name}\nJenis: ${doc.type}\nSatuan Pendidikan: ${schoolSettings.namaSekolah}\nDiunggah pada: ${doc.uploadDate}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePrintDocument = (doc: TeacherDocument) => {
    if (!activeTeacher) return;
    // Export PDF and open Print Dialog
    exportTeacherDocumentToPDF(activeTeacher, doc, schoolSettings);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const filteredTeachers = teachers.filter((t) =>
    t.nama.toLowerCase().includes(searchTeacher.toLowerCase()) ||
    t.mapel.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-600" />
            Pusat Manajemen Dokumen Perangkat Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pusat arsip Modul Ajar, RPP, LKPD, dan instrumen asesmen guru yang sinkron dengan seluruh
            tahapan supervisi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveMenu('cetak')}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Menu Cetak Dokumen</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Sinkron Otomatis</span>
          </div>
        </div>
      </div>

      {/* Bento Layout Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Teacher Selection Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col h-[650px]">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              Pilih Guru Pengampu
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari guru atau mapel..."
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredTeachers.map((teacher) => {
              const isSelected = activeTeacher?.id === teacher.id;
              const docCount = teacher.documents?.length || 0;
              return (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacherId(teacher.id)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="truncate">
                    <p
                      className={`text-sm font-bold truncate ${
                        isSelected ? 'text-indigo-900' : 'text-slate-800'
                      }`}
                    >
                      {teacher.nama}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {teacher.mapel} • Kelas {teacher.kelas}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      docCount > 0
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {docCount} Dokumen
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Teacher Document Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeTeacher ? (
            <>
              {/* Active Teacher Info Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{activeTeacher.nama}</h3>
                    <p className="text-xs text-slate-500">
                      NIP. {activeTeacher.nip || '-'} • Mapel:{' '}
                      <span className="font-semibold text-indigo-700">{activeTeacher.mapel}</span> (Kelas{' '}
                      {activeTeacher.kelas})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold">
                    Status: {activeTeacher.status}
                  </span>
                </div>
              </div>

              {/* Upload Card */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <UploadCloud className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-base">Unggah Berkas Perangkat Ajar Baru</h4>
                </div>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Unggah file PDF / Dokumen Modul Ajar, RPP, atau LKPD untuk ditelaah pada tahap
                  Pra-Observasi dan pelaksanaan kelas.
                </p>

                <form onSubmit={handleUploadSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-indigo-200 uppercase mb-1">
                        Kategori Perangkat
                      </label>
                      <select
                        value={docType}
                        onChange={(e) =>
                          setDocType(e.target.value as TeacherDocument['type'])
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      >
                        <option value="Modul Ajar">Modul Ajar Kurikulum Nasional</option>
                        <option value="RPP">RPP Pembelajaran Mendalam</option>
                        <option value="LKPD">Lembar Kerja Murid (LKPD)</option>
                        <option value="Bahan Ajar">Bahan Ajar & Media Presentasi</option>
                        <option value="Instrumen Asesmen">Rubrik & Instrumen Asesmen</option>
                        <option value="Lainnya">Dokumen Pendukung Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-indigo-200 uppercase mb-1">
                        Pilih Berkas Komputer
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={handleFileChange}
                        className="w-full text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-indigo-200 uppercase mb-1">
                      Judul / Label File
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Modul_Ajar_Pythagoras_Berdiferensiasi.pdf"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition flex items-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{isUploading ? 'Sedang Menyimpan...' : 'Upload Dokumen Sekarang'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Documents List */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Berkas Tersimpan ({activeTeacher.documents?.length || 0})
                  </h4>
                  <span className="text-xs text-slate-400">Tersimpan di perangkat lokal</span>
                </div>

                {!activeTeacher.documents || activeTeacher.documents.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <FilePlus className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">
                      Belum ada dokumen perangkat untuk guru ini.
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Gunakan form di atas untuk melampirkan Modul Ajar atau RPP sebelum pelaksanaan
                      observasi telaah.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeTeacher.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider mb-1">
                              {doc.type}
                            </span>
                            <h5 className="font-bold text-sm text-slate-800 truncate" title={doc.name}>
                              {doc.name}
                            </h5>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Ukuran: {doc.size} • Diunggah: {doc.uploadDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleSimulateDownload(doc)}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition"
                              title="Unduh berkas PDF dokumen"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>Unduh PDF</span>
                            </button>

                            <button
                              onClick={() => handlePrintDocument(doc)}
                              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition"
                              title="Cetak lembar verifikasi dokumen ke printer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak Dokumen</span>
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus dokumen ${doc.name}?`)) {
                                deleteTeacherDocument(activeTeacher.id, doc.id);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded-md transition"
                            title="Hapus berkas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
              Pilih guru di sebelah kiri untuk melihat dan mengunggah dokumen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
