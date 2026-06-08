import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-sipentar-blue/20">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10 text-center">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-sipentar-blue hover:text-sipentar-blue-dark transition-colors mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">Kebijakan Privasi</h1>
          <p className="text-slate-500 font-medium">Pembaruan Terakhir: 15 Agustus 2026</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <p className="lead text-lg text-slate-600 font-medium">
            Pemerintah Desa sangat menghargai dan melindungi privasi data pribadi Anda sebagai warga yang menggunakan layanan SIPENTAR (Sistem Informasi Pelayanan & Pengaduan Terpadu).
          </p>
          
          <h3 className="text-xl font-bold mt-8 mb-4">1. Pengumpulan Data</h3>
          <p className="text-slate-600">
            Kami mengumpulkan data pribadi berupa NIK, Nama Lengkap, Nomor Telepon, Alamat, dan berkas lampiran (seperti foto KTP/KK) secara eksklusif untuk tujuan verifikasi identitas kependudukan dan administrasi pelayanan surat maupun laporan pengaduan.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">2. Penggunaan Data</h3>
          <p className="text-slate-600">
            Informasi Anda hanya digunakan dalam ruang lingkup pelayanan Pemerintah Desa, termasuk namun tidak terbatas pada:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600">
            <li>Memvalidasi laporan kejadian atau masalah infrastruktur.</li>
            <li>Memproses dan menerbitkan permohonan surat administrasi (SKU, SKTM, Domisili, dll).</li>
            <li>Memberikan pemberitahuan status pelayanan melalui WhatsApp atau notifikasi aplikasi.</li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4">3. Keamanan Informasi</h3>
          <p className="text-slate-600">
            Seluruh data yang Anda masukkan disimpan dalam server terenkripsi. Kata sandi (password) Anda telah dienkripsi secara aman menggunakan <i>bcrypt</i>. Kami tidak akan pernah menjual, menyewakan, atau memberikan informasi pribadi Anda kepada pihak ketiga manapun tanpa persetujuan hukum.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">4. Hak Anda</h3>
          <p className="text-slate-600">
            Sebagai warga terdaftar, Anda memiliki hak penuh untuk mengakses, memperbarui, atau meminta penghapusan riwayat data Anda dengan menghubungi langsung petugas admin di kantor desa kami.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
