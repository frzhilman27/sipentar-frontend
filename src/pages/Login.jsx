import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import villageBg from '../assets/village-bg.png';

function Login() {
  const navigate = useNavigate();
  // State untuk melacak Portal yang aktif (warga atau admin)
  const [roleTarget, setRoleTarget] = useState("user");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Penyesuaian tema warna & input berdasarkan role aktif
  const isUser = roleTarget === "user";

  // Custom Dynamic Styling based on role, matching Premium Village Theme
  const selectionColor = isUser ? "selection:bg-emerald-200" : "selection:bg-amber-200";
  const bgImage = `url(${villageBg})`;

  const glareGradient = isUser
    ? "from-transparent via-emerald-400 to-transparent"
    : "from-transparent via-amber-400 to-transparent";

  const iconGradient = isUser
    ? "from-emerald-500 to-teal-700 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.8)] border border-emerald-400/30"
    : "from-amber-500 via-orange-600 to-red-700 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.8)] border border-amber-400/30";

  const inputFocusRing = isUser
    ? "focus:ring-emerald-500/30 focus:border-emerald-400"
    : "focus:ring-amber-500/30 focus:border-amber-400";

  const buttonStyle = isUser
    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.8)] border border-emerald-400/50"
    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.8)] border border-amber-400/50";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", {
        identifier,
        password,
        role_target: roleTarget
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Kredensial tidak valid");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = (newRole) => {
    setRoleTarget(newRole);
    setIdentifier(""); // Reset input saat switch
    setPassword("");
    setError("");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative bg-slate-900 font-sans ${selectionColor} overflow-hidden`}>
      {/* Background Image with transitions */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out z-0">
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform scale-105`}
          style={{ backgroundImage: bgImage }}
        >
          {/* Blend Overlays: Dark Emerald for Users, Deep Amber/Sepia for Admin */}
          <div className={`absolute inset-0 transition-colors duration-1000 ${isUser ? 'bg-gradient-to-br from-village-dark-900/80 via-village-emerald-900/60 to-village-dark-900/90 mix-blend-multiply' : 'bg-gradient-to-br from-village-dark-900/80 via-orange-950/60 to-village-dark-900/90 mix-blend-multiply'}`}></div>
          {/* Dynamic Frosted Base Blur */}
          <div className={`absolute inset-0 backdrop-blur-[4px] transition-colors duration-1000 ${isUser ? 'bg-village-dark-900/40' : 'bg-village-dark-900/60'}`}></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-white/90 hover:text-amber-300 font-medium transition group drop-shadow-md">
          <div className="w-8 h-8 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-slate-900/80 transition">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </div>
          Kembali ke Beranda Desa
        </Link>

        {/* Login Card */}
        <div className={`backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border relative overflow-hidden transition-all duration-500 p-8 sm:p-10 ${isUser ? 'bg-white/10 border-white/20' : 'bg-slate-900/60 border-amber-500/30'}`}>
          {/* Subtle top glare */}
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r opacity-50 transition-all duration-500 ${glareGradient}`}></div>

          <div className="text-center mb-8">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br mx-auto flex items-center justify-center shadow-lg mb-5 transition-all duration-500 transform ${isUser ? 'rotate-0' : 'rotate-3'} ${iconGradient}`}>
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isUser ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                )}
              </svg>
            </div>
            <h2 className={`font-outfit text-2xl font-extrabold tracking-tight transition-colors ${isUser ? 'text-slate-100' : 'text-white'}`}>Portal Sipentar</h2>
            <p className={`text-sm font-bold mt-1.5 uppercase tracking-widest transition-colors ${isUser ? 'text-emerald-200/80' : 'text-orange-400/80'}`}>
              {isUser ? "Akses Warga Desa" : "Divisi Administrator"}
            </p>
          </div>

          {/* Role Toggle Switch */}
          <div className={`flex p-1.5 rounded-2xl mb-8 relative z-20 shadow-inner transition-colors duration-500 ${isUser ? 'bg-slate-900/40 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]' : 'bg-slate-950/60 border border-slate-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'}`}>
            <button
              type="button"
              onClick={() => handleRoleSwitch("user")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${isUser
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-900/50 ring-1 ring-emerald-300/50 transform scale-100"
                : "text-slate-400 hover:text-slate-200 transform scale-95"
                }`}
            >
              Portal Warga
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("admin")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${!isUser
                ? "bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-md shadow-orange-900/50 ring-1 ring-amber-400/50 transform scale-100"
                : "text-slate-400 hover:text-slate-200 transform scale-95"
                }`}
            >
              Portal Admin
            </button>
          </div>

          {error && (
            <div className={`border-l-4 p-4 rounded-r-xl mb-6 flex items-start backdrop-blur-md animate-fade-in ${isUser ? 'bg-red-900/40 border-red-500' : 'bg-red-950/60 border-red-500'}`}>
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className={`text-sm font-medium ${isUser ? 'text-red-100' : 'text-red-200'}`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-sm font-bold mb-1.5 pl-1 drop-shadow-md transition-colors ${isUser ? 'text-slate-100' : 'text-slate-200'}`}>
                {isUser ? "Nomor Induk Kependudukan (NIK)" : "Alamat Email Admin"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {isUser ? (
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                  ) : (
                    <svg className="h-5 w-5 text-orange-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <input
                  type={isUser ? "text" : "email"}
                  placeholder={isUser ? "Masukkan 16 Digit NIK..." : "admin@sipentar.com"}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition font-medium backdrop-blur-sm shadow-inner
                    ${isUser
                      ? 'border-white/20 bg-slate-900/40 text-white placeholder-slate-400 ' + inputFocusRing
                      : 'border-amber-500/30 bg-slate-950/60 text-white placeholder-slate-500 ' + inputFocusRing
                    }`}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5 pl-1 drop-shadow-md">
                <label className={`block text-sm font-bold transition-colors ${isUser ? 'text-slate-100' : 'text-slate-200'}`}>Kata Sandi</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${isUser ? 'text-slate-400' : 'text-orange-400/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition font-medium backdrop-blur-sm shadow-inner
                    ${isUser
                      ? 'border-white/20 bg-slate-900/40 text-white placeholder-slate-400 ' + inputFocusRing
                      : 'border-amber-500/30 bg-slate-950/60 text-white placeholder-slate-500 ' + inputFocusRing
                    }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-8 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 transform hover:-translate-y-0.5 ${buttonStyle}`}
            >
              {loading ? "Memproses Data..." : "Autentikasi Masuk"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            {isUser ? (
              <p className="text-sm text-slate-300 font-medium tracking-wide">
                Warga baru mendaftar?{' '}
                <Link to="/register" className="text-amber-400 font-extrabold hover:text-amber-300 hover:underline transition">
                  Buat Akses Pelapor
                </Link>
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                <span className="text-amber-400">⚠️</span> Akses Khusus Aparatur Desa Terdaftar.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;