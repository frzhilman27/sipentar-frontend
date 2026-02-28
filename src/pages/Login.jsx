import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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

  // Custom Dynamic Styling based on role
  const selectionColor = isUser ? "selection:bg-blue-200" : "selection:bg-amber-200";
  const bgImage = isUser
    ? "url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
    : "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')";

  const glareGradient = isUser
    ? "from-transparent via-blue-400 to-transparent"
    : "from-transparent via-amber-400 to-transparent";

  const iconGradient = isUser
    ? "from-blue-600 to-indigo-700 shadow-blue-500/30"
    : "from-amber-500 via-orange-600 to-red-700 shadow-orange-500/40";

  const inputFocusRing = isUser
    ? "focus:ring-blue-500/10 focus:border-blue-500"
    : "focus:ring-orange-500/15 focus:border-amber-500";

  const buttonStyle = isUser
    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-orange-500/40 border border-orange-500/50";

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
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform ${isUser ? 'scale-105 filter-none' : 'scale-110 sepia-[0.3]'}`}
          style={{ backgroundImage: bgImage }}
        >
          {/* Dynamic Overlay overlay - darker for admin with a slight warm tint */}
          <div className={`absolute inset-0 transition-all duration-1000 ${isUser ? 'bg-slate-900/40 backdrop-blur-[3px]' : 'bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-orange-900/40 backdrop-blur-[4px]'}`}></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-white/90 hover:text-white font-medium transition group">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </div>
          Kembali ke Beranda
        </Link>

        {/* Login Card */}
        <div className={`backdrop-blur-xl rounded-[2rem] shadow-2xl border p-8 sm:p-10 relative overflow-hidden transition-all duration-500 ${isUser ? 'bg-white/95 border-white/40 shadow-black/30' : 'bg-slate-900/80 border-orange-500/20 shadow-orange-900/40'}`}>
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
            <h2 className={`text-2xl font-extrabold tracking-tight transition-colors ${isUser ? 'text-slate-900' : 'text-white'}`}>Portal Sipentar</h2>
            <p className={`text-sm font-bold mt-1.5 uppercase tracking-widest transition-colors ${isUser ? 'text-slate-500' : 'text-orange-400/80'}`}>
              {isUser ? "Akses Warga Desa" : "Divisi Administrator"}
            </p>
          </div>

          {/* Role Toggle Switch */}
          <div className={`flex p-1.5 rounded-2xl mb-8 relative z-20 shadow-inner transition-colors duration-500 ${isUser ? 'bg-slate-100/80' : 'bg-slate-800/80 border border-slate-700/50'}`}>
            <button
              type="button"
              onClick={() => handleRoleSwitch("user")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${isUser
                ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/50 transform scale-100"
                : "text-slate-400 hover:text-slate-200 transform scale-95"
                }`}
            >
              Portal Warga
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("admin")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${!isUser
                ? "bg-gradient-to-b from-orange-500 to-amber-600 text-white shadow-md shadow-orange-900/50 ring-1 ring-orange-500/50 transform scale-100"
                : "text-slate-500 hover:text-slate-700 transform scale-95"
                }`}
            >
              Portal Admin
            </button>
          </div>

          {error && (
            <div className={`border-l-4 p-4 rounded-r-xl mb-6 flex items-start animate-fade-in ${isUser ? 'bg-red-50 border-red-500' : 'bg-red-900/30 border-red-500 backdrop-blur-sm'}`}>
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className={`text-sm font-medium ${isUser ? 'text-red-700' : 'text-red-200'}`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-sm font-bold mb-1.5 pl-1 transition-colors ${isUser ? 'text-slate-700' : 'text-slate-300'}`}>
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
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition font-medium
                    ${isUser
                      ? 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 ' + inputFocusRing
                      : 'border-slate-700/50 bg-slate-800/50 text-white placeholder-slate-500 ' + inputFocusRing
                    }`}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5 pl-1">
                <label className={`block text-sm font-bold transition-colors ${isUser ? 'text-slate-700' : 'text-slate-300'}`}>Kata Sandi</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 ${isUser ? 'text-slate-400' : 'text-orange-400/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition font-medium
                    ${isUser
                      ? 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 ' + inputFocusRing
                      : 'border-slate-700/50 bg-slate-800/50 text-white placeholder-slate-500 ' + inputFocusRing
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

          <div className="mt-8 pt-6 border-t border-slate-100/20 text-center">
            {isUser ? (
              <p className="text-sm text-slate-500 font-medium">
                Warga baru mendaftar?{' '}
                <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition">
                  Buat Akses Pelapor
                </Link>
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                <span className="text-orange-400">⚠️</span> Hanya staf desa yang berwenang yang dapat mengakses portal ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;