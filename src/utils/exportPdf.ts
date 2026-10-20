import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SchoolSettings, Teacher, TindakLanjutProgram, TeacherDocument } from '../types';
import { DEVELOPER_INFO } from '../data/defaultData';

/**
 * Helper to render the official school letterhead (KOP SURAT) with logo and dynamic lines
 */
function drawOfficialHeader(
  doc: jsPDF,
  schoolSettings: SchoolSettings,
  startY: number,
  pageWidth: number,
  marginX: number
): number {
  let currentY = startY;
  const kopBaris1 =
    schoolSettings.kopBaris1 ||
    `PEMERINTAH ${(schoolSettings.provinsi || 'PROPINSI JAWA TENGAH').toUpperCase()}`;
  const kopBaris2 = schoolSettings.kopBaris2 || 'DINAS PENDIDIKAN DAN KEBUDAYAAN';

  // Render logo if present (supports base64 data URL)
  if (schoolSettings.logoUrl) {
    try {
      if (schoolSettings.logoUrl.startsWith('data:image/')) {
        const format =
          schoolSettings.logoUrl.includes('image/jpeg') ||
          schoolSettings.logoUrl.includes('image/jpg')
            ? 'JPEG'
            : 'PNG';
        doc.addImage(schoolSettings.logoUrl, format, marginX + 1, currentY - 2, 17, 17);
      }
    } catch (e) {
      console.warn('Could not render logo in PDF, proceeding without logo:', e);
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text(kopBaris1.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(kopBaris2.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });

  currentY += 5.5;
  doc.setFontSize(13.5);
  doc.setTextColor(24, 28, 77); // Deep indigo
  doc.text(schoolSettings.namaSekolah.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(
    `${schoolSettings.alamat}, Kec. ${schoolSettings.kecamatan}, ${schoolSettings.kabupatenKota} - ${schoolSettings.kodePos}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  currentY += 3.8;
  doc.setFontSize(7.5);
  doc.text(
    `Telepon: ${schoolSettings.telepon} • Pos-el: ${schoolSettings.email} • Website: ${schoolSettings.website}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  currentY += 3;
  // Double Official Lines
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.8);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 1;
  doc.setLineWidth(0.25);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);

  currentY += 6;
  return currentY;
}

/**
 * Helper to add official footer on all pages with Developer Attribution
 */
function drawOfficialFooters(doc: jsPDF, marginX: number, pageWidth: number, pageHeight: number) {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(marginX, pageHeight - 11, pageWidth - marginX, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 110);
    doc.text(
      `SI SUPAK v2.0 • Inovasi Pengembang: ${DEVELOPER_INFO.nama}, ${DEVELOPER_INFO.gelar} (${DEVELOPER_INFO.jabatan})`,
      marginX,
      pageHeight - 7
    );

    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - marginX, pageHeight - 7, {
      align: 'right',
    });
  }
}

/**
 * 1. Export Laporan Hasil Supervisi Akademik to PDF (jsPDF)
 */
export const exportSupervisionReportToPDF = (
  teacher: Teacher,
  schoolSettings: SchoolSettings
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;
  const contentWidth = pageWidth - marginX * 2;

  const praData = teacher.praObservasiData;
  const obsData = teacher.observasiData;
  const pascaData = teacher.pascaObservasiData;

  const praScore = praData?.skorPersentase || (teacher.status === 'Selesai' ? 92 : 0);
  const obsScore = obsData?.persentase || (teacher.status === 'Selesai' ? 91.7 : 0);
  const finalScore =
    praScore > 0 && obsScore > 0
      ? Number((praScore * 0.4 + obsScore * 0.6).toFixed(1))
      : obsScore || praScore || 0;

  const getPredikat = (score: number) => {
    if (score >= 86) return 'Sangat Baik (A)';
    if (score >= 71) return 'Baik (B)';
    if (score >= 56) return 'Cukup (C)';
    return 'Perlu Bimbingan (D)';
  };

  const predikatLabel = getPredikat(finalScore);

  let currentY = drawOfficialHeader(doc, schoolSettings, 16, pageWidth, marginX);

  // --- JUDUL DOKUMEN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('LAPORAN HASIL SUPERVISI AKADEMIK', pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  const nomorSurat = `Nomor: 421.3 / SUPAK / ${new Date().getFullYear()} / ${schoolSettings.semester.toUpperCase()}`;
  doc.text(nomorSurat, pageWidth / 2, currentY, { align: 'center' });

  currentY += 6;

  // --- BAGIAN A: IDENTITAS GURU & PELAKSANAAN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('A. IDENTITAS GURU & PELAKSANAAN SUPERVISI', marginX, currentY);
  currentY += 2;

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellPadding: 1.2,
      textColor: [40, 40, 40],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 38 },
      1: { cellWidth: 52 },
      2: { fontStyle: 'bold', cellWidth: 38 },
      3: { cellWidth: 52 },
    },
    body: [
      [
        'Nama Lengkap Guru',
        `: ${teacher.nama}`,
        'Kelas / Semester',
        `: Kelas ${teacher.kelas} / ${schoolSettings.semester}`,
      ],
      [
        'NIP / NUPTK',
        `: ${teacher.nip || '-'}`,
        'Tahun Pelajaran',
        `: ${schoolSettings.tahunPelajaran}`,
      ],
      [
        'Pangkat / Golongan',
        `: ${teacher.pangkatGolongan || 'Penata / III-c'}`,
        'Materi Pokok',
        `: ${teacher.materiPokok || 'Pembelajaran Berpusat pada Murid'}`,
      ],
      [
        'Mata Pelajaran',
        `: ${teacher.mapel}`,
        'Tanggal Supervisi',
        `: Pra (${teacher.tglPraObservasi || '-'}) | Obs (${teacher.tglObservasi || '-'}) | Pasca (${teacher.tglPascaObservasi || '-'})`,
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // --- BAGIAN B: REKAPITULASI KUANTITATIF ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('B. REKAPITULASI KUANTITATIF HASIL SUPERVISI', marginX, currentY);
  currentY += 2;

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [30, 41, 59],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 105 },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 23, halign: 'center', fontStyle: 'bold' },
    },
    head: [['No', 'Komponen Supervisi Akademik', 'Skor (%)', 'Bobot', 'Nilai Akhir']],
    body: [
      ['1', 'Telaah Dokumen Perangkat (Pra-Observasi)', `${praScore}%`, '40%', `${(praScore * 0.4).toFixed(1)}`],
      ['2', 'Observasi Kelas (Pembelajaran Mendalam & Kokurikuler)', `${obsScore}%`, '60%', `${(obsScore * 0.6).toFixed(1)}`],
      [
        { content: 'NILAI TOTAL SUPERVISI AKADEMIK', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `${finalScore}%`, styles: { halign: 'center', fontStyle: 'bold', textColor: [30, 27, 75] } },
      ],
      [
        { content: `Kualifikasi Kinerja Guru: ${predikatLabel}`, colSpan: 5, styles: { fontStyle: 'bold', textColor: [15, 118, 110], fillColor: [240, 253, 250] } },
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // --- BAGIAN C: ANALISIS TEMUAN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('C. ANALISIS TEMUAN SUPERVISI', marginX, currentY);
  currentY += 2;

  const kelebihanText =
    praData?.kelebihan ||
    obsData?.catatanSupervisor ||
    'Guru menyusun rancangan modul ajar secara sistematis, penguasaan materi esensial sangat baik, serta mampu menciptakan iklim belajar yang kondusif dan inklusif.';

  const perbaikanText =
    praData?.perluDitingkatkan ||
    'Penguatan variasi diferensiasi produk tugas murid serta optimalisasi manajemen alokasi waktu sesi presentasi kelompok dan penarikan kesimpulan reflektif.';

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: {
      fontSize: 7.8,
      cellPadding: 2.5,
      textColor: [40, 40, 40],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [30, 41, 59],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 90 },
    },
    head: [['Kelebihan & Kekuatan Teramati', 'Hal yang Perlu Ditingkatkan']],
    body: [[kelebihanText, perbaikanText]],
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // --- BAGIAN D: REKOMENDASI & TINDAK LANJUT ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('D. REKOMENDASI PERBAIKAN & RENCANA TINDAK LANJUT', marginX, currentY);
  currentY += 2;

  const rekomendasiText =
    obsData?.rekomendasi ||
    praData?.rekomendasi ||
    'Guru disarankan memperkaya instrumen asesmen formatif seketika (immediate feedback), menerapkan metode presentasi interaktif seperti gallery walk, serta memperkuat integrasi dimensi Kokurikuler.';

  const tindakLanjutText =
    pascaData?.kesepakatanBersama ||
    obsData?.tindakLanjut ||
    'Guru dan Supervisor sepakat untuk melaksanakan tindak lanjut perbaikan melalui keikutsertaan aktif dalam Komunitas Belajar (Kombel) sekolah serta mengimplementasikan diferensiasi produk pada siklus pembelajaran berikutnya.';

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: {
      fontSize: 7.8,
      cellPadding: 2.5,
      textColor: [40, 40, 40],
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [30, 41, 59],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 180 },
    },
    body: [
      [`Rekomendasi Supervisor:\n${rekomendasiText}`],
      [`Kesepakatan Komitmen Tindak Lanjut:\n${tindakLanjutText}`],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  if (currentY + 36 > pageHeight - 15) {
    doc.addPage();
    currentY = 20;
  }

  // --- BAGIAN E: LEMBAR PENGESAHAN (3 KOLOM TANDA TANGAN) ---
  const colWidth = contentWidth / 3;
  const tglFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);

  // Kolom 1: Guru
  const col1X = marginX + colWidth / 2;
  doc.text('Guru Yang Disupervisi,', col1X, currentY, { align: 'center' });

  // Kolom 2: Pengawas
  const col2X = marginX + colWidth + colWidth / 2;
  doc.text('Mengetahui,', col2X, currentY, { align: 'center' });
  doc.text('Pengawas Pembina Sekolah', col2X, currentY + 4, { align: 'center' });

  // Kolom 3: Kepala Sekolah
  const col3X = marginX + colWidth * 2 + colWidth / 2;
  doc.text(`${schoolSettings.kabupatenKota}, ${tglFormatted}`, col3X, currentY, { align: 'center' });
  doc.text('Kepala Satuan Pendidikan / Supervisor', col3X, currentY + 4, { align: 'center' });

  const signY = currentY + 22;

  // Nama & NIP Kolom 1
  doc.setFont('helvetica', 'bold');
  doc.text(teacher.nama, col1X, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${teacher.nip || '-'}`, col1X, signY + 3.8, { align: 'center' });

  // Nama & NIP Kolom 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(schoolSettings.pengawas, col2X, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${schoolSettings.nipPengawas}`, col2X, signY + 3.8, { align: 'center' });

  // Nama & NIP Kolom 3
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(schoolSettings.kepalaSekolah, col3X, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${schoolSettings.nipKepalaSekolah}`, col3X, signY + 3.8, { align: 'center' });

  drawOfficialFooters(doc, marginX, pageWidth, pageHeight);

  const cleanTeacherName = teacher.nama.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanSchool = schoolSettings.namaSekolah.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Laporan_Supervisi_${cleanTeacherName}_${cleanSchool}_${schoolSettings.tahunPelajaran.replace(/\//g, '-')}.pdf`;

  doc.save(filename);
};

/**
 * 2. Export Program & Jadwal Supervisi Akademik to PDF (jsPDF)
 */
export const exportSupervisionProgramToPDF = (
  teachers: Teacher[],
  schoolSettings: SchoolSettings
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;
  const contentWidth = pageWidth - marginX * 2;

  let currentY = drawOfficialHeader(doc, schoolSettings, 16, pageWidth, marginX);

  // --- JUDUL PROGRAM ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('PROGRAM KERJA & JADWAL SUPERVISI AKADEMIK', pageWidth / 2, currentY, {
    align: 'center',
  });

  currentY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text(
    `Tahun Pelajaran ${schoolSettings.tahunPelajaran} • Semester ${schoolSettings.semester}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );

  currentY += 6;

  // Deskripsi ringkas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('I. LANDASAN & SASARAN STRATEGIS', marginX, currentY);
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  const intro = doc.splitTextToSize(
    `Program supervisi akademik pada satuan pendidikan ${schoolSettings.namaSekolah} dirancang berbasis Kurikulum Nasional dengan fokus pada peningkatan kualitas Pembelajaran Mendalam (Deep Learning), penguatan dimensi Kokurikuler (Gotong Royong, Bernalar Kritis, Kemandirian, Kreatif), dan kultur asesmen formatif berkelanjutan.`,
    contentWidth
  );
  doc.text(intro, marginX, currentY);
  currentY += intro.length * 3.8 + 4;

  // Tabel Jadwal Sistematis Pelaksanaan Supervisi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('II. JADWAL SISTEMATIS PELAKSANAAN SUPERVISI GURU', marginX, currentY);
  currentY += 2;

  const tableBody = teachers.map((t, idx) => [
    (idx + 1).toString(),
    `${t.nama}\nNIP. ${t.nip || '-'}`,
    t.mapel,
    t.kelas,
    t.tglPraObservasi || '-',
    t.tglObservasi || '-',
    t.tglPascaObservasi || '-',
    schoolSettings.kepalaSekolah,
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [30, 41, 59],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 42 },
      2: { cellWidth: 32 },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 21, halign: 'center' },
      5: { cellWidth: 21, halign: 'center', fontStyle: 'bold' },
      6: { cellWidth: 21, halign: 'center' },
      7: { cellWidth: 21 },
    },
    head: [
      [
        'No',
        'Nama Guru & NIP',
        'Mata Pelajaran',
        'Kelas',
        'Pra-Obs',
        'Observasi',
        'Pasca-Obs',
        'Supervisor',
      ],
    ],
    body: tableBody,
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  if (currentY + 36 > pageHeight - 15) {
    doc.addPage();
    currentY = 20;
  }

  // Tanda Tangan 2 Kolom
  const colHalf = contentWidth / 2;
  const tglFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);

  const leftX = marginX + colHalf / 2;
  const rightX = marginX + colHalf + colHalf / 2;

  doc.text('Mengetahui,', leftX, currentY, { align: 'center' });
  doc.text('Pengawas Pembina Sekolah', leftX, currentY + 4, { align: 'center' });

  doc.text(`${schoolSettings.kabupatenKota}, ${tglFormatted}`, rightX, currentY, {
    align: 'center',
  });
  doc.text('Kepala Satuan Pendidikan / Supervisor', rightX, currentY + 4, { align: 'center' });

  const signY2 = currentY + 22;

  doc.setFont('helvetica', 'bold');
  doc.text(schoolSettings.pengawas, leftX, signY2, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${schoolSettings.nipPengawas}`, leftX, signY2 + 3.8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(schoolSettings.kepalaSekolah, rightX, signY2, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${schoolSettings.nipKepalaSekolah}`, rightX, signY2 + 3.8, { align: 'center' });

  drawOfficialFooters(doc, marginX, pageWidth, pageHeight);

  const cleanSchool = schoolSettings.namaSekolah.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Program_Jadwal_Supervisi_${cleanSchool}_${schoolSettings.tahunPelajaran.replace(/\//g, '-')}.pdf`;

  doc.save(filename);
};

/**
 * 3. Export Instrumen Pra-Observasi to PDF
 */
export const exportPraObservasiToPDF = (
  teacher: Teacher,
  schoolSettings: SchoolSettings
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;
  const contentWidth = pageWidth - marginX * 2;

  let currentY = drawOfficialHeader(doc, schoolSettings, 16, pageWidth, marginX);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(20, 20, 20);
  doc.text('INSTRUMEN SUPERVISI PRA-OBSERVASI (TELAAH MODUL AJAR)', pageWidth / 2, currentY, {
    align: 'center',
  });
  currentY += 5;

  // Identity Table
  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 1.2 },
    body: [
      ['Nama Guru', `: ${teacher.nama}`, 'Kelas / Semester', `: ${teacher.kelas} / ${schoolSettings.semester}`],
      ['NIP', `: ${teacher.nip || '-'}`, 'Mata Pelajaran', `: ${teacher.mapel}`],
      ['Tanggal Telaah', `: ${teacher.tglPraObservasi || '-'}`, 'Materi Pokok', `: ${teacher.materiPokok || '-'}`],
    ],
  });
  currentY = (doc as any).lastAutoTable.finalY + 4;

  const praItems = teacher.praObservasiData?.items || [];
  const tableData = praItems.map((item, idx) => [
    (idx + 1).toString(),
    item.komponen,
    item.ada ? 'Ada / Lengkap' : 'Belum Ada',
    item.catatan || '-',
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 80 },
      2: { cellWidth: 26, halign: 'center' },
      3: { cellWidth: 66 },
    },
    head: [['No', 'Komponen / Indikator Modul Ajar', 'Keterlaksanaan', 'Catatan Pembinaan']],
    body: tableData.length > 0 ? tableData : [['1', 'Komponen Perangkat Ajar Lengkap', 'Ada / Lengkap', 'Sesuai BSKAP Kurikulum Nasional']],
  });

  drawOfficialFooters(doc, marginX, pageWidth, pageHeight);
  doc.save(`Instrumen_PraObservasi_${teacher.nama.replace(/\s+/g, '_')}.pdf`);
};

/**
 * 4. Export Instrumen Observasi Kelas to PDF
 */
export const exportObservasiToPDF = (
  teacher: Teacher,
  schoolSettings: SchoolSettings
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;

  let currentY = drawOfficialHeader(doc, schoolSettings, 16, pageWidth, marginX);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(20, 20, 20);
  doc.text('INSTRUMEN OBSERVASI KELAS (PEMBELAJARAN MENDALAM)', pageWidth / 2, currentY, {
    align: 'center',
  });
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 1.2 },
    body: [
      ['Nama Guru', `: ${teacher.nama}`, 'Kelas / Mapel', `: ${teacher.kelas} / ${teacher.mapel}`],
      ['Tanggal Observasi', `: ${teacher.tglObservasi || '-'}`, 'Materi Pokok', `: ${teacher.materiPokok || '-'}`],
    ],
  });
  currentY = (doc as any).lastAutoTable.finalY + 4;

  const obsItems = teacher.observasiData?.items || [];
  const tableData = obsItems.map((item, idx) => [
    (idx + 1).toString(),
    item.namaKategori,
    item.indikator,
    item.skor.toString(),
    item.catatan || item.buktiPembelajaran || '-',
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 7.2, cellPadding: 2 },
    headStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 70 },
      3: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 53 },
    },
    head: [['No', 'Fokus Aspek', 'Indikator Kinerja Observasi', 'Skor', 'Bukti / Catatan Guru']],
    body: tableData.length > 0 ? tableData : [['1', 'Pembelajaran Berdiferensiasi', 'Memfasilitasi keragaman gaya belajar siswa', '4', 'Sangat interaktif']],
  });

  drawOfficialFooters(doc, marginX, pageWidth, pageHeight);
  doc.save(`Instrumen_Observasi_${teacher.nama.replace(/\s+/g, '_')}.pdf`);
};

/**
 * 5. Export Instrumen Pasca-Observasi to PDF
 */
export const exportPascaObservasiToPDF = (
  teacher: Teacher,
  schoolSettings: SchoolSettings
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;

  let currentY = drawOfficialHeader(doc, schoolSettings, 16, pageWidth, marginX);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(20, 20, 20);
  doc.text('INSTRUMEN PASCA-OBSERVASI & REFLEKSI GURU', pageWidth / 2, currentY, {
    align: 'center',
  });
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 1.2 },
    body: [
      ['Nama Guru', `: ${teacher.nama}`, 'Kelas / Mapel', `: ${teacher.kelas} / ${teacher.mapel}`],
      ['Tanggal Refleksi', `: ${teacher.tglPascaObservasi || '-'}`, 'Materi Pokok', `: ${teacher.materiPokok || '-'}`],
    ],
  });
  currentY = (doc as any).lastAutoTable.finalY + 4;

  const umpanBalik = teacher.pascaObservasiData?.umpanBalik || [];
  const tableData = umpanBalik.map((ub, idx) => [
    (idx + 1).toString(),
    ub.aspek,
    ub.apresiasi,
    ub.areaPengembangan,
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2.2 },
    headStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 45 },
      2: { cellWidth: 65 },
      3: { cellWidth: 62 },
    },
    head: [['No', 'Aspek Pengamatan', 'Apresiasi Praktik Baik', 'Area Pengembangan Kompetensi']],
    body: tableData.length > 0 ? tableData : [['1', 'Pemberian Umpan Balik', 'Umpan balik langsung dan positif', 'Tindak lanjut diferensiasi produk']],
  });

  drawOfficialFooters(doc, marginX, pageWidth, pageHeight);
  doc.save(`Instrumen_PascaObservasi_${teacher.nama.replace(/\s+/g, '_')}.pdf`);
};

/**
 * 6. Export Tindak Lanjut & Evaluasi to PDF
 */
export const exportTindakLanjutToPDF = (
  tindakLanjutList: TindakLanjutProgram[],
  teachers: Teacher[],
  schoolSettings: SchoolSettings
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;

  let currentY = drawOfficialHeader(doc, schoolSettings, 16, pageWidth, marginX);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('PROGRAM TINDAK LANJUT & EVALUASI PEMBINAAN GURU', pageWidth / 2, currentY, {
    align: 'center',
  });
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(`Tahun Pelajaran ${schoolSettings.tahunPelajaran} • Semester ${schoolSettings.semester}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;

  const tableData = tindakLanjutList.map((item, idx) => [
    (idx + 1).toString(),
    item.namaGuru,
    item.mapel,
    item.aspekPengembangan,
    item.bentukTindakLanjut,
    item.targetWaktu,
    item.status,
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [241, 245, 249], textColor: [30, 41, 59], fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 26 },
      3: { cellWidth: 40 },
      4: { cellWidth: 35 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 18, halign: 'center' },
    },
    head: [['No', 'Nama Guru', 'Mapel', 'Aspek Sasaran', 'Bentuk Pembinaan', 'Target', 'Status']],
    body: tableData,
  });

  drawOfficialFooters(doc, marginX, pageWidth, pageHeight);
  doc.save(`Tindak_Lanjut_Supervisi_${schoolSettings.namaSekolah.replace(/\s+/g, '_')}.pdf`);
};

/**
 * 7. Export Teacher Document Record to PDF
 */
export const exportTeacherDocumentToPDF = (
  teacher: Teacher,
  docItem: TeacherDocument,
  schoolSettings: SchoolSettings
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;

  let currentY = drawOfficialHeader(doc, schoolSettings, 16, pageWidth, marginX);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('LEMBAR PENGESAHAN DOKUMEN PERANGKAT AJAR GURU', pageWidth / 2, currentY, {
    align: 'center',
  });
  currentY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(`Tahun Pelajaran ${schoolSettings.tahunPelajaran} • Semester ${schoolSettings.semester}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45, fillColor: [248, 250, 252] },
      1: { cellWidth: 135 },
    },
    body: [
      ['Judul Berkas Dokumen', docItem.name],
      ['Jenis / Kategori Perangkat', docItem.type],
      ['Guru Pengampu', `${teacher.nama} (NIP. ${teacher.nip || '-'})`],
      ['Pangkat / Golongan', teacher.pangkatGolongan || 'Penata / III-c'],
      ['Mata Pelajaran', teacher.mapel],
      ['Sasaran Kelas / Fase', `Kelas ${teacher.kelas} (Fase D / E)`],
      ['Tanggal Pengesahan', docItem.uploadDate],
      ['Status Verifikasi', 'Telah Ditelaah & Disetujui untuk Pembelajaran Kurikulum Nasional'],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // Signatures
  const colWidth = (pageWidth - marginX * 2) / 2;
  const tglFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Guru Pengampu,', marginX + colWidth / 2, currentY, { align: 'center' });
  doc.text(`${schoolSettings.kabupatenKota}, ${tglFormatted}`, marginX + colWidth + colWidth / 2, currentY, { align: 'center' });
  doc.text('Kepala Satuan Pendidikan / Supervisor,', marginX + colWidth + colWidth / 2, currentY + 4, { align: 'center' });

  const signY = currentY + 22;
  doc.setFont('helvetica', 'bold');
  doc.text(teacher.nama, marginX + colWidth / 2, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${teacher.nip || '-'}`, marginX + colWidth / 2, signY + 4, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(schoolSettings.kepalaSekolah, marginX + colWidth + colWidth / 2, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${schoolSettings.nipKepalaSekolah}`, marginX + colWidth + colWidth / 2, signY + 4, { align: 'center' });

  drawOfficialFooters(doc, marginX, pageWidth, pageHeight);
  doc.save(`Pengesahan_${docItem.name.replace(/\.[^/.]+$/, '')}.pdf`);
};
