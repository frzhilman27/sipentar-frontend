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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-200 flex flex-col relative overflow-x-hidden">

      {/* 1. SOLID NAVBAR */}
      <div className={`fixed w-full z-50 top-0 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm border-b border-slate-200' : 'bg-slate-50'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logosipentar.png" alt="Logo Sipentar" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm bg-white" />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  SIPENTAR<span className="text-blue-600">.</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Portal Layanan Publik</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#beranda" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Beranda</a>
              <a href="#tentang" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Tentang Sistem</a>
              <a href="#alur" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Alur Pelaporan</a>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                Masuk
              </Link>
              <Link to="/register" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-md transition-colors shadow-sm">
                Daftar Akun
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors focus:outline-none"
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
            <a href="#beranda" className="text-slate-700 font-bold text-base hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Beranda</a>
            <a href="#tentang" className="text-slate-700 font-bold text-base hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Tentang Sistem</a>
            <a href="#alur" className="text-slate-700 font-bold text-base hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Alur Pelaporan</a>
            <div className="h-px bg-slate-100 my-2"></div>
            <Link to="/login" className="text-blue-700 font-bold text-base text-center border border-blue-200 bg-blue-50 py-3 rounded-md hover:bg-blue-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Masuk Ke Akun</Link>
            <Link to="/register" className="text-center bg-blue-600 text-white font-bold text-base py-3 rounded-md hover:bg-blue-700 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Mendaftar Sekarang</Link>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION - Clean Typography Focused */}
      <section id="beranda" className="relative pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 bg-slate-50">
        
        {/* Minimal grid background pattern */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Sistem Informasi Pengaduan Pintar
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Tata Kelola Desa Berbasis <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">Data & Transparansi.</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-medium">
            Wadah penyampaian aspirasi dan pengaduan masyarakat Desa Lamaran Tarung secara terpadu. Sistematis, tercatat, dan mudah dipantau secara langsung.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                Buat Laporan Baru
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-base font-bold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                Akses Dasbor Warga
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. TENTANG SISTEM SECTION - Enterprise Cards */}
      <section id="tentang" className="py-20 sm:py-32 bg-white border-y border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16 md:flex justify-between items-end border-b border-slate-200 pb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                  Infrastruktur Informasi Desa
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl font-medium">
                  SIPENTAR dirancang untuk mengeliminasi birokrasi berbelit dan menggantinya dengan alur pendataan digital yang efisien.
                </p>
              </div>
              <div className="mt-6 md:mt-0 hidden md:block text-right">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform Version</p>
                <p className="text-slate-800 font-bold">2.0.1 Enterprise</p>
              </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl">
               <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 mb-6 border border-slate-200 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Keamanan Data (NIK)</h3>
               <p className="text-slate-600 text-sm leading-relaxed font-medium">
                 Verifikasi pengguna menggunakan Nomor Induk Kependudukan (NIK) terdaftar untuk memastikan validitas pelapor dan menghindari duplikasi data atau pelaporan palsu.
               </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl">
               <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 mb-6 border border-slate-200 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Akses 24/7 Tanpa Henti</h3>
               <p className="text-slate-600 text-sm leading-relaxed font-medium">
                 Pusat pangkalan data menerima masukan dan laporan kapanpun secara real-time, bebas dari kendala batasan jam operasional kantor kelurahan konvensional.
               </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl">
               <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 mb-6 border border-slate-200 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">Pemantauan Terintegrasi</h3>
               <p className="text-slate-600 text-sm leading-relaxed font-medium">
                 Setiap tiket pelaporan dapat dilacak status penanganannya secara langsung melalui dasbor personal warga, dari tahap tinjauan hingga dokumentasi hasil akhir.
               </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ALUR PELAPORAN - Clean Steps */}
      <section id="alur" className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4 text-center">Standar Operasional Prosedur</h2>
            <p className="text-slate-600 text-lg font-medium text-center max-w-3xl mx-auto">Tiga tahapan sistematis dalam pemrosesan aduan masyarakat untuk menjaga transparansi kerja.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-8 border-slate-50 shadow-sm flex items-center justify-center text-2xl font-black text-blue-600 mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pencatatan Data</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">Warga mengunggah detail masalah beserta foto bukti aktual ke dalam sistem menggunakan akun terverifikasi.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-8 border-slate-50 shadow-sm flex items-center justify-center text-2xl font-black text-blue-600 mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Verifikasi & Penanganan</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">Aparatur desa memeriksa validitas laporan di dasbor admin dan merubah status menjadi 'Diproses' untuk memulai eksekusi lapangan.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-8 border-slate-50 shadow-sm flex items-center justify-center text-2xl font-black text-blue-600 mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Penyelesaian Laporan</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">Laporan ditutup dengan melampirkan dokumentasi pengerjaan yang transparan, dapat dilihat kembali melalui rekam jejak sistem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER - Corporate Minimal */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-slate-800 pb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded bg-white flex items-center justify-center p-1">
                  <img src="/logosipentar.png" alt="Logo Sipentar Footer" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">SIPENTAR.</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                Pusat aduan dan layanan digital Pemerintah Desa Lamaran Tarung. Mendukung tata kelola pemerintahan desa yang akuntabel.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Sistem</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Portal Login</Link></li>
                <li><Link to="/register" className="text-slate-400 hover:text-white transition-colors">Registrasi Penduduk</Link></li>
                <li><a href="#alur" className="text-slate-400 hover:text-white transition-colors">Dokumentasi Alur</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Pusat Bantuan</h4>
              <ul className="space-y-3 text-sm font-medium text-slate-400">
                <li>Balai Desa Lamaran Tarung</li>
                <li>Kec. Cantigi, Kab. Indramayu</li>
                <li className="pt-2 text-blue-400 font-bold">admin@lamarantarung.desa.id</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Pemerintah Desa Lamaran Tarung. Seluruh Hak Cipta Dilindungi.
            </p>
            <div className="flex gap-4">
              <span>Sistem Pengaduan Pintar v2.0.1</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;