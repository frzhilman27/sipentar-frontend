import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Laporan from "./Laporan";

function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const fetchReports = async () => {
    try {
      const res = await api.get("/laporan");
      setReports(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Gagal memuat notifikasi", err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchReports();
    fetchNotifications();

    // Polling setiap 10 detik
    const intervalId = setInterval(fetchNotifications, 10000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      console.error("Gagal menandai dibaca", err);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      handleMarkAllAsRead();
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/laporan/${id}/status`, { status: newStatus });
      fetchReports();
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm";
      case "Diproses":
        return "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm";
      case "Menunggu": default:
        return "bg-amber-50 text-amber-600 border border-amber-200 shadow-sm";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-200">
      {/* Header Estetis Mewah */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-indigo-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50/50">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight">Sipentar<span className="text-indigo-600">.</span></h1>
              <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Desa Lamaran Tarung</p>
            </div>
          </div>

          <div className="flex items-center gap-5 sm:gap-7">
            {/* Notification Bell Mewah */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown Aesthetic */}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100/60 overflow-hidden transform origin-top-right transition-all">
                  <div className="px-6 py-4 border-b border-slate-50 bg-white flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-slate-800">Pemberitahuan</h3>
                    {unreadCount > 0 && <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">{unreadCount} Baru</span>}
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500">Ketenangan Terjaga.</p>
                        <p className="text-xs text-slate-400 mt-0.5">Belum ada aktivitas baru hari ini.</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-50">
                        {notifications.map((notif) => (
                          <li key={notif.id} className={`p-5 hover:bg-slate-50/80 transition-colors group ${!notif.is_read ? 'bg-indigo-50/20' : ''}`}>
                            <div className="flex gap-4">
                              <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-slate-200'}`}></div>
                              <div>
                                <p className={`text-sm leading-snug ${!notif.is_read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{notif.message}</p>
                                <p className="text-[11px] font-semibold text-slate-400 mt-2 flex items-center gap-1.5">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  {new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <p className="text-sm font-extrabold text-slate-800 leading-tight">{name || "Pengguna"}</p>
                <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">{role}</p>
              </div>

              {/* Actions Dropdown / Links */}
              <div className="flex gap-1.5 sm:gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                <Link
                  to="/profile"
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                  title="Kelola Akun Pribadi"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                  title="Akhiri Sesi"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Hero Section Premium dengan Efek Mesh Gradient */}
        <div className="relative mb-12 rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 opacity-90"></div>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>

          <div className="relative px-8 py-14 sm:p-20 flex flex-col sm:flex-row items-center justify-between gap-10">
            <div className="text-center sm:text-left z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4 border border-white/10 backdrop-blur-md">
                Portal Terpusat
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                <span className="opacity-90 font-light">Selamat datang,</span> <br className="hidden sm:block" />
                {name}
              </h2>
              <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
                Kelola laporan insiden dan aspirasi warga dengan satu ketukan. Sistem transparan untuk Desa Lamaran Tarung yang lebih baik.
              </p>
            </div>
            <div className="hidden lg:block shrink-0 z-10 w-48 h-48 opacity-90">
              {/* Ilustrasi Dekoratif (Opsional - memakai SVG Vektor Pola) */}
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform -rotate-6">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path fill="url(#grad1)" d="M49.6,-66C63.1,-58.5,72.2,-42.6,76.5,-26C80.8,-9.4,80.3,7.9,73.1,22.1C65.8,36.3,51.8,47.4,37.3,55.8C22.8,64.2,7.8,69.9,-7.4,69.5C-22.6,69.1,-38,62.6,-50.2,52C-62.5,41.4,-71.5,26.7,-74.3,10.6C-77.1,-5.5,-73.8,-23.1,-63.3,-36C-52.8,-48.9,-35.1,-57.2,-19.1,-63C-3.1,-68.8,11.2,-72.1,26.7,-71.2C42.2,-70.3,56.7,-65.2,49.6,-66Z" transform="translate(100 100)" />
                <path fill="white" fillOpacity="0.2" d="M38.1,-55C49.9,-43.5,60.5,-32.1,64.4,-18.2C68.4,-4.3,65.8,12.2,58.2,26.2C50.6,40.2,38.1,51.7,23.3,59.2C8.6,66.8,-8.5,70.5,-23.1,66.5C-37.7,62.5,-49.9,50.9,-58.3,37C-66.8,23.1,-71.6,7,-68.5,-7C-65.5,-21,-54.6,-32.8,-43.4,-44.5C-32.2,-56.3,-20.5,-68,-6.4,-70.6C7.7,-73.1,26.3,-66.4,38.1,-55Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Metrik Analitik Mini (Angka Statistik) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100/60 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">Total Laporan</p>
            <p className="text-3xl font-extrabold text-slate-800">{reports.length}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100/60 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">Diselesaikan</p>
            <p className="text-3xl font-extrabold text-slate-800">{reports.filter(r => r.status === 'Selesai').length}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100/60 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">Diproses</p>
            <p className="text-3xl font-extrabold text-slate-800">{reports.filter(r => r.status === 'Diproses').length}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100/60 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">Menunggu</p>
            <p className="text-3xl font-extrabold text-slate-800">{reports.filter(r => r.status === 'Menunggu').length}</p>
          </div>
        </div>

        {/* Input Form Khusus User (Bagian atas) */}
        {role === "user" && (
          <div className="mb-14">
            <Laporan onReportAdded={fetchReports} />
          </div>
        )}

        {/* Koleksi Laporan - Transformasi List Cards (Bukan Tabel) */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                {role === "admin" ? "Semua Rekapitulasi Laporan" : "Lini Masa Laporan Anda"}
              </h3>
              <p className="text-slate-500 font-medium mt-1">Histori laporan disajikan dalam tatanan kronologis yang mutakhir.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {reports.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-slate-100/60 shadow-sm p-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h4 className="text-xl font-extrabold text-slate-800 mb-2">Papan Ketik Bersih</h4>
                <p className="text-slate-500 font-medium max-w-sm">Sipentar belum mencatat satu pelaporan pun ke dalam kotak arsip.</p>
              </div>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="bg-white group rounded-[2rem] border border-slate-100/60 p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-10 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">

                  {/* Avatar & Info Pelapor */}
                  <div className="flex items-start gap-4 shrink-0 md:w-64">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-extrabold text-xl shadow-inner group-hover:from-indigo-100 group-hover:to-blue-50 transition-colors">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{r.name}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1 tracking-wider uppercase flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Tanggal Laporan'}
                      </p>
                    </div>
                  </div>

                  {/* Konten Aduan */}
                  <div className="flex-1">
                    <h4 className="font-extrabold text-xl text-slate-900 mb-2 leading-tight">{r.judul}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed pb-6 text-[15px]">{r.isi}</p>

                    {/* Gambar Opsional Bento Style */}
                    {r.image_url && (
                      <div className="mt-2 mb-6 rounded-2xl overflow-hidden border border-slate-200/40 shadow-sm sm:max-w-md relative group/img cursor-zoom-in">
                        <img
                          src={`${API_URL}/uploads/${r.image_url}`}
                          alt="Bukti Laporan"
                          className="w-full h-auto object-cover group-hover/img:scale-105 group-hover/img:rotate-1 transition-all duration-500"
                          onClick={() => window.open(`${API_URL}/uploads/${r.image_url}`, "_blank")}
                        />
                        <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                      </div>
                    )}

                    {/* Status & Kendali Admin Bottom Bar */}
                    <div className="pt-5 mt-auto border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-extrabold tracking-widest uppercase ${getStatusBadge(r.status)}`}>
                        {r.status === 'Menunggu' && <span className="w-2 h-2 rounded-full bg-amber-500 mr-2.5 shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse"></span>}
                        {r.status === 'Diproses' && <span className="w-2 h-2 rounded-full bg-blue-500 mr-2.5 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse"></span>}
                        {r.status === 'Selesai' && <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        Status: {r.status}
                      </span>

                      {role === "admin" && (
                        <div className="relative shrink-0">
                          <select
                            value={r.status}
                            onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                            className="appearance-none bg-slate-50 border-2 border-slate-100/80 hover:border-indigo-200 text-slate-700 text-sm font-bold rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block w-full pl-5 pr-12 py-2.5 outline-none transition-all cursor-pointer"
                          >
                            <option value="Menunggu">Tandai Tertunda</option>
                            <option value="Diproses">Kerjakan (Proses)</option>
                            <option value="Selesai">Tetapkan Tuntas</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-20 text-center flex flex-col items-center">
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mb-4"></div>
          <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">
            Sipentar Dashboard Platform © {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;