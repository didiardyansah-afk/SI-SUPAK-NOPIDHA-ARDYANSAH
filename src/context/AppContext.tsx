import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SchoolSettings,
  Teacher,
  PraObservasiData,
  ObservasiData,
  PascaObservasiData,
  TindakLanjutProgram,
  TeacherDocument,
} from '../types';
import {
  DEFAULT_SCHOOL_SETTINGS,
  DEFAULT_TEACHERS,
  DEFAULT_TINDAK_LANJUT_LIST,
} from '../data/defaultData';

interface AppContextType {
  schoolSettings: SchoolSettings;
  teachers: Teacher[];
  tindakLanjutList: TindakLanjutProgram[];
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  selectedTeacherId: string;
  setSelectedTeacherId: (id: string) => void;
  currentInstrumentTab: 'pra' | 'observasi' | 'pasca';
  setCurrentInstrumentTab: (tab: 'pra' | 'observasi' | 'pasca') => void;
  isDevModalOpen: boolean;
  setIsDevModalOpen: (open: boolean) => void;

  updateSchoolSettings: (settings: Partial<SchoolSettings>) => void;
  resetSchoolSettings: () => void;
  addTeacher: (teacher: {
    nama: string;
    nip: string;
    pangkatGolongan?: string;
    mapel: string;
    kelas: string;
    materiPokok?: string;
    tglPraObservasi?: string;
    tglObservasi?: string;
    tglPascaObservasi?: string;
  }) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  uploadTeacherDocument: (
    teacherId: string,
    doc: { name: string; type: TeacherDocument['type']; size: string; dataUrl?: string }
  ) => void;
  deleteTeacherDocument: (teacherId: string, docId: string) => void;

  savePraObservasi: (teacherId: string, data: PraObservasiData) => void;
  saveObservasi: (teacherId: string, data: ObservasiData) => void;
  savePascaObservasi: (teacherId: string, data: PascaObservasiData) => void;

  addTindakLanjut: (item: Omit<TindakLanjutProgram, 'id'>) => void;
  updateTindakLanjut: (id: string, item: Partial<TindakLanjutProgram>) => void;
  deleteTindakLanjut: (id: string) => void;

  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => boolean;
  resetAllData: () => void;

  generateAINotes: (params: {
    stage: 'pra-observasi' | 'observasi' | 'pasca-observasi';
    teacherName: string;
    subject: string;
    grade: string;
    topic: string;
    contextData: any;
  }) => Promise<{ success: boolean; data: any }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'si_supak_settings_v2',
  TEACHERS: 'si_supak_teachers_v2',
  TINDAK_LANJUT: 'si_supak_tindak_lanjut_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize School Settings
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading settings from localStorage:', e);
    }
    return DEFAULT_SCHOOL_SETTINGS;
  });

  // Initialize Teachers
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading teachers from localStorage:', e);
    }
    return DEFAULT_TEACHERS;
  });

  // Initialize Follow-up list
  const [tindakLanjutList, setTindakLanjutList] = useState<TindakLanjutProgram[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TINDAK_LANJUT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading follow-up list from localStorage:', e);
    }
    return DEFAULT_TINDAK_LANJUT_LIST;
  });

  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    DEFAULT_TEACHERS[0]?.id || ''
  );
  const [currentInstrumentTab, setCurrentInstrumentTab] = useState<'pra' | 'observasi' | 'pasca'>(
    'pra'
  );
  const [isDevModalOpen, setIsDevModalOpen] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(schoolSettings));
    } catch (e) {
      console.error('Error writing settings to localStorage:', e);
    }
  }, [schoolSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    } catch (e) {
      console.error('Error writing teachers to localStorage:', e);
    }
  }, [teachers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TINDAK_LANJUT, JSON.stringify(tindakLanjutList));
    } catch (e) {
      console.error('Error writing tindak lanjut to localStorage:', e);
    }
  }, [tindakLanjutList]);

  // Methods
  const updateSchoolSettings = (settings: Partial<SchoolSettings>) => {
    setSchoolSettings((prev) => ({
      ...prev,
      ...settings,
      isCustomized: true,
    }));
  };

  const resetSchoolSettings = () => {
    setSchoolSettings(DEFAULT_SCHOOL_SETTINGS);
  };

  const addTeacher = (teacher: {
    nama: string;
    nip: string;
    pangkatGolongan?: string;
    mapel: string;
    kelas: string;
    materiPokok?: string;
    tglPraObservasi?: string;
    tglObservasi?: string;
    tglPascaObservasi?: string;
  }) => {
    const newTeacher: Teacher = {
      id: `guru-${Date.now()}`,
      nama: teacher.nama,
      nip: teacher.nip,
      pangkatGolongan: teacher.pangkatGolongan || 'Penata Muda / III-a',
      mapel: teacher.mapel,
      kelas: teacher.kelas,
      materiPokok: teacher.materiPokok || 'Materi Pembelajaran Mendalam',
      tglPraObservasi: teacher.tglPraObservasi || '',
      tglObservasi: teacher.tglObservasi || '',
      tglPascaObservasi: teacher.tglPascaObservasi || '',
      status: 'Belum',
      documents: [],
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    setSelectedTeacherId(newTeacher.id);
  };

  const updateTeacher = (id: string, updatedFields: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const merged = { ...t, ...updatedFields };
          // Check auto-status
          if (merged.pascaObservasiData && merged.observasiData) {
            merged.status = 'Selesai';
          } else if (merged.praObservasiData || merged.observasiData) {
            merged.status = 'Sedang Berjalan';
          }
          return merged;
        }
        return t;
      })
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    if (selectedTeacherId === id) {
      const remaining = teachers.filter((t) => t.id !== id);
      setSelectedTeacherId(remaining[0]?.id || '');
    }
  };

  const uploadTeacherDocument = (
    teacherId: string,
    doc: { name: string; type: TeacherDocument['type']; size: string; dataUrl?: string }
  ) => {
    const newDoc: TeacherDocument = {
      id: `doc-${Date.now()}`,
      name: doc.name,
      type: doc.type,
      size: doc.size,
      uploadDate: new Date().toISOString().split('T')[0],
      dataUrl: doc.dataUrl,
    };

    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          return {
            ...t,
            documents: [newDoc, ...(t.documents || [])],
          };
        }
        return t;
      })
    );
  };

  const deleteTeacherDocument = (teacherId: string, docId: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          return {
            ...t,
            documents: (t.documents || []).filter((d) => d.id !== docId),
          };
        }
        return t;
      })
    );
  };

  const savePraObservasi = (teacherId: string, data: PraObservasiData) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          const updated: Teacher = {
            ...t,
            kelas: data.kelas || t.kelas,
            materiPokok: data.materiPokok || t.materiPokok,
            tglPraObservasi: data.tanggal || t.tglPraObservasi,
            praObservasiData: data,
            status: t.observasiData && t.pascaObservasiData ? 'Selesai' : 'Sedang Berjalan',
          };
          return updated;
        }
        return t;
      })
    );
  };

  const saveObservasi = (teacherId: string, data: ObservasiData) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          const updated: Teacher = {
            ...t,
            kelas: data.kelas || t.kelas,
            materiPokok: data.materiPokok || t.materiPokok,
            tglObservasi: data.tanggal || t.tglObservasi,
            observasiData: data,
            status: t.pascaObservasiData ? 'Selesai' : 'Sedang Berjalan',
          };
          return updated;
        }
        return t;
      })
    );
  };

  const savePascaObservasi = (teacherId: string, data: PascaObservasiData) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          const updated: Teacher = {
            ...t,
            kelas: data.kelas || t.kelas,
            materiPokok: data.materiPokok || t.materiPokok,
            tglPascaObservasi: data.tanggal || t.tglPascaObservasi,
            pascaObservasiData: data,
            status: 'Selesai',
          };
          return updated;
        }
        return t;
      })
    );
  };

  const addTindakLanjut = (item: Omit<TindakLanjutProgram, 'id'>) => {
    const newItem: TindakLanjutProgram = {
      id: `tl-${Date.now()}`,
      ...item,
    };
    setTindakLanjutList((prev) => [newItem, ...prev]);
  };

  const updateTindakLanjut = (id: string, item: Partial<TindakLanjutProgram>) => {
    setTindakLanjutList((prev) => prev.map((t) => (t.id === id ? { ...t, ...item } : t)));
  };

  const deleteTindakLanjut = (id: string) => {
    setTindakLanjutList((prev) => prev.filter((t) => t.id !== id));
  };

  const exportBackupJSON = () => {
    const backupData = {
      version: 'SI_SUPAK_v2.0',
      exportedAt: new Date().toISOString(),
      schoolSettings,
      teachers,
      tindakLanjutList,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_SI_SUPAK_${schoolSettings.namaSekolah.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.schoolSettings && Array.isArray(data.teachers)) {
        setSchoolSettings(data.schoolSettings);
        setTeachers(data.teachers);
        if (Array.isArray(data.tindakLanjutList)) {
          setTindakLanjutList(data.tindakLanjutList);
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to import backup JSON:', e);
    }
    return false;
  };

  const resetAllData = () => {
    setSchoolSettings(DEFAULT_SCHOOL_SETTINGS);
    setTeachers(DEFAULT_TEACHERS);
    setTindakLanjutList(DEFAULT_TINDAK_LANJUT_LIST);
    setSelectedTeacherId(DEFAULT_TEACHERS[0]?.id || '');
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.TINDAK_LANJUT);
  };

  const generateAINotes = async (params: {
    stage: 'pra-observasi' | 'observasi' | 'pasca-observasi';
    teacherName: string;
    subject: string;
    grade: string;
    topic: string;
    contextData: any;
  }) => {
    try {
      const res = await fetch('/api/ai/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      console.warn('Network or server error during AI call, fallback applied:', err);
    }

    // Client-side fallback if server is unreachable
    if (params.stage === 'pra-observasi') {
      return {
        success: true,
        data: {
          kelebihan: `Modul ajar yang disusun oleh ${params.teacherName} untuk materi ${params.topic || params.subject} terstruktur sistematis. Alur pembelajaran berpusat pada murid, tujuan pembelajaran jelas, dan mengintegrasikan nilai dimensi Kokurikuler secara kontekstual.`,
          perluDitingkatkan: `Perlu diperkuat diferensiasi proses dan variasi pilihan produk hasil belajar bagi murid dengan berbagai profil minat.`,
          rekomendasi: `Lengkapi Lembar Kerja Murid (LKM) berbasis pemecahan masalah nyata (Pembelajaran Mendalam) dan siapkan rubrik asesmen formatif berkelanjutan.`,
        },
      };
    } else if (params.stage === 'observasi') {
      return {
        success: true,
        data: {
          catatanSupervisor: `Pelaksanaan pembelajaran ${params.subject} di kelas ${params.grade} berjalan komunikatif, interaktif, dan kondusif. Guru ${params.teacherName} berhasil memfasilitasi diskusi kritis dan inquiry murid dengan baik.`,
          rekomendasi: `1. Optimalkan alokasi waktu presentasi dan perumusan simpulan pembelajaran.\n2. Tingkatkan pemberian umpan balik langsung (immediate feedback) saat diskusi kelompok berlangsung.`,
          tindakLanjut: `Guru mendiseminasikan praktik baik penerapan pembelajaran mendalam ini dalam kegiatan Komunitas Belajar (Kombel) sekolah.`,
        },
      };
    } else {
      return {
        success: true,
        data: {
          catatanSupervisor: `Berdasarkan refleksi pasca-observasi, guru ${params.teacherName} memiliki metakognisi pembelajaran yang tajam dan responsif terhadap penguatan kualitas pengajaran berpusat pada murid.`,
          kesepakatanBersama: `Supervisor dan ${params.teacherName} bersepakat untuk menerapkan diferensiasi produk dan metode rotasi kelompok pada siklus pembelajaran berikutnya.`,
        },
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        schoolSettings,
        teachers,
        tindakLanjutList,
        activeMenu,
        setActiveMenu,
        selectedTeacherId,
        setSelectedTeacherId,
        currentInstrumentTab,
        setCurrentInstrumentTab,
        isDevModalOpen,
        setIsDevModalOpen,
        updateSchoolSettings,
        resetSchoolSettings,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        uploadTeacherDocument,
        deleteTeacherDocument,
        savePraObservasi,
        saveObservasi,
        savePascaObservasi,
        addTindakLanjut,
        updateTindakLanjut,
        deleteTindakLanjut,
        exportBackupJSON,
        importBackupJSON,
        resetAllData,
        generateAINotes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
