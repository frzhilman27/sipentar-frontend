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

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR DESKTOP - Clean Enterprise Panel */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 z-20 shrink-0">
        
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 shrink-0">
          <img src="/logosipentar.png" alt="Logo Sipentar" className="w-8 h-8 rounded-md object-cover border border-slate-200" />
          <div>
            <h1 className="font-outfit text-lg font-black text-slate-900 tracking-tight leading-none">SIPENTAR<span className="text-sipentar-blue">.</span></h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2 px-3">Modul Sistem</div>
          {menuItems.map((item) => {
            const isActive = activeMainTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMainTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors relative group ${
                  isActive 
                    ? 'bg-sipentar-blue-50 text-sipentar-blue-dark font-bold' 
                    : 'text-slate-600 hover:bg-slate-100 font-medium'
                }`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-1 rounded-r-full bg-sipentar-blue"></div>}
                <svg className={`w-5 h-5 ${isActive ? 'text-sipentar-blue' : 'text-slate-400 group-hover:text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2.5" : "2"} d={item.icon} />
                </svg>
                <span className="text-sm tracking-wide">{item.label}</span>
                
                {item.badge > 0 && (
                  <span className={`ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${isActive ? 'bg-sipentar-blue text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2">
            {userProfileData?.foto_profil ? (
              <img
                src={
                  (userProfileData.foto_profil.startsWith('data:image') || userProfileData.foto_profil.startsWith('http'))
                    ? userProfileData.foto_profil
                    : `${BASE_URL}${userProfileData.foto_profil.startsWith('/') ? '' : '/'}${userProfileData.foto_profil}`
                }
                alt="Profil"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-900 leading-tight">{name || "Pengguna"}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-slate-600 hover:text-red-700 font-bold text-sm hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 group"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        
        {/* HEADER TOP - Clean */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 shrink-0">
          
          {/* Mobile Logo Only */}
          <div className="md:hidden flex items-center gap-3">
            <img src="/logosipentar.png" alt="Logo Sipentar" className="w-8 h-8 rounded-md object-cover border border-slate-200" />
            <h1 className="font-outfit text-lg font-black text-slate-900 tracking-tight leading-none">SIPENTAR.</h1>
          </div>

          {/* Desktop Title Context */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
             <span>Sistem Informasi Desa</span>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             <span className="text-slate-900 font-bold">{menuItems.find(m => m.id === activeMainTab)?.label || 'Dashboard'}</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Search Placeholder (Visual only for now) */}
            <div className="hidden md:flex relative">
              <input type="text" placeholder="Cari ID laporan..." className="w-64 pl-9 pr-4 py-1.5 text-sm bg-slate-100 border-transparent rounded-md focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-sipentar-blue-100 transition-all outline-none" />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Notifikasi</h3>
                    {unreadCount > 0 && <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-sipentar-blue">{unreadCount} Baru</span>}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 flex flex-col items-center text-center">
                        <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kosong</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                          <li key={notif.id} onClick={() => handleNotificationClick(notif)} className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-sipentar-blue-50/30' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-sipentar-blue' : 'bg-transparent'}`}></div>
                              <div>
                                <p className={`text-sm ${!notif.is_read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{notif.message}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">
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

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto relative p-4 md:p-6 pb-24 md:pb-6 scroll-smooth bg-slate-50">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>

      {/* BOTTOM NAVIGATION MOBILE - Simple Bar Design */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200">
        <div className="flex justify-around items-center h-16 pb-safe">
          {menuItems.map((item) => {
            const isActive = activeMainTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveMainTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-sipentar-blue' : 'text-slate-500'}`}
              >
                <div className="relative p-1">
                  <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "0" : "2"} d={item.icon} />
                  </svg>
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;
