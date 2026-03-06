import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Laporan from "./Laporan";
import Profile from "./Profile";
import useDarkMode from "../hooks/useDarkMode";
import villageBg from '../assets/village-bg.png';

function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState("beranda");
  const notifRef = useRef(null);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [userProfileData, setUserProfileData] = useState(null);

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  // Menghilangkan sisipan trailing "/api" agar rute uploads langsung mengarah ke akar peladen Node
  const BASE_URL = API_URL.replace(/\/api\/?$/, "");
  const IMAGE_BASE_URL = API_URL.endsWith("/api") ? API_URL.slice(0, -4) : API_URL;

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUserProfileData(res.data);
    } catch (err) {
      console.error("Gagal mengambil profil detail:", err);
    }
  };

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
    fetchUserProfile();
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
    <div className="min-h-screen relative font-sans selection:bg-emerald-200 transition-colors duration-300 bg-slate-50">

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-300 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              title="Tutup (Esc)"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img
              src={selectedImage}
              alt="Bukti Laporan (Diperbesar)"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-default border border-white/20 bg-slate-800"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Estetis Mewah - Solid Formal */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
            <div className="flex items-center gap-4 group">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border ${role === 'admin' ? 'bg-amber-600 border-amber-700' : 'bg-emerald-700 border-emerald-800'}`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <h1 className="font-outfit text-2xl font-black text-slate-900 tracking-tight leading-tight">Sipentar<span className={role === 'admin' ? 'text-amber-600' : 'text-emerald-700'}>.</span></h1>
                <p className={`text-[10px] font-extrabold tracking-[0.2em] uppercase ${role === 'admin' ? 'text-amber-700' : 'text-emerald-700'}`}>Desa Lamaran Tarung</p>
              </div>
            </div>

            <div className="flex items-center gap-5 sm:gap-7">
              {/* Notification Bell Mewah */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative p-2.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Formal */}
                {showNotifications && (
                  <div className="fixed sm:absolute inset-x-4 top-20 sm:inset-auto sm:top-auto sm:right-0 sm:mt-4 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform origin-top sm:origin-top-right transition-all z-50">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-800 uppercase">Pemberitahuan</h3>
                      {unreadCount > 0 && <span className={`text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full ${role === 'admin' ? 'bg-amber-600' : 'bg-emerald-600'}`}>{unreadCount} Baru</span>}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                          </div>
                          <p className="text-sm font-bold text-slate-600">Terpantau Tenang.</p>
                          <p className="text-xs text-slate-500 mt-1">Belum ada aktivitas baru.</p>
                        </div>
                      ) : (
                        <ul className="divide-y divide-slate-100">
                          {notifications.map((notif) => (
                            <li key={notif.id} className={`p-4 hover:bg-slate-50 transition-colors group ${!notif.is_read ? 'bg-blue-50/30' : ''}`}>
                              <div className="flex gap-3">
                                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? (role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-300'}`}></div>
                                <div>
                                  <p className={`text-sm ${!notif.is_read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{notif.message}</p>
                                  <p className="text-xs font-semibold text-slate-400 mt-1.5 flex items-center gap-1">
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

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{name || "Pengguna"}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${role === 'admin' ? 'text-amber-600' : 'text-emerald-700'}`}>{role}</p>
                </div>

                {/* Avatar / Profile Picture in Header */}
                <div onClick={() => setActiveMainTab("profil")} className="cursor-pointer ml-1 sm:ml-2">
                  {userProfileData?.foto_profil ? (
                    <img
                      src={
                        (userProfileData.foto_profil.startsWith('data:image') || userProfileData.foto_profil.startsWith('http'))
                          ? userProfileData.foto_profil
                          : `${BASE_URL}${userProfileData.foto_profil.startsWith('/') ? '' : '/'}${userProfileData.foto_profil}`
                      }
                      alt="Profil"
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 shadow-sm transition-transform hover:scale-105 ${role === 'admin' ? 'border-amber-200' : 'border-emerald-200'}`}
                    />
                  ) : (
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-sm border-2 transition-transform hover:scale-105 ${role === 'admin' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>

                {/* Actions Dropdown / Links */}
                <div className="flex gap-1.5 sm:gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 ml-1">
                  <button
                    onClick={() => setActiveMainTab("profil")}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-white rounded-md transition-all"
                    title="Kelola Akun Pribadi"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </button>

                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-md transition-all"
                    title="Akhiri Sesi"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

          {/* Tab Navigation Menu (Desktop) */}
          <div className="hidden sm:flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
            <button
              onClick={() => setActiveMainTab('beranda')}
              className={`px-4 sm:px-6 py-4 font-bold text-sm sm:text-base whitespace-nowrap border-b-[3px] transition-colors flex items-center gap-2 ${activeMainTab === 'beranda' ? (role === 'admin' ? 'border-amber-600 text-amber-700' : 'border-emerald-600 text-emerald-700') : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Semua Laporan
            </button>

            {role === 'user' && (
              <button
                onClick={() => setActiveMainTab('histori')}
                className={`px-4 sm:px-6 py-4 font-bold text-sm sm:text-base whitespace-nowrap border-b-[3px] transition-colors flex items-center gap-2 ${activeMainTab === 'histori' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Laporan Saya
              </button>
            )}

            {role === 'user' && (
              <button
                onClick={() => setActiveMainTab('pengaduan')}
                className={`px-4 sm:px-6 py-4 font-bold text-sm sm:text-base whitespace-nowrap border-b-[3px] transition-colors flex items-center gap-2 ${activeMainTab === 'pengaduan' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Buat Pengaduan
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={() => setActiveMainTab('aduan_masuk')}
                className={`px-4 sm:px-6 py-4 font-bold text-sm sm:text-base whitespace-nowrap border-b-[3px] transition-colors flex items-center gap-2 ${activeMainTab === 'aduan_masuk' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
              >
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  {reports.filter(r => r.status === 'Menunggu').length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-white"></span>
                    </span>
                  )}
                </div>
                Laporan Masuk
              </button>
            )}

            <button
              onClick={() => setActiveMainTab('profil')}
              className={`px-4 sm:px-6 py-4 font-bold text-sm sm:text-base whitespace-nowrap border-b-[3px] transition-colors flex items-center gap-2 ${activeMainTab === 'profil' ? (role === 'admin' ? 'border-amber-600 text-amber-700' : 'border-emerald-600 text-emerald-700') : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Profil Akun
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(activeMainTab === 'beranda' || activeMainTab === 'histori' || activeMainTab === 'aduan_masuk') && (
              <>
                {/* Hero Section Formal */}
                {activeMainTab === 'beranda' && (
                  <div className="relative mb-8 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                    <div className={`absolute inset-0 bg-gradient-to-r ${role === 'admin' ? 'from-amber-50 to-white' : 'from-emerald-50 to-white'} opacity-90`}></div>

                    <div className="relative p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8">
                      <div className="text-center sm:text-left z-10 w-full">
                        <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4 border ${role === 'admin' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                          {role === 'admin' ? 'Portal Kelurahan' : 'Ruang Warga'}
                        </span>
                        <h2 className="font-outfit text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                          <span className="font-medium">Selamat datang,</span> <br className="hidden sm:block" />
                          {name}
                        </h2>
                        <p className="text-slate-600 font-medium max-w-xl leading-relaxed text-sm lg:text-base">
                          {role === 'admin' ? "Pantau semua pelaporan dan status operasional sistem persuratan desa dalam tayangan data yang aktual dan presisi." : "Lihat laporan publik dari berbagai warga untuk mengetahui kondisi dan keluhan terkini seputar desa."}
                        </p>
                      </div>
                      <div className="hidden lg:flex shrink-0 z-10 w-32 h-32 opacity-90 items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <svg className={`w-16 h-16 ${role === 'admin' ? 'text-amber-600' : 'text-emerald-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Metrik Analitik Mini - Formal */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-slate-100 text-slate-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="text-slate-500 font-bold text-xs mb-1 uppercase tracking-wider">Total Laporan</p>
                    <p className="text-2xl font-black text-slate-800">
                      {activeMainTab === 'beranda' ? reports.length : reports.filter(r => r.name === name).length}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-slate-500 font-bold text-xs mb-1 uppercase tracking-wider">Diselesaikan</p>
                    <p className="text-2xl font-black text-slate-800">
                      {activeMainTab === 'beranda' ? reports.filter(r => r.status === 'Selesai').length : reports.filter(r => r.name === name && r.status === 'Selesai').length}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-cyan-100">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700 mb-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <p className="text-slate-500 font-bold text-xs mb-1 uppercase tracking-wider">Diproses</p>
                    <p className="text-2xl font-black text-slate-800">
                      {activeMainTab === 'beranda' ? reports.filter(r => r.status === 'Diproses').length : reports.filter(r => r.name === name && r.status === 'Diproses').length}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-slate-500 font-bold text-xs mb-1 uppercase tracking-wider">Menunggu</p>
                    <p className="text-2xl font-black text-slate-800">
                      {activeMainTab === 'beranda' ? reports.filter(r => r.status === 'Menunggu').length : reports.filter(r => r.name === name && r.status === 'Menunggu').length}
                    </p>
                  </div>
                </div>

                {/* Koleksi Laporan - Formal Cards */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-end mb-6 border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="font-outfit text-2xl font-black text-slate-800 tracking-tight">
                        {activeMainTab === 'beranda' ? "Ruang Publik Laporan Warga" : (activeMainTab === 'aduan_masuk' ? "Antrean Laporan Baru" : "Lini Masa Laporan Anda")}
                      </h3>
                      <p className="text-slate-500 font-medium mt-1 text-sm">
                        {activeMainTab === 'beranda' ? "Aduan warga yang sedang diproses maupun telah diselesaikan oleh desa." : (activeMainTab === 'aduan_masuk' ? "Laporan yang baru dikirim warga dan membutuhkan persetujuan / penanganan Anda segera." : "Histori khusus dari aduan yang Anda kirimkan.")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    {/* Render Filtered Reports */}
                    {(() => {
                      let displayedReports = [];
                      if (activeMainTab === 'beranda') {
                        // Public feed: only processed or finished reports
                        displayedReports = reports.filter(r => r.status === 'Diproses' || r.status === 'Selesai');
                      } else if (activeMainTab === 'histori') {
                        // User's own feed: all their reports
                        displayedReports = reports.filter(r => r.name === name);
                      } else if (activeMainTab === 'aduan_masuk' && role === 'admin') {
                        // Admin inbox: only pending reports
                        displayedReports = reports.filter(r => r.status === 'Menunggu');
                      }

                      if (displayedReports.length === 0) {
                        return (
                          <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <h4 className="text-lg font-bold text-slate-700 mb-1">{activeMainTab === 'aduan_masuk' ? "Kotak Masuk Kosong" : "Belum Ada Catatan"}</h4>
                            <p className="text-slate-500 text-sm">{activeMainTab === 'aduan_masuk' ? "Tidak ada pelaporan warga baru yang menunggu untuk diproses saat ini." : "Sipentar belum mencatat pelaporan apa pun di halaman ini."}</p>
                          </div>
                        );
                      }

                      return displayedReports.map((r) => (
                        <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-6 shadow-sm">

                          {/* Avatar & Info Pelapor */}
                          <div className="flex items-center sm:items-start gap-3 sm:gap-4 shrink-0 sm:w-56 pb-3 sm:pb-0 border-b border-slate-100 sm:border-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-100 flex items-center justify-center text-lg font-black border border-slate-200 shrink-0 ${role === 'admin' ? 'text-amber-700' : 'text-emerald-700'}`}>
                              {r.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className={`font-black text-slate-900 text-sm sm:text-base`}>{r.name}</p>
                              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 tracking-wide flex items-center gap-1">
                                {r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Tanggal Laporan'}
                              </p>
                            </div>
                          </div>

                          {/* Konten Aduan */}
                          <div className="flex-1 pt-1 sm:pt-0">
                            <h4 className="font-bold text-base sm:text-xl text-slate-900 mb-1.5 sm:mb-2 leading-snug">{r.judul}</h4>
                            <p className="text-slate-600 font-medium leading-relaxed pb-3 sm:pb-4 text-[13px] sm:text-sm">{r.isi}</p>

                            {/* Gambar Opsional */}
                            {r.image_url && (
                              <div
                                className="mt-1 mb-5 rounded-lg overflow-hidden border border-slate-200 shadow-sm sm:max-w-md w-full relative group/img cursor-zoom-in bg-slate-50"
                                onClick={() => {
                                  const imgSrc = r.image_url.startsWith('data:image') ? r.image_url : `${IMAGE_BASE_URL}/uploads/${r.image_url}`;
                                  setSelectedImage(imgSrc);
                                }}
                              >
                                <img
                                  src={r.image_url.startsWith('data:image') ? r.image_url : `${IMAGE_BASE_URL}/uploads/${r.image_url}`}
                                  alt="Bukti Laporan"
                                  className="w-full h-auto max-h-48 object-contain sm:object-cover transition-transform duration-500 group-hover/img:scale-105"
                                />
                                <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
                                  <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg shadow-sm font-bold text-xs transform scale-90 opacity-0 group-hover/img:scale-100 group-hover/img:opacity-100 transition-all duration-300 flex items-center gap-1.5 border border-slate-200">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    Perbesar
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Status & Kendali Admin Bottom Bar */}
                            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                              <span className={`inline-flex items-center w-fit px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold tracking-widest uppercase border ${r.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.status === 'Diproses' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                {r.status === 'Menunggu' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shrink-0"></span>}
                                {r.status === 'Diproses' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2 shrink-0"></span>}
                                {r.status === 'Selesai' && <svg className="w-3 h-3 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                Status: {r.status}
                              </span>

                              {role === "admin" && (
                                <div className="relative shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                  <select
                                    value={r.status}
                                    onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                                    className={`appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-[11px] sm:text-xs font-bold rounded-lg focus:ring-2 outline-none cursor-pointer block w-full pl-3 pr-8 py-2.5 sm:py-2 ${role === 'admin' ? 'focus:ring-amber-500/30' : 'focus:ring-emerald-500/30'}`}
                                  >
                                    <option value="Menunggu">Tertunda</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Selesai">Tuntas</option>
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-2 text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </>
            )}

            {activeMainTab === 'pengaduan' && role === 'user' && (
              <div className="max-w-4xl mx-auto">
                <Laporan onReportAdded={() => { fetchReports(); setActiveMainTab('beranda'); }} />
              </div>
            )}

            {activeMainTab === 'profil' && (
              <Profile isEmbedded={true} />
            )}
          </div>

          <div className="mt-16 mb-6 text-center">
            <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase">
              Sipentar Dashboard Platform © {new Date().getFullYear()}
            </p>
          </div>
        </main>

        {/* Bottom Navigation Bar (Mobile Native App Feel) */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-40 pb-safe">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => setActiveMainTab('beranda')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeMainTab === 'beranda' ? (role === 'admin' ? 'text-amber-600' : 'text-emerald-700') : 'text-slate-400 hover:text-slate-600'}`}
            >
              <svg className="w-6 h-6" fill={activeMainTab === 'beranda' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeMainTab === 'beranda' ? "0" : "2"} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span className="text-[10px] font-bold tracking-wide">Beranda</span>
            </button>

            {role === 'user' && (
              <button
                onClick={() => setActiveMainTab('histori')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeMainTab === 'histori' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <svg className="w-6 h-6" fill={activeMainTab === 'histori' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeMainTab === 'histori' ? "0" : "2"} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-[10px] font-bold tracking-wide">Histori</span>
              </button>
            )}

            {role === 'user' && (
              <button
                onClick={() => setActiveMainTab('pengaduan')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative`}
              >
                <div className={`absolute -top-5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-full p-3 shadow-lg border-4 border-slate-50 transition-transform ${activeMainTab === 'pengaduan' ? 'scale-110 shadow-emerald-500/40' : 'hover:scale-105'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <span className={`text-[10px] font-bold tracking-wide mt-7 ${activeMainTab === 'pengaduan' ? 'text-emerald-700' : 'text-slate-400'}`}>Aduan</span>
              </button>
            )}

            {role === 'admin' && (
              <button
                onClick={() => setActiveMainTab('aduan_masuk')}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative`}
              >
                <div className={`absolute -top-5 text-white rounded-full p-3 shadow-lg border-4 border-slate-50 transition-transform ${activeMainTab === 'aduan_masuk' ? 'bg-amber-600 scale-110 shadow-amber-500/40' : 'bg-slate-400 hover:scale-105'}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  {reports.filter(r => r.status === 'Menunggu').length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-wide mt-7 ${activeMainTab === 'aduan_masuk' ? 'text-amber-700' : 'text-slate-400'}`}>Laporan</span>
              </button>
            )}

            <button
              onClick={() => setActiveMainTab('profil')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeMainTab === 'profil' ? (role === 'admin' ? 'text-amber-600' : 'text-emerald-700') : 'text-slate-400 hover:text-slate-600'}`}
            >
              <svg className="w-6 h-6" fill={activeMainTab === 'profil' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeMainTab === 'profil' ? "0" : "2"} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-[10px] font-bold tracking-wide">Profil</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
