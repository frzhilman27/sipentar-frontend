import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

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
        <div className="min-h-screen flex items-center justify-center relative bg-slate-900 font-sans selection:bg-blue-200 py-12">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
            >
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 mb-6 text-white/90 hover:text-white font-medium transition group">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </div>
                    Kembali ke Beranda
                </Link>

                {/* Register Card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-black/30 border border-white/40 p-8 sm:p-10 relative overflow-hidden">
                    {/* Subtle top glare */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Registrasi Warga</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Aktivasi Identitas Sipentar</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-6 flex items-start">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Nomor Induk Kependudukan (NIK)</label>
                            <input
                                type="number"
                                placeholder="16 Digit NIK KTP Resmi..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder-slate-400 outline-none transition bg-slate-50 font-medium"
                                value={nik}
                                onChange={(e) => setNik(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Nama Lengkap (Sesuai KTP)</label>
                            <input
                                type="text"
                                placeholder="Misal: Bapak Ahmad"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder-slate-400 outline-none transition bg-slate-50 font-medium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Email Aktif</label>
                            <input
                                type="email"
                                placeholder="ahmad@domain.com"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder-slate-400 outline-none transition bg-slate-50 font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 pl-1">Buat Kata Sandi</label>
                            <input
                                type="password"
                                placeholder="Gunakan minimal 6 karakter..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-900 placeholder-slate-400 outline-none transition bg-slate-50 font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 transform hover:-translate-y-0.5"
                        >
                            {loading ? "Memverifikasi..." : "Aktivasi Akun Sekarang"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Sudah punya identitas?{' '}
                            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition">
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
