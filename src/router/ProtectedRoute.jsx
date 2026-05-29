import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && role !== roleRequired) {
    if (role === "admin" && roleRequired === "user") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-lg p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Akses Ditolak</h2>
            <p className="text-sm text-slate-600 mb-6">
              Anda menggunakan akun Administrator. Silakan gunakan Portal Admin yang terpisah, bukan Portal Warga.
            </p>
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="w-full py-3 bg-sipentar-blue text-white font-bold rounded-xl hover:bg-sipentar-blue-dark transition-colors"
            >
              Kembali ke Login Warga
            </button>
          </div>
        </div>
      );
    }
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
