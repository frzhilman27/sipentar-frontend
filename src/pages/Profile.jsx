import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import useDarkMode from "../hooks/useDarkMode";

function Profile() {
    const [user, setUser] = useState({ name: "", role: "", email: "", nik: "" });
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    const navigate = useNavigate();

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
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "ringkasan";

    const handleTabChange = (tabName) => {
        setSearchParams({ tab: tabName });
    };
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-12 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
            {/* Header Premium & Identitas Kompak */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => activeTab === 'ringkasan' ? navigate('/dashboard') : handleTabChange('ringkasan')}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </button>

                        {/* Identitas Terpadu di Header */}
                        <div className="flex items-center gap-4 pl-2 border-l border-slate-200 dark:border-slate-700 transition-colors">
                            {userPhotoUrl ? (
                                <img src={userPhotoUrl} alt="Profil Atas" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600 shadow-sm transition-colors" />
                            ) : (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-inner bg-gradient-to-br from-cyan-400 to-blue-600`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-base font-bold text-slate-800 dark:text-white tracking-tight leading-none transition-colors">{user.name}</h1>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider transition-colors">{isUser ? 'Warga' : 'Admin'}</span>
                                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 transition-colors">&bull;&nbsp; {isUser ? `NIK: ${user.nik}` : 'Sipentar Sistem'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 sm:gap-7">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="relative p-2.5 rounded-full text-slate-400 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
                            title="Ganti Tema Warna"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            )}
                        </button>
                    </div>

                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16">
                <div className="flex flex-col gap-6 items-center w-full">

                    {/* VIEW: MENU NAVIGASI GRID (DEFAULT "Ringkasan") */}
                    {activeTab === "ringkasan" && (
                        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
                            {/* Sambutan Pribadi & Identitas */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-8 flex flex-col items-center justify-center text-center transition-colors mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

                                <div className="w-28 h-28 mb-6 relative z-10">
                                    {userPhotoUrl ? (
                                        <img src={userPhotoUrl} alt="Profil Atas" className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl transition-colors" />
                                    ) : (
                                        <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-extrabold text-white shadow-xl border-4 border-white dark:border-slate-800 bg-gradient-to-br from-cyan-400 to-blue-600`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 transition-colors relative z-10 tracking-tight">Halo, {user.name || "Kawan"}!</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed transition-colors relative z-10 text-base font-medium">
                                    Selamat datang di pusat kendali akun Sipentar Anda.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
                                {/* Text List Menu: Kelola Profil */}
                                <button
                                    onClick={() => { handleTabChange("profil"); setProfileMessage({ type: '', text: '' }); }}
                                    className="flex items-center justify-between w-full px-5 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                        <span className="text-base font-bold text-slate-700 dark:text-white">Kelola Identitas Profil</span>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>

                                {/* Text List Menu: Pengaturan */}
                                <button
                                    onClick={() => { handleTabChange("pengaturan"); setPasswordMessage({ type: '', text: '' }); setDeleteMessage({ type: '', text: '' }); }}
                                    className="flex items-center justify-between w-full px-5 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <span className="text-base font-bold text-slate-700 dark:text-white">Pengaturan Keamanan</span>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VIEW: AREA KONTEN PENUH (FULL WIDTH FOR FORMS) */}
                    <div className={`w-full ${activeTab === 'ringkasan' ? 'hidden' : 'block'}`}>

                        {/* VIEW: KELOLA PROFIL (Dual-Mode: Read vs Edit) */}
                        {activeTab === "profil" && (
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-blue-900/5 dark:shadow-none border border-slate-200 dark:border-slate-700/50 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-300 transition-colors">
                                <div className="px-6 sm:px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white transition-colors tracking-tight">Kelola Identitas Publik</h3>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors">Identitas otentik yang terafiliasi dengan akun Sipentar Anda.</p>
                                        </div>
                                    </div>
                                    {!isEditingProfile && (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all"
                                        >
                                            Mode Ubah Data
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
                            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">

                                {/* Header Kembali Navigasi Pengaturan */}
                                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-indigo-900/5 dark:shadow-none border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-colors">
                                    <div className="px-6 sm:px-8 py-6 flex items-center gap-4 transition-colors">
                                        <div>
                                            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white transition-colors tracking-tight">Pusat Keamanan & Pengaturan Terpadu</h3>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors">Kelola lapis dinding pelindung akun digital Sipentar Anda.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* KARTU 1: GANTI SANDI */}
                                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-colors">
                                    <div className="px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between transition-colors">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">Keamanan Kredensial</h3>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">Perbarui perlindungan kata sandi secara berkala.</p>
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

                                {/* KARTU 2: HAPUS AKUN (DANGER ZONE) */}
                                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-red-900/5 dark:shadow-none border border-red-200 dark:border-red-900/30 overflow-hidden transition-colors relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[100px] pointer-events-none"></div>
                                    <div className="px-6 sm:px-8 py-5 border-b border-red-50 dark:border-red-900/20 flex items-center gap-3 transition-colors relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Zona Berbahaya</h3>
                                            <p className="text-xs font-medium text-red-500/80 dark:text-red-500 mt-0.5">Tindakan ini permanen dan berisiko tinggi.</p>
                                        </div>
                                    </div>

                                    <div className="p-0 relative z-10">
                                        {deleteMessage.text && (
                                            <div className={`m-6 p-3 rounded-lg flex items-center text-sm ${deleteMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                <p className="font-semibold">{deleteMessage.text}</p>
                                            </div>
                                        )}

                                        <div className="px-6 sm:px-8 py-6">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-5 leading-relaxed transition-colors">
                                                Jika Anda memilih menghapus akun, semua data pribadi, foto beserta laporan pengaduan Anda akan dipangkas selamanya dari pangkalan data sistem kami. <span className="font-bold text-red-600 dark:text-red-400">Mohon pastikan Anda yakin!</span>
                                            </p>

                                            {!showDeleteConfirm ? (
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:hover:bg-red-900/40 rounded-xl transition-all shadow-sm flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    Hapus Akun Sipentar
                                                </button>
                                            ) : (
                                                <form onSubmit={handleDeleteAccount} className="bg-red-50/50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 space-y-4 animate-in fade-in transition-colors">
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">
                                                            Konfirmasi Penghapusan
                                                        </label>
                                                        <p className="text-xs text-red-600/80 dark:text-red-400 mb-3 font-medium">Buktikan keabsahan ini dengan menginput kata sandi akun Anda.</p>
                                                        <input
                                                            type="password"
                                                            required
                                                            placeholder="••••••••"
                                                            value={deletePassword}
                                                            onChange={(e) => setDeletePassword(e.target.value)}
                                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:focus:border-red-500 outline-none transition-all text-slate-800 dark:text-white font-medium"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3 pt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all shadow-sm"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={loadingDelete}
                                                            className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm border border-red-600 hover:border-red-700"
                                                        >
                                                            {loadingDelete ? "Sedang Mengunci..." : "Yakin, Hapus!"}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
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
