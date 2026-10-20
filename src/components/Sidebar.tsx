import React from 'react';
import { useApp } from '../context/AppContext';
import { DEVELOPER_INFO } from '../data/defaultData';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  CalendarDays,
  FileCheck2,
  FileSpreadsheet,
  Target,
  Settings,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Printer,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeMenu,
    setActiveMenu,
    teachers,
    schoolSettings,
    setIsDevModalOpen,
  } = useApp();

  const totalDocuments = teachers.reduce((acc, t) => acc + (t.documents?.length || 0), 0);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Eksekutif',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'guru',
      label: 'Data Guru',
      icon: Users,
      badge: `${teachers.length} Guru`,
    },
    {
      id: 'dokumen',
      label: 'Dokumen Perangkat',
      icon: FolderGit2,
      badge: totalDocuments > 0 ? `${totalDocuments} File` : null,
    },
    {
      id: 'program',
      label: 'Program Supervisi',
      icon: CalendarDays,
      badge: 'Auto Sync',
    },
    {
      id: 'instrumen',
      label: 'Instrumen Supervisi',
      icon: FileCheck2,
      badge: '3 Tahap',
    },
    {
      id: 'laporan',
      label: 'Laporan Hasil',
      icon: FileSpreadsheet,
      badge: 'Siap Cetak',
    },
    {
      id: 'cetak',
      label: 'Cetak Dokumen',
      icon: Printer,
      badge: 'Cetak & PDF',
    },
    {
      id: 'tindak-lanjut',
      label: 'Tindak Lanjut & Evaluasi',
      icon: Target,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } print-hide`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-xl tracking-tight text-white font-mono">
                  SI SUPAK
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Sistem Informasi Supervisi Akademik
              </p>
            </div>
          </div>

          {/* School Badge */}
          <div className="mt-3.5 px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs">
            <div className="truncate pr-2">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                Satuan Pendidikan
              </span>
              <span className="font-semibold text-slate-200 truncate">
                {schoolSettings.namaSekolah}
              </span>
            </div>
            <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Sistem & Konfigurasi
          </div>

          {/* Pengaturan Sekolah (located at the bottom of sidebar as requested) */}
          <button
            onClick={() => {
              setActiveMenu('pengaturan');
              onClose?.();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              activeMenu === 'pengaturan'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings
                className={`w-4 h-4 transition ${
                  activeMenu === 'pengaturan'
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-indigo-400'
                }`}
              />
              <span>Pengaturan Sekolah</span>
            </div>
            {!schoolSettings.isCustomized && (
              <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30" />
            )}
          </button>
        </div>

        {/* Developer Attribution Card */}
        <div className="p-3.5 border-t border-slate-800/90 bg-slate-950/80">
          <div
            onClick={() => setIsDevModalOpen(true)}
            className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-900/50 hover:border-indigo-600/60 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Pengembang Aplikasi
              </div>
              <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-indigo-200 transition truncate">
              {DEVELOPER_INFO.nama}, {DEVELOPER_INFO.gelar}
            </p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              Kepala SMP N 2 Gumelar • Kab. Banyumas
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
