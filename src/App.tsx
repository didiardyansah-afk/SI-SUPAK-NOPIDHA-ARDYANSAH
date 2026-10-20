import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TeacherManagement } from './components/TeacherManagement';
import { TeacherDocuments } from './components/TeacherDocuments';
import { SupervisionProgram } from './components/SupervisionProgram';
import { SupervisionInstruments } from './components/SupervisionInstruments';
import { SupervisionReport } from './components/SupervisionReport';
import { DocumentPrintCenter } from './components/DocumentPrintCenter';
import { FollowUpEvaluation } from './components/FollowUpEvaluation';
import { SchoolSettingsView } from './components/SchoolSettingsView';
import { DeveloperModal } from './components/DeveloperModal';
import { DEVELOPER_INFO } from './data/defaultData';
import { Heart, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeMenu, setIsDevModalOpen } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'guru':
        return <TeacherManagement />;
      case 'dokumen':
        return <TeacherDocuments />;
      case 'program':
        return <SupervisionProgram />;
      case 'instrumen':
        return <SupervisionInstruments />;
      case 'laporan':
        return <SupervisionReport />;
      case 'cetak':
        return <DocumentPrintCenter />;
      case 'tindak-lanjut':
        return <FollowUpEvaluation />;
      case 'pengaturan':
        return <SchoolSettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

        {/* Global Footer with Requested Developer Attribution */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 print-hide">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
            <div>
              <p className="font-extrabold text-slate-800">
                SI SUPAK — Sistem Informasi Supervisi Akademik
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Terintegrasi Kurikulum Nasional, Pembelajaran Mendalam, dan Dimensi Kokurikuler.
              </p>
            </div>

            {/* Prominent Developer Attribution */}
            <div className="flex flex-col sm:items-end">
              <button
                onClick={() => setIsDevModalOpen(true)}
                className="group inline-flex items-center gap-1.5 font-bold text-indigo-700 hover:text-indigo-900 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pengembang: {DEVELOPER_INFO.nama}, {DEVELOPER_INFO.gelar}</span>
              </button>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {DEVELOPER_INFO.jabatan}
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Profile Pengembang */}
      <DeveloperModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
