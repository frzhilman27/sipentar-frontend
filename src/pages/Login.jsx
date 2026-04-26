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
    ? "from-emerald-600 to-teal-700 shadow-emerald-500/30"
    : "from-amber-600 to-orange-700 shadow-amber-500/30";

  const inputFocusRing = isUser
    ? "focus:ring-sipentar-green/20 focus:border-emerald-500"
    : "focus:ring-amber-500/20 focus:border-amber-500";

  const buttonStyle = isUser
    ? "bg-sipentar-green-dark hover:bg-emerald-800 shadow-emerald-700/30"
    : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30";

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
      
      if (res.data.role === 'admin') {
          navigate("/admin/dashboard");
      } else {
          navigate("/user/dashboard");
      }
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

      <div className="relative z-10 w-full max-w-md px-4 py-8 sm:px-4 sm:py-12">
        {/* Login Card - Formal Solid White */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative transition-all duration-500 p-6 sm:p-10 w-full">

          <div className="text-center mb-6 sm:mb-8">
            <img src="/logosipentar.png" alt="Logo Sipentar" className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto object-cover shadow-md mb-4 sm:mb-5 ring-2 ring-white ring-offset-2 ${isUser ? 'ring-offset-emerald-50' : 'ring-offset-amber-50'}`} />
            <h2 className="font-outfit text-2xl font-extrabold tracking-tight text-slate-900">Portal Sipentar</h2>
            <p className={`text-xs font-bold mt-1.5 uppercase tracking-widest ${isUser ? 'text-sipentar-green-dark' : 'text-amber-600'}`}>
              {isUser ? "Akses Warga Desa" : "Divisi Administrator"}
            </p>
          </div>

          {/* Role Toggle Switch */}
          <div className="flex flex-col sm:flex-row p-1.5 rounded-xl mb-6 sm:mb-8 relative z-20 bg-slate-100 shadow-inner overflow-hidden border border-slate-200 gap-1 sm:gap-0">
            <button
              type="button"
              onClick={() => handleRoleSwitch("user")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${isUser
                ? "bg-white text-sipentar-green-dark shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Portal Warga
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("admin")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${!isUser
                ? "bg-white text-amber-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Portal Admin
            </button>
          </div>

          {error && (
            <div className="border-l-4 p-4 rounded-r-lg mb-6 flex items-start bg-red-50 border-red-500">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-1.5 pl-1 text-slate-800">
                {isUser ? "Nomor Induk Kependudukan (NIK)" : "Alamat Email Admin"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isUser ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    )}
                  </svg>
                </div>
                <input
                  type={isUser ? "text" : "email"}
                  placeholder={isUser ? "Masukkan 16 Digit NIK..." : "admin@sipentar.com"}
                  className={`w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl outline-none transition font-medium text-slate-900 placeholder-slate-400 shadow-sm ${inputFocusRing}`}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5 pl-1">
                <label className="block text-sm font-bold text-slate-800">Kata Sandi</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl outline-none transition font-medium text-slate-900 placeholder-slate-400 shadow-sm ${inputFocusRing}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md disabled:opacity-50 transform active:scale-95 ${buttonStyle}`}
            >
              {loading ? "Memproses Data..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            {isUser ? (
              <p className="text-sm text-slate-600 font-medium">
                Warga baru mendaftar?{' '}
                <Link to="/register" className="text-sipentar-green-dark font-bold hover:text-sipentar-green hover:underline transition">
                  Buat Akses Pelapor
                </Link>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                <span className="text-amber-500">⚠️</span> Akses Khusus Aparatur Desa Terdaftar.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;