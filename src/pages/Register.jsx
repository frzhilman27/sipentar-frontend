import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import villageBg from '../assets/village-bg.png';

function Register() {
    const navigate = useNavigate();
    const [nik, setNik] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (nik.length !== 16) {
            setError("NIK harus persis 16 digit angka.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await api.post("/auth/register", { nik, name, email, password });
            alert("Pendaftaran berhasil, silakan login menggunakan NIK Anda.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || "Gagal membuat identitas. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-slate-900 font-sans selection:bg-emerald-200 py-12">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed transform scale-105"
                style={{ backgroundImage: `url(${villageBg})` }}
            >
                {/* Premium Emerald/Golden Tint Overlay - darker for contrast */}
                <div className="absolute inset-0 bg-gradient-to-br from-village-dark-900/80 via-village-emerald-900/60 to-village-dark-900/90 mix-blend-multiply"></div>
                {/* Glassmorphism subtle blur layer */}
                <div className="absolute inset-0 backdrop-blur-[4px] bg-village-dark-900/40"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4 py-8 sm:py-12">
                {/* Register Card - Formal Solid White */}
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-10 relative overflow-hidden">

                    <div className="text-center mb-6 sm:mb-8 font-jakarta">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 mx-auto flex items-center justify-center shadow-md mb-4 sm:mb-5">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Registrasi Warga</h2>
                        <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-1.5 uppercase tracking-widest">Aktivasi Identitas Sipentar</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 flex items-start">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm text-red-800 font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1.5 pl-1">Nomor Induk Kependudukan (NIK)</label>
                            <input
                                type="number"
                                placeholder="16 Digit NIK KTP Resmi..."
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder-slate-400 outline-none transition bg-white shadow-sm font-medium"
                                value={nik}
                                onChange={(e) => setNik(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1.5 pl-1">Nama Lengkap (Sesuai KTP)</label>
                            <input
                                type="text"
                                placeholder="Misal: Bapak Ahmad"
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder-slate-400 outline-none transition bg-white shadow-sm font-medium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1.5 pl-1">Email Aktif</label>
                            <input
                                type="email"
                                placeholder="ahmad@domain.com"
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder-slate-400 outline-none transition bg-white shadow-sm font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-800 mb-1.5 pl-1">Buat Kata Sandi</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 placeholder-slate-400 outline-none transition bg-white shadow-sm font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-700/30 disabled:opacity-50 transform active:scale-95"
                        >
                            {loading ? "Memproses Data..." : "Aktivasi Akun Sekarang"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-600 font-medium">
                            Sudah punya identitas?{' '}
                            <Link to="/login" className="text-emerald-700 font-bold hover:text-emerald-600 hover:underline transition">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
