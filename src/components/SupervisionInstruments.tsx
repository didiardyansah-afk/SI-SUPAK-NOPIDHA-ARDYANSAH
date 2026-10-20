import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  PraObservasiItem,
  PraObservasiWawancara,
  ObservasiItem,
  TeacherDocument,
} from '../types';
import {
  DEFAULT_PRA_OBSERVASI_COMPONENTS,
  DEFAULT_PRA_OBSERVASI_WAWANCARA,
  DEFAULT_OBSERVASI_ITEMS,
  DEFAULT_PASCA_REFLEKSI,
  DEFAULT_PASCA_UMPAN_BALIK,
  DEFAULT_PASCA_RENCANA_TINDAK_LANJUT,
} from '../data/defaultData';
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  FileCheck2,
  FileText,
  FileUp,
  HelpCircle,
  Loader2,
  MessageSquare,
  Save,
  Sparkles,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';

export const SupervisionInstruments: React.FC = () => {
  const {
    teachers,
    selectedTeacherId,
    setSelectedTeacherId,
    currentInstrumentTab,
    setCurrentInstrumentTab,
    schoolSettings,
    savePraObservasi,
    saveObservasi,
    savePascaObservasi,
    uploadTeacherDocument,
    generateAINotes,
  } = useApp();

  // Active teacher
  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  // Flexible session states
  const [sessionDate, setSessionDate] = useState('');
  const [sessionClass, setSessionClass] = useState('');
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionSemester, setSessionSemester] = useState<'Ganjil' | 'Genap'>(schoolSettings.semester);
  const [sessionYear, setSessionYear] = useState(schoolSettings.tahunPelajaran);

  // Pra-Observasi State
  const [praItems, setPraItems] = useState<PraObservasiItem[]>(DEFAULT_PRA_OBSERVASI_COMPONENTS);
  const [praWawancara, setPraWawancara] = useState<PraObservasiWawancara[]>(
    DEFAULT_PRA_OBSERVASI_WAWANCARA
  );
  const [praKelebihan, setPraKelebihan] = useState('');
  const [praPerluDitingkatkan, setPraPerluDitingkatkan] = useState('');
  const [praRekomendasi, setPraRekomendasi] = useState('');
  const [isGeneratingPraAI, setIsGeneratingPraAI] = useState(false);

  // Observasi Kelas State
  const [obsItems, setObsItems] = useState<ObservasiItem[]>(DEFAULT_OBSERVASI_ITEMS);
  const [obsCatatan, setObsCatatan] = useState('');
  const [obsRekomendasi, setObsRekomendasi] = useState('');
  const [obsTindakLanjut, setObsTindakLanjut] = useState('');
  const [isGeneratingObsAI, setIsGeneratingObsAI] = useState(false);

  // Pasca-Observasi State
  const [pascaRefleksi, setPascaRefleksi] = useState(DEFAULT_PASCA_REFLEKSI);
  const [pascaUmpanBalik, setPascaUmpanBalik] = useState(DEFAULT_PASCA_UMPAN_BALIK);
  const [pascaRencanaTL, setPascaRencanaTL] = useState(DEFAULT_PASCA_RENCANA_TINDAK_LANJUT);
  const [pascaCatatanSupervisor, setPascaCatatanSupervisor] = useState('');
  const [pascaKesepakatan, setPascaKesepakatan] = useState('');
  const [isGeneratingPascaAI, setIsGeneratingPascaAI] = useState(false);

  // Notification state
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Quick upload in Pra-Observasi
  const [quickUploadName, setQuickUploadName] = useState('');

  // Sync state whenever activeTeacher or tab changes
  useEffect(() => {
    if (!activeTeacher) return;

    setSessionClass(activeTeacher.kelas || 'VII-A');
    setSessionTopic(activeTeacher.materiPokok || '');

    if (currentInstrumentTab === 'pra') {
      setSessionDate(
        activeTeacher.praObservasiData?.tanggal ||
          activeTeacher.tglPraObservasi ||
          new Date().toISOString().slice(0, 10)
      );
      if (activeTeacher.praObservasiData) {
        setPraItems(activeTeacher.praObservasiData.items || DEFAULT_PRA_OBSERVASI_COMPONENTS);
        setPraWawancara(
          activeTeacher.praObservasiData.wawancara || DEFAULT_PRA_OBSERVASI_WAWANCARA
        );
        setPraKelebihan(activeTeacher.praObservasiData.kelebihan || '');
        setPraPerluDitingkatkan(activeTeacher.praObservasiData.perluDitingkatkan || '');
        setPraRekomendasi(activeTeacher.praObservasiData.rekomendasi || '');
      } else {
        setPraItems(DEFAULT_PRA_OBSERVASI_COMPONENTS);
        setPraWawancara(DEFAULT_PRA_OBSERVASI_WAWANCARA);
        setPraKelebihan('');
        setPraPerluDitingkatkan('');
        setPraRekomendasi('');
      }
    } else if (currentInstrumentTab === 'observasi') {
      setSessionDate(
        activeTeacher.observasiData?.tanggal ||
          activeTeacher.tglObservasi ||
          new Date().toISOString().slice(0, 10)
      );
      if (activeTeacher.observasiData) {
        setObsItems(activeTeacher.observasiData.items || DEFAULT_OBSERVASI_ITEMS);
        setObsCatatan(activeTeacher.observasiData.catatanSupervisor || '');
        setObsRekomendasi(activeTeacher.observasiData.rekomendasi || '');
        setObsTindakLanjut(activeTeacher.observasiData.tindakLanjut || '');
      } else {
        setObsItems(DEFAULT_OBSERVASI_ITEMS);
        setObsCatatan('');
        setObsRekomendasi('');
        setObsTindakLanjut('');
      }
    } else if (currentInstrumentTab === 'pasca') {
      setSessionDate(
        activeTeacher.pascaObservasiData?.tanggal ||
          activeTeacher.tglPascaObservasi ||
          new Date().toISOString().slice(0, 10)
      );
      if (activeTeacher.pascaObservasiData) {
        setPascaRefleksi(
          activeTeacher.pascaObservasiData.refleksiGuru || DEFAULT_PASCA_REFLEKSI
        );
        setPascaUmpanBalik(
          activeTeacher.pascaObservasiData.umpanBalik || DEFAULT_PASCA_UMPAN_BALIK
        );
        setPascaRencanaTL(
          activeTeacher.pascaObservasiData.rencanaTindakLanjut ||
            DEFAULT_PASCA_RENCANA_TINDAK_LANJUT
        );
        setPascaCatatanSupervisor(
          activeTeacher.pascaObservasiData.catatanSupervisor || ''
        );
        setPascaKesepakatan(
          activeTeacher.pascaObservasiData.kesepakatanBersama || ''
        );
      } else {
        setPascaRefleksi(DEFAULT_PASCA_REFLEKSI);
        setPascaUmpanBalik(DEFAULT_PASCA_UMPAN_BALIK);
        setPascaRencanaTL(DEFAULT_PASCA_RENCANA_TINDAK_LANJUT);
        setPascaCatatanSupervisor('');
        setPascaKesepakatan('');
      }
    }
  }, [activeTeacher, currentInstrumentTab]);

  // Calculate observation scores
  const totalObsScore = obsItems.reduce((acc, item) => acc + (item.skor || 0), 0);
  const maxObsScore = obsItems.length * 4;
  const obsPercentage =
    maxObsScore > 0 ? Number(((totalObsScore / maxObsScore) * 100).toFixed(1)) : 0;

  const getPredikat = (pct: number): 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' => {
    if (pct >= 86) return 'Sangat Baik';
    if (pct >= 71) return 'Baik';
    if (pct >= 56) return 'Cukup';
    return 'Kurang';
  };

  // Calculate Pra items score
  const praYesCount = praItems.filter((i) => i.ada === true).length;
  const praScorePct = Math.round((praYesCount / praItems.length) * 100);

  // AI Generation Handlers
  const handleGeneratePraAI = async () => {
    if (!activeTeacher) return;
    setIsGeneratingPraAI(true);
    try {
      const res = await generateAINotes({
        stage: 'pra-observasi',
        teacherName: activeTeacher.nama,
        subject: activeTeacher.mapel,
        grade: sessionClass,
        topic: sessionTopic,
        contextData: {
          itemsSummary: praItems.map((i) => ({ no: i.id, komponen: i.komponen, ada: i.ada, catatan: i.catatan })),
          wawancaraSummary: praWawancara,
        },
      });
      if (res && res.data) {
        if (res.data.kelebihan) setPraKelebihan(res.data.kelebihan);
        if (res.data.perluDitingkatkan) setPraPerluDitingkatkan(res.data.perluDitingkatkan);
        if (res.data.rekomendasi) setPraRekomendasi(res.data.rekomendasi);
      }
    } finally {
      setIsGeneratingPraAI(false);
    }
  };

  const handleGenerateObsAI = async () => {
    if (!activeTeacher) return;
    setIsGeneratingObsAI(true);
    try {
      const res = await generateAINotes({
        stage: 'observasi',
        teacherName: activeTeacher.nama,
        subject: activeTeacher.mapel,
        grade: sessionClass,
        topic: sessionTopic,
        contextData: {
          scorePercentage: obsPercentage,
          predikat: getPredikat(obsPercentage),
          items: obsItems.map((i) => ({ kode: i.id, kategori: i.namaKategori, skor: i.skor, bukti: i.buktiPembelajaran, catatan: i.catatan })),
        },
      });
      if (res && res.data) {
        if (res.data.catatanSupervisor) setObsCatatan(res.data.catatanSupervisor);
        if (res.data.rekomendasi) setObsRekomendasi(res.data.rekomendasi);
        if (res.data.tindakLanjut) setObsTindakLanjut(res.data.tindakLanjut);
      }
    } finally {
      setIsGeneratingObsAI(false);
    }
  };

  const handleGeneratePascaAI = async () => {
    if (!activeTeacher) return;
    setIsGeneratingPascaAI(true);
    try {
      const res = await generateAINotes({
        stage: 'pasca-observasi',
        teacherName: activeTeacher.nama,
        subject: activeTeacher.mapel,
        grade: sessionClass,
        topic: sessionTopic,
        contextData: {
          refleksiGuru: pascaRefleksi,
          umpanBalik: pascaUmpanBalik,
          rencanaTindakLanjut: pascaRencanaTL,
        },
      });
      if (res && res.data) {
        if (res.data.catatanSupervisor) setPascaCatatanSupervisor(res.data.catatanSupervisor);
        if (res.data.kesepakatanBersama) setPascaKesepakatan(res.data.kesepakatanBersama);
      }
    } finally {
      setIsGeneratingPascaAI(false);
    }
  };

  // Save Handlers
  const handleSavePra = () => {
    if (!activeTeacher) return;
    savePraObservasi(activeTeacher.id, {
      tanggal: sessionDate,
      kelas: sessionClass,
      materiPokok: sessionTopic,
      items: praItems,
      wawancara: praWawancara,
      kelebihan: praKelebihan,
      perluDitingkatkan: praPerluDitingkatkan,
      rekomendasi: praRekomendasi,
      catatanSupervisor: praRekomendasi,
      skorPersentase: praScorePct,
      predikat: getPredikat(praScorePct),
      savedAt: new Date().toLocaleString('id-ID'),
    });
    setSaveSuccessMsg('Instrumen Pra-Observasi berhasil disimpan!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveObs = () => {
    if (!activeTeacher) return;
    saveObservasi(activeTeacher.id, {
      tanggal: sessionDate,
      kelas: sessionClass,
      materiPokok: sessionTopic,
      items: obsItems,
      skorTotal: totalObsScore,
      skorMaksimal: maxObsScore,
      persentase: obsPercentage,
      predikat: getPredikat(obsPercentage),
      catatanSupervisor: obsCatatan,
      rekomendasi: obsRekomendasi,
      tindakLanjut: obsTindakLanjut,
      savedAt: new Date().toLocaleString('id-ID'),
    });
    setSaveSuccessMsg('Instrumen Observasi Kelas berhasil disimpan!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSavePasca = () => {
    if (!activeTeacher) return;
    savePascaObservasi(activeTeacher.id, {
      tanggal: sessionDate,
      kelas: sessionClass,
      materiPokok: sessionTopic,
      refleksiGuru: pascaRefleksi,
      umpanBalik: pascaUmpanBalik,
      rencanaTindakLanjut: pascaRencanaTL,
      catatanSupervisor: pascaCatatanSupervisor,
      kesepakatanBersama: pascaKesepakatan,
      savedAt: new Date().toLocaleString('id-ID'),
    });
    setSaveSuccessMsg('Instrumen Pasca-Observasi & Kesepakatan berhasil disimpan!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleQuickUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeTeacher || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const name = quickUploadName || file.name;
    const size = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    uploadTeacherDocument(activeTeacher.id, {
      name,
      type: 'Modul Ajar',
      size,
    });
    setQuickUploadName('');
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 3. Panel Input Fleksibel pada Instrumen */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Konfigurasi Sesi Supervisi Digital
            </span>
            <h3 className="text-lg font-bold text-slate-800">Panel Identitas & Instrumen</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Supervisor:</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              {schoolSettings.kepalaSekolah}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Pilih Guru */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Pilih Guru Sasaran *
            </label>
            <select
              value={activeTeacher?.id || ''}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50/40 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama} — {t.mapel} ({t.kelas})
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal Pelaksanaan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Tanggal Pelaksanaan *
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Nama Kelas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nama Kelas *
            </label>
            <input
              type="text"
              placeholder="Contoh: VII-A"
              value={sessionClass}
              onChange={(e) => setSessionClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Semester & Tahun Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Semester & TP
            </label>
            <div className="flex gap-1.5">
              <select
                value={sessionSemester}
                onChange={(e) => setSessionSemester(e.target.value as 'Ganjil' | 'Genap')}
                className="w-1/2 px-2 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
              <input
                type="text"
                value={sessionYear}
                onChange={(e) => setSessionYear(e.target.value)}
                className="w-1/2 px-2 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Materi Pokok Field */}
          <div className="sm:col-span-2 lg:col-span-5">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Materi Pokok Pembelajaran (Subject Matter)
            </label>
            <input
              type="text"
              placeholder="Contoh: Eksplorasi Konsep dan Penerapan Teorema Pythagoras dalam Pemecahan Masalah Kontekstual"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation (Pra, Observasi, Pasca) */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-3 gap-2 shadow-xs">
        <button
          onClick={() => setCurrentInstrumentTab('pra')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            currentInstrumentTab === 'pra'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Pra-Observasi (Telaah Modul Ajar & Wawancara)</span>
        </button>

        <button
          onClick={() => setCurrentInstrumentTab('observasi')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            currentInstrumentTab === 'observasi'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Observasi Kelas (Pembelajaran Mendalam & Kokurikuler)</span>
        </button>

        <button
          onClick={() => setCurrentInstrumentTab('pasca')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            currentInstrumentTab === 'pasca'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>3. Pasca-Observasi (Refleksi & Umpan Balik)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PRA-OBSERVASI */}
      {/* ============================================================== */}
      {currentInstrumentTab === 'pra' && (
        <div className="space-y-6">
          {/* Dokumen RPP / Modul Ajar Section in Pra-Observasi (Requested feature) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Dokumen RPP / Modul Ajar Guru Terlampir
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tinjau atau unggah dokumen perencanaan mengajar guru sebelum melakukan telaah.
                </p>
              </div>

              {/* Quick file upload directly on form */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-200 transition">
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Upload Berkas Modul</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleQuickUploadFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* List of files for this teacher */}
            {activeTeacher.documents && activeTeacher.documents.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeTeacher.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block truncate max-w-[200px]">
                        {doc.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {doc.type} • {doc.size}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Belum ada dokumen perangkat diunggah untuk guru ini. Anda tetap dapat melakukan telaah manual di bawah.</span>
              </div>
            )}
          </div>

          {/* 1. Instrumen Telaah RPP / Modul Ajar (20 Poin Lengkap) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  A. Instrumen Telaah RPP / Modul Ajar
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  20 butir komponen perangkat pembelajaran berdasarkan prinsip Pembelajaran Mendalam
                  dan Kokurikuler.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700">
                <span>Keterpenuhan: {praYesCount} / 20 ({praScorePct}%)</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-3 w-48">Komponen</th>
                    <th className="py-3 px-4">Indikator Pengamatan</th>
                    <th className="py-3 px-3 w-28 text-center">Ada / Sesuai</th>
                    <th className="py-3 px-3 w-72">Catatan Temuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {praItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{item.komponen}</td>
                      <td className="py-3 px-4 text-slate-600 leading-relaxed">{item.indikator}</td>
                      {/* Interactive Yes / No Buttons (✓ / ✕) */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...praItems];
                              updated[index].ada = true;
                              setPraItems(updated);
                            }}
                            className={`p-1.5 rounded-lg transition ${
                              item.ada === true
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-emerald-700'
                            }`}
                            title="Ada / Sesuai"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...praItems];
                              updated[index].ada = false;
                              setPraItems(updated);
                            }}
                            className={`p-1.5 rounded-lg transition ${
                              item.ada === false
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-rose-700'
                            }`}
                            title="Tidak Ada / Belum Sesuai"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      {/* Catatan Field */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          placeholder="Tuliskan catatan spesifik..."
                          value={item.catatan}
                          onChange={(e) => {
                            const updated = [...praItems];
                            updated[index].catatan = e.target.value;
                            setPraItems(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Wawancara Pra-Observasi (6 Pertanyaan Esensial) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                B. Wawancara Pra-Observasi Kesiapan Pembelajaran
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar pertanyaan esensial untuk menggali kesiapan strategi, media, asesmen, dan
                fokus kompetensi sebelum observasi kelas dimulai.
              </p>
            </div>

            <div className="space-y-4">
              {praWawancara.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      {item.pertanyaan}
                    </p>
                  </div>
                  <textarea
                    rows={2}
                    value={item.respon}
                    onChange={(e) => {
                      const updated = [...praWawancara];
                      updated[idx].respon = e.target.value;
                      setPraWawancara(updated);
                    }}
                    placeholder="Tuliskan respon atau catatan wawancara guru..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Catatan Tambahan (Kelebihan, Peningkatan, Rekomendasi PM) with AI Generation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  C. Simpulan Analisis & Rekomendasi Pra-Observasi
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Analisis kekuatan perencanaan dan rekomendasi revisi sesuai prinsip Pembelajaran
                  Mendalam (PM).
                </p>
              </div>

              {/* AI Generation Button */}
              <button
                type="button"
                onClick={handleGeneratePraAI}
                disabled={isGeneratingPraAI}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto disabled:opacity-50"
              >
                {isGeneratingPraAI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>Generate dengan AI</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  1. Kelebihan Perencanaan Pembelajaran
                </label>
                <textarea
                  rows={3}
                  value={praKelebihan}
                  onChange={(e) => setPraKelebihan(e.target.value)}
                  placeholder="Deskripsikan keunggulan modul ajar (misal keterpaduan konsep, pertanyaan pemantik, dsb)..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  2. Hal yang Perlu Ditingkatkan
                </label>
                <textarea
                  rows={3}
                  value={praPerluDitingkatkan}
                  onChange={(e) => setPraPerluDitingkatkan(e.target.value)}
                  placeholder="Aspek yang masih perlu dilengkapi atau disempurnakan..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  3. Rekomendasi & Revisi Sesuai Prinsip Pembelajaran Mendalam (PM)
                </label>
                <textarea
                  rows={3}
                  value={praRekomendasi}
                  onChange={(e) => setPraRekomendasi(e.target.value)}
                  placeholder="Rekomendasi praktis dan operasional untuk dipersiapkan saat observasi kelas..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Simpan Button */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSavePra}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Instrumen Pra-Observasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: OBSERVASI KELAS */}
      {/* ============================================================== */}
      {currentInstrumentTab === 'observasi' && (
        <div className="space-y-6">
          {/* Rubrik Penilaian Observasi Kelas */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Lembar Penilaian Observasi Kelas (Skala 1–4)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mencakup Perencanaan, Pembelajaran Mendalam, Pengelolaan Kelas, Asesmen, dan
                  Kokurikuler.
                </p>
              </div>

              {/* Skor Realtime calculation badge */}
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Capaian Skor
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-slate-900">
                      {totalObsScore} / {maxObsScore}
                    </span>
                    <span className="text-xs font-bold text-indigo-700">({obsPercentage}%)</span>
                  </div>
                </div>
                <div className="border-l border-slate-200 pl-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Predikat
                  </span>
                  <span
                    className={`text-xs font-extrabold ${
                      obsPercentage >= 86
                        ? 'text-emerald-700'
                        : obsPercentage >= 71
                        ? 'text-indigo-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {getPredikat(obsPercentage)}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-16 text-center">Kode</th>
                    <th className="py-3 px-3 w-44">Aspek Penilaian</th>
                    <th className="py-3 px-4">Indikator Kinerja & Pembelajaran</th>
                    <th className="py-3 px-3 w-36 text-center">Skor (1–4)</th>
                    <th className="py-3 px-3 w-48">Bukti Pembelajaran</th>
                    <th className="py-3 px-3 w-48">Catatan Pengamatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {obsItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-3 text-center font-bold text-indigo-600 bg-indigo-50/30">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-800">{item.namaKategori}</td>
                      <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{item.indikator}</td>
                      {/* Skor Buttons 1, 2, 3, 4 */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                          {([1, 2, 3, 4] as const).map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => {
                                const updated = [...obsItems];
                                updated[index].skor = score;
                                setObsItems(updated);
                              }}
                              className={`w-6 h-6 rounded-lg text-xs font-bold transition ${
                                item.skor === score
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </td>
                      {/* Bukti Pembelajaran */}
                      <td className="py-3.5 px-3">
                        <textarea
                          rows={2}
                          value={item.buktiPembelajaran}
                          onChange={(e) => {
                            const updated = [...obsItems];
                            updated[index].buktiPembelajaran = e.target.value;
                            setObsItems(updated);
                          }}
                          placeholder="Fakta atau bukti teramati..."
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                      {/* Catatan Pengamatan */}
                      <td className="py-3.5 px-3">
                        <textarea
                          rows={2}
                          value={item.catatan}
                          onChange={(e) => {
                            const updated = [...obsItems];
                            updated[index].catatan = e.target.value;
                            setObsItems(updated);
                          }}
                          placeholder="Catatan supervisor..."
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Supervisor Notes, Recommendations & Follow-Up with AI Generation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Catatan Akhir Supervisor, Rekomendasi, & Tindak Lanjut Observasi
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rumuskan evaluasi komprehensif setelah proses observasi kelas berlangsung.
                </p>
              </div>

              {/* AI Button */}
              <button
                type="button"
                onClick={handleGenerateObsAI}
                disabled={isGeneratingObsAI}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto disabled:opacity-50"
              >
                {isGeneratingObsAI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>Generate dengan AI</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan Menyeluruh Supervisor
                </label>
                <textarea
                  rows={3}
                  value={obsCatatan}
                  onChange={(e) => setObsCatatan(e.target.value)}
                  placeholder="Catatan mengenai suasana kelas, keterlibatan murid, dan penguasaan pembelajaran mendalam..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rekomendasi Perbaikan Pembelajaran
                </label>
                <textarea
                  rows={3}
                  value={obsRekomendasi}
                  onChange={(e) => setObsRekomendasi(e.target.value)}
                  placeholder="Rekomendasi konkrit untuk meningkatkan pembelajaran..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rencana Aksi Tindak Lanjut
                </label>
                <textarea
                  rows={3}
                  value={obsTindakLanjut}
                  onChange={(e) => setObsTindakLanjut(e.target.value)}
                  placeholder="Bentuk kegiatan tindak lanjut yang akan dilaksanakan guru..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveObs}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Instrumen Observasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: PASCA-OBSERVASI */}
      {/* ============================================================== */}
      {currentInstrumentTab === 'pasca' && (
        <div className="space-y-6">
          {/* A. Refleksi Guru (5 Pertanyaan Terstruktur) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                A. Refleksi Guru Pasca-Observasi
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                5 pertanyaan reflektif untuk memfasilitasi evaluasi diri guru terhadap proses belajar
                yang telah dilaksanakan.
              </p>
            </div>

            <div className="space-y-4">
              {pascaRefleksi.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      {item.pertanyaan}
                    </p>
                  </div>
                  <textarea
                    rows={2}
                    value={item.respon}
                    onChange={(e) => {
                      const updated = [...pascaRefleksi];
                      updated[idx].respon = e.target.value;
                      setPascaRefleksi(updated);
                    }}
                    placeholder="Tuliskan respon atau evaluasi diri guru..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* B. Umpan Balik Supervisor (5 Aspek: Apresiasi & Area Pengembangan) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h4 className="font-extrabold text-base text-slate-900">
                B. Umpan Balik Konstruktif Supervisor
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Mencakup 5 aspek kunci: Perencanaan, Pembelajaran Mendalam, Pengelolaan Kelas,
                Asesmen, dan Refleksi.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold tracking-wider text-slate-600">
                  <tr>
                    <th className="py-3 px-4 w-48">Aspek</th>
                    <th className="py-3 px-4">Apresiasi (Kekuatan yang Ditemukan)</th>
                    <th className="py-3 px-4">Area Pengembangan / Rekomendasi Perbaikan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pascaUmpanBalik.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-800 bg-slate-50/50">
                        {item.aspek}
                      </td>
                      <td className="py-3.5 px-4">
                        <textarea
                          rows={2}
                          value={item.apresiasi}
                          onChange={(e) => {
                            const updated = [...pascaUmpanBalik];
                            updated[idx].apresiasi = e.target.value;
                            setPascaUmpanBalik(updated);
                          }}
                          placeholder="Kekuatan guru..."
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <textarea
                          rows={2}
                          value={item.areaPengembangan}
                          onChange={(e) => {
                            const updated = [...pascaUmpanBalik];
                            updated[idx].areaPengembangan = e.target.value;
                            setPascaUmpanBalik(updated);
                          }}
                          placeholder="Area yang perlu ditingkatkan..."
                          className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* C. Rencana Tindak Lanjut yang Disepakati (5 Aspek) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h4 className="font-extrabold text-base text-slate-900">
                C. Rencana Tindak Lanjut yang Disepakati
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tindakan nyata perbaikan pembelajaran beserta penanggung jawab dan waktu
                pelaksanaan.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold tracking-wider text-slate-600">
                  <tr>
                    <th className="py-3 px-4 w-52">Aspek Sasaran</th>
                    <th className="py-3 px-4">Tindak Lanjut yang Disepakati</th>
                    <th className="py-3 px-4 w-44">Penanggung Jawab</th>
                    <th className="py-3 px-4 w-44">Waktu Pelaksanaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pascaRencanaTL.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-bold text-slate-800 bg-slate-50/50">
                        {item.aspek}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={item.tindakLanjut}
                          onChange={(e) => {
                            const updated = [...pascaRencanaTL];
                            updated[idx].tindakLanjut = e.target.value;
                            setPascaRencanaTL(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={item.penanggungJawab}
                          onChange={(e) => {
                            const updated = [...pascaRencanaTL];
                            updated[idx].penanggungJawab = e.target.value;
                            setPascaRencanaTL(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={item.waktuPelaksanaan}
                          onChange={(e) => {
                            const updated = [...pascaRencanaTL];
                            updated[idx].waktuPelaksanaan = e.target.value;
                            setPascaRencanaTL(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* D. Catatan Supervisor & Kesepakatan Bersama with AI Generation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  D. Catatan Supervisor & Kesepakatan Bersama
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simpulan akhir sesi bimbingan klinis dan komitmen bersama antara supervisor dan
                  guru.
                </p>
              </div>

              {/* AI Button */}
              <button
                type="button"
                onClick={handleGeneratePascaAI}
                disabled={isGeneratingPascaAI}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto disabled:opacity-50"
              >
                {isGeneratingPascaAI ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>Generate dengan AI</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan Supervisor
                </label>
                <textarea
                  rows={3}
                  value={pascaCatatanSupervisor}
                  onChange={(e) => setPascaCatatanSupervisor(e.target.value)}
                  placeholder="Catatan penutup supervisor mengenai kemajuan guru..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kesepakatan Bersama
                </label>
                <textarea
                  rows={3}
                  value={pascaKesepakatan}
                  onChange={(e) => setPascaKesepakatan(e.target.value)}
                  placeholder="Pernyataan kesepakatan komitmen bersama guru dan supervisor..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSavePasca}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Instrumen Pasca-Observasi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
