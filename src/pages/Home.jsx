import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useDarkMode from "../hooks/useDarkMode";

import villageBg from '../assets/village-bg.png';

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

      {/* 1. FLOATING NAVBAR */}
      <div className="fixed w-full z-50 top-0 transition-all duration-500 ease-in-out px-4 sm:px-6 lg:px-8 mt-4">
        <nav className={`max-w-6xl mx-auto rounded-2xl transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 py-2.5 px-4' : 'bg-transparent py-4 px-2'} ${isMobileMenuOpen && !isScrolled ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800' : ''}`}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3 pl-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <img src="/logosipentar.png" alt="Logo Sipentar" className="relative w-9 h-9 rounded-full object-cover shadow-sm border-2 border-white bg-white" />
              </div>
              <span className={`text-xl font-bold tracking-tight ${(isScrolled || (isMobileMenuOpen && !isScrolled)) ? 'text-slate-800' : 'text-white'} ${(!isScrolled && isMobileMenuOpen) ? '!text-white' : ''}`}>
                Sipentar<span className="text-emerald-500">.</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 px-6 py-2 rounded-full bg-slate-900/5 border border-white/10 backdrop-blur-sm">
              <a href="#beranda" className={`text-sm font-bold transition-colors hover:text-emerald-500 ${isScrolled ? 'text-slate-600' : 'text-white drop-shadow-sm'}`}>Beranda</a>
              <a href="#tentang" className={`text-sm font-bold transition-colors hover:text-emerald-500 ${isScrolled ? 'text-slate-600' : 'text-white drop-shadow-sm'}`}>Tentang Sipentar</a>
              <a href="#alur" className={`text-sm font-bold transition-colors hover:text-emerald-500 ${isScrolled ? 'text-slate-600' : 'text-white drop-shadow-sm'}`}>Alur Layanan</a>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3 pr-1">
              <Link to="/login" className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>
                Masuk
              </Link>
              <Link to="/register" className="relative group overflow-hidden rounded-xl">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 group-hover:from-emerald-400 group-hover:via-emerald-500 group-hover:to-emerald-600 transition-all duration-300"></span>
                <span className="relative text-sm font-bold text-white px-6 py-2.5 block shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300">
                  Daftar
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center pr-1">
              <button
                className={`p-2 rounded-xl ${isScrolled ? 'text-slate-700 bg-slate-100 hover:bg-slate-200' : 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm'} ${isMobileMenuOpen && !isScrolled ? '!text-white !bg-white/10' : ''} transition-colors focus:outline-none`}
                aria-label="Menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-2xl transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
          <div className="p-5 flex flex-col gap-2">
            <a href="#beranda" className="text-slate-800 font-bold text-base px-4 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Beranda</a>
            <a href="#tentang" className="text-slate-800 font-bold text-base px-4 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Tentang Sipentar</a>
            <a href="#alur" className="text-slate-800 font-bold text-base px-4 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Alur Pelaporan</a>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>
            <Link to="/login" className="text-slate-800 font-bold text-base text-center border-2 border-slate-100 py-3 rounded-xl hover:bg-slate-50 transition-colors mt-2" onClick={() => setIsMobileMenuOpen(false)}>Masuk Ke Akun</Link>
            <Link to="/register" className="text-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base py-3 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all mt-2" onClick={() => setIsMobileMenuOpen(false)}>Mendaftar Sekarang</Link>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION - Premium Glow */}
      <section id="beranda" className="relative min-h-[100dvh] pt-24 pb-20 flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" style={{ backgroundImage: `url(${villageBg})` }}></div>
          <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply"></div>
          {/* Animated Ambient Glows */}
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-500/40 rounded-full mix-blend-screen filter blur-[120px] animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
          <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-screen filter blur-[120px] animate-[pulse_10s_ease-in-out_infinite_alternate_reverse]"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full flex flex-col items-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold tracking-widest uppercase mb-8 shadow-2xl transform hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Platform Pintar Desa 2.0
          </div>

          <h1 className="font-outfit text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-300 tracking-tight leading-[1.1] mb-6 drop-shadow-2xl max-w-[90%] mx-auto md:max-w-none">
            Transformasi Digital <br className="hidden md:block" /> Desa Lamaran Tarung.
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-200/90 mb-10 leading-relaxed font-medium max-w-2xl drop-shadow-lg px-2">
            Wadah penyampaian aspirasi dan pengaduan masyarakat secara resmi, terintegrasi, dan transparan untuk tata kelola desa yang responsif.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Link to="/register" className="w-full sm:w-auto group">
              <button className="relative w-full overflow-hidden px-8 py-4 bg-emerald-600 text-white text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] flex items-center justify-center gap-3">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                <span className="relative">Buat Pengaduan Sekarang</span>
                <svg className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-base font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                Pantau Laporan Saya
              </button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 animate-bounce">
          <span className="text-[10px] uppercase font-bold text-white tracking-widest">Scroll</span>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* 3. TENTANG SIPENTAR SECTION - Bento Grid Style */}
      <section id="tentang" className="py-20 sm:py-32 bg-white text-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Tentang Sipentar
              </div>
              <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-2xl">
                Sistem Pengaduan Pintar <br className="hidden lg:block" /> Terpadu Satu Pintu.
              </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Main Bento Card */}
            <div className="lg:col-span-8 bg-slate-50 border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-6 border border-slate-100">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Validitas dan Keamanan Data</h3>
               <p className="text-slate-600 text-lg leading-relaxed font-medium mb-6">
                 Sipentar (Sistem Informasi Pengaduan Pintar) adalah komitmen nyata dari Pemerintah Desa Lamaran Tarung untuk mempermudah warga dalam menyampaikan masalah. Laporan diverifikasi menggunakan <span className="font-bold text-slate-800">Nomor Induk Kependudukan (NIK)</span> terdaftar, meminimalisir pelaporan anonim palsu demi penanganan yang tepat sasaran.
               </p>
            </div>

            {/* Side Bento Cards */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex-1 bg-emerald-900 rounded-3xl p-8 shadow-lg shadow-emerald-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <h4 className="text-4xl font-black text-white mb-2">24/7</h4>
                <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs">Akses Terbuka</p>
                <div className="mt-6 text-emerald-50/80 text-sm font-medium leading-relaxed">Sistem menerima laporan kapanpun tanpa batasan jam kerja birokrasi konvensional.</div>
              </div>

              <div className="flex-1 bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-4xl font-black text-amber-500 mb-2">100%</h4>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Terintegrasi</p>
                <div className="mt-6 text-slate-600 text-sm font-medium leading-relaxed">Setiap pelaporan akan diteruskan langsung ke *dashboard* penanganan pamong desa terkait.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CARA KERJA SECTION - Modern Cards with Micro-interactions */}
      <section id="alur" className="py-20 sm:py-32 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 px-2">
            <h2 className="font-outfit text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">Alur Pelayanan Digital</h2>
            <p className="text-slate-500 text-lg font-medium">Birokrasi Pelayanan Masyarakat yang dirombak menjadi Sistematis, Transparan, dan Super Cepat.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-8 right-8 text-slate-100 font-outfit text-6xl font-black group-hover:text-emerald-50 transition-colors duration-300">01</div>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-black mb-8 relative z-10 border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">Buat Laporan</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10">Daftar/Masuk menggunakan Nomor Induk Kependudukan (NIK) Anda dan lampirkan kronologi rinci perihal keluhan warga beserta foto bukti lapangan.</p>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-8 right-8 text-slate-100 font-outfit text-6xl font-black group-hover:text-amber-50 transition-colors duration-300">02</div>
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl font-black mb-8 relative z-10 border border-amber-100 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">Tinjauan Desa</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10">Admin dan aparatur desa akan meninjau validitas laporan Anda secara real-time dan merubah statusnya menjadi proses eksekusi penanganan.</p>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-8 right-8 text-slate-100 font-outfit text-6xl font-black group-hover:text-cyan-50 transition-colors duration-300">03</div>
              <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center text-xl font-black mb-8 relative z-10 border border-cyan-100 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">Tuntas & Bukti</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10">Pemerintah merampungkan perbaikan dan melampirkan foto hasil akhir di sistem. Anda bisa melihat rekam jejak penyelesaian laporan di beranda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER - Clean & Minimal */}
      <footer className="bg-white pt-16 pb-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logosipentar.png" alt="Logo Sipentar Footer" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm object-cover" />
                <span className="text-2xl font-bold text-slate-900 tracking-tight">Sipentar<span className="text-emerald-500">.</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                Pusat aduan dan layanan digital Pemerintah Desa Lamaran Tarung. Mendukung tata kelola desa yang transparan, modern, dan akuntabel.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-5">Navigasi</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#beranda" className="text-slate-500 hover:text-emerald-600 transition">Halaman Utama</a></li>
                <li><Link to="/register" className="text-slate-500 hover:text-emerald-600 transition">Pendaftaran Warga</Link></li>
                <li><Link to="/login" className="text-slate-500 hover:text-emerald-600 transition">Akses Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-5">Kontak</h4>
              <ul className="space-y-3 text-sm font-medium text-slate-500">
                <li>Balai Desa Lamaran Tarung</li>
                <li>Kec. Cantigi, Kab. Indramayu</li>
                <li className="pt-2 text-emerald-600 font-bold">admin@lamarantarung.desa.id</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs font-medium text-center md:text-left">
              &copy; {new Date().getFullYear()} Pemerintah Desa Lamaran Tarung.
            </p>
            <div className="text-slate-400 text-xs font-medium flex gap-4">
              <span>Sipentar Versi 2.0</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;