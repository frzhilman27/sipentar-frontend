import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Laporan from "./Laporan";
import useDarkMode from "../hooks/useDarkMode";
import villageBg from '../assets/village-bg.png';

function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  // Menghilangkan sisipan trailing "/api" agar rute uploads langsung mengarah ke akar peladen Node
  const IMAGE_BASE_URL = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

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
    } catch {
      alert("Gagal memperbarui status");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-emerald-200 transition-colors duration-300">

      {/* Global Village Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[30s] ease-in-out scale-105"
          style={{ backgroundImage: `url(${villageBg})` }}
        ></div>
        {/* Dynamic Dark Gradient Overlay - Changes slightly based on role */}
        <div className={`absolute inset-0 transition-colors duration-1000 mix-blend-multiply ${role === 'admin' ? 'bg-gradient-to-b from-village-dark-900/80 via-orange-950/70 to-village-dark-900/90' : 'bg-gradient-to-b from-village-dark-900/80 via-village-emerald-900/60 to-village-dark-900/90'}`}></div>
        <div className={`absolute inset-0 backdrop-blur-[4px] ${role === 'admin' ? 'bg-village-dark-900/60' : 'bg-village-dark-900/40'}`}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Estetis Mewah - Glassmorphism */}
        <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
            <div className="flex items-center gap-4 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border group-hover:scale-105 transition-transform ${role === 'admin' ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/30 border-amber-400/30 ring-4 ring-amber-500/10' : 'bg-gradient-to-tr from-village-emerald-500 to-village-emerald-700 shadow-village-emerald-500/30 border-village-emerald-400/30 ring-4 ring-village-emerald-500/10'}`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <h1 className="font-outfit text-2xl font-black text-white tracking-tighter leading-tight drop-shadow-md">Sipentar<span className={role === 'admin' ? 'text-amber-400' : 'text-village-emerald-400'}>.</span></h1>
                <p className={`text-[10px] font-extrabold tracking-[0.2em] uppercase drop-shadow-sm ${role === 'admin' ? 'text-amber-200/80' : 'text-emerald-200/80'}`}>Desa Lamaran Tarung</p>
              </div>
            </div>

            <div className="flex items-center gap-5 sm:gap-7">
              {/* Notification Bell Mewah */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/50 backdrop-blur-md"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Aesthetic - Glassmorphism */}
                {showNotifications && (
                  <div className="fixed sm:absolute inset-x-4 top-20 sm:inset-auto sm:top-auto sm:right-0 sm:mt-4 sm:w-96 bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/20 overflow-hidden transform origin-top sm:origin-top-right transition-all z-50">
                    <div className="px-6 py-5 border-b border-white/10 bg-white/5 flex justify-between items-center transition-colors">
                      <h3 className="text-sm font-black text-white tracking-widest uppercase">Pemberitahuan</h3>
                      {unreadCount > 0 && <span className={`text-[10px] font-black uppercase tracking-wider text-white px-3 py-1 rounded-full shadow-inner ${role === 'admin' ? 'bg-amber-600/80 shadow-amber-900' : 'bg-emerald-600/80 shadow-emerald-900'}`}>{unreadCount} Baru</span>}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-4 shadow-inner">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                          </div>
                          <p className="text-base font-bold text-slate-300 drop-shadow-md">Ketenangan Terjaga.</p>
                          <p className="text-xs text-slate-400 font-medium mt-1">Belum ada aktivitas baru hari ini.</p>
                        </div>
                      ) : (
                        <ul className="divide-y divide-white/10">
                          {notifications.map((notif) => (
                            <li key={notif.id} className={`p-5 hover:bg-white/5 transition-colors group ${!notif.is_read ? 'bg-white/10' : ''}`}>
                              <div className="flex gap-4">
                                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${!notif.is_read ? (role === 'admin' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]') : 'bg-slate-600'}`}></div>
                                <div>
                                  <p className={`text-sm leading-relaxed transition-colors ${!notif.is_read ? 'font-bold text-white drop-shadow-sm' : 'font-medium text-slate-300'}`}>{notif.message}</p>
                                  <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mt-2 flex items-center gap-1.5">
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

              <div className="h-8 w-px bg-white/20 hidden sm:block transition-colors mix-blend-overlay"></div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <p className="text-sm font-black text-white leading-tight drop-shadow-md">{name || "Pengguna"}</p>
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest drop-shadow-sm ${role === 'admin' ? 'text-amber-300' : 'text-emerald-300'}`}>{role}</p>
                </div>

                {/* Actions Dropdown / Links */}
                <div className="flex gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-inner">
                  <Link
                    to="/profile"
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all shadow-sm"
                    title="Kelola Akun Pribadi"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-2 text-rose-300 hover:text-white hover:bg-rose-500/80 rounded-xl transition-all shadow-sm"
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

          {/* Hero Section Premium dengan Efek Glassmorphism */}
          <div className="relative mb-12 rounded-[2.5rem] overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${role === 'admin' ? 'from-amber-600/20 via-orange-900/10 to-transparent' : 'from-emerald-600/20 via-teal-900/10 to-transparent'} opacity-90`}></div>
            <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-pulse ${role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full mix-blend-screen filter blur-[120px] opacity-60 ${role === 'admin' ? 'bg-orange-500' : 'bg-teal-500'}`}></div>

            <div className="relative px-8 py-14 sm:p-20 flex flex-col sm:flex-row items-center justify-between gap-10">
              <div className="text-center sm:text-left z-10 w-full">
                <span className={`inline-block px-4 py-1.5 rounded-full bg-white/10 text-xs font-black uppercase tracking-widest mb-4 border border-white/20 backdrop-blur-md shadow-inner ${role === 'admin' ? 'text-amber-300' : 'text-village-emerald-300'}`}>
                  {role === 'admin' ? 'Portal Manajemen' : 'Ruang Warga'}
                </span>
                <h2 className="font-outfit text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter leading-tight drop-shadow-md">
                  <span className="opacity-90 font-light tracking-tight">Selamat datang,</span> <br className="hidden sm:block" />
                  {name}
                </h2>
                <p className="text-white/80 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
                  Kelola laporan insiden dan aspirasi warga dengan elegan. Ekosistem premium transparan untuk Desa Lamaran Tarung yang lebih baik.
                </p>
              </div>
              <div className="hidden lg:flex shrink-0 z-10 w-48 h-48 opacity-90 items-center justify-center bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-lg shadow-inner">
                <svg className={`w-24 h-24 ${role === 'admin' ? 'text-amber-400/80' : 'text-emerald-400/80'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Metrik Analitik Mini - Glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-lg border border-white/10 hover:-translate-y-1 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors shadow-inner border bg-white/10 border-white/20 text-white group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-white/60 font-bold text-sm mb-1 uppercase tracking-wider">Total Laporan</p>
              <p className="text-3xl font-black text-white drop-shadow-sm">{reports.length}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-500/20 hover:-translate-y-1 hover:bg-emerald-900/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center text-emerald-400 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-emerald-200/60 font-bold text-sm mb-1 uppercase tracking-wider">Diselesaikan</p>
              <p className="text-3xl font-black text-white drop-shadow-sm">{reports.filter(r => r.status === 'Selesai').length}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-lg border border-cyan-500/20 hover:-translate-y-1 hover:bg-cyan-900/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center text-cyan-400 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <p className="text-cyan-200/60 font-bold text-sm mb-1 uppercase tracking-wider">Diproses</p>
              <p className="text-3xl font-black text-white drop-shadow-sm">{reports.filter(r => r.status === 'Diproses').length}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-500/20 hover:-translate-y-1 hover:bg-amber-900/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center text-amber-400 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-amber-200/60 font-bold text-sm mb-1 uppercase tracking-wider">Menunggu</p>
              <p className="text-3xl font-black text-white drop-shadow-sm">{reports.filter(r => r.status === 'Menunggu').length}</p>
            </div>
          </div>

          {/* Input Form Khusus User (Bagian atas) */}
          {role === "user" && (
            <div className="mb-14">
              <Laporan onReportAdded={fetchReports} />
            </div>
          )}

          {/* Koleksi Laporan - Glassmorphism Cards */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-6">
              <div>
                <h3 className="font-outfit text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                  {role === "admin" ? "Semua Rekapitulasi Laporan" : "Lini Masa Laporan Anda"}
                </h3>
                <p className="text-white/70 font-medium mt-1">Histori laporan disajikan dalam tatanan kronologis yang mutakhir.</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {reports.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] p-20 flex flex-col items-center justify-center text-center transition-all">
                  <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-inner">
                    <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  <h4 className="text-2xl font-black text-white mb-3 drop-shadow-md">Papan Ketik Bersih</h4>
                  <p className="text-white/70 font-medium max-w-sm">Sipentar belum mencatat satu pelaporan pun ke dalam kotak arsip.</p>
                </div>
              ) : (
                reports.map((r) => (
                  <div key={r.id} className="bg-white/5 backdrop-blur-2xl group rounded-[2.5rem] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-10 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] hover:-translate-y-1 hover:bg-white/10 transition-all duration-500">

                    {/* Avatar & Info Pelapor */}
                    <div className="flex items-start gap-4 shrink-0 md:w-64">
                      <div className={`w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-extrabold text-xl shadow-inner group-hover:bg-white/20 transition-colors ${role === 'admin' ? 'group-hover:text-amber-300' : 'group-hover:text-emerald-300'}`}>
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-black text-white text-lg transition-colors drop-shadow-sm ${role === 'admin' ? 'group-hover:text-amber-300' : 'group-hover:text-emerald-300'}`}>{r.name}</p>
                        <p className="text-[11px] font-bold text-white/60 mt-1 tracking-[0.1em] uppercase flex items-center gap-1.5 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Tanggal Laporan'}
                        </p>
                      </div>
                    </div>

                    {/* Konten Aduan */}
                    <div className="flex-1">
                      <h4 className="font-black text-2xl text-white mb-3 leading-tight transition-colors drop-shadow-md">{r.judul}</h4>
                      <p className="text-white/80 font-medium leading-relaxed pb-6 text-[15px] transition-colors">{r.isi}</p>

                      {/* Gambar Opsional Bento Style */}
                      {r.image_url && (
                        <div
                          className="mt-2 mb-6 rounded-2xl overflow-hidden border border-slate-200/40 shadow-sm sm:max-w-md relative group/img cursor-zoom-in"
                          onClick={() => {
                            const imgSrc = r.image_url.startsWith('data:image') ? r.image_url : `${IMAGE_BASE_URL}/uploads/${r.image_url}`;
                            window.open(imgSrc, "_blank");
                          }}
                        >
                          <img
                            src={r.image_url.startsWith('data:image') ? r.image_url : `${IMAGE_BASE_URL}/uploads/${r.image_url}`}
                            alt="Bukti Laporan"
                            className="w-full h-auto object-cover group-hover/img:scale-105 group-hover/img:rotate-1 transition-all duration-500"
                          />
                          {/* Overlay shadow (pointer-events-none mencegah halangan ketukan sentuh UI HP) */}
                          <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                      )}

                      {/* Status & Kendali Admin Bottom Bar */}
                      <div className="pt-6 mt-auto border-t border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-5 transition-colors">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase shadow-sm border ${r.status === 'Selesai' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : r.status === 'Diproses' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                          {r.status === 'Menunggu' && <span className="w-2 h-2 rounded-full bg-amber-500 mr-2.5 shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse"></span>}
                          {r.status === 'Diproses' && <span className="w-2 h-2 rounded-full bg-blue-500 mr-2.5 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse"></span>}
                          {r.status === 'Selesai' && <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                          Status: {r.status}
                        </span>

                        {role === "admin" && (
                          <div className="relative shrink-0 w-full sm:w-auto">
                            <select
                              value={r.status}
                              onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                              className={`appearance-none bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-black rounded-xl focus:ring-4 outline-none transition-all cursor-pointer block w-full pl-5 pr-12 py-3 backdrop-blur-md shadow-inner ${role === 'admin' ? 'focus:ring-amber-500/30 focus:border-amber-400' : 'focus:ring-emerald-500/30 focus:border-emerald-400'}`}
                            >
                              <option value="Menunggu" className="bg-slate-900 text-amber-400">Tandai Tertunda</option>
                              <option value="Diproses" className="bg-slate-900 text-cyan-400">Kerjakan (Proses)</option>
                              <option value="Selesai" className="bg-slate-900 text-emerald-400">Tetapkan Tuntas</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-white/50">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
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

          <div className="mt-24 mb-10 text-center flex flex-col items-center relative z-10 w-full">
            <div className="w-1.5 h-1.5 bg-white/30 rounded-full mb-4"></div>
            <p className="text-white/50 text-xs font-black tracking-[0.2em] uppercase">
              Sipentar Dashboard Platform © {new Date().getFullYear()}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
