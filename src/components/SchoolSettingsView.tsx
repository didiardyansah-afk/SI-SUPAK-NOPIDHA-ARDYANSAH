import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolSettings } from '../types';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Download,
  Eye,
  FileCheck2,
  GraduationCap,
  RefreshCw,
  RotateCcw,
  Save,
  School,
  Settings,
  ShieldCheck,
  Upload,
  UserCheck,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { LOGO_PRESETS } from '../data/defaultData';

export const SchoolSettingsView: React.FC = () => {
  const {
    schoolSettings,
    updateSchoolSettings,
    resetSchoolSettings,
    exportBackupJSON,
    importBackupJSON,
    resetAllData,
  } = useApp();

  const [formData, setFormData] = useState<SchoolSettings>(() => ({
    ...schoolSettings,
    kopBaris1:
      schoolSettings.kopBaris1 ||
      `PEMERINTAH ${(schoolSettings.provinsi || 'PROPINSI JAWA TENGAH').toUpperCase()}`,
    kopBaris2: schoolSettings.kopBaris2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
    logoUrl: schoolSettings.logoUrl || '',
  }));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleChange = (field: keyof SchoolSettings, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran berkas logo maksimal 2 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleChange('logoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    handleChange('logoUrl', '');
  };

  const handleSelectPresetLogo = (presetUrl: string) => {
    handleChange('logoUrl', presetUrl);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const ok = importBackupJSON(text);
        if (ok) {
          setImportStatus('Data cadangan berhasil dipulihkan!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Gagal memulihkan data: format file tidak valid.');
          setTimeout(() => setImportStatus(null), 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Pengaturan Identitas Satuan Pendidikan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Data identitas sekolah, Kepala Sekolah, dan Pengawas Pembina akan otomatis tampil pada
            seluruh kop dokumen dan instrumen SI SUPAK.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Grid: Form Setting + Live Kop Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Settings (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Section 0: Header Kop Bagian Atas Surat Resmi */}
            <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Kop Bagian Atas Surat Resmi (Dapat Diedit)
                </h3>
                <span className="text-[10px] font-bold text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
                  Kop Dinamis
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sesuaikan teks kop bagian atas ini sesuai status kewenangan wilayah satuan pendidikan Anda (Provinsi, Kabupaten, Kota, atau Yayasan). Teks ini akan otomatis muncul di seluruh dokumen laporan, jadwal supervisi, dan berkas PDF.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Kop Baris 1: Pemerintah Daerah / Provinsi / Kabupaten / Yayasan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.kopBaris1 || ''}
                  onChange={(e) => handleChange('kopBaris1', e.target.value)}
                  placeholder="Contoh: PEMERINTAH PROPINSI JAWA TENGAH atau PEMERINTAH KABUPATEN BANYUMAS"
                  className="w-full px-3.5 py-2 rounded-xl border border-indigo-300 bg-white text-xs font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 font-semibold">Pilihan Cepat:</span>
                  <button
                    type="button"
                    onClick={() => handleChange('kopBaris1', 'PEMERINTAH PROPINSI JAWA TENGAH')}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                  >
                    PEMERINTAH PROPINSI JAWA TENGAH
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('kopBaris1', `PEMERINTAH ${(formData.kabupatenKota || 'KABUPATEN BANYUMAS').toUpperCase()}`)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                  >
                    PEMERINTAH {formData.kabupatenKota?.toUpperCase() || 'KABUPATEN BANYUMAS'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('kopBaris1', 'KEMENTERIAN AGAMA REPUBLIK INDONESIA')}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                  >
                    KEMENAG RI
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Kop Baris 2: Dinas Pendidikan / Instansi Terkait *
                </label>
                <input
                  type="text"
                  required
                  value={formData.kopBaris2 || ''}
                  onChange={(e) => handleChange('kopBaris2', e.target.value)}
                  placeholder="Contoh: DINAS PENDIDIKAN DAN KEBUDAYAAN"
                  className="w-full px-3.5 py-2 rounded-xl border border-indigo-300 bg-white text-xs font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
                />
              </div>

              {/* Logo Upload Sub-section */}
              <div className="pt-3 border-t border-indigo-200/80">
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Logo Kop Surat (Logo Sekolah atau Logo Pemerintah Daerah)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 bg-white p-3 rounded-xl border border-indigo-200">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Logo Kop"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="text-center text-slate-400 p-1">
                        <ImageIcon className="w-6 h-6 mx-auto opacity-50" />
                        <span className="text-[9px] block font-semibold leading-tight mt-0.5">
                          Tanpa Logo
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>
                          {formData.logoUrl ? 'Ganti Logo' : 'Unggah Logo (PNG/JPG/SVG)'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>

                      {formData.logoUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Logo</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Format: PNG transparan, JPG, atau SVG (maks. 2 MB). Logo otomatis tampil di sisi kiri Kop Surat pada seluruh dokumen & laporan.
                    </p>
                  </div>
                </div>

                {/* Preset Logos */}
                <div className="mt-2.5">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">
                    Atau gunakan template lambang umum:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {LOGO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPresetLogo(preset.url)}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-md border transition ${
                          formData.logoUrl === preset.url
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-400 ring-1 ring-indigo-400'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-3.5 h-3.5 object-contain" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Identitas Sekolah */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-indigo-100 pb-1.5">
                <School className="w-4 h-4" />
                1. Identitas Satuan Pendidikan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Satuan Pendidikan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaSekolah}
                    onChange={(e) => handleChange('namaSekolah', e.target.value)}
                    placeholder="Contoh: Negeri Unggul atau SMP Negeri 2 Gumelar"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NPSN
                  </label>
                  <input
                    type="text"
                    value={formData.npsn}
                    onChange={(e) => handleChange('npsn', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Akreditasi Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.akreditasi}
                    onChange={(e) => handleChange('akreditasi', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Alamat Jalan / Gedung *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.alamat}
                    onChange={(e) => handleChange('alamat', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    value={formData.kecamatan}
                    onChange={(e) => handleChange('kecamatan', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kabupaten / Kota *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kabupatenKota}
                    onChange={(e) => handleChange('kabupatenKota', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.provinsi}
                    onChange={(e) => handleChange('provinsi', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kode Pos & Telepon
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kode Pos"
                      value={formData.kodePos}
                      onChange={(e) => handleChange('kodePos', e.target.value)}
                      className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Telepon"
                      value={formData.telepon}
                      onChange={(e) => handleChange('telepon', e.target.value)}
                      className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Website / Laman Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pimpinan & Pengawas */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-indigo-100 pb-1.5">
                <UserCheck className="w-4 h-4" />
                2. Kepala Sekolah & Pengawas Pembina
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Kepala Sekolah (dengan Gelar) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kepalaSekolah}
                    onChange={(e) => handleChange('kepalaSekolah', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NIP Kepala Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nipKepalaSekolah}
                    onChange={(e) => handleChange('nipKepalaSekolah', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Pengawas Pembina *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pengawas}
                    onChange={(e) => handleChange('pengawas', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NIP Pengawas Pembina *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nipPengawas}
                    onChange={(e) => handleChange('nipPengawas', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Periode Akademik */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 border-b border-indigo-100 pb-1.5">
                <GraduationCap className="w-4 h-4" />
                3. Periode Semester & Tahun Pelajaran
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Semester Aktif
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      handleChange('semester', e.target.value as 'Ganjil' | 'Genap')
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tahun Pelajaran
                  </label>
                  <input
                    type="text"
                    value={formData.tahunPelajaran}
                    onChange={(e) => handleChange('tahunPelajaran', e.target.value)}
                    placeholder="2024/2025"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={resetSchoolSettings}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Data Awal</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Identitas</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Kop Surat Preview + Backup Options (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Kop Surat */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                Pratinjau Kop Surat Resmi
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Live Sinkron
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-center gap-3">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo Kop"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0"
                  />
                ) : null}

                <div className="text-center flex-1 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                    {formData.kopBaris1 || `PEMERINTAH ${(formData.provinsi || 'PROPINSI JAWA TENGAH').toUpperCase()}`}
                  </p>
                  <p className="text-xs font-extrabold text-slate-800 uppercase">
                    {formData.kopBaris2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                  </p>
                  <p className="text-sm font-black text-indigo-950 uppercase tracking-wide">
                    {formData.namaSekolah || 'NAMA SATUAN PENDIDIKAN'}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    {formData.alamat}, Kec. {formData.kecamatan}, {formData.kabupatenKota} - {formData.kodePos}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Telp: {formData.telepon} • Pos-el: {formData.email}
                  </p>
                </div>

                {formData.logoUrl ? (
                  <div className="w-14 sm:w-16 shrink-0 hidden sm:block pointer-events-none" aria-hidden="true" />
                ) : null}
              </div>
              <div className="border-t-2 border-slate-900 mt-2.5 pt-0.5" />
            </div>

            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
              Kop di atas akan otomatis dicetak pada lembar <strong>Program Supervisi Akademik</strong>{' '}
              dan <strong>Laporan Hasil Supervisi</strong>.
            </div>
          </div>

          {/* Backup & Restore Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-4 h-4 text-indigo-600" />
              Cadangan Data & Pemulihan (JSON)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ekspor seluruh data guru, dokumen, instrumen, dan pengaturan sekolah ke berkas JSON
              untuk diarsipkan atau dipindahkan ke perangkat lain.
            </p>

            {importStatus && (
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-semibold">
                {importStatus}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={exportBackupJSON}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Cadangan JSON</span>
              </button>

              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Pulihkan Cadangan</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
