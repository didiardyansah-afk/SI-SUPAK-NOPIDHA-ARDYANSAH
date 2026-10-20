import React from 'react';
import { useApp } from '../context/AppContext';
import { DEVELOPER_INFO } from '../data/defaultData';
import {
  Menu,
  School,
  Calendar,
  Sparkles,
  Printer,
  UserCheck,
} from 'lucide-react';
import { printHtmlElement } from '../utils/printDocument';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    activeMenu,
    schoolSettings,
    setIsDevModalOpen,
    setActiveMenu,
  } = useApp();

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'dashboard':
        return 'Dashboard Eksekutif';
      case 'guru':
        return 'Manajemen Data Guru';
      case 'dokumen':
        return 'Dokumen Perangkat Pembelajaran';
      case 'program':
        return 'Program Supervisi Akademik';
      case 'instrumen':
        return 'Instrumen Supervisi Digital';
      case 'laporan':
        return 'Laporan Hasil Supervisi';
      case 'cetak':
        return 'Pusat Cetak Dokumen & Ekspor';
      case 'tindak-lanjut':
        return 'Tindak Lanjut & Evaluasi Pembelajaran';
      case 'pengaturan':
        return 'Pengaturan Identitas Sekolah';
      default:
        return 'SI SUPAK';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 print-hide">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 transition"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                SI SUPAK
              </span>
              <span className="text-slate-300">/</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                {getPageTitle()}
              </h2>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {schoolSettings.namaSekolah} • Semester {schoolSettings.semester} TP {schoolSettings.tahunPelajaran}
            </p>
          </div>
        </div>

        {/* Right: Badges & Developer Attribution Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supervisor / Kepala Sekolah Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/70 text-xs">
            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                Supervisor
              </span>
              <span className="font-semibold text-slate-700 max-w-[140px] truncate block">
                {schoolSettings.kepalaSekolah}
              </span>
            </div>
          </div>

          {/* Quick Print Button when on Laporan or Program */}
          {(activeMenu === 'laporan' || activeMenu === 'program') && (
            <button
              onClick={() => {
                const targetId =
                  activeMenu === 'laporan'
                    ? '#printable-supervision-report'
                    : '#printable-supervision-program';
                printHtmlElement(targetId, 'Dokumen SI SUPAK');
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              title="Cetak Dokumen Resmi A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Dokumen</span>
            </button>
          )}

          {/* Developer Attribution Button */}
          <button
            onClick={() => setIsDevModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-semibold transition group shadow-xs"
            title="Klik untuk melihat profil pengembang aplikasi"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Pengembang:</span>
            <span className="font-bold truncate max-w-[120px] sm:max-w-none">
              Nopidha Ardyansah
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
