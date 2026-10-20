import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Teacher, TeacherDocument } from '../types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  FileCheck2,
  FilePlus,
  FileText,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  FileUp,
} from 'lucide-react';

export const TeacherManagement: React.FC = () => {
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    uploadTeacherDocument,
    deleteTeacherDocument,
    setSelectedTeacherId,
    setActiveMenu,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Belum' | 'Sedang Berjalan' | 'Selesai'>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [uploadModalTeacher, setUploadModalTeacher] = useState<Teacher | null>(null);

  // Form states for add / edit
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    pangkatGolongan: 'Penata / III-c',
    mapel: '',
    kelas: '',
    materiPokok: '',
    tglPraObservasi: '',
    tglObservasi: '',
    tglPascaObservasi: '',
  });

  // Upload modal states
  const [uploadedDocType, setUploadedDocType] = useState<TeacherDocument['type']>('Modul Ajar');
  const [customDocName, setCustomDocName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resetForm = () => {
    setFormData({
      nama: '',
      nip: '',
      pangkatGolongan: 'Penata / III-c',
      mapel: '',
      kelas: '',
      materiPokok: '',
      tglPraObservasi: '',
      tglObservasi: '',
      tglPascaObservasi: '',
    });
    setEditingTeacher(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      nama: teacher.nama,
      nip: teacher.nip,
      pangkatGolongan: teacher.pangkatGolongan || 'Penata / III-c',
      mapel: teacher.mapel,
      kelas: teacher.kelas,
      materiPokok: teacher.materiPokok || '',
      tglPraObservasi: teacher.tglPraObservasi || '',
      tglObservasi: teacher.tglObservasi || '',
      tglPascaObservasi: teacher.tglPascaObservasi || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.mapel || !formData.kelas) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        nama: formData.nama,
        nip: formData.nip,
        pangkatGolongan: formData.pangkatGolongan,
        mapel: formData.mapel,
        kelas: formData.kelas,
        materiPokok: formData.materiPokok,
        tglPraObservasi: formData.tglPraObservasi,
        tglObservasi: formData.tglObservasi,
        tglPascaObservasi: formData.tglPascaObservasi,
      });
    } else {
      addTeacher({
        nama: formData.nama,
        nip: formData.nip,
        pangkatGolongan: formData.pangkatGolongan,
        mapel: formData.mapel,
        kelas: formData.kelas,
        materiPokok: formData.materiPokok,
        tglPraObservasi: formData.tglPraObservasi,
        tglObservasi: formData.tglObservasi,
        tglPascaObservasi: formData.tglPascaObservasi,
      });
    }
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!customDocName) {
        setCustomDocName(file.name);
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalTeacher) return;

    const fileName = customDocName || (selectedFile ? selectedFile.name : `Dokumen_${uploadedDocType}.pdf`);
    const fileSize = selectedFile
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : '1.2 MB';

    uploadTeacherDocument(uploadModalTeacher.id, {
      name: fileName,
      type: uploadedDocType,
      size: fileSize,
    });

    setUploadModalTeacher(null);
    setSelectedFile(null);
    setCustomDocName('');
  };

  // Filtered teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mapel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.kelas.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Daftar Guru Sasaran Supervisi</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola data guru, jadwal tahapan supervisi, dan unggah dokumen perangkat ajar.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama guru, NIP, mapel, atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-medium">
            {(['All', 'Belum', 'Sedang Berjalan', 'Selesai'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg transition ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status === 'All' ? 'Semua' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Lengkap & NIP</th>
                <th className="py-3.5 px-4">Mata Pelajaran & Kelas</th>
                <th className="py-3.5 px-4">Jadwal Tahapan (Pra, Obs, Pasca)</th>
                <th className="py-3.5 px-4">Dokumen Perangkat</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <p className="text-sm font-medium">Tidak ada data guru yang cocok.</p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, index) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>

                    {/* Nama & NIP */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{teacher.nama}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        NIP. {teacher.nip || '-'}
                      </div>
                      <div className="text-[11px] text-indigo-600 font-medium">
                        {teacher.pangkatGolongan}
                      </div>
                    </td>

                    {/* Mapel & Kelas */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{teacher.mapel}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">
                          Kelas {teacher.kelas}
                        </span>
                      </div>
                      {teacher.materiPokok && (
                        <div className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                          &quot;{teacher.materiPokok}&quot;
                        </div>
                      )}
                    </td>

                    {/* Jadwal Ringkas: Pra, Obs, Pasca */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-12 text-[10px] uppercase font-bold text-slate-400">
                            Pra:
                          </span>
                          <span
                            className={`font-medium ${
                              teacher.tglPraObservasi ? 'text-slate-800' : 'text-slate-300 italic'
                            }`}
                          >
                            {teacher.tglPraObservasi || 'Belum diisi'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-12 text-[10px] uppercase font-bold text-indigo-500">
                            Obs:
                          </span>
                          <span
                            className={`font-semibold ${
                              teacher.tglObservasi ? 'text-indigo-900' : 'text-slate-300 italic'
                            }`}
                          >
                            {teacher.tglObservasi || 'Belum diisi'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-12 text-[10px] uppercase font-bold text-slate-400">
                            Pasca:
                          </span>
                          <span
                            className={`font-medium ${
                              teacher.tglPascaObservasi
                                ? 'text-slate-800'
                                : 'text-slate-300 italic'
                            }`}
                          >
                            {teacher.tglPascaObservasi || 'Belum diisi'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Dokumen Perangkat & Tombol Upload */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        <button
                          onClick={() => setUploadModalTeacher(teacher)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>

                        {/* List file badges */}
                        {teacher.documents && teacher.documents.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {teacher.documents.map((doc) => (
                              <span
                                key={doc.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] border border-slate-200 group"
                              >
                                <FileText className="w-3 h-3 text-indigo-600" />
                                <span className="truncate max-w-[90px]">{doc.name}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTeacherDocument(teacher.id, doc.id);
                                  }}
                                  className="text-slate-400 hover:text-rose-500 ml-0.5"
                                  title="Hapus file"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">Belum ada dokumen</div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          teacher.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : teacher.status === 'Sedang Berjalan'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {teacher.status === 'Selesai' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {teacher.status}
                      </span>
                    </td>

                    {/* Aksi: Edit, Supervisi, Hapus */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedTeacherId(teacher.id);
                            setActiveMenu('instrumen');
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Buka Instrumen Supervisi"
                        >
                          <FileCheck2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(teacher)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit Data Guru & Jadwal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Apakah Anda yakin ingin menghapus data guru ${teacher.nama}?`
                              )
                            ) {
                              deleteTeacher(teacher.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Data Guru"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Data Guru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                {editingTeacher ? 'Perbarui Data Guru & Jadwal' : 'Tambah Guru Sasaran Supervisi'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Lengkap Guru (dengan Gelar) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Siti Fatimah, S.Pd., M.Pd."
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NIP / NUPTK Guru
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 19850612 201001 2 018"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pangkat / Golongan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Penata Tk. I / III-d"
                    value={formData.pangkatGolongan}
                    onChange={(e) =>
                      setFormData({ ...formData, pangkatGolongan: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bahasa Indonesia"
                    value={formData.mapel}
                    onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kelas yang Diampu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: VIII-A"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Materi Pokok Pembelajaran
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Teks Eksplanasi Kontekstual Berbasis Masalah"
                    value={formData.materiPokok}
                    onChange={(e) => setFormData({ ...formData, materiPokok: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Jadwal Supervisi 3 Tahap */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase">
                  <Calendar className="w-4 h-4" />
                  <span>Jadwal Pelaksanaan Supervisi Akademik</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      1. Pra-Observasi
                    </label>
                    <input
                      type="date"
                      value={formData.tglPraObservasi}
                      onChange={(e) =>
                        setFormData({ ...formData, tglPraObservasi: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-indigo-700 mb-1">
                      2. Observasi Kelas
                    </label>
                    <input
                      type="date"
                      value={formData.tglObservasi}
                      onChange={(e) =>
                        setFormData({ ...formData, tglObservasi: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-indigo-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      3. Pasca-Observasi
                    </label>
                    <input
                      type="date"
                      value={formData.tglPascaObservasi}
                      onChange={(e) =>
                        setFormData({ ...formData, tglPascaObservasi: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  * Jadwal ini otomatis terhubung ke menu Program Supervisi Akademik.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition"
                >
                  {editingTeacher ? 'Simpan Perubahan' : 'Tambahkan Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Upload Dokumen Perangkat */}
      {uploadModalTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Upload Dokumen Perangkat</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Untuk guru: <strong>{uploadModalTeacher.nama}</strong>
                </p>
              </div>
              <button
                onClick={() => setUploadModalTeacher(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Jenis Dokumen Perangkat
                </label>
                <select
                  value={uploadedDocType}
                  onChange={(e) =>
                    setUploadedDocType(e.target.value as TeacherDocument['type'])
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Modul Ajar">Modul Ajar</option>
                  <option value="RPP">Rencana Pelaksanaan Pembelajaran (RPP)</option>
                  <option value="LKPD">Lembar Kerja Murid (LKPD)</option>
                  <option value="Bahan Ajar">Bahan Ajar / Diktat</option>
                  <option value="Instrumen Asesmen">Instrumen Asesmen & Rubrik</option>
                  <option value="Lainnya">Dokumen Pendukung Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pilih Berkas File
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Label Dokumen
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Modul_Ajar_Bab_3_Revisi.pdf"
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalTeacher(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Simpan Dokumen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
