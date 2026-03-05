import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useDarkMode from "../hooks/useDarkMode";

import villageBg from '../assets/village-bg.png';

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  // Handle scroll for sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 flex flex-col transition-colors duration-300 relative overflow-x-hidden">

      {/* 2. HERO SECTION */}
      <section id="beranda" className="relative min-h-[85vh] pt-16 pb-20 flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${villageBg})` }}
          ></div>
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
        </div>

        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 relative w-full flex flex-col items-center z-10">

          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/80 border border-slate-600 text-emerald-300 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-6 sm:mb-8 shadow-lg">
            Sistem Informasi Desa Resmi
          </div>

          <h1 className="font-outfit text-2xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5 sm:mb-6 drop-shadow-lg max-w-[90%] mx-auto md:max-w-none">
            Pemerintah Desa Lamaran Tarung <br className="hidden md:block" /> Melayani Secara Digital.
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-slate-100 mb-8 sm:mb-10 leading-relaxed font-medium max-w-2xl drop-shadow-md px-2">
            Wadah penyampaian aspirasi dan pengaduan masyarakat secara resmi, terintegrasi, dan transparan untuk pembangunan desa yang lebih baik.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-5 sm:px-8 py-3.5 sm:py-4 bg-emerald-700 hover:bg-emerald-800 text-white text-sm sm:text-base font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-3">
                Buat Laporan / Pengaduan
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full px-5 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-transparent text-sm sm:text-base font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                Pantau Laporan Saya
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. TENTANG SIPENTAR SECTION  */}
      <section id="tentang" className="py-12 sm:py-24 bg-white border-y border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            {/* Image / Stats Solid Card */}
            <div className="order-2 lg:order-1">
              <div className="bg-slate-50 p-5 sm:p-10 rounded-2xl shadow-lg border border-slate-200">

                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  <div className="p-4 sm:p-6 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                    <p className="text-3xl sm:text-4xl font-black text-emerald-700 mb-1 sm:mb-2">24/7</p>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Akses Terbuka</p>
                  </div>
                  <div className="p-4 sm:p-6 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                    <p className="text-3xl sm:text-4xl font-black text-amber-600 mb-1 sm:mb-2">100%</p>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">Terintegrasi</p>
                  </div>
                  <div className="sm:col-span-2 p-6 sm:p-8 bg-emerald-800 rounded-xl shadow-md text-left relative overflow-hidden">
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2 relative z-10">Keterbukaan Informasi</h4>
                    <p className="text-emerald-50 font-medium leading-relaxed relative z-10 text-sm sm:text-base">Mewujudkan Desa Lamaran Tarung yang aman, bersih, dan sejahtera melalui partisipasi dan pengawasan aktif warga.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Context */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Informasi Desa
              </div>
              <h2 className="font-outfit text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4 sm:mb-6">
                Sistem Pengaduan Pintar <br className="hidden lg:block" /> Terpadu Satu Pintu.
              </h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                <p>
                  Sipentar (Sistem Informasi Pengaduan Pintar) adalah komitmen nyata dari Pemerintah Desa Lamaran Tarung untuk mempermudah warga dalam menyampaikan masalah, kebutuhan fasilitas, dan aspirasi.
                </p>
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl mt-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Validitas Keluhan</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">Laporan diverifikasi menggunakan Nomor Induk Kependudukan (NIK) terdaftar, meminimalisir laporan tanpa identitas jelas demi penanganan tepat sasaran.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA SECTION (Solid Cards) */}
      <section id="alur" className="py-12 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-2">
            <h2 className="font-outfit text-3xl font-black text-slate-900 mb-4 tracking-tight">SOP Alur Pelaporan</h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">Birokrasi Pelayanan Masyarakat secara Sistematis dan Efisien.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">

            {/* Step 1 */}
            <div className="p-5 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-md transition-all hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-lg font-bold mb-4 sm:mb-6">1</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">Pembuatan Laporan</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">Masuk menggunakan Nomor Induk Kependudukan (NIK) Anda dan lampirkan kronologi rinci perihal keluhan warga atau perbaikan.</p>
            </div>

            {/* Step 2 */}
            <div className="p-5 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-md transition-all hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-lg font-bold mb-4 sm:mb-6">2</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">Verifikasi Desa</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">Admin / Pamong Desa akan meninjau validitas laporan dan memasukkannya ke dalam tabel antrian penanganan dinas terkait.</p>
            </div>

            {/* Step 3 */}
            <div className="p-5 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-md transition-all hover:shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-700 text-white rounded-lg flex items-center justify-center text-lg font-bold mb-4 sm:mb-6">3</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">Resolusi & Eksekusi</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">Pemerintah merampungkan perbaikan dan melampirkan tanggapan akhir sebagai tanda laporan telah sukses diselesaikan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 pt-12 sm:pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12 border-b border-slate-800 pb-10 sm:pb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-slate-700">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Pemerintah Desa Lamaran Tarung</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Sistem Informasi Pengaduan Pintar (Sipentar) mendukung transparansi anggaran pertanggungjawaban program desa terpadu.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Informasi Web</h4>
              <ul className="space-y-3 text-xs sm:text-sm">
                <li><a href="#beranda" className="text-slate-300 hover:text-white transition">Halaman Utama</a></li>
                <li><Link to="/register" className="text-slate-300 hover:text-white transition">Daftar Akun Baru</Link></li>
                <li><Link to="/login" className="text-slate-300 hover:text-white transition">Akses Sistem</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Pusat Layanan</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li>Kantor Keuchik / Balai Desa</li>
                <li>Jalan Raya Blok Kosambi</li>
                <li>Kecamatan Cantigi</li>
                <li className="pt-2 sm:pt-3 text-emerald-400 font-medium break-all">admin@lamarantarung.desa.id</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs text-center md:text-left">
              &copy; {new Date().getFullYear()} Pemerintah Desa Lamaran Tarung, Kab. Indramayu. <br className="md:hidden" /> Hak Cipta Dilindungi Undang-Undang.
            </p>
            <div className="text-slate-500 text-xs flex gap-3">
              <span>Sipentar Versi 2.0</span>
              <span className="text-slate-700">|</span>
              <Link to="/login" className="hover:text-slate-300 transition">Portal Layanan</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;