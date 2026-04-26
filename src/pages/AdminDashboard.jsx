import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import KelolaWarga from "./KelolaWarga";
import Profile from "./Profile";
import useDarkMode from "../hooks/useDarkMode";
import { compressImageToBase64 } from "../utils/imageUtils";
import villageBg from '../assets/village-bg.png';
import AIChatWidget from "../components/AIChatWidget";
import DashboardLayout from "../layouts/DashboardLayout";

function AdminDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState("beranda");
  const notifRef = useRef(null);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [userProfileData, setUserProfileData] = useState(null);

  // Modal Evidence States
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceTargetId, setEvidenceTargetId] = useState(null);
  const [evidenceTargetStatus, setEvidenceTargetStatus] = useState("");
  const [evidenceImages, setEvidenceImages] = useState([]);
  const [evidencePreviewUrls, setEvidencePreviewUrls] = useState([]);
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  // History Modal States
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyTargetId, setHistoryTargetId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Clean up object URLs
  useEffect(() => {
    if (evidenceImages.length > 0) {
      const urls = evidenceImages.map(img => URL.createObjectURL(img));
      setEvidencePreviewUrls(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setEvidencePreviewUrls([]);
    }
  }, [evidenceImages]);

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

  const handleNotificationClick = async (notif) => {
    setShowNotifications(false);
    
    if (!notif.is_read) {
      try {
        await api.put(`/notifications/${notif.id}/read`);
        fetchNotifications();
      } catch (err) {
        console.error("Gagal menandai notifikasi dibaca", err);
      }
    }
    
    if (!notif.laporan_id) return;
    
    const report = reports.find(r => String(r.id) === String(notif.laporan_id));
    if (report) {
      if (role === 'admin') {
        if (report.status === 'Menunggu') {
          setActiveMainTab('aduan_masuk');
        } else {
          setActiveMainTab('beranda');
        }
      } else {
        setActiveMainTab('histori');
      }
      
      setTimeout(() => {
        const el = document.getElementById(`report-${report.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-emerald-500', 'transition-all', 'duration-1000');
          setTimeout(() => el.classList.remove('ring-4', 'ring-emerald-500'), 2500);
        }
      }, 300);
    }
  };

  const handleStatusSelect = (id, newStatus) => {
    if (newStatus === "Diproses" || newStatus === "Selesai") {
      setEvidenceTargetId(id);
      setEvidenceTargetStatus(newStatus);
      setShowEvidenceModal(true);
    } else {
      handleUpdateStatus(id, newStatus, null);
    }
  };

  const handleUpdateStatus = async (id, newStatus, adminEvidenceUrls = null) => {
    try {
      await api.put(`/laporan/${id}/status`, { status: newStatus, adminEvidenceUrls });
      fetchReports();
      setShowEvidenceModal(false);
      setEvidenceImages([]);
    } catch (err) {
      alert(err.response?.data?.error || "Gagal memperbarui status");
    } finally {
      setEvidenceLoading(false);
    }
  };

  const handleConfirmEvidence = async () => {
    if (evidenceImages.length === 0) {
      alert("Pilih minimal satu foto bukti pengerjaan!");
      return;
    }
    setEvidenceLoading(true);
    try {
      const base64Images = await Promise.all(
          evidenceImages.map(img => compressImageToBase64(img, 800, 800, 0.7))
      );
      await handleUpdateStatus(evidenceTargetId, evidenceTargetStatus, base64Images);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses foto");
      setEvidenceLoading(false);
    }
  };

  const handleDeleteLaporan = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus laporan ini beserta semua riwayatnya?")) {
        try {
            await api.delete(`/laporan/${id}`);
            alert("Laporan berhasil dihapus.");
            fetchReports();
        } catch (err) {
            alert("Gagal menghapus laporan.");
        }
    }
  };

  const fetchHistory = async (reportId) => {
    setHistoryTargetId(reportId);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const res = await api.get(`/laporan/${reportId}/history`);
      setHistoryData(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat riwayat laporan.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <DashboardLayout
      role={role}
      name={name}
      userProfileData={userProfileData}
      activeMainTab={activeMainTab}
      setActiveMainTab={setActiveMainTab}
      unreadCount={unreadCount}
      showNotifications={showNotifications}
      toggleNotifications={toggleNotifications}
      notifications={notifications}
      handleNotificationClick={handleNotificationClick}
      logout={logout}
      pendingReportsCount={reports.filter(r => r.status === 'Menunggu').length}
    >
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

      {/* Evidence Upload Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-amber-50">
              <h3 className="font-bold text-lg text-amber-900">Upload Bukti {evidenceTargetStatus}</h3>
              <button onClick={() => { setShowEvidenceModal(false); setEvidenceImages([]); }} className="text-amber-500 hover:text-amber-700 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4 font-medium">Anda diwajibkan menyertakan foto progres penanganan. Anda dapat memilih lebih dari satu foto.</p>
              
              <div className="relative group/upload mt-1 mb-6">
                <div className={`absolute inset-0 border-2 border-dashed rounded-xl transition-colors duration-300 pointer-events-none ${evidenceImages.length > 0 ? 'border-amber-500' : 'border-slate-300 group-hover/upload:border-amber-400'}`}></div>
                <div className={`relative p-6 rounded-xl transition-all duration-300 ${evidenceImages.length > 0 ? 'bg-amber-50' : 'bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center'}`}>
                  {evidenceImages.length === 0 ? (
                    <>
                      <div className="w-12 h-12 mb-3 rounded-full bg-white text-slate-400 shadow-sm border border-slate-200 flex items-center justify-center group-hover/upload:text-amber-500 group-hover/upload:border-amber-200 transition-all duration-300 transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-sm font-bold text-slate-700 mb-1 text-center"><span className="text-amber-600 cursor-pointer hover:underline">Pilih Foto</span></p>
                      <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/jpeg,image/png,image/webp" onChange={(e) => setEvidenceImages(Array.from(e.target.files))} />
                    </>
                  ) : (
                    <div className="w-full z-10 relative">
                        <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/jpeg,image/png,image/webp" onChange={(e) => setEvidenceImages(Array.from(e.target.files))} />
                        <div className="flex overflow-x-auto gap-4 pb-2">
                        {evidencePreviewUrls.map((url, i) => (
                            <div key={i} className="relative inline-block shrink-0">
                                <div className="w-32 h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative z-30">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        ))}
                        </div>
                        <p className="text-xs font-bold text-amber-700 mt-2 text-center">Menyiapkan {evidenceImages.length} foto. Klik kotak ini untuk mengganti pilihan.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => { setShowEvidenceModal(false); setEvidenceImages([]); }} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50" disabled={evidenceLoading}>Batal</button>
                <button onClick={handleConfirmEvidence} disabled={evidenceLoading || evidenceImages.length === 0} className="px-4 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm shadow-amber-600/30 transition-all flex items-center gap-2 disabled:opacity-50">
                  {evidenceLoading ? "Menyimpan..." : "Konfirmasi & Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-emerald-50">
              <h3 className="font-bold text-lg text-emerald-900">Linimasa Riwayat Laporan</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-emerald-500 hover:text-emerald-700 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {historyLoading ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div></div>
              ) : historyData.length === 0 ? (
                <p className="text-center text-slate-500 py-4">Belum ada riwayat tercatat.</p>
              ) : (
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2">
                  {historyData.map((h, index) => (
                    <div key={h.id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${h.status === 'Menunggu' ? 'bg-amber-400' : h.status === 'Diproses' ? 'bg-cyan-500' : 'bg-emerald-500'}`}></div>
                      <p className="text-xs font-bold text-slate-500 mb-1">{new Date(h.created_at).toLocaleString('id-ID')}</p>
                      <p className="text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-100 rounded-lg p-2.5 inline-block">Status berubah menjadi <span className={h.status === 'Selesai' ? 'text-emerald-600' : 'text-cyan-600'}>{h.status}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setShowHistoryModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors">Tutup</button>
            </div>
          </div>
        </div>
      )}

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
                    displayedReports = reports.filter(r => r.status === 'Diproses' || r.status === 'Selesai');
                  } else if (activeMainTab === 'histori') {
                    displayedReports = reports.filter(r => r.name === name);
                  } else if (activeMainTab === 'aduan_masuk' && role === 'admin') {
                    displayedReports = reports.filter(r => r.status === 'Menunggu');
                  }

                  if (displayedReports.length === 0) {
                    return (
                      <div className="bg-white rounded-xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-1">{activeMainTab === 'aduan_masuk' ? "Kotak Masuk Kosong" : "Belum Ada Catatan"}</h4>
                        <p className="text-slate-500 text-sm">{activeMainTab === 'aduan_masuk' ? "Tidak ada pelaporan warga baru yang menunggu untuk diproses saat ini." : "Sipentar belum mencatat pelaporan apa pun di halaman ini."}</p>
                      </div>
                    );
                  }

                  return displayedReports.map((r) => (
                    <div key={r.id} id={`report-${r.id}`} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-6 shadow-sm hover:shadow-md transition-all duration-500">

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

                        {/* Bukti Penanganan Admin */}
                        {r.admin_evidence_urls && (Array.isArray(r.admin_evidence_urls) ? r.admin_evidence_urls.length > 0 : true) && (
                          <div className="mt-4 bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
                            <h5 className="font-bold text-xs sm:text-sm text-amber-800 mb-2.5 flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Bukti Penanganan Admin</h5>
                            <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar cursor-ew-resize">
                              {(Array.isArray(r.admin_evidence_urls) ? r.admin_evidence_urls : [r.admin_evidence_urls]).map((url, i) => (
                                <div 
                                  key={i}
                                  className="shrink-0 rounded-lg overflow-hidden border border-amber-300 shadow-sm w-40 sm:w-56 h-28 sm:h-36 relative group/evidence cursor-zoom-in bg-white"
                                  onClick={() => {
                                    const imgSrc = url.startsWith('data:image') ? url : `${IMAGE_BASE_URL}/uploads/${url}`;
                                    setSelectedImage(imgSrc);
                                  }}
                                >
                                  <img 
                                    src={url.startsWith('data:image') ? url : `${IMAGE_BASE_URL}/uploads/${url}`} 
                                    alt={`Bukti Admin ${i+1}`} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/evidence:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-slate-900/0 group-hover/evidence:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg shadow-sm font-bold text-xs transform scale-90 opacity-0 group-hover/evidence:scale-100 group-hover/evidence:opacity-100 transition-all duration-300 flex items-center gap-1.5 border border-slate-200">
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                      Buka
                                    </div>
                                  </div>
                                </div>
                              ))}
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
                            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                              <button onClick={() => fetchHistory(r.id)} className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors text-xs font-bold flex items-center gap-1 w-full justify-center">
                                Riwayat
                              </button>
                              <div className="relative shrink-0 w-full sm:w-auto">
                                <select
                                    value={r.status}
                                    onChange={(e) => handleStatusSelect(r.id, e.target.value)}
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
                              <button onClick={() => handleDeleteLaporan(r.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1 w-full justify-center border border-red-200">
                                Hapus
                              </button>
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

        {activeMainTab === 'kelola_warga' && role === 'admin' && (
          <KelolaWarga />
        )}

        {activeMainTab === 'profil' && (
          <Profile isEmbedded={true} />
        )}
      </div>

      <div className="mt-8 mb-4 text-center">
        <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase">
          Sipentar Dashboard Platform © {new Date().getFullYear()}
        </p>
      </div>

      <AIChatWidget />
    </DashboardLayout>
  );
}

export default AdminDashboard;