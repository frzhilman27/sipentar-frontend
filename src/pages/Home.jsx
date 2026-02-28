import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useDarkMode from "../hooks/useDarkMode";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 flex flex-col transition-colors duration-300">

      {/* 1. NAVBAR SECTION */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'} `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <span className={`text-xl font-extrabold tracking-tight block leading-none transition-colors ${isScrolled ? 'text-slate-900 dark:text-white' : 'text-white'} `}>Sipentar</span>
              <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isScrolled ? 'text-blue-600 dark:text-blue-400' : 'text-blue-300'} `}>Desa Lamaran Tarung</span>
            </div>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <a href="#beranda" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-slate-200 hover:text-white'}`}>Beranda</a>
            <a href="#tentang" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-slate-200 hover:text-white'}`}>Tentang Sipentar</a>
            <a href="#alur" className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-slate-200 hover:text-white'}`}>Alur Pelaporan</a>
          </div>

          <div className="flex gap-3 items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full transition-all focus:outline-none ${isScrolled ? 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              title="Ganti Tema Warna"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>
            <Link to="/login">
              <button className={`hidden sm:block px-5 py-2.5 text-sm font-bold rounded-lg transition shadow-sm border ${isScrolled ? 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700' : 'text-white bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-md'}`}>
                Masuk
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-lg shadow-blue-600/30">
                Daftar Warga
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="beranda" className="relative min-h-[90vh] lg:min-h-screen pt-32 pb-20 overflow-hidden flex flex-col justify-center items-center text-center">
        {/* Cinematic Photographic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
        >
          {/* Gradients to ensure text readability */}
          <div className="absolute inset-0 bg-slate-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-bold tracking-wide uppercase mb-8 backdrop-blur-md shadow-xl">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
            Layanan Publik Desa Digital
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
            Wujudkan Desa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Lebih Baik</span> <br className="hidden md:block" /> Bersama-sama.
          </h1>

          <p className="text-lg lg:text-xl text-slate-200 mb-10 leading-relaxed font-medium max-w-2xl drop-shadow-md">
            Sistem Informasi Pengaduan Pintar (Sipentar) melayani aspirasi dan laporan kejadian masyarakat Desa Lamaran Tarung secara cepat, transparan, dan terintegrasi langsung dengan aparat desa.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Buat Laporan Sekarang
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-base font-bold rounded-xl transition-all shadow-lg backdrop-blur-md flex items-center justify-center gap-2 transform hover:-translate-y-1">
                Lacak Laporan Saya
              </button>
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-4 text-sm font-medium text-slate-300 drop-shadow-md">
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

      {/* 3. TENTANG SIPENTAR SECTION */}
      <section id="tentang" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image / Stats */}
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-[2rem] transform -rotate-3 transition duration-500"></div>
              <div className="relative bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-center transition-colors">
                    <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2 transition-colors">24/7</p>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Akses Terbuka</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-center transition-colors">
                    <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2 transition-colors">100%</p>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Transparan</p>
                  </div>
                  <div className="col-span-2 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <h4 className="text-lg font-bold text-white mb-1 relative z-10">Misi Kami</h4>
                    <p className="text-sm text-blue-100 relative z-10">Mewujudkan Desa Lamaran Tarung yang aman, bersih, dan sejahtera melalui partisipasi aktif warga.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Tentang Sipentar
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6 transition-colors">
                Jembatan Pintar Antara Warga dan Desa.
              </h2>
              <div className="space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium transition-colors">
                <p>
                  Sipentar (Sistem Informasi Pengaduan Pintar) adalah inisiatif digital resmi dari Pemerintah Desa Lamaran Tarung. Kami percaya bahwa pembangunan desa yang optimal membutuhkan komunikasi dua arah yang lancar tanpa batasan birokrasi yang rumit.
                </p>
                <p>
                  Melalui platform ini, setiap Warga dapat dengan mudah menyuarakan aspirasi, melaporkan infrastruktur yang rusak, atau kejadian penting lainnya yang membutuhkan perhatian segera dari pihak Desa, di mana saja dan kapan saja.
                </p>
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-colors">
                  <div className="min-w-max">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white transition-colors">Akurasi & Transparansi</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Setiap laporan diverifikasi melalui NIK dan warga dapat memonitor progres tindak-lanjut secara *real-time*.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES / CARA KERJA SECTION */}
      <section id="alur" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">Alur Pelaporan yang Transparan</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">Sistem ini dirancang untuk memudahkan Anda melapor dalam tiga langkah sederhana tanpa birokrasi yang rumit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition duration-300">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-xl font-black mb-6 transition-colors">1</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Tulis Laporan</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Daftarkan identitas NIK Anda, lalu tuliskan rincian kejadian, keluhan, atau aspirasi dengan jelas di form yang tersedia.</p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition duration-300">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center text-xl font-black mb-6 transition-colors">2</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Proses Verifikasi</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Laporan masuk ke Dasbor Admin Desa, diverifikasi urgensinya, dan diteruskan ke perangkat desa untuk ditindaklanjuti.</p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition duration-300">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center text-xl font-black mb-6 transition-colors">3</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Tindak Lanjut Selesai</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Laporan selesai dikerjakan, status berubah hijau, dan desa akan terbebas dari masalah yang diberitahukan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">Sipentar</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm">
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
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Kontak Desa</h4>
              <ul className="space-y-3 text-slate-400">
                <li>Jl. Raya Lamaran Tarung No. 1</li>
                <li>Kecamatan Cantigi</li>
                <li>Kabupaten Indramayu</li>
                <li className="pt-2 text-blue-400 border-t border-slate-800 mt-2">admin@lamarantarung.desa.id</li>
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