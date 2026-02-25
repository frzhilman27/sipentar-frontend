import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Sistem Pengaduan Terpadu</h1>
      <p>Platform digital untuk laporan masyarakat</p>

      <Link to="/login">
        <button style={{ padding: "10px 20px" }}>
          Login Admin
        </button>
      </Link>
    </div>
  );
}

export default Home;