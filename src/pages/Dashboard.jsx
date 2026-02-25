import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [laporan, setLaporan] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await API.get("/laporan", {
        headers: { Authorization: token },
      });
      setLaporan(res.data);
    } catch (err) {
      console.log(err);
      alert("Gagal mengambil data laporan");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(
        `/laporan/${id}`,
        { status },
        { headers: { Authorization: token } }
      );
      fetchData();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = laporan.length;
  const menunggu = laporan.filter(l => l.status === "menunggu").length;
  const diproses = laporan.filter(l => l.status === "diproses").length;
  const selesai = laporan.filter(l => l.status === "selesai").length;

  return (
    <div>

      {/* ===== HEADER ===== */}
      <h2 className="text-3xl font-bold mb-8">Dashboard Admin</h2>

      {/* ===== STATISTIK ===== */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h4 className="text-gray-400">Total Laporan</h4>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="bg-yellow-600 p-6 rounded-2xl shadow-lg">
          <h4>Menunggu</h4>
          <p className="text-3xl font-bold">{menunggu}</p>
        </div>

        <div className="bg-blue-600 p-6 rounded-2xl shadow-lg">
          <h4>Diproses</h4>
          <p className="text-3xl font-bold">{diproses}</p>
        </div>

        <div className="bg-green-600 p-6 rounded-2xl shadow-lg">
          <h4>Selesai</h4>
          <p className="text-3xl font-bold">{selesai}</p>
        </div>
      </div>

      {/* ===== LIST LAPORAN ===== */}
      <div className="space-y-6">
        {laporan.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800"
          >
            <div className="flex justify-between items-start">

              <div>
                <h3 className="text-xl font-bold mb-2">
                  {item.judul}
                </h3>

                <p className="text-gray-400 mb-2">
                  {item.isi}
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  Pelapor: {item.name}
                </p>
              </div>

              <div>
                <select
                  value={item.status}
                  onChange={(e) =>
                    updateStatus(item.id, e.target.value)
                  }
                  className="bg-gray-800 p-2 rounded-lg"
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

            </div>

            {/* FOTO BUKTI */}
            {item.foto && (
              <img
                src={`http://localhost:5000/uploads/${item.foto}`}
                alt="bukti"
                className="mt-4 rounded-xl max-h-64 border border-gray-700"
              />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;