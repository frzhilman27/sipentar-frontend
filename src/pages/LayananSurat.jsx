import { useState, useEffect, useRef } from "react";
import api from "../services/api";

const JENIS_SURAT_OPTIONS = [
  "Surat Pengantar",
  "Surat Keterangan Domisili",
  "Surat Keterangan Tidak Mampu",
  "Surat Keterangan Usaha",
  "Surat Keterangan Belum Menikah",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Kematian",
  "Lainnya",
];

function LayananSurat({ isVerified = false, verificationLoading = false }) {
  const [activeTab, setActiveTab] = useState("form");
  const [jenisSurat, setJenisSurat] = useState(JENIS_SURAT_OPTIONS[0]);
  const [keperluan, setKeperluan] = useState("");
  const [loading, setLoading] = useState(false);
  const [suratList, setSuratList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = (seconds = 30) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchSuratList = async () => {
    setListLoading(true);
    try {
      const res = await api.get("/surat");
      setSuratList(res.data);
    } catch (err) {
      console.error("Gagal memuat data surat:", err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "riwayat") {
      fetchSuratList();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationLoading && !isVerified) {
      alert("Akun Anda belum diverifikasi oleh Admin. Tidak dapat mengajukan surat.");
      return;
    }

    if (!keperluan.trim() || keperluan.trim().length < 10) {
      alert("Keperluan wajib diisi minimal 10 karakter.");
      return;
    }

    if (loading || cooldown > 0) return;
    setLoading(true);

    try {
      await api.post("/surat", {
        jenis_surat: jenisSurat,
        keperluan: keperluan.trim(),
      });
      alert("Pengajuan surat berhasil dikirim! ✅");
      setJenisSurat(JENIS_SURAT_OPTIONS[0]);
      setKeperluan("");
      startCooldown(30);
      setActiveTab("riwayat");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error;
      if (status === 403) {
        alert("⚠️ " + (message || "Akun belum diverifikasi."));
      } else if (status === 429) {
        alert("⏳ " + (message || "Harap tunggu sebelum mengajukan surat serupa."));
        startCooldown(60);
      } else {
        alert(message || "Gagal mengajukan surat.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-green-50 text-green-700 border-green-200";
      case "Diproses":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Ditolak":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Selesai":
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        );
      case "Diproses":
        return (
          <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        );
      case "Ditolak":
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        );
    }
  };

  if (!verificationLoading && !isVerified) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-amber-200 p-8 sm:p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Layanan Surat Terkunci</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Akun Anda belum diverifikasi oleh perangkat desa. Setelah diverifikasi, Anda dapat mengajukan surat melalui formulir ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === "form" ? "bg-sipentar-blue text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Ajukan Surat
          </span>
        </button>
        <button
          onClick={() => setActiveTab("riwayat")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === "riwayat" ? "bg-sipentar-blue text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Riwayat Pengajuan
          </span>
        </button>
      </div>

      {/* Form Pengajuan */}
      {activeTab === "form" && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 sm:p-10 relative overflow-hidden transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 relative z-10">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h3 className="font-outfit text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Ajukan Surat Desa</h3>
              <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">Pilih jenis surat dan jelaskan keperluan Anda secara lengkap.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 pl-1 tracking-wide uppercase">Jenis Surat</label>
              <select
                value={jenisSurat}
                onChange={(e) => setJenisSurat(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-900 font-bold appearance-none cursor-pointer"
              >
                {JENIS_SURAT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 pl-1 tracking-wide uppercase">Keperluan / Alasan Pengajuan</label>
              <textarea
                placeholder="Jelaskan tujuan pengajuan surat ini secara detail..."
                rows="4"
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
                required
                minLength={10}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all resize-y text-slate-900 font-medium leading-relaxed placeholder-slate-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-5 border-t border-slate-200">
              {cooldown > 0 && (
                <p className="text-xs font-bold text-slate-500 order-2 sm:order-1">
                  <svg className="w-4 h-4 inline mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Dapat mengajukan lagi dalam <span className="text-emerald-600">{cooldown}s</span>
                </p>
              )}
              <button
                type="submit"
                disabled={loading || cooldown > 0}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    Kirim Pengajuan
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Riwayat Pengajuan */}
      {activeTab === "riwayat" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-slate-900">Riwayat Pengajuan Surat</h3>
            <button onClick={fetchSuratList} className="text-xs font-bold text-sipentar-blue hover:underline">Refresh</button>
          </div>

          {listLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sipentar-blue" />
            </div>
          ) : suratList.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h4 className="text-base font-bold text-slate-700 mb-1">Belum Ada Pengajuan</h4>
              <p className="text-slate-500 text-sm max-w-sm">Anda belum pernah mengajukan surat. Gunakan tab "Ajukan Surat" untuk memulai.</p>
            </div>
          ) : (
            suratList.map((s) => (
              <div key={s.id} className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3 gap-4">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{s.jenis_surat}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      ID: #{String(s.id).padStart(4, "0")} • {new Date(s.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border ${getStatusStyle(s.status)}`}>
                    {getStatusIcon(s.status)}
                    {s.status}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">{s.keperluan}</p>

                {s.nomor_surat && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <p className="text-xs font-bold text-green-800">
                      <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Nomor Surat: <span className="font-mono">{s.nomor_surat}</span>
                    </p>
                    <p className="text-xs text-green-700 mt-1">Silakan ambil surat Anda di balai desa.</p>
                  </div>
                )}

                {s.catatan_admin && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Catatan Admin:</p>
                    <p className="text-sm text-slate-700">{s.catatan_admin}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default LayananSurat;
