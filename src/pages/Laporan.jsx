import { useState } from "react";
import API from "../services/api";

function Laporan() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [foto, setFoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    if (foto) formData.append("foto", foto);

    try {
      await API.post("/laporan", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Laporan berhasil dikirim 🔥");
      setJudul("");
      setIsi("");
      setFoto(null);
    } catch (err) {
      alert("Gagal kirim laporan");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-900 p-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Buat Laporan</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Judul Laporan"
          className="w-full mb-4 p-3 rounded bg-gray-800"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
        />

        <textarea
          placeholder="Isi laporan..."
          className="w-full mb-4 p-3 rounded bg-gray-800"
          rows="5"
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          required
        ></textarea>

        <input
          type="file"
          className="mb-4 text-white"
          onChange={(e) => setFoto(e.target.files[0])}
        />

        <button className="bg-blue-600 px-6 py-3 rounded-lg">
          Kirim Laporan
        </button>
      </form>
    </div>
  );
}

export default Laporan;