import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TindakLanjutProgram } from '../types';
import {
  CheckCircle2,
  Clock,
  Edit2,
  GraduationCap,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';

export const FollowUpEvaluation: React.FC = () => {
  const {
    teachers,
    tindakLanjutList,
    addTindakLanjut,
    updateTindakLanjut,
    deleteTindakLanjut,
    schoolSettings,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TindakLanjutProgram | null>(null);

  const [formData, setFormData] = useState({
    teacherId: teachers[0]?.id || '',
    namaGuru: teachers[0]?.nama || '',
    mapel: teachers[0]?.mapel || '',
    aspekPengembangan: '',
    bentukTindakLanjut: 'Workshop Pembelajaran Mendalam & Coaching Berkelanjutan',
    targetWaktu: 'Bulan Depan',
    penanggungJawab: `${schoolSettings.kepalaSekolah} (Kepala Sekolah)`,
    evaluasiHasil: '',
    status: 'Direncanakan' as TindakLanjutProgram['status'],
  });

  const resetForm = () => {
    setFormData({
      teacherId: teachers[0]?.id || '',
      namaGuru: teachers[0]?.nama || '',
      mapel: teachers[0]?.mapel || '',
      aspekPengembangan: '',
      bentukTindakLanjut: 'Workshop Pembelajaran Mendalam & Coaching Berkelanjutan',
      targetWaktu: 'Bulan Depan',
      penanggungJawab: `${schoolSettings.kepalaSekolah} (Kepala Sekolah)`,
      evaluasiHasil: '',
      status: 'Direncanakan',
    });
    setEditingItem(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: TindakLanjutProgram) => {
    setEditingItem(item);
    setFormData({
      teacherId: item.teacherId,
      namaGuru: item.namaGuru,
      mapel: item.mapel,
      aspekPengembangan: item.aspekPengembangan,
      bentukTindakLanjut: item.bentukTindakLanjut,
      targetWaktu: item.targetWaktu,
      penanggungJawab: item.penanggungJawab,
      evaluasiHasil: item.evaluasiHasil,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aspekPengembangan) return;

    const teacher = teachers.find((t) => t.id === formData.teacherId);
    const teacherName = teacher ? teacher.nama : formData.namaGuru;
    const teacherMapel = teacher ? teacher.mapel : formData.mapel;

    if (editingItem) {
      updateTindakLanjut(editingItem.id, {
        teacherId: formData.teacherId,
        namaGuru: teacherName,
        mapel: teacherMapel,
        aspekPengembangan: formData.aspekPengembangan,
        bentukTindakLanjut: formData.bentukTindakLanjut,
        targetWaktu: formData.targetWaktu,
        penanggungJawab: formData.penanggungJawab,
        evaluasiHasil: formData.evaluasiHasil,
        status: formData.status,
      });
    } else {
      addTindakLanjut({
        teacherId: formData.teacherId,
        namaGuru: teacherName,
        mapel: teacherMapel,
        aspekPengembangan: formData.aspekPengembangan,
        bentukTindakLanjut: formData.bentukTindakLanjut,
        targetWaktu: formData.targetWaktu,
        penanggungJawab: formData.penanggungJawab,
        evaluasiHasil: formData.evaluasiHasil,
        status: formData.status,
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const totalAction = tindakLanjutList.length;
  const tercapai = tindakLanjutList.filter((i) => i.status === 'Tercapai').length;
  const dalamProses = tindakLanjutList.filter((i) => i.status === 'Dalam Proses').length;
  const direncanakan = tindakLanjutList.filter((i) => i.status === 'Direncanakan').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Tindak Lanjut & Evaluasi Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Program pembinaan berkelanjutan, monitoring capaian target, dan evaluasi dampak supervisi.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rencana Aksi</span>
        </button>
      </div>

      {/* Program Pembinaan Guru Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Coaching Klinis & Mentoring</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pendampingan individual oleh Kepala Sekolah dan Guru Penggerak dalam penyempurnaan
            modul ajar dan asesmen formatif.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Komunitas Belajar (Kombel)</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Forum mingguan guru mata pelajaran untuk berbagi praktik baik (lesson study) dan
            desain diferensiasi pembelajaran mendalam.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">IHT & Workshop Terfokus</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pelatihan tematik pengembangan perangkat Kurikulum Nasional, pemanfaatan media digital,
            dan integrasi proyek Kokurikuler.
          </p>
        </div>
      </div>

      {/* Monitoring Status Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 uppercase font-bold text-[11px]">Capaian Aksi:</span>
          <span className="font-extrabold text-slate-900 text-sm">{totalAction} Program</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {tercapai} Tercapai
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {dalamProses} Dalam Proses
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            {direncanakan} Direncanakan
          </span>
        </div>
      </div>

      {/* Tabel Rencana Aksi Perbaikan Pembelajaran */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900">
            Tabel Rencana Aksi & Monitoring Evaluasi Guru
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar perbaikan pembelajaran yang disepakati untuk setiap guru sasaran supervisi.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-4 w-44">Nama Guru & Mapel</th>
                <th className="py-3 px-4">Aspek Sasaran Perbaikan</th>
                <th className="py-3 px-4">Bentuk Tindak Lanjut</th>
                <th className="py-3 px-3 w-32">Target Waktu</th>
                <th className="py-3 px-3 w-36">Penanggung Jawab</th>
                <th className="py-3 px-4">Evaluasi Hasil</th>
                <th className="py-3 px-3 text-center w-28">Status</th>
                <th className="py-3 px-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tindakLanjutList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Belum ada rencana tindak lanjut yang dicatat.
                  </td>
                </tr>
              ) : (
                tindakLanjutList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{item.namaGuru}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{item.mapel}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {item.aspekPengembangan}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-700 font-semibold">
                      {item.bentukTindakLanjut}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                      {item.targetWaktu}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{item.penanggungJawab}</td>
                    <td className="py-3.5 px-4 text-slate-600 italic">
                      {item.evaluasiHasil || '-'}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.status === 'Tercapai'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'Dalam Proses'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded"
                          title="Edit Rencana"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Hapus rencana tindak lanjut ini?')) {
                              deleteTindakLanjut(item.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal Add / Edit Tindak Lanjut */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {editingItem ? 'Perbarui Rencana Aksi Tindak Lanjut' : 'Tambah Rencana Aksi Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Guru Sasaran *
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => {
                    const selected = teachers.find((t) => t.id === e.target.value);
                    setFormData({
                      ...formData,
                      teacherId: e.target.value,
                      namaGuru: selected ? selected.nama : '',
                      mapel: selected ? selected.mapel : '',
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama} ({t.mapel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Aspek Sasaran Perbaikan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penguatan Diferensiasi Produk & Manajemen Presentasi"
                  value={formData.aspekPengembangan}
                  onChange={(e) =>
                    setFormData({ ...formData, aspekPengembangan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Bentuk Program Tindak Lanjut *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Coaching Klinis / Lesson Study di Kombel"
                  value={formData.bentukTindakLanjut}
                  onChange={(e) =>
                    setFormData({ ...formData, bentukTindakLanjut: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Target Waktu
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: November 2024"
                    value={formData.targetWaktu}
                    onChange={(e) =>
                      setFormData({ ...formData, targetWaktu: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Status Pelaksanaan
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as TindakLanjutProgram['status'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                  >
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Tercapai">Tercapai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={formData.penanggungJawab}
                  onChange={(e) =>
                    setFormData({ ...formData, penanggungJawab: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Evaluasi Hasil / Catatan Kemajuan
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan kemajuan atau hasil implementasi perbaikan..."
                  value={formData.evaluasiHasil}
                  onChange={(e) =>
                    setFormData({ ...formData, evaluasiHasil: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 transition"
                >
                  Simpan Aksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
