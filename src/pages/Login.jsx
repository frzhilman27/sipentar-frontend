import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", {
        identifier,
        password,
        role_target: "user"
      });

      // Block admin accounts from logging into the warga portal
      if (res.data.role === "admin") {
        setError("Akses Ditolak: Anda menggunakan akun Administrator. Silakan gunakan Portal Admin yang terpisah.");
        localStorage.clear();
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Kredensial tidak valid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-900 font-sans selection:bg-blue-200 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform scale-105"
          style={{ backgroundImage: `url('/rice_field_bg.png')` }}
        >
          <div className="absolute inset-0 bg-slate-900/60"></div>
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-8 sm:px-4 sm:py-12">
        {/* Login Card - Formal Solid White */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative transition-all duration-500 p-6 sm:p-10 w-full">

          <div className="text-center mb-6 sm:mb-8">
            <img src="/logosipentar.png" alt="Logo Sipentar" className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto object-cover shadow-md mb-4 sm:mb-5 ring-2 ring-white ring-offset-2 ring-offset-blue-50" />
            <h2 className="font-outfit text-2xl font-extrabold tracking-tight text-slate-900">Portal Warga Sipentar</h2>
            <p className="text-xs font-bold mt-1.5 uppercase tracking-widest text-sipentar-blue">
              Akses Pelaporan Desa
            </p>
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
                Nomor Induk Kependudukan (NIK)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Masukkan 16 Digit NIK..."
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl outline-none transition font-medium text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-sipentar-blue/20 focus:border-sipentar-blue"
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
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl outline-none transition font-medium text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-sipentar-blue/20 focus:border-sipentar-blue"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-sipentar-blue hover:bg-sipentar-blue-dark text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-700/30 disabled:opacity-50 transform active:scale-95"
            >
              {loading ? "Memproses Data..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600 font-medium">
              Warga baru mendaftar?{' '}
              <Link to="/register" className="text-sipentar-blue font-bold hover:text-sipentar-blue-dark hover:underline transition">
                Buat Akses Pelapor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;