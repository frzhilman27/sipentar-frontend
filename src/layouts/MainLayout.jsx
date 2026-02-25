import { Outlet, Link, useNavigate } from "react-router-dom";

function MainLayout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ===== NAVBAR ===== */}
      <nav className="bg-black border-b border-gray-800 px-10 py-4 flex justify-between items-center shadow-lg">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide text-blue-500">
          SIPENTAR
        </h1>

        {/* Menu */}
        <div className="flex items-center space-x-8 text-sm font-medium">

          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>

          {!token && (
            <Link to="/login" className="hover:text-blue-400 transition">
              Login
            </Link>
          )}

          {role === "admin" && (
            <Link to="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>
          )}

          {role === "warga" && (
            <Link to="/laporan" className="hover:text-blue-400 transition">
              Buat Laporan
            </Link>
          )}

          {token && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          )}

        </div>
      </nav>

      {/* ===== CONTENT ===== */}
      <main className="p-10">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-800 text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} SIPENTAR - Sistem Pengaduan Terpadu
      </footer>

    </div>
  );
}

export default MainLayout;