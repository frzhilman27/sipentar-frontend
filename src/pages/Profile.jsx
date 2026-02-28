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
    const [removePhoto, setRemovePhoto] = useState(false);

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

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const BASE_URL = API_URL.replace(/\/api\/?$/, "");
    const userPhotoUrl = fotoProfilLocal ? `${BASE_URL}${fotoProfilLocal}` : null;

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
            setRemovePhoto(false);
        } catch (err) {
            console.error("Gagal mengambil profil:", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setRemovePhoto(false);
        }
    };

    const cancelEditing = () => {
        setIsEditingProfile(false);
        setProfileMessage({ type: '', text: '' });
        setRemovePhoto(false);
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
            formData.append("remove_photo", removePhoto);

            if (selectedImage && !removePhoto) {
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

    const handleBackNavigation = () => {
        if (activeTab === 'ringkasan') {
            navigate('/dashboard');
        } else if (activeTab === 'profil') {
            if (isEditingProfile) {
                setIsEditingProfile(false);
            } else {
                handleTabChange('ringkasan');
            }
        } else if (activeTab === 'pengaturan_akun') {
            handleTabChange('pengaturan');
        } else if (activeTab === 'pengaturan_sandi' || activeTab === 'pengaturan_hapus') {
            handleTabChange('pengaturan_akun');
        } else {
            handleTabChange('ringkasan');
        }
    };

    const isUser = user.role === "user";
    const theme = "blue";

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans pb-16 selection:bg-indigo-200 dark:selection:bg-indigo-900 transition-colors duration-500">
            {/* Header Premium & Identitas Kompak */}
            <header className={`sticky top-0 z-40 transition-all duration-300 ${isEditingProfile ? 'bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800' : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/40 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]'}`}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBackNavigation}
                            className="p-1 sm:p-2 text-slate-800 font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all focus:outline-none flex-shrink-0"
                        >
                            <svg className="w-6 h-6 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {/* Identitas Terpadu / Judul Halaman di Header */}
                        <div className={`flex items-center gap-3 w-full transition-colors ${activeTab === 'ringkasan' ? 'pl-2 border-l border-slate-200 dark:border-slate-700' : ''}`}>
                            {activeTab === 'ringkasan' ? (
                                <>
                                    {userPhotoUrl ? (
                                        <img src={userPhotoUrl} alt="Profil Atas" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600 shadow-sm transition-colors" />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-inner bg-gradient-to-br from-cyan-400 to-blue-600`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h1 className="text-base font-bold text-slate-800 dark:text-white tracking-tight leading-none transition-colors">{user.name}</h1>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider transition-colors">{isUser ? 'Warga' : 'Admin'}</span>
                                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 transition-colors">&bull;&nbsp; {isUser ? `NIK: ${user.nik}` : 'Sipentar Sistem'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <h1 className="text-[17px] font-bold text-slate-800 dark:text-white tracking-wide transition-colors">
                                    {activeTab === 'profil' ? (isEditingProfile ? 'Ubah Profil' : 'Profil') :
                                        activeTab === 'pengaturan' ? 'Pengaturan' :
                                            activeTab === 'pengaturan_akun' ? 'Akun' :
                                                activeTab === 'pengaturan_sandi' ? 'Mengubah Sandi' :
                                                    activeTab === 'pengaturan_hapus' ? 'Hapus Akun' : ''}
                                </h1>
                            )}
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

            <main className={`max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 mb-16 ${isEditingProfile ? 'mt-0' : 'mt-8'}`}>
                <div className="flex flex-col items-center w-full">

                    {/* VIEW: MENU NAVIGASI GRID (DEFAULT "Ringkasan") */}
                    {activeTab === "ringkasan" && (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                            {/* Sambutan Pribadi & Identitas */}
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl rounded-[2.5rem] shadow-xl shadow-green-900/5 dark:shadow-none border border-white/80 dark:border-slate-700/50 p-10 flex flex-col items-center justify-center text-center transition-all duration-500 mb-10 relative overflow-hidden group">
                                {/* Decorative Orbs */}
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-green-500/10 rounded-full blur-[3rem] group-hover:scale-110 transition-all duration-700 ease-in-out"></div>
                                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-[3rem] group-hover:scale-110 transition-all duration-700 ease-in-out"></div>

                                <div className="w-32 h-32 mb-6 relative z-10">
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    {userPhotoUrl ? (
                                        <img src={userPhotoUrl} alt="Profil Atas" className="w-full h-full rounded-full object-cover border-[5px] border-white dark:border-slate-800 shadow-xl transition-transform duration-500 group-hover:scale-105 relative z-10" />
                                    ) : (
                                        <div className={`w-full h-full rounded-full flex items-center justify-center text-5xl font-black text-white shadow-xl border-[5px] border-white dark:border-slate-800 bg-gradient-to-br from-[#00a82d] to-green-600 transition-transform duration-500 group-hover:scale-105 relative z-10`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 transition-colors relative z-10 tracking-tight">Halo, <span className="text-[#00a82d] dark:text-green-400">{user.name || "Kawan"}</span>!</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed transition-colors relative z-10 text-base md:text-lg font-medium">
                                    Sipentar Identity Center. Kelola lapis ganda privasi masa depan Anda dengan cerdas dan eksklusif.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
                                {/* Text List Menu: Kelola Profil */}
                                <button
                                    onClick={() => { handleTabChange("profil"); setProfileMessage({ type: '', text: '' }); }}
                                    className="group flex items-center justify-between w-full px-6 py-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-[1.5rem] border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:shadow-green-900/5 hover:border-green-200 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/15"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-green-50 dark:bg-slate-700 text-[#00a82d] dark:text-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                        <span className="text-[17px] font-bold text-slate-800 dark:text-white group-hover:text-[#00a82d] dark:group-hover:text-green-400 transition-colors">Kelola Identitas Profil</span>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-green-500 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                </button>

                                {/* Text List Menu: Pengaturan */}
                                <button
                                    onClick={() => { handleTabChange("pengaturan"); setPasswordMessage({ type: '', text: '' }); setDeleteMessage({ type: '', text: '' }); }}
                                    className="group flex items-center justify-between w-full px-6 py-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-[1.5rem] border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:shadow-indigo-900/5 hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <span className="text-[17px] font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Pengaturan Keamanan</span>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* VIEW: AREA KONTEN PENUH (FULL WIDTH FOR FORMS) */}
                    <div className={`w-full ${activeTab === 'ringkasan' ? 'hidden' : 'block'}`}>

                        {/* VIEW: KELOLA PROFIL (Dual-Mode: Read vs Edit) */}
                        {activeTab === "profil" && (
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl border-t border-b sm:border sm:rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 dark:shadow-none border-white/60 dark:border-slate-700/50 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-500 transition-all relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
                                {isEditingProfile && (
                                    <div className="px-6 sm:px-10 py-7 border-b border-slate-100 dark:border-slate-700/50 transition-colors relative z-10">
                                        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white transition-colors tracking-tight">Ubah Informasi Identitas</h3>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5 transition-colors">Mutakhirkan jejak identitas keanggotaan publik Anda dengan akurat.</p>
                                    </div>
                                )}

                                <div className="p-0">
                                    {profileMessage.text && (
                                        <div className={`m-6 p-3 rounded-lg flex items-center text-sm ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            <p className="font-semibold">{profileMessage.text}</p>
                                        </div>
                                    )}

                                    {!isEditingProfile ? (
                                        /* ================= READ MODE (VIEW COMPACT PREMIUM) ================= */
                                        <div className="flex flex-col animate-in fade-in duration-500 relative z-10 bg-white dark:bg-slate-900 sm:rounded-[2.5rem] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mt-2">
                                            {/* Top Centered Profile Header */}
                                            <div className="flex flex-col items-center justify-center pt-10 pb-8 px-6 text-center">
                                                <div className="w-28 h-28 mb-5 relative group cursor-default">
                                                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                                    {userPhotoUrl ? (
                                                        <img src={userPhotoUrl} alt="Profil" className="w-[105px] h-[105px] rounded-full object-cover border-[3px] border-white dark:border-slate-800 shadow-xl transition-transform duration-500 group-hover:scale-105 relative z-10" />
                                                    ) : (
                                                        <div className="w-[105px] h-[105px] rounded-full flex items-center justify-center text-[40px] font-black text-white shadow-xl border-[3px] border-white dark:border-slate-800 bg-gradient-to-br from-[#00a82d] to-green-600 transition-transform duration-500 group-hover:scale-105 relative z-10">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <h2 className="text-[19px] font-black tracking-widest uppercase text-slate-800 dark:text-white mb-2">{user.name}</h2>
                                                {isUser ? (
                                                    <p className="text-[14px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-1.5">Warga Masyarakat</p>
                                                ) : (
                                                    <p className="text-[14px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-1.5">Pusat Sistem Sipentar</p>
                                                )}
                                                <p className="text-[14px] font-medium text-slate-400 dark:text-slate-500 tracking-wide mb-3">{isUser ? 'Pelapor Aktif' : 'Administrator'}</p>
                                                <div className="inline-flex px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tracking-widest text-[10px] font-bold">
                                                    TERVERIFIKASI
                                                </div>
                                            </div>

                                            {/* Details List Premium */}
                                            <div className="px-6 md:px-10 pb-10 space-y-4">
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 flex align-middle justify-between hover:bg-slate-100/80 transition-colors">
                                                    <div>
                                                        <span className="block text-[13px] font-bold text-slate-500 mb-0.5">Alamat Surel (Email)</span>
                                                        <span className="block text-[15px] font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 flex align-middle justify-between hover:bg-slate-100/80 transition-colors">
                                                    <div>
                                                        <span className="block text-[13px] font-bold text-slate-500 mb-0.5">Jenis Kelamin</span>
                                                        <span className="block text-[15px] font-semibold text-slate-800 dark:text-slate-200">{jenisKelamin || " - "}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 flex align-middle justify-between hover:bg-slate-100/80 transition-colors">
                                                    <div>
                                                        <span className="block text-[13px] font-bold text-slate-500 mb-0.5">Nomor Handphone</span>
                                                        <span className="block text-[15px] font-semibold text-slate-800 dark:text-slate-200">{noHp || " - "}</span>
                                                    </div>
                                                </div>

                                                {/* Full Width Green Button Premium */}
                                                <div className="pt-6 pb-2">
                                                    <button
                                                        onClick={() => setIsEditingProfile(true)}
                                                        className="w-full bg-[#00a82d] hover:bg-green-700 text-white font-bold tracking-wide py-3.5 px-4 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] outline-none focus:ring-4 focus:ring-green-500/20"
                                                    >
                                                        Ubah Profil
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ================= EDIT MODE (REFERENSI BARU) ================= */
                                        <form onSubmit={handleUpdateProfileInfo} className="px-5 md:px-10 py-6 md:py-10 animate-in fade-in slide-in-from-top-2 duration-500 relative z-10 flex flex-col gap-5 bg-white w-full rounded-b-3xl">

                                            {/* Field Unggah Foto Centered */}
                                            <div className="flex flex-col items-center justify-center mb-6 relative z-10 pt-4">
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                    {/* Prioritas Render Gambar */}
                                                    {(!removePhoto && (imagePreview || userPhotoUrl)) ? (
                                                        <img src={imagePreview || userPhotoUrl} alt="Preview" className="w-[105px] h-[105px] rounded-full object-cover border-[3px] border-white shadow-sm relative z-10" />
                                                    ) : (
                                                        <div className={`w-[105px] h-[105px] rounded-full flex items-center justify-center text-[40px] font-black text-white bg-gradient-to-br from-[#00a82d] to-green-600 shadow-sm border-[3px] border-white relative z-10`}>
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}

                                                    {/* Ikon Hapus Foto Kiri Atas Penuh Gaya (Muncul jika ada foto) */}
                                                    {(!removePhoto && (imagePreview || userPhotoUrl)) && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); setRemovePhoto(true); setImagePreview(null); setSelectedImage(null); }}
                                                            className="absolute top-0 -right-2 w-8 h-8 bg-white border border-rose-100 shadow-md rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-50 hover:border-red-200 transition-all z-30 opacity-80 hover:opacity-100 hover:scale-110 group-hover:opacity-100"
                                                            title="Hapus Foto Profil"
                                                        >
                                                            <svg className="w-[16px] h-[16px] text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}

                                                    {/* Ikon Kamera Overlay Kanan Bawah */}
                                                    <label className="absolute bottom-0 -right-2 w-9 h-9 bg-white border border-slate-100 shadow-md rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors z-20 hover:scale-110">
                                                        <svg className="w-[18px] h-[18px] text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M4 8V6a2 2 0 012-2h1.5l1.65-2h5.7l1.65 2H18a2 2 0 012 2v2M4 8h16M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8m-9 9a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                        </svg>
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Input Area Group */}
                                            <div className="space-y-5">

                                                {/* Edit Nama Field */}
                                                <div className="space-y-1.5">
                                                    <label className="block text-[14px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                                                        Nama Lengkap<span className="text-red-500 ml-0.5">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-700 text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-[#00a82d]/20 focus:border-[#00a82d] block w-full px-4 py-3 outline-none transition-all`}
                                                        value={user.name}
                                                        readOnly
                                                        disabled
                                                    />
                                                </div>

                                                {/* Edit Email Field */}
                                                <div className="space-y-1.5">
                                                    <label className="block text-[14px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                                                        Email<span className="text-red-500 ml-0.5">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            type="email"
                                                            required
                                                            className={`appearance-none bg-[#eff2f6] border border-transparent text-slate-700 text-[15px] font-medium rounded-xl focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-[#00a82d]/20 block w-full pl-11 pr-4 py-3 outline-none transition-all`}
                                                            value={newEmail}
                                                            onChange={(e) => setNewEmail(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Edit Kelamin Field */}
                                                <div className="space-y-1.5">
                                                    <label className="block text-[14px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                                                        Jenis Kelamin
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            className={`appearance-none bg-white border border-slate-200 text-slate-700 text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-[#00a82d]/20 focus:border-[#00a82d] block w-full px-4 py-3 pr-10 outline-none transition-all cursor-pointer`}
                                                            value={jenisKelamin}
                                                            onChange={(e) => setJenisKelamin(e.target.value)}
                                                        >
                                                            <option value="">-- Pilih --</option>
                                                            <option value="Laki-laki">Laki-laki</option>
                                                            <option value="Perempuan">Perempuan</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Edit Nomor Handphone Field */}
                                                <div className="space-y-1.5">
                                                    <label className="block text-[14px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                                                        Nomor Handphone
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-[15px] font-medium text-slate-400 pointer-events-none">
                                                            +62
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            className={`appearance-none bg-white border border-slate-200 text-slate-700 text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-[#00a82d]/20 focus:border-[#00a82d] block w-full pl-12 pr-4 py-3 outline-none transition-all`}
                                                            value={noHp.replace(/^\+?62/, '')}
                                                            placeholder="000 0000 0000 0000"
                                                            onChange={(e) => setNoHp(e.target.value)}
                                                            maxLength={15}
                                                        />
                                                    </div>
                                                    <div className="text-right text-[11px] font-bold text-slate-400 mt-1">
                                                        {noHp.length}/15
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Area Tombol Aksi Simpan Full Width */}
                                            <div className="pt-2 mt-4 pb-2">
                                                <button
                                                    type="submit"
                                                    disabled={loadingProfile}
                                                    className={`w-full py-3.5 text-[15px] font-bold text-white rounded-xl transition-all disabled:opacity-50 bg-[#00a82d] hover:bg-green-700 active:scale-[0.98] outline-none shadow-sm`}
                                                >
                                                    {loadingProfile ? "Memproses..." : "Simpan"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* VIEW: PENGATURAN (MAIN MENU) */}
                        {activeTab === "pengaturan" && (
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl border-t border-b sm:border sm:rounded-[2.5rem] shadow-sm dark:shadow-none border-slate-100 dark:border-slate-700/50 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-500 transition-all p-3 sm:p-5 mt-2">
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => handleTabChange("pengaturan_akun")}
                                        className="group flex items-center justify-between w-full px-5 py-5 sm:px-7 sm:py-6 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-[1.25rem] border border-slate-100 dark:border-slate-700 hover:border-slate-200 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-green-500/10 shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-[#00a82d] transition-colors">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                            <span className="text-[17px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#00a82d] transition-colors tracking-tight">Pengaturan Akun Spesifik</span>
                                        </div>
                                        <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-green-500 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* VIEW: PENGATURAN -> AKUN */}
                        {activeTab === "pengaturan_akun" && (
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl border-t border-b sm:border sm:rounded-[2.5rem] shadow-sm dark:shadow-none border-slate-100 dark:border-slate-700/50 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-500 transition-all p-3 sm:p-5 mt-2">
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => handleTabChange("pengaturan_sandi")}
                                        className="group flex items-center justify-between w-full px-5 py-5 sm:px-7 sm:py-6 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-[1.25rem] border border-slate-100 dark:border-slate-700 hover:border-slate-200 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 transition-colors">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                            </div>
                                            <span className="text-[17px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 transition-colors">Ubah Kata Sandi Kunci</span>
                                        </div>
                                        <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-orange-500 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>

                                    <button
                                        onClick={() => handleTabChange("pengaturan_hapus")}
                                        className="group flex items-center justify-between w-full px-5 py-5 sm:px-7 sm:py-6 bg-white dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[1.25rem] border border-slate-100 dark:border-red-900/30 hover:border-red-200 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-red-500/10 shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-100 transition-colors">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </div>
                                            <span className="text-[17px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors">Musnahkan Keanggotaan</span>
                                        </div>
                                        <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-red-500 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* VIEW: PENGATURAN -> GANTI SANDI FORM */}
                        {activeTab === "pengaturan_sandi" && (
                            <div className="animate-in slide-in-from-right-8 fade-in duration-500 relative z-10 mt-2">
                                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl border-t border-b sm:border sm:rounded-[2.5rem] rounded-2xl shadow-sm dark:shadow-none border-slate-100 dark:border-slate-700/50 overflow-hidden transition-all duration-300 relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
                                    <div className="p-0 relative z-10">
                                        {passwordMessage.text && (
                                            <div className={`m-6 p-4 rounded-xl flex items-center text-sm ${passwordMessage.type === 'success' ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/50' : 'bg-red-50/80 text-red-600 border border-red-200/50'}`}>
                                                <p className="font-semibold">{passwordMessage.text}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handleUpdatePassword} className="divide-y divide-slate-100/60 dark:divide-slate-700/40">
                                            {/* Sandi Lama Mendatar */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 md:px-10 py-8 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                <div className="pt-2">
                                                    <label className="block text-[15px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">Sandi Saat Ini</label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="password"
                                                        required
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-700 text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-[#00a82d]/20 focus:border-[#00a82d] block w-full max-w-sm px-4 py-3 outline-none transition-all`}
                                                        value={oldPassword}
                                                        onChange={(e) => setOldPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Sandi Baru Mendatar */}
                                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 md:px-10 py-8 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors border-b border-transparent">
                                                <div className="pt-2">
                                                    <label className="block text-[15px] font-bold text-slate-800 dark:text-slate-200 tracking-tight">Sandi Baru</label>
                                                </div>
                                                <div className="space-y-4">
                                                    <input
                                                        type="password"
                                                        required
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-700 text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-[#00a82d]/20 focus:border-[#00a82d] block w-full max-w-sm px-4 py-3 outline-none transition-all`}
                                                        placeholder="Ketik rahasia baru..."
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                    <input
                                                        type="password"
                                                        required
                                                        className={`appearance-none bg-white border border-slate-200 text-slate-700 text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-[#00a82d]/20 focus:border-[#00a82d] block w-full max-w-sm px-4 py-3 outline-none transition-all`}
                                                        placeholder="Ulangi sekali lagi..."
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="px-6 md:px-10 py-6 mb-2 flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={loadingPassword}
                                                    className={`px-8 py-3.5 text-[15px] font-bold text-white rounded-xl transition-all shadow-sm disabled:opacity-50 bg-[#00a82d] hover:bg-green-700 active:scale-[0.98] outline-none whitespace-nowrap`}
                                                >
                                                    {loadingPassword ? "Memvalidasi..." : "Terapkan Keamanan"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW: PENGATURAN -> HAPUS AKUN FORM */}
                        {activeTab === "pengaturan_hapus" && (
                            <div className="animate-in slide-in-from-right-8 fade-in duration-500 relative z-10 mt-2">
                                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl border-t border-b sm:border sm:rounded-[2.5rem] rounded-2xl shadow-sm dark:shadow-none border-red-50 dark:border-red-900/30 overflow-hidden transition-all duration-300 relative">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-bl-full pointer-events-none blur-3xl"></div>
                                    <div className="px-6 md:px-10 py-7 border-b border-red-50/50 dark:border-red-900/20 flex flex-col sm:flex-row sm:items-center gap-5 transition-colors relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 shadow-inner border border-transparent dark:border-red-800/50">
                                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">Pemusnahan Permanen</h3>
                                            <p className="text-[15px] font-medium text-red-500/80 dark:text-red-500 mt-1">Tindakan ini menghapus akses Anda seutuhnya dari ekosistem.</p>
                                        </div>
                                    </div>

                                    <div className="p-0 relative z-10">
                                        {deleteMessage.text && (
                                            <div className={`m-6 p-4 rounded-xl flex items-center text-sm ${deleteMessage.type === 'success' ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/50' : 'bg-red-50/80 text-red-600 border border-red-200/50'}`}>
                                                <p className="font-semibold">{deleteMessage.text}</p>
                                            </div>
                                        )}

                                        <div className="px-6 md:px-10 py-8">
                                            <p className="text-[15px] text-slate-600 dark:text-slate-400 font-medium mb-6 leading-relaxed flex flex-col gap-2">
                                                <span>Jika Anda memilih menghapus akun, seluruh data yang melampirkan identitas Anda: profil, gambar wajah, beserta laporan kejadian yang pernah Anda rekam, akan dibumi-hanguskan selamanya dari pangkalan pusat.</span>
                                                <span className="font-bold text-red-600 dark:text-red-400 uppercase tracking-widest text-xs mt-1">Pertimbangkan hal ini sebaik-baiknya.</span>
                                            </p>

                                            {!showDeleteConfirm ? (
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="px-6 py-4 text-[15px] font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 dark:bg-red-900/20 dark:border-red-900/30 dark:hover:bg-red-900/40 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 w-full sm:w-auto focus:ring-4 focus:ring-red-500/15"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    Hapus Akun Sipentar
                                                </button>
                                            ) : (
                                                <form onSubmit={handleDeleteAccount} className="bg-red-50/30 dark:bg-red-900/10 p-6 md:p-8 rounded-[1.5rem] border border-red-100 dark:border-red-900/30 space-y-6 animate-in fade-in transition-colors">
                                                    <div>
                                                        <label className="block text-[16px] font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">
                                                            Konfirmasi Penghapusan
                                                        </label>
                                                        <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-5 font-medium leading-relaxed">Buktikan keabsahan ini dengan menginput kata sandi akun Anda.</p>
                                                        <input
                                                            type="password"
                                                            required
                                                            placeholder="Sandi Anda..."
                                                            value={deletePassword}
                                                            onChange={(e) => setDeletePassword(e.target.value)}
                                                            className="w-full max-w-md px-4 py-3.5 bg-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-slate-800 dark:text-white font-medium shadow-sm"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="w-full sm:w-auto px-6 py-3.5 text-[15px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={loadingDelete}
                                                            className="w-full sm:w-auto px-7 py-3.5 text-[15px] font-bold text-white transition-all shadow-sm disabled:opacity-50 bg-red-600 hover:bg-red-700 active:scale-[0.98] outline-none rounded-xl"
                                                        >
                                                            {loadingDelete ? "Sedang Mengunci..." : "Yakin, Hancurkan!"}
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
