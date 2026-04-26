import React, { useEffect, useRef } from 'react';

const DashboardLayout = ({
  children,
  role,
  name,
  userProfileData,
  activeMainTab,
  setActiveMainTab,
  unreadCount,
  showNotifications,
  toggleNotifications,
  notifications,
  handleNotificationClick,
  logout,
  pendingReportsCount
}) => {
  const notifRef = useRef(null);
  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/api\/?$/, "");

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        if (showNotifications) toggleNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, toggleNotifications]);

  const menuItems = role === 'admin' ? [
    { id: 'beranda', label: 'Semua Laporan', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'aduan_masuk', label: 'Laporan Masuk', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', badge: pendingReportsCount },
    { id: 'kelola_warga', label: 'Kelola Warga', icon: 'M17 20h5V4H2v16h5m10 0v-4H7v4m10 0H7m0 0H2m5 0h10M9 8h6v4H9V8z' },
    { id: 'profil', label: 'Profil Akun', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ] : [
    { id: 'beranda', label: 'Semua Laporan', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'histori', label: 'Laporan Saya', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'pengaduan', label: 'Buat Pengaduan', icon: 'M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'profil', label: 'Profil Akun', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const primaryColor = role === 'admin' ? 'amber' : 'emerald';

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white shadow-[2px_0_15px_rgba(0,0,0,0.03)] z-20 shrink-0">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100 shrink-0">
          <img src="/logosipentar.png" alt="Logo Sipentar" className={`w-9 h-9 rounded-xl object-cover shadow-sm border border-${primaryColor}-700/30`} />
          <div>
            <h1 className="font-outfit text-xl font-black text-slate-900 tracking-tight leading-none">Sipentar<span className={`text-${primaryColor}-600`}>.</span></h1>
            <p className={`text-[9px] font-extrabold tracking-[0.15em] uppercase text-${primaryColor}-700 mt-0.5`}>Desa Lamaran Tarung</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeMainTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMainTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                    ? `bg-${primaryColor}-50 text-${primaryColor}-700 font-bold shadow-sm border border-${primaryColor}-100` 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium border border-transparent'
                }`}
              >
                {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${primaryColor}-500`}></div>}
                <svg className={`w-5 h-5 ${isActive ? `text-${primaryColor}-600` : 'text-slate-400 group-hover:text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2.5" : "2"} d={item.icon} />
                </svg>
                <span className="text-sm tracking-wide">{item.label}</span>
                
                {item.badge > 0 && (
                  <span className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white bg-${primaryColor}-500 shadow-sm shadow-${primaryColor}-500/40`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        
        {/* HEADER TOP */}
        <header className="h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shrink-0">
          
          {/* Mobile Logo Only */}
          <div className="md:hidden flex items-center gap-3">
            <img src="/logosipentar.png" alt="Logo Sipentar" className={`w-8 h-8 rounded-lg object-cover shadow-sm border border-${primaryColor}-700/30`} />
            <div>
              <h1 className="font-outfit text-xl font-black text-slate-900 tracking-tight leading-none">Sipentar<span className={`text-${primaryColor}-600`}>.</span></h1>
            </div>
          </div>

          <div className="hidden md:flex flex-col">
             <h2 className="text-lg font-bold text-slate-800 capitalize">{menuItems.find(m => m.id === activeMainTab)?.label || 'Dashboard'}</h2>
             <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 ml-auto">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 border border-slate-200"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white`}></span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="fixed sm:absolute inset-x-4 top-16 sm:inset-auto sm:top-auto sm:right-0 sm:mt-3 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden transform origin-top sm:origin-top-right transition-all z-50">
                  <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifikasi</h3>
                    {unreadCount > 0 && <span className={`text-[9px] font-bold uppercase tracking-widest text-white px-2 py-0.5 rounded-full bg-${primaryColor}-600`}>{unreadCount} Baru</span>}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="px-6 py-8 flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <p className="text-xs font-bold text-slate-600">Terpantau Tenang.</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                          <li key={notif.id} onClick={() => handleNotificationClick(notif)} className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer group ${!notif.is_read ? 'bg-blue-50/20' : ''}`}>
                            <div className="flex gap-2.5">
                              <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? `bg-${primaryColor}-500` : 'bg-slate-300'}`}></div>
                              <div>
                                <p className={`text-[13px] leading-snug ${!notif.is_read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{notif.message}</p>
                                <p className="text-[10px] font-semibold text-slate-400 mt-1">
                                  {new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* User Profile */}
            <div 
              onClick={() => setActiveMainTab("profil")} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{name || "Pengguna"}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest text-${primaryColor}-600`}>{role}</p>
              </div>

              {userProfileData?.foto_profil ? (
                <img
                  src={
                    (userProfileData.foto_profil.startsWith('data:image') || userProfileData.foto_profil.startsWith('http'))
                      ? userProfileData.foto_profil
                      : `${BASE_URL}${userProfileData.foto_profil.startsWith('/') ? '' : '/'}${userProfileData.foto_profil}`
                  }
                  alt="Profil"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 shadow-sm transition-transform group-hover:scale-105 border-${primaryColor}-200`}
                />
              ) : (
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-sm border-2 transition-transform group-hover:scale-105 bg-${primaryColor}-100 text-${primaryColor}-700 border-${primaryColor}-200`}>
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-24 md:pb-6 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* BOTTOM NAVIGATION MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/60 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-40 pb-safe">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const isActive = activeMainTab === item.id;
            const isSpecial = item.id === 'pengaduan' || item.id === 'aduan_masuk';
            
            if (isSpecial) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMainTab(item.id)}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative group"
                >
                  <div className={`absolute -top-6 rounded-full p-3.5 shadow-lg border-4 border-slate-50 transition-transform duration-300 ${isActive ? `bg-${primaryColor}-600 scale-110 shadow-${primaryColor}-500/40 text-white` : `bg-slate-800 text-white hover:scale-105 hover:bg-slate-700`}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                    </svg>
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border-2 border-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide mt-7 ${isActive ? `text-${primaryColor}-700` : 'text-slate-500 group-hover:text-slate-700'}`}>
                    {item.label.split(' ')[0]}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveMainTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-colors ${isActive ? `text-${primaryColor}-600` : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? `bg-${primaryColor}-50` : 'bg-transparent'}`}>
                  <svg className="w-5 h-5" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "0" : "2"} d={item.icon} />
                  </svg>
                </div>
                <span className={`text-[10px] font-bold tracking-wide ${isActive ? `text-${primaryColor}-700` : ''}`}>
                  {item.label.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;
