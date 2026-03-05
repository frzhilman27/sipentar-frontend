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

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 mb-6 text-white/90 hover:text-amber-300 font-medium transition group drop-shadow-md">
                    <div className="w-8 h-8 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-slate-900/80 transition">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </div>
                    Kembali ke Beranda Desa
                </Link>

                {/* Register Card */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/20 p-8 sm:p-10 relative overflow-hidden">
                    {/* Subtle top glare */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-60"></div>

                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-village-emerald-500 to-village-emerald-700 mx-auto flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(16,185,129,0.8)] mb-4 border border-village-emerald-400/30">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h2 className="font-outfit text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Registrasi Warga</h2>
                        <p className="text-sm font-semibold text-emerald-100/80 mt-2">Aktivasi Identitas Sipentar</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/40 border-l-4 border-red-500 p-4 rounded-r-xl mb-6 flex items-start backdrop-blur-md">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm text-red-100 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-100 mb-1.5 pl-1 drop-shadow-md">Nomor Induk Kependudukan (NIK)</label>
                            <input
                                type="number"
                                placeholder="16 Digit NIK KTP Resmi..."
                                className="w-full px-4 py-3.5 border border-white/20 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 text-white placeholder-slate-400 outline-none transition bg-slate-900/40 backdrop-blur-sm shadow-inner font-medium"
                                value={nik}
                                onChange={(e) => setNik(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-100 mb-1.5 pl-1 drop-shadow-md">Nama Lengkap (Sesuai KTP)</label>
                            <input
                                type="text"
                                placeholder="Misal: Bapak Ahmad"
                                className="w-full px-4 py-3.5 border border-white/20 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 text-white placeholder-slate-400 outline-none transition bg-slate-900/40 backdrop-blur-sm shadow-inner font-medium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-100 mb-1.5 pl-1 drop-shadow-md">Email Aktif</label>
                            <input
                                type="email"
                                placeholder="ahmad@domain.com"
                                className="w-full px-4 py-3.5 border border-white/20 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 text-white placeholder-slate-400 outline-none transition bg-slate-900/40 backdrop-blur-sm shadow-inner font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-100 mb-1.5 pl-1 drop-shadow-md">Buat Kata Sandi</label>
                            <input
                                type="password"
                                placeholder="Gunakan minimal 6 karakter..."
                                className="w-full px-4 py-3.5 border border-white/20 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 text-white placeholder-slate-400 outline-none transition bg-slate-900/40 backdrop-blur-sm shadow-inner font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-lg tracking-wide py-3.5 rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(16,185,129,0.8)] border border-emerald-400/50 disabled:opacity-50 transform hover:-translate-y-1"
                        >
                            {loading ? "Memverifikasi..." : "Aktivasi Akun Sekarang"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-slate-300 font-medium">
                            Sudah punya identitas?{' '}
                            <Link to="/login" className="text-amber-400 font-extrabold hover:text-amber-300 hover:underline transition">
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
