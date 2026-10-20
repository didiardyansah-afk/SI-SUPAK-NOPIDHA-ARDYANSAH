import React from 'react';
import { useApp } from '../context/AppContext';
import { DEVELOPER_INFO } from '../data/defaultData';
import { Award, BookOpen, CheckCircle, GraduationCap, MapPin, School, Sparkles, X } from 'lucide-react';

export const DeveloperModal: React.FC = () => {
  const { isDevModalOpen, setIsDevModalOpen } = useApp();

  if (!isDevModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 p-6 text-white relative">
          <button
            onClick={() => setIsDevModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Profil Pengembang Aplikasi
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">SI SUPAK</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Sistem Informasi Supervisi Akademik Berbasis Kurikulum Nasional
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Developer Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-gradient-to-br from-indigo-50/80 to-sky-50/50 rounded-2xl border border-indigo-100">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20 shrink-0 border-2 border-white">
              NA
            </div>
            <div className="text-center sm:text-left space-y-2">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Pengembang & Inovator Sistem
                </span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
                  {DEVELOPER_INFO.nama}, {DEVELOPER_INFO.gelar}
                </h3>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-700 font-medium">
                <School className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{DEVELOPER_INFO.sekolah}</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>
                  {DEVELOPER_INFO.kabupaten}, {DEVELOPER_INFO.provinsi}
                </span>
              </div>
            </div>
          </div>

          {/* Vision & Objectives */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Dedikasi & Tujuan Pengembangan
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Aplikasi <strong>SI SUPAK (Sistem Informasi Supervisi Akademik)</strong> dirancang dan
              dikembangkan secara profesional oleh{' '}
              <strong>{DEVELOPER_INFO.nama}, {DEVELOPER_INFO.gelar}</strong> untuk membantu Kepala
              Sekolah dan Pengawas Pembina dalam mengoptimalkan tata kelola supervisi akademik secara
              terukur, transparan, dan berdampak nyata terhadap perbaikan proses pembelajaran di kelas.
            </p>
          </div>

          {/* Key Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Kurikulum Nasional Terbaru</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Memuat integrasi Pembelajaran Mendalam dan dimensi Kokurikuler.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Sinkronisasi Otomatis</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jadwal supervisi otomatis tersusun rapi dari data guru dan profil supervisor.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Bantuan Rekomendasi AI</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ditenagai kecerdasan buatan untuk analisis temuan dan rekomendasi tindak lanjut.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Laporan Siap Cetak</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Format formal dengan Kop Surat dinamis dan pengesahan resmi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Versi Resmi SI SUPAK 2.0 • Hak Cipta &copy; 2024-2026</span>
          </div>
          <button
            onClick={() => setIsDevModalOpen(false)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
