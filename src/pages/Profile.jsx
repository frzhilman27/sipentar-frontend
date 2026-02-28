import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Profile() {
    const [user, setUser] = useState({ name: "", role: "", email: "", nik: "" });

    // State Profil Dasar (Email, Kelamin, No HP) & Unggah Foto
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [fotoProfilLocal, setFotoProfilLocal] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [newEmail, setNewEmail] = useState("");
    const [jenisKelamin, setJenisKelamin] = useState("");
    const [noHp, setNoHp] = useState("");
    const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
    const [loadingProfile, setLoadingProfile] = useState(false);

    // State Password Form
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
    const [loadingPassword, setLoadingPassword] = useState(false);

    // State Tab & Delete Account
    const [activeTab, setActiveTab] = useState("profil");
    const [deletePassword, setDeletePassword] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState({ type: "", text: "" });

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const userPhotoUrl = fotoProfilLocal ? `${API_BASE_URL}${fotoProfilLocal}` : null;

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
            setNewEmail(res.data.email || "");
            setJenisKelamin(res.data.jenis_kelamin || "");
            setNoHp(res.data.no_hp || "");
            setFotoProfilLocal(res.data.foto_profil || "");
            setImagePreview(null);
            setSelectedImage(null);
        } catch (err) {
            console.error("Gagal mengambil profil:", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const cancelEditing = () => {
        setIsEditingProfile(false);
        setProfileMessage({ type: '', text: '' });
        fetchProfile(); // Reset fields to initial
    };

    const handleUpdateProfileInfo = async (e) => {
        e.preventDefault();
        setProfileMessage({ type: "", text: "" });

        setLoadingProfile(true);
        try {
            const formData = new FormData();
            formData.append("newEmail", newEmail);
            formData.append("jenis_kelamin", jenisKelamin);
            formData.append("no_hp", noHp);

            if (selectedImage) {
                formData.append("foto_profil", selectedImage);
            }

            const res = await api.put("/auth/profile/info", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setProfileMessage({ type: "success", text: res.data.message });
            setIsEditingProfile(false);
            fetchProfile(); // Segarkan pasca simpan
        } catch (err) {
            setProfileMessage({ type: "error", text: err.response?.data?.message || "Terjadi kesalahan sistem saat memperbarui profil dasar." });
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: "", text: "" });

        if (!oldPassword || !newPassword || !confirmPassword) {
            return setPasswordMessage({ type: "error", text: "Mohon lengkapi semua isian sandi." });
        }

        if (newPassword !== confirmPassword) {
            return setPasswordMessage({ type: "error", text: "Konfirmasi Kata Sandi Baru tidak cocok." });
        }

        setLoadingPassword(true);
        try {
            const res = await api.put("/auth/profile/password", {
                oldPassword,
                newPassword
            });
            setPasswordMessage({ type: "success", text: res.data.message });
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordMessage({ type: "error", text: err.response?.data?.message || "Terjadi kesalahan sistem saat mengubah sandi." });
        } finally {
            setLoadingPassword(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleteMessage({ type: "", text: "" });

        if (!deletePassword) {
            return setDeleteMessage({ type: "error", text: "Kata sandi diperlukan untuk menghapus akun." });
        }

        setLoadingDelete(true);
        try {
            const res = await api.delete("/auth/profile", {
                data: { password: deletePassword }
            });
            alert(res.data.message || "Akun berhasil dihapus.");
            localStorage.clear();
            window.location.href = "/login";
        } catch (err) {
            setDeleteMessage({ type: "error", text: err.response?.data?.message || "Gagal memusnahkan akun." });
        } finally {
            setLoadingDelete(false);
        }
    };

    const isUser = user.role === "user";
    const theme = "blue";

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12 selection:bg-blue-100">
            {/* Header Premium & Identitas Kompak */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 text-slate-400 hover:bg-slate-50 rounded-full hover:text-blue-600 transition-colors focus:outline-none">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>

                        {/* Identitas Terpadu di Header */}
                        <div className="flex items-center gap-4 pl-2 border-l border-slate-200">
                            {userPhotoUrl ? (
                                <img src={userPhotoUrl} alt="Profil Atas" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                            ) : (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-inner bg-gradient-to-br from-cyan-400 to-blue-600`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-base font-bold text-slate-800 tracking-tight leading-none">{user.name}</h1>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{isUser ? 'Warga' : 'Admin'}</span>
                                    <span className="text-[10px] font-medium text-slate-400">&bull;&nbsp; {isUser ? `NIK: ${user.nik}` : 'Sipentar Sistem'}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* --- SIDEBAR NAVIGASI TAB (Lebih Ramping) --- */}
                    <div className="w-full md:w-56 shrink-0 space-y-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 sticky top-28">
                        <div className="px-3 py-2 mb-1">
                            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Menu Akun</h2>
                        </div>
                        <button
                            onClick={() => { setActiveTab("profil"); setProfileMessage({ type: '', text: '' }); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-bold transition-all ${activeTab === "profil"
                                ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20"
                                : "bg-transparent text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <svg className={`w-4 h-4 shrink-0 transition-colors ${activeTab === "profil" ? "text-blue-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Kelola Profil
                        </button>
                        <button
                            onClick={() => { setActiveTab("pengaturan"); setPasswordMessage({ type: '', text: '' }); setDeleteMessage({ type: '', text: '' }); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-bold transition-all ${activeTab === "pengaturan"
                                ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20"
                                : "bg-transparent text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <svg className={`w-4 h-4 shrink-0 transition-colors ${activeTab === "pengaturan" ? "text-blue-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Pengaturan
                        </button>
                    </div>

                    {/* --- AREA KONTEN TAB --- */}
                    <div className="flex-1 min-w-0">

                        {/* VIEW: KELOLA PROFIL (Dual-Mode: Read vs Edit) */}
                        {activeTab === "profil" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">Informasi Dasar</h3>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">Identitas otentik yang terafiliasi dengan akun Sipentar Anda.</p>
                                    </div>
                                    {!isEditingProfile && (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg shadow-sm transition-all"
                                        >
                                            Ubah Profil
                                        </button>
                                    )}
                                </div>

                                <div className="p-0">
                                    {profileMessage.text && (
                                        <div className={`m-6 p-3 rounded-lg flex items-center text-sm ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            <p className="font-semibold">{profileMessage.text}</p>
                                        </div>
                                    )}

                                    {!isEditingProfile ? (
                                        /* ================= READ MODE ================= */
                                        <div className="divide-y divide-slate-50">
                                            {/* Foto Profil View */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-5">
                                                <div className="pt-2">
                                                    <span className="block text-sm font-semibold text-slate-500">Foto Profil</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {userPhotoUrl ? (
                                                        <img src={userPhotoUrl} alt="Profil" className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm" />
                                                    ) : (
                                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-slate-400 bg-slate-100 shadow-inner border border-slate-200`}>
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Nama View */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-5">
                                                <div><span className="block text-sm font-semibold text-slate-500">Nama Lengkap</span></div>
                                                <div className="text-sm font-bold text-slate-800">{user.name}</div>
                                            </div>

                                            {/* Email View */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-5">
                                                <div><span className="block text-sm font-semibold text-slate-500">Alamat Surel (Email)</span></div>
                                                <div className="text-sm font-bold text-slate-800">{user.email}</div>
                                            </div>

                                            {/* Kelamin View */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-5">
                                                <div><span className="block text-sm font-semibold text-slate-500">Jenis Kelamin</span></div>
                                                <div className="text-sm font-bold text-slate-800">{jenisKelamin || " - "}</div>
                                            </div>

                                            {/* HP View */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-5">
                                                <div><span className="block text-sm font-semibold text-slate-500">Nomor Telepon</span></div>
                                                <div className="text-sm font-bold text-slate-800">{noHp || " - "}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ================= EDIT MODE ================= */
                                        <form onSubmit={handleUpdateProfileInfo} className="divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">

                                            {/* Field Unggah Foto */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-6 bg-blue-50/20 border-b border-slate-100">
                                                <div className="pt-2">
                                                    <label className="block text-sm font-semibold text-slate-700">Ganti Foto Profil</label>
                                                    <p className="text-[11px] text-slate-500 mt-1 max-w-[180px]">Disarankan menggunakan rasio 1:1, maks (2MB).</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-4">
                                                        {(imagePreview || userPhotoUrl) ? (
                                                            <img src={imagePreview || userPhotoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm" />
                                                        ) : (
                                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-slate-400 bg-slate-100 shadow-inner border border-slate-200`}>
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <label className="cursor-pointer px-4 py-2 text-xs font-bold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg shadow-sm transition-colors">
                                                            Pilih Berkas Gambar
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Field Email: Layout Mendatar */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-6 hover:bg-slate-50/50 transition-colors">
                                                <div className="pt-2">
                                                    <label className="block text-sm font-semibold text-slate-700">Alamat Email Baru</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="email"
                                                        required
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:ring-2 focus:ring-${theme}-500/20 focus:border-${theme}-500 block w-full max-w-sm px-3.5 py-2.5 outline-none transition-all shadow-sm`}
                                                        value={newEmail}
                                                        onChange={(e) => setNewEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Field Kelamin: Layout Mendatar */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-6 hover:bg-slate-50/50 transition-colors">
                                                <div className="pt-2">
                                                    <label className="block text-sm font-semibold text-slate-700">Jenis Kelamin</label>
                                                </div>
                                                <div>
                                                    <select
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:ring-2 focus:ring-${theme}-500/20 focus:border-${theme}-500 block w-full max-w-xs px-3.5 py-2.5 outline-none transition-all shadow-sm cursor-pointer`}
                                                        value={jenisKelamin}
                                                        onChange={(e) => setJenisKelamin(e.target.value)}
                                                    >
                                                        <option value="">-- Pilih --</option>
                                                        <option value="Laki-laki">Laki-laki</option>
                                                        <option value="Perempuan">Perempuan</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Field Nomor HP: Layout Mendatar */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-6 hover:bg-slate-50/50 transition-colors">
                                                <div className="pt-2">
                                                    <label className="block text-sm font-semibold text-slate-700">Nomor Telepon</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="tel"
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:ring-2 focus:ring-${theme}-500/20 focus:border-${theme}-500 block w-full max-w-sm px-3.5 py-2.5 outline-none transition-all shadow-sm`}
                                                        value={noHp}
                                                        placeholder="0812xxxxx (Boleh dikosongkan)"
                                                        onChange={(e) => setNoHp(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Area Tombol Aksi Simpan */}
                                            <div className="bg-slate-50/80 px-6 py-5 flex justify-end gap-3 rounded-b-2xl">
                                                <button
                                                    type="button"
                                                    onClick={cancelEditing}
                                                    className={`px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all shadow-sm`}
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loadingProfile}
                                                    className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-all shadow-sm disabled:opacity-50 bg-slate-800 hover:bg-slate-900 whitespace-nowrap`}
                                                >
                                                    {loadingProfile ? "Meyimpan..." : "Simpan Berkas"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* VIEW: PENGATURAN (AKUN) */}
                        {activeTab === "pengaturan" && (
                            <div className="space-y-6 animate-in fade-in duration-300">

                                {/* KARTU 1: GANTI SANDI */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">Keamanan Kredensial</h3>
                                            <p className="text-xs font-medium text-slate-500 mt-0.5">Perbarui perlindungan kata sandi Anda.</p>
                                        </div>
                                    </div>

                                    <div className="p-0">
                                        {passwordMessage.text && (
                                            <div className={`m-6 p-3 rounded-lg flex items-center text-sm ${passwordMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                <p className="font-semibold">{passwordMessage.text}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handleUpdatePassword} className="divide-y divide-slate-100">

                                            {/* Sandi Lama Mendatar */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-6 hover:bg-slate-50/50 transition-colors">
                                                <div className="pt-2">
                                                    <label className="block text-sm font-semibold text-slate-700">Sandi Saat Ini</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="password"
                                                        required
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full max-w-sm px-3.5 py-2.5 outline-none transition-all shadow-sm`}
                                                        value={oldPassword}
                                                        onChange={(e) => setOldPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Sandi Baru Mendatar */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-6 hover:bg-slate-50/50 transition-colors">
                                                <div className="pt-2">
                                                    <label className="block text-sm font-semibold text-slate-700">Sandi Baru</label>
                                                </div>
                                                <div className="space-y-3">
                                                    <input
                                                        type="password"
                                                        required
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full max-w-sm px-3.5 py-2.5 outline-none transition-all shadow-sm`}
                                                        placeholder="Ketik rahasia baru..."
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                    <input
                                                        type="password"
                                                        required
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full max-w-sm px-3.5 py-2.5 outline-none transition-all shadow-sm`}
                                                        placeholder="Ulangi sekali lagi..."
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/80 px-6 py-4 flex justify-end rounded-b-2xl">
                                                <button
                                                    type="submit"
                                                    disabled={loadingPassword}
                                                    className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-all shadow-sm disabled:opacity-50 bg-indigo-600 hover:bg-indigo-700`}
                                                >
                                                    {loadingPassword ? "Memvalidasi..." : "Terapkan Keamanan"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* KARTU 2: HAPUS AKUN (COMPACT DANGER ZONE) */}
                                <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden mt-6">
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-base">Hapus Permanen Akun Ini</h4>
                                                <p className="text-xs text-slate-500 mt-1">Sistem akan menghancurkan data profil beserta seluruh rekam jejak laporan Anda tanpa sisa.</p>
                                            </div>
                                            {!showDeleteConfirm ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                                                    className="px-5 py-2.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all whitespace-nowrap shrink-0"
                                                >
                                                    Minta Hapus
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all whitespace-nowrap shrink-0"
                                                >
                                                    Batal
                                                </button>
                                            )}
                                        </div>

                                        {showDeleteConfirm && (
                                            <div className="mt-5 pt-5 border-t border-red-100 animate-in fade-in duration-300">
                                                <form onSubmit={handleDeleteAccount} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                    <div className="flex-1 w-full max-w-sm">
                                                        <input
                                                            type="password"
                                                            required
                                                            className={`appearance-none bg-white border border-red-200 text-slate-800 text-sm font-bold rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block w-full px-3.5 py-2.5 outline-none transition-all`}
                                                            placeholder="Validasi dengan sandi Anda..."
                                                            value={deletePassword}
                                                            onChange={(e) => setDeletePassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={loadingDelete}
                                                        className={`w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-all disabled:opacity-50 bg-red-600 hover:bg-red-700 whitespace-nowrap shadow-sm`}
                                                    >
                                                        {loadingDelete ? "Menghancurkan..." : "Konfirmasi Musnahkan"}
                                                    </button>
                                                </form>
                                                {deleteMessage.text && (
                                                    <p className="text-xs font-semibold text-red-600 mt-3">{deleteMessage.text}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </main >
        </div >
    );
}

export default Profile;
