import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { compressImageToBase64 } from "../utils/imageUtils";
import villageBg from '../assets/village-bg.png';

function Profile() {
    const [user, setUser] = useState({ name: "", role: "", email: "", nik: "" });
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

    const handleUpdateProfileInfo = async (e) => {
        e.preventDefault();
        setProfileMessage({ type: "", text: "" });

        setLoadingProfile(true);
        try {
            let base64Image = null;
            if (selectedImage && !removePhoto) {
                base64Image = await compressImageToBase64(selectedImage, 800, 800, 0.7);
            }

            const payload = {
                newEmail: newEmail,
                jenis_kelamin: jenisKelamin,
                no_hp: noHp,
                remove_photo: removePhoto,
                foto_profil: base64Image
            };

            const res = await api.put("/auth/profile/info", payload);

            setProfileMessage({ type: "success", text: res.data.message });
            setIsEditingProfile(false);
            fetchProfile(); // Segarkan pasca simpan
        } catch (err) {
            setProfileMessage({ type: "error", text: err.response?.data?.message || "Terjadi kesalahan sistem saat memperbarui profil." });
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
            if (isEditingProfile) setIsEditingProfile(false);
            else handleTabChange('ringkasan');
        } else if (activeTab === 'pengaturan_akun') {
            handleTabChange('pengaturan');
        } else if (activeTab === 'pengaturan_sandi' || activeTab === 'pengaturan_hapus') {
            handleTabChange('pengaturan_akun');
        } else {
            handleTabChange('ringkasan');
        }
    };

    const isUser = user.role === "user";

    // Theme configurations
    const themeParams = {
        primaryColor: isUser ? "emerald" : "amber",
        gradientStart: isUser ? "from-emerald-500" : "from-amber-500",
        gradientEnd: isUser ? "to-teal-600" : "to-orange-600",
        textGlow: isUser ? "text-emerald-400" : "text-amber-400",
        ringColor: isUser ? "focus:ring-emerald-500/30" : "focus:ring-amber-500/30",
        borderColor: isUser ? "focus:border-emerald-400" : "focus:border-amber-400",
        bgOverlay: isUser ? "bg-emerald-950/70" : "bg-orange-950/80",
        hoverBg: isUser ? "hover:bg-emerald-500/10" : "hover:bg-amber-500/10",
        hoverBorder: isUser ? "hover:border-emerald-400/40" : "hover:border-amber-400/40"
    };

    return (
        <div className={`min-h-screen relative font-sans selection:bg-${themeParams.primaryColor}-200 transition-colors duration-500 pb-16`}>

            {/* Background Image & Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[30s] ease-in-out scale-105"
                    style={{ backgroundImage: `url(${villageBg})` }}
                />
                {/* Dynamic Role-Based Multiplier Layer */}
                <div className={`absolute inset-0 transition-colors duration-1000 mix-blend-multiply ${themeParams.bgOverlay}`} />
                {/* Vignette Gradient Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-village-dark-900/90 via-village-dark-900/40 to-village-dark-900/60" />
                {/* Diffused Blur Layer for premium feel */}
                <div className="absolute inset-0 backdrop-blur-[6px]" />
            </div>

            <div className="relative z-10">
                {/* Header Premium Glassmorphism */}
                <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBackNavigation}
                                className="p-2 text-white hover:bg-white/10 rounded-full transition-all focus:outline-none flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                            </button>

                            <div className={`flex items-center gap-3 w-full transition-colors ${activeTab === 'ringkasan' ? 'pl-2 border-l border-white/20' : ''}`}>
                                {activeTab === 'ringkasan' ? (
                                    <>
                                        {userPhotoUrl ? (
                                            <img src={userPhotoUrl} alt="Profil Atas" className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-sm" />
                                        ) : (
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-inner bg-gradient-to-br ${themeParams.gradientStart} ${themeParams.gradientEnd}`}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h1 className="text-base font-bold text-white tracking-tight leading-none drop-shadow-md">{user.name}</h1>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className={`text-[10px] font-black ${themeParams.textGlow} uppercase tracking-wider drop-shadow-sm`}>{isUser ? 'Warga' : 'Admin'}</span>
                                                <span className="text-[10px] font-medium text-white/50">&bull;&nbsp; {isUser ? `NIK: ${user.nik}` : 'Sipentar Sistem'}</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <h1 className="font-outfit text-[17px] font-bold text-white tracking-wide drop-shadow-md border-l border-white/20 pl-4">
                                        {activeTab === 'profil' ? (isEditingProfile ? 'Ubah Profil' : 'Profil') :
                                            activeTab === 'pengaturan' ? 'Pengaturan' :
                                                activeTab === 'pengaturan_akun' ? 'Akun' :
                                                    activeTab === 'pengaturan_sandi' ? 'Mengubah Sandi' :
                                                        activeTab === 'pengaturan_hapus' ? 'Hapus Akun' : ''}
                                    </h1>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 ${isEditingProfile ? 'mt-4' : 'mt-8'}`}>
                    <div className="flex flex-col items-center w-full">

                        {/* VIEW: MENU NAVIGASI GRID (DEFAULT "Ringkasan") */}
                        {activeTab === "ringkasan" && (
                            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                                {/* Profil Card Glassmorphism */}
                                <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-10 flex flex-col items-center justify-center text-center transition-all duration-500 mb-10 relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
                                    {/* Decorative Orbs */}
                                    <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-${themeParams.primaryColor}-500/20 rounded-full blur-[60px] group-hover:scale-110 transition-all duration-700 pointer-events-none`}></div>
                                    <div className={`absolute bottom-0 left-0 -mb-10 -ml-10 w-56 h-56 bg-${isUser ? 'teal' : 'orange'}-500/20 rounded-full blur-[60px] group-hover:scale-110 transition-all duration-700 pointer-events-none`}></div>

                                    <div className="w-32 h-32 mb-6 relative z-10 transition-transform duration-500 group-hover:scale-105">
                                        <div className={`absolute inset-0 bg-${themeParams.primaryColor}-500/30 rounded-full blur-2xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                                        {userPhotoUrl ? (
                                            <img src={userPhotoUrl} alt="Profil Atas" className="w-full h-full rounded-full object-cover border-[4px] border-white/20 shadow-2xl relative z-10" />
                                        ) : (
                                            <div className={`w-full h-full rounded-full flex items-center justify-center text-5xl font-black text-white shadow-2xl border-[4px] border-white/20 bg-gradient-to-br ${themeParams.gradientStart} ${themeParams.gradientEnd} relative z-10`}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-outfit text-3xl md:text-4xl font-extrabold text-white mb-3 relative z-10 tracking-tight drop-shadow-lg">Halo, <span className={`${themeParams.textGlow}`}>{user.name || "Kawan"}</span>!</h3>
                                    <p className="text-white/70 max-w-lg leading-relaxed relative z-10 text-base md:text-lg font-medium">
                                        Pusat Identitas Sipentar. Kelola kemewahan dan privasi masa depan Anda dengan cerdas dan eksklusif.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
                                    {/* Kelola Profil Button */}
                                    <button
                                        onClick={() => { handleTabChange("profil"); setProfileMessage({ type: '', text: '' }); }}
                                        className={`group flex items-center justify-between w-full px-6 py-5 bg-white/5 backdrop-blur-xl rounded-[1.5rem] border border-white/10 ${themeParams.hoverBorder} ${themeParams.hoverBg} shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 ${themeParams.ringColor}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-${themeParams.primaryColor}-400/40 shadow-inner`}>
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                            <span className={`text-[17px] font-bold text-white group-hover:${themeParams.textGlow} transition-colors drop-shadow-sm`}>Kelola Identitas Profil</span>
                                        </div>
                                        <svg className={`w-5 h-5 text-white/50 group-hover:translate-x-1 group-hover:${themeParams.textGlow} transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>

                                    {/* Pengaturan Button */}
                                    <button
                                        onClick={() => { handleTabChange("pengaturan"); setPasswordMessage({ type: '', text: '' }); setDeleteMessage({ type: '', text: '' }); }}
                                        className={`group flex items-center justify-between w-full px-6 py-5 bg-white/5 backdrop-blur-xl rounded-[1.5rem] border border-white/10 hover:border-indigo-400/40 hover:bg-indigo-500/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-indigo-400/40 shadow-inner">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <span className="text-[17px] font-bold text-white group-hover:text-indigo-300 transition-colors drop-shadow-sm">Keamanan & Privasi</span>
                                        </div>
                                        <svg className="w-5 h-5 text-white/50 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* VIEW: AREA KONTEN PENUH */}
                        <div className={`w-full max-w-2xl mx-auto ${activeTab === 'ringkasan' ? 'hidden' : 'block'}`}>

                            {/* VIEW: KELOLA PROFIL (Dual-Mode: Read vs Edit) */}
                            {activeTab === "profil" && (
                                <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-500 transition-all relative">
                                    <div className={`absolute top-0 right-0 w-64 h-64 bg-${themeParams.primaryColor}-500/10 rounded-full blur-[60px] pointer-events-none`}></div>

                                    {isEditingProfile && (
                                        <div className="px-6 md:px-10 py-7 border-b border-white/10 relative z-10 bg-white/5 shadow-inner">
                                            <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Ubah Profil</h3>
                                            <p className="text-sm font-medium text-white/70 mt-1.5">Mutakhirkan informasi identitas resmi Anda.</p>
                                        </div>
                                    )}

                                    <div className="p-0 relative z-10">
                                        {profileMessage.text && (
                                            <div className={`m-6 p-4 rounded-xl flex items-center text-sm shadow-lg border backdrop-blur-md ${profileMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' : 'bg-red-500/20 text-red-100 border-red-500/30'}`}>
                                                <p className="font-bold">{profileMessage.text}</p>
                                            </div>
                                        )}

                                        {!isEditingProfile ? (
                                            /* ================= READ MODE ================= */
                                            <div className="flex flex-col animate-in fade-in duration-500 pt-8">
                                                <div className="flex flex-col items-center justify-center pb-8 px-6 text-center">
                                                    <div className="w-28 h-28 mb-5 relative group cursor-default">
                                                        <div className={`absolute inset-0 bg-${themeParams.primaryColor}-500/30 rounded-full blur-2xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                                                        {userPhotoUrl ? (
                                                            <img src={userPhotoUrl} alt="Profil" className="w-[105px] h-[105px] rounded-full object-cover border-[3px] border-white/30 shadow-2xl relative z-10" />
                                                        ) : (
                                                            <div className={`w-[105px] h-[105px] rounded-full flex items-center justify-center text-[40px] font-black text-white shadow-2xl border-[3px] border-white/30 bg-gradient-to-br ${themeParams.gradientStart} ${themeParams.gradientEnd} relative z-10`}>
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h2 className="text-xl font-black tracking-widest uppercase text-white mb-2 drop-shadow-lg">{user.name}</h2>
                                                    <p className={`text-sm font-bold ${themeParams.textGlow} tracking-widest mb-1.5 uppercase drop-shadow-sm`}>{isUser ? 'Warga Masyarakat' : 'Panel Administrator'}</p>
                                                    <p className="text-xs font-medium text-white/50 tracking-wide mb-4">{isUser ? 'Pelapor Terdaftar' : 'Sistem Kontrol'}</p>
                                                    <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 text-white shadow-inner border border-white/10 tracking-widest text-[10px] font-bold">
                                                        TERVERIFIKASI
                                                    </div>
                                                </div>

                                                <div className="px-6 md:px-10 pb-10 space-y-4">
                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 shadow-inner flex align-middle justify-between hover:bg-white/10 transition-colors">
                                                        <div>
                                                            <span className="block text-xs font-bold text-white/50 tracking-wider uppercase mb-1">Email / Surel</span>
                                                            <span className="block text-[15px] font-bold text-white drop-shadow-sm">{user.email}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 shadow-inner flex align-middle justify-between hover:bg-white/10 transition-colors">
                                                        <div>
                                                            <span className="block text-xs font-bold text-white/50 tracking-wider uppercase mb-1">Jenis Kelamin</span>
                                                            <span className="block text-[15px] font-bold text-white drop-shadow-sm">{jenisKelamin || "Belum diatur"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 shadow-inner flex align-middle justify-between hover:bg-white/10 transition-colors">
                                                        <div>
                                                            <span className="block text-xs font-bold text-white/50 tracking-wider uppercase mb-1">Nomor Handphone</span>
                                                            <span className="block text-[15px] font-bold text-white drop-shadow-sm">{noHp ? `+62 ${noHp.replace(/^\+?62/, '')}` : "Belum diatur"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-6">
                                                        <button
                                                            onClick={() => setIsEditingProfile(true)}
                                                            className={`w-full bg-gradient-to-r ${themeParams.gradientStart} ${themeParams.gradientEnd} hover:opacity-90 text-white font-black uppercase tracking-widest text-sm py-4 px-4 rounded-2xl shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 active:scale-[0.98] border border-white/20`}
                                                        >
                                                            Ubah Data Profil
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ================= EDIT MODE ================= */
                                            <form onSubmit={handleUpdateProfileInfo} className="px-5 md:px-10 py-6 md:py-8 animate-in fade-in slide-in-from-top-2 duration-500 relative z-10 flex flex-col gap-6 w-full">
                                                <div className="flex flex-col items-center justify-center mb-4 relative z-10 pt-2">
                                                    <div className="relative group/photo">
                                                        <div className={`absolute inset-0 bg-${themeParams.primaryColor}-500/30 rounded-full blur-xl scale-110 opacity-0 group-hover/photo:opacity-100 transition-opacity`}></div>
                                                        {(!removePhoto && (imagePreview || userPhotoUrl)) ? (
                                                            <img src={imagePreview || userPhotoUrl} alt="Preview" className="w-[105px] h-[105px] rounded-full object-cover border-[3px] border-white/40 shadow-xl relative z-10" />
                                                        ) : (
                                                            <div className={`w-[105px] h-[105px] rounded-full flex items-center justify-center text-[40px] font-black text-white bg-gradient-to-br ${themeParams.gradientStart} ${themeParams.gradientEnd} shadow-xl border-[3px] border-white/40 relative z-10`}>
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}

                                                        {(!removePhoto && (imagePreview || userPhotoUrl)) && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); setRemovePhoto(true); setImagePreview(null); setSelectedImage(null); }}
                                                                className="absolute top-0 -right-2 w-8 h-8 bg-rose-500/80 backdrop-blur-md border border-white/30 shadow-[0_0_15px_rgba(244,63,94,0.6)] rounded-full flex items-center justify-center cursor-pointer hover:bg-rose-600 transition-all z-30 hover:scale-110"
                                                                title="Hapus Foto Profil"
                                                            >
                                                                <svg className="w-[16px] h-[16px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        )}

                                                        <label className="absolute bottom-0 -right-2 w-9 h-9 bg-white/20 backdrop-blur-md border border-white/40 shadow-lg rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors z-20 hover:scale-110">
                                                            <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 8V6a2 2 0 012-2h1.5l1.65-2h5.7l1.65 2H18a2 2 0 012 2v2M4 8h16M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8m-9 9a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="block text-xs font-bold text-white/70 uppercase tracking-widest pl-1 mb-2">Nama Lengkap</label>
                                                        <input
                                                            type="text"
                                                            className="appearance-none bg-white/5 border border-white/10 text-white/50 text-[15px] font-medium rounded-2xl block w-full px-5 py-4 cursor-not-allowed shadow-inner"
                                                            value={user.name}
                                                            readOnly
                                                            disabled
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-white/70 uppercase tracking-widest pl-1 mb-2">Email</label>
                                                        <input
                                                            type="email"
                                                            required
                                                            className={`appearance-none bg-white/5 border border-white/20 text-white text-[15px] font-medium rounded-2xl focus:bg-white/10 focus:ring-4 ${themeParams.ringColor} ${themeParams.borderColor} block w-full px-5 py-4 outline-none transition-all shadow-inner`}
                                                            value={newEmail}
                                                            onChange={(e) => setNewEmail(e.target.value)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-white/70 uppercase tracking-widest pl-1 mb-2">Jenis Kelamin</label>
                                                        <select
                                                            className={`appearance-none bg-black/20 border border-white/20 text-white text-[15px] font-medium rounded-2xl focus:ring-4 ${themeParams.ringColor} ${themeParams.borderColor} block w-full px-5 py-4 outline-none transition-all cursor-pointer backdrop-blur-md`}
                                                            value={jenisKelamin}
                                                            onChange={(e) => setJenisKelamin(e.target.value)}
                                                        >
                                                            <option value="" className="text-slate-900">-- Pilih --</option>
                                                            <option value="Laki-laki" className="text-slate-900">Laki-laki</option>
                                                            <option value="Perempuan" className="text-slate-900">Perempuan</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold text-white/70 uppercase tracking-widest pl-1 mb-2">Nomor Handphone</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-[15px] font-bold text-white/50 pointer-events-none">+62</div>
                                                            <input
                                                                type="tel"
                                                                className={`appearance-none bg-white/5 border border-white/20 text-white text-[15px] font-medium rounded-2xl focus:bg-white/10 focus:ring-4 ${themeParams.ringColor} ${themeParams.borderColor} block w-full pl-14 pr-5 py-4 outline-none transition-all shadow-inner`}
                                                                value={noHp.replace(/^\+?62/, '')}
                                                                placeholder="000 0000 0000 0000"
                                                                onChange={(e) => setNoHp(e.target.value)}
                                                                maxLength={15}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={loadingProfile}
                                                        className={`w-full py-4 text-sm font-black text-white uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 bg-gradient-to-r ${themeParams.gradientStart} ${themeParams.gradientEnd} hover:opacity-90 active:scale-[0.98] border border-white/20 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center`}
                                                    >
                                                        {loadingProfile ? "Memproses..." : "Simpan Pembaruan"}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* VIEW: PENGATURAN (MAIN MENU) */}
                            {activeTab === "pengaturan" && (
                                <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-4 sm:p-6 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-500">
                                    <button
                                        onClick={() => handleTabChange("pengaturan_akun")}
                                        className={`group flex items-center justify-between w-full px-6 py-6 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10 ${themeParams.hoverBorder} ${themeParams.hoverBg} transition-all duration-300 text-left focus:outline-none focus:ring-4 ${themeParams.ringColor} shadow-inner`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform shadow-sm">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                            <span className={`text-[17px] font-bold text-white group-hover:${themeParams.textGlow} transition-colors tracking-tight drop-shadow-sm`}>Manajemen Sandi & Akun</span>
                                        </div>
                                        <svg className={`w-5 h-5 text-white/50 group-hover:translate-x-1 group-hover:${themeParams.textGlow} transition-all duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}

                            {/* VIEW: PENGATURAN -> AKUN */}
                            {activeTab === "pengaturan_akun" && (
                                <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-4 sm:p-6 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-500 space-y-4">
                                    <button
                                        onClick={() => handleTabChange("pengaturan_sandi")}
                                        className="group flex items-center justify-between w-full px-6 py-6 bg-white/5 hover:bg-orange-500/10 backdrop-blur-md rounded-[1.5rem] border border-white/10 hover:border-orange-400/40 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-orange-500/30 shadow-inner"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                            </div>
                                            <span className="text-[17px] font-bold text-white group-hover:text-orange-400 transition-colors drop-shadow-sm">Ubah Kunci Akses</span>
                                        </div>
                                        <svg className="w-5 h-5 text-white/50 group-hover:translate-x-1 group-hover:text-orange-400 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>

                                    <button
                                        onClick={() => handleTabChange("pengaturan_hapus")}
                                        className="group flex items-center justify-between w-full px-6 py-6 bg-white/5 hover:bg-rose-500/10 backdrop-blur-md rounded-[1.5rem] border border-white/10 hover:border-rose-400/40 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-rose-500/30 shadow-inner"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </div>
                                            <span className="text-[17px] font-bold text-white group-hover:text-rose-400 transition-colors drop-shadow-sm">Pemutusan Ekosistem Definitif</span>
                                        </div>
                                        <svg className="w-5 h-5 text-white/50 group-hover:translate-x-1 group-hover:text-rose-400 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}

                            {/* VIEW: GANTI SANDI FORM */}
                            {activeTab === "pengaturan_sandi" && (
                                <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-500 relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                                    <div className="px-6 md:px-10 py-7 border-b border-white/10 bg-white/5">
                                        <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Keamanan Lanjut</h3>
                                        <p className="text-sm font-medium text-white/70 mt-1.5">Ubah kunci kriptografik akses harian Anda.</p>
                                    </div>
                                    <div className="p-0 relative z-10">
                                        {passwordMessage.text && (
                                            <div className={`m-6 p-4 rounded-xl flex items-center text-sm border backdrop-blur-md ${passwordMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' : 'bg-red-500/20 text-red-100 border-red-500/30'}`}>
                                                <p className="font-bold">{passwordMessage.text}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handleUpdatePassword} className="p-6 md:p-10 space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold text-white/70 uppercase tracking-widest pl-1 mb-2">Sandi Identifikasi Saat Ini</label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="appearance-none bg-white/5 border border-white/20 text-white text-[15px] font-medium rounded-2xl focus:bg-white/10 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 block w-full px-5 py-4 outline-none transition-all shadow-inner placeholder-white/40"
                                                    placeholder="Sandi saat ini..."
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                                                <div>
                                                    <label className="block text-xs font-bold text-orange-200 uppercase tracking-widest pl-1 mb-2">Sandi Baru</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        className="appearance-none bg-orange-950/20 border border-orange-500/30 text-white text-[15px] font-medium rounded-2xl focus:bg-orange-950/40 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 block w-full px-5 py-4 outline-none transition-all shadow-inner placeholder-orange-200/40"
                                                        placeholder="Sandi rahasia baru..."
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-orange-200 uppercase tracking-widest pl-1 mb-2">Konfirmasi Sandi Baru</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        className="appearance-none bg-orange-950/20 border border-orange-500/30 text-white text-[15px] font-medium rounded-2xl focus:bg-orange-950/40 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-400 block w-full px-5 py-4 outline-none transition-all shadow-inner placeholder-orange-200/40"
                                                        placeholder="Ulangi sekali lagi..."
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button
                                                    type="submit"
                                                    disabled={loadingPassword}
                                                    className="w-full py-4 text-sm font-black text-white uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 active:scale-[0.98] border border-orange-400/30 shadow-[0_10px_20px_-10px_rgba(249,115,22,0.6)] flex items-center justify-center"
                                                >
                                                    {loadingPassword ? "Memvalidasi Algoritma..." : "Enkripsi Parameter Baru"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* VIEW: HAPUS AKUN FORM */}
                            {activeTab === "pengaturan_hapus" && (
                                <div className="bg-rose-950/40 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(244,63,94,0.3)] border border-rose-500/30 overflow-hidden animate-in slide-in-from-right-8 fade-in duration-500 relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                                    <div className="px-6 md:px-10 py-7 border-b border-rose-500/20 bg-rose-950/20 flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-400/30 flex items-center justify-center shadow-inner shrink-0">
                                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Protokol Kehancuran</h3>
                                            <p className="text-sm font-medium text-rose-200 mt-1.5">Pemusnahan absolut identitas digital Anda.</p>
                                        </div>
                                    </div>

                                    <div className="p-0 relative z-10">
                                        {deleteMessage.text && (
                                            <div className="m-6 p-4 rounded-xl flex items-center text-sm border backdrop-blur-md bg-red-500/20 text-red-100 border-red-500/30">
                                                <p className="font-bold">{deleteMessage.text}</p>
                                            </div>
                                        )}

                                        <div className="px-6 md:px-10 py-8">
                                            <div className="bg-black/20 p-5 rounded-2xl border border-rose-500/20 mb-8 border-l-4 border-l-rose-500 shadow-inner">
                                                <p className="text-[14px] text-white/80 font-medium leading-relaxed">
                                                    Jika Anda mengeksekusi ini, sekumpulan data krusial—sertifikat identitas, rekam wajah, & log pelaporan—akan dihanguskan secara permanen dari server utama tanpa peluang restorasi.
                                                </p>
                                                <p className="font-black text-rose-400 uppercase tracking-widest text-[10px] mt-4">Kesalahan Konsekuensi Menjadi Tanggung Jawab Pribadi.</p>
                                            </div>

                                            {!showDeleteConfirm ? (
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="w-full py-4 text-sm font-black text-white uppercase tracking-widest rounded-2xl transition-all bg-rose-600/20 hover:bg-rose-600 hover:shadow-[0_0_25px_rgba(244,63,94,0.6)] border border-rose-500 flex items-center justify-center gap-3 backdrop-blur-md"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    Setujui Pemusnahan Akun
                                                </button>
                                            ) : (
                                                <form onSubmit={handleDeleteAccount} className="bg-rose-950/50 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-rose-500/40 space-y-6 animate-in fade-in shadow-inner">
                                                    <div>
                                                        <label className="block text-[15px] font-black tracking-widest uppercase text-white mb-2">
                                                            Konfirmasi Definitif
                                                        </label>
                                                        <p className="text-xs text-rose-200 mb-5 font-medium leading-relaxed">Buktikan validitas otoritas Anda dengan mengisi kunci kriptografik sandi Anda.</p>
                                                        <input
                                                            type="password"
                                                            required
                                                            placeholder="Kata sandi validasi..."
                                                            value={deletePassword}
                                                            onChange={(e) => setDeletePassword(e.target.value)}
                                                            className="w-full px-5 py-4 bg-black/30 border border-rose-500/30 rounded-xl focus:ring-4 focus:ring-rose-500/30 focus:border-rose-400 outline-none transition-all text-white font-medium shadow-inner placeholder-white/30"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeleteConfirm(false)}
                                                            className="w-full sm:w-auto px-8 py-4 text-sm font-black uppercase tracking-widest text-white bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl transition-all shadow-sm active:scale-[0.98]"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={loadingDelete}
                                                            className="w-full sm:w-auto px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all shadow-[0_10px_20px_-5px_rgba(244,63,94,0.6)] disabled:opacity-50 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] outline-none rounded-xl"
                                                        >
                                                            {loadingDelete ? "Menghapus..." : "Eksekusi Destruksi"}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
