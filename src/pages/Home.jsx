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
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-200 flex flex-col transition-colors duration-300 relative overflow-hidden">

      {/* Global Village Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[30s] ease-in-out hover:scale-110"
          style={{ backgroundImage: `url(${villageBg})` }}
        ></div>
        {/* Dynamic Dark Gradient Overlay to ensure text readability across sections - Golden/Emerald Mix */}
        <div className="absolute inset-0 bg-gradient-to-b from-village-dark-900/40 via-village-emerald-900/50 to-village-dark-900/90 mix-blend-multiply"></div>
      </div>

      {/* 1. NAVBAR SECTION */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border-b border-white/10 py-3' : 'bg-transparent py-5'} `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-[0_5px_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform border border-emerald-400/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <span className={`text-xl font-extrabold tracking-tight block leading-none transition-colors text-white drop-shadow-md`}>Sipentar</span>
              <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors text-emerald-300 drop-shadow-sm`}>Desa Lamaran Tarung</span>
            </div>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <a href="#beranda" className={`text-sm font-semibold transition-colors text-slate-200 hover:text-white drop-shadow-md hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`}>Beranda</a>
            <a href="#tentang" className={`text-sm font-semibold transition-colors text-slate-200 hover:text-white drop-shadow-md hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`}>Tentang Sipentar</a>
            <a href="#alur" className={`text-sm font-semibold transition-colors text-slate-200 hover:text-white drop-shadow-md hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`}>Alur Pelaporan</a>
          </div>

          <div className="flex gap-3 items-center">
            <Link to="/login">
              <button className={`hidden sm:block px-5 py-2.5 text-sm font-bold rounded-xl transition shadow-[0_5px_15px_rgba(0,0,0,0.2)] border text-white bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-md`}>
                Masuk Dasbor
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2.5 text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-xl transition shadow-[0_5px_15px_rgba(16,185,129,0.4)] border border-emerald-400/50 hover:-translate-y-0.5 transform">
                Daftar Warga
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="beranda" className="relative min-h-[90vh] lg:min-h-screen pt-32 pb-20 flex flex-col justify-center items-center text-center z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full flex flex-col items-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-[11px] font-extrabold tracking-widest uppercase mb-8 backdrop-blur-md shadow-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.9)]"></span>
            Layanan Publik Desa Digital Hadir Kembali
          </div>

          <h1 className="font-outfit text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] filter">
            Wujudkan Desa <span className="text-transparent bg-clip-text bg-gradient-to-r from-village-amber-300 via-village-emerald-300 to-village-amber-400 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">Lebih Baik</span> <br className="hidden md:block" /> Bersama-sama.
          </h1>

          <p className="text-lg lg:text-xl text-slate-200 mb-10 leading-relaxed font-semibold max-w-2xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Sistem Informasi Pengaduan Pintar (Sipentar) melayani aspirasi dan laporan masyarakat Desa Lamaran Tarung secara memukau, transparan, dan terintegrasi.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-base font-extrabold rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(16,185,129,0.8)] border border-emerald-400/50 transform hover:-translate-y-1 flex items-center justify-center gap-3">
                Buat Laporan Sekarang
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-base font-extrabold rounded-xl transition-all shadow-xl backdrop-blur-xl flex items-center justify-center gap-2 transform hover:-translate-y-1">
                Lacak Laporan
              </button>
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-4 text-sm font-bold text-slate-300 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=33" alt="Warga" className="w-10 h-10 rounded-full border-2 border-slate-800" />
              <img src="https://i.pravatar.cc/100?img=12" alt="Warga" className="w-10 h-10 rounded-full border-2 border-slate-800" />
              <img src="https://i.pravatar.cc/100?img=45" alt="Warga" className="w-10 h-10 rounded-full border-2 border-slate-800" />
              <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs text-white font-bold">+99</div>
            </div>
            <p>Bergabung dengan ratusan warga lainnya yang telah melapor.</p>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* 3. TENTANG SIPENTAR SECTION  */}
      <section id="tentang" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image / Stats Glassmorphism */}
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-[2.5rem] transform -rotate-3 transition duration-500 blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-3xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/20">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-60"></div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/10 text-center shadow-inner">
                    <p className="text-5xl font-black text-emerald-400 tracking-tighter mb-2 drop-shadow-md">24/7</p>
                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Akses Terbuka</p>
                  </div>
                  <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/10 text-center shadow-inner">
                    <p className="text-5xl font-black text-amber-400 tracking-tighter mb-2 drop-shadow-md">100%</p>
                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Transparan</p>
                  </div>
                  <div className="col-span-2 p-8 bg-gradient-to-br from-emerald-600/90 to-teal-800/90 rounded-2xl shadow-xl text-left relative overflow-hidden border border-emerald-400/30">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl animate-pulse"></div>
                    <h4 className="text-2xl font-black text-white mb-2 relative z-10 drop-shadow-md">Misi Keasrian</h4>
                    <p className="text-emerald-100 font-semibold leading-relaxed relative z-10">Mewujudkan Desa Lamaran Tarung yang aman, bersih, asri, dan sejahtera melalui partisipasi aktif setiap rukun warga.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Context */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-white/10 text-emerald-300 text-[11px] font-extrabold tracking-widest uppercase mb-6 shadow-[0_5px_15px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Tentang Sipentar
              </div>
              <h2 className="font-outfit text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                Keharmonisan Warga dan <br className="hidden lg:block" /> Infrastruktur Pintar.
              </h2>
              <div className="space-y-6 text-lg text-slate-300 leading-relaxed font-semibold drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                <p>
                  Sipentar (Sistem Informasi Pengaduan Pintar) adalah komitmen digital dari Pemerintah Desa Lamaran Tarung untuk menjahit kesenjangan infrastruktur pedesaan menjadi tatanilai premium yang agung.
                </p>
                <div className="flex items-start gap-5 p-6 bg-slate-900/40 border border-white/10 rounded-2xl shadow-inner backdrop-blur-md mt-8">
                  <div className="min-w-max">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-[0_5px_15px_rgba(16,185,129,0.5)]">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white drop-shadow-md">Akurasi & Transparansi</h4>
                    <p className="text-sm font-medium text-emerald-100/70 mt-1.5 leading-relaxed">Setiap laporan dikurasi melalui KTP dan warga dapat menyelinap untuk memantau progres secara *real-time* di Dashboard eksklusif.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA SECTION (Glass Cards) */}
      <section id="alur" className="py-24 relative z-10 bg-slate-950/40 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-outfit text-4xl font-black text-white mb-4 tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">Alur Pelaporan Transparan</h2>
            <p className="text-slate-300 text-lg font-medium drop-shadow-md">Sistem ini dirancang dari bawah ke atas agar sangat sederhana, mewah, dan bebas hambatan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">

            {/* Step 1 */}
            <div className="p-10 rounded-[2rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 hover:border-emerald-400/50 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.3)] transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-8 shadow-lg shadow-emerald-900/50 border border-emerald-400/30 group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Ciptakan Laporan</h3>
              <p className="text-slate-300 leading-relaxed font-medium">Buka gerbang eksklusif dengan NIK, lalu lampirkan keluhan, kerusakan alam, atau aspirasi pembangunan berharga Anda.</p>
            </div>

            {/* Step 2 */}
            <div className="p-10 rounded-[2rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 hover:border-amber-400/50 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_-15px_rgba(245,158,11,0.3)] transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-8 shadow-lg shadow-amber-900/50 border border-amber-400/30 group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Atensi Desa</h3>
              <p className="text-slate-300 leading-relaxed font-medium">Laporan akan menyentuh radar Kepala Desa, diverifikasi urgensinya, dan masuk antrian pengerjaan prioritas tinggi.</p>
            </div>

            {/* Step 3 */}
            <div className="p-10 rounded-[2rem] bg-slate-900/60 backdrop-blur-2xl border border-white/10 hover:border-emerald-400/50 hover:-translate-y-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.3)] transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-8 shadow-lg shadow-teal-900/50 border border-emerald-400/30 group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Resolusi Agung</h3>
              <p className="text-slate-300 leading-relaxed font-medium">Proyek pelaporan dituntaskan tanpa bekas, infrastruktur pulih berkelas, dan lumbung desa makmur terjaga sejahtera.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER (Translucent) */}
      <footer className="bg-slate-950/90 backdrop-blur-3xl pt-20 pb-10 border-t border-white/5 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg border border-emerald-400/30">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">Sipentar v2</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                Sistem Informasi Pengaduan Warga Desa Lamaran Tarung. Solusi digital untuk pelayanan aparat desa yang responsif, transparan, dan akuntabel.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tautan Pantas</h4>
              <ul className="space-y-3">
                <li><a href="#beranda" className="text-slate-400 hover:text-white transition">Halaman Utama</a></li>
                <li><Link to="/register" className="text-slate-400 hover:text-white transition">Daftar Akun Baru</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-white transition">Masuk Dasbor</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-5 opacity-80">Kontak Desa</h4>
              <ul className="space-y-3 text-slate-400 font-medium">
                <li>Bale Desa Agung, Jl. Raya Tarung</li>
                <li>Kecamatan Lereng Cantigi</li>
                <li>Kabupaten Alam Indramayu</li>
                <li className="pt-4 text-emerald-400 border-t border-slate-800/50 mt-4 font-bold tracking-wide">admin@lamarantarung.desa.id</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">
              &copy; {new Date().getFullYear()} Pemerintah Desa Lamaran Tarung. Hak Cipta Dilindungi.
            </p>
            <div className="text-slate-500 text-sm font-medium flex gap-4">
              <span>Sipentar Versi 2.0</span>
              <span className="text-slate-700">|</span>
              <Link to="/login" className="hover:text-white transition">Akses Admin</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;