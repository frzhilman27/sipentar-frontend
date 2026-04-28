import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useDarkMode from "../hooks/useDarkMode";

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col relative overflow-x-hidden">

      {/* 1. SOLID NAVBAR */}
      <div className={`fixed w-full z-50 top-0 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm border-b border-slate-200' : 'bg-slate-50'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logosipentar.png" alt="Logo Sipentar" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm bg-white" />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  SIPENTAR<span className="text-sipentar-blue">.</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Portal Layanan Publik</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#layanan" className="text-sm font-bold text-slate-600 hover:text-sipentar-blue transition-colors">Layanan</a>
              <a href="#keamanan" className="text-sm font-bold text-slate-600 hover:text-sipentar-blue transition-colors">Keamanan</a>
              <a href="#kontak" className="text-sm font-bold text-slate-600 hover:text-sipentar-blue transition-colors">Kontak</a>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                Masuk
              </Link>
              <Link to="/register" className="text-sm font-bold text-white bg-sipentar-blue hover:bg-sipentar-blue-dark px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                Mulai Sekarang
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                aria-label="Menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
          <div className="px-4 py-6 flex flex-col gap-4">
            <a href="#layanan" className="text-slate-700 font-bold text-base hover:text-sipentar-blue transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Layanan</a>
            <a href="#keamanan" className="text-slate-700 font-bold text-base hover:text-sipentar-blue transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Keamanan</a>
            <a href="#kontak" className="text-slate-700 font-bold text-base hover:text-sipentar-blue transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Kontak</a>
            <div className="h-px bg-slate-100 my-2"></div>
            <Link to="/login" className="text-sipentar-blue-dark font-bold text-base text-center border border-blue-200 bg-sipentar-blue-50 py-3 rounded-lg hover:bg-sipentar-blue-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Masuk Ke Akun</Link>
            <Link to="/register" className="text-center bg-sipentar-blue text-white font-bold text-base py-3 rounded-lg hover:bg-sipentar-blue-dark transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Mulai Sekarang</Link>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION - Clean Typography Focused */}
      <section id="beranda" className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat pt-20" style={{ backgroundImage: "url('/rice_field_bg.png')" }}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center mt-10">
          <img src="/logosipentar.png" alt="Logo" className="w-24 h-24 mb-6 drop-shadow-2xl" />
          
          {/* Desktop Headline */}
          <h1 className="hidden md:block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] mb-6">
            Masa Depan Tata Kelola <br/><span className="text-blue-400 drop-shadow-md">Pemerintahan Desa.</span>
          </h1>

          {/* Mobile Headline */}
          <h1 className="md:hidden text-4xl font-black text-white tracking-tight leading-tight mb-6">
            Tata Kelola Desa Berbasis <span className="text-blue-400 drop-shadow-md">Data & Transparansi.</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl font-medium drop-shadow-sm">
            Platform digital terintegrasi untuk pelayanan publik, visualisasi data, dan manajemen administrasi desa yang efisien.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 relative z-10">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-sipentar-blue hover:bg-sipentar-blue-dark text-white text-base font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg border border-transparent hover:border-blue-400">
                <span className="hidden md:inline">Mulai Sekarang</span>
                <span className="md:hidden">Buat Laporan Baru</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md text-base font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg">
                Akses Dasbor Warga
              </button>
            </Link>
          </div>

          {/* Desktop Hero Image - Mockup placeholder */}
          <div className="hidden md:flex w-full max-w-4xl mx-auto relative items-center justify-center mt-16 mb-8">
             <img src="/logosipentar.png" alt="Logo Sipentar" className="w-64 h-64 drop-shadow-2xl opacity-90" />
          </div>
        </div>
      </section>

      {/* 3. FITUR / SECTIONS */}
      <section id="layanan" className="py-20 sm:py-32 bg-white border-y border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16 md:flex justify-between items-end border-b border-slate-200 pb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                  Sistem Informasi Terpadu
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl font-medium">
                  Modul komprehensif untuk mendukung operasional pemerintahan desa modern.
                </p>
              </div>
          </div>

          {/* Desktop Sections & Mobile Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-sipentar-blue mb-6 border border-slate-200 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Layanan Pemerintahan Terpadu</h3>
               <p className="text-slate-600 text-sm leading-relaxed font-medium md:hidden font-bold mb-1">Data Security</p>
               <p className="text-slate-600 text-sm leading-relaxed">
                 Akses berbagai layanan administrasi, pengajuan surat menyurat, dan pelaporan langsung dari satu pintu.
               </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-sipentar-blue mb-6 border border-slate-200 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Visualisasi Data</h3>
               <p className="text-slate-600 text-sm leading-relaxed font-medium md:hidden font-bold mb-1">24/7 Access</p>
               <p className="text-slate-600 text-sm leading-relaxed">
                 Pemantauan metrik laporan, demografi, dan status pelayanan dalam bentuk grafik analitik yang mudah dipahami.
               </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow" id="keamanan">
               <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-sipentar-blue mb-6 border border-slate-200 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Keamanan Tingkat Tinggi</h3>
               <p className="text-slate-600 text-sm leading-relaxed font-medium md:hidden font-bold mb-1">Integrated Monitoring</p>
               <p className="text-slate-600 text-sm leading-relaxed">
                 Proteksi data warga dengan enkripsi berlapis, verifikasi identitas, dan audit log riwayat aktivitas secara real-time.
               </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOOTER - Corporate Minimal */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800" id="kontak">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-slate-800 pb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1">
                  <img src="/logosipentar.png" alt="Logo Sipentar Footer" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">SIPENTAR.</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                Pusat aduan dan layanan digital Pemerintah Desa. Mendukung tata kelola pemerintahan desa yang akuntabel.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Sistem</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Portal Login</Link></li>
                <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Registrasi Penduduk</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Kontak & Bantuan</h4>
              <ul className="space-y-3 text-sm font-medium text-slate-400">
                <li>Balai Desa</li>
                <li>Kecamatan, Kabupaten</li>
                <li className="pt-2 text-sipentar-blue-light font-bold">admin@desa.id</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Pemerintah Desa. Seluruh Hak Cipta Dilindungi.
            </p>
            <div className="flex gap-4">
              <span>Sipentar Portal v3.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200">
        <div className="flex justify-around items-center h-16 pb-safe">
          <a href="#beranda" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-sipentar-blue">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
             <span className="text-[10px] font-bold tracking-wide">Beranda</span>
          </a>
          <Link to="/login" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
             <span className="text-[10px] font-bold tracking-wide">Laporan</span>
          </Link>
          <Link to="/register" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
             <span className="text-[10px] font-bold tracking-wide">Daftar</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default Home;