import { Link } from "react-router-dom";

function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-sipentar-blue/20">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10 text-center">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-sipentar-blue hover:text-sipentar-blue-dark transition-colors mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">Syarat & Ketentuan</h1>
          <p className="text-slate-500 font-medium">Berlaku Efektif: 15 Agustus 2026</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <p className="lead text-lg text-slate-600 font-medium">
            Dengan menggunakan portal layanan SIPENTAR (Sistem Informasi Pelayanan & Pengaduan Terpadu), Anda menyetujui seluruh ketentuan yang ditetapkan di bawah ini. Harap dibaca dengan saksama.
          </p>
          
          <h3 className="text-xl font-bold mt-8 mb-4">1. Pendaftaran Akun</h3>
          <p className="text-slate-600">
            Pendaftaran hanya diperbolehkan untuk Warga Negara Indonesia yang terdaftar secara sah di wilayah desa terkait. Pengguna wajib memberikan NIK asli dan identitas valid. Pemalsuan identitas dapat berakibat pada pembatalan layanan dan tindakan hukum yang berlaku.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">2. Tanggung Jawab Pengguna</h3>
          <p className="text-slate-600">
            Setiap pelaporan kejadian atau permintaan surat yang diajukan haruslah berdasarkan kebenaran faktual. Anda dilarang untuk:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Mengunggah foto bukti atau lampiran palsu/hasil rekayasa.</li>
            <li>Membuat laporan spam yang tidak relevan dengan infrastruktur atau layanan desa.</li>
            <li>Menggunakan bahasa kotor, diskriminatif, atau ancaman dalam fitur keterangan pelaporan.</li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4">3. Persetujuan Layanan</h3>
          <p className="text-slate-600">
            Admin desa memiliki hak penuh untuk menolak permohonan surat atau menutup laporan jika ditemukan ketidaksesuaian berkas atau laporan tidak mendasar tanpa perlu memberikan pemberitahuan sebelumnya, meskipun kami akan selalu mengupayakan memberikan "Catatan Admin".
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">4. Perubahan Ketentuan</h3>
          <p className="text-slate-600">
            Pemerintah Desa berhak mengubah, memodifikasi, menambah atau menghapus bagian dari Syarat & Ketentuan ini sewaktu-waktu. Anda disarankan untuk memeriksa halaman ini secara berkala.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terms;
