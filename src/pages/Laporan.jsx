import { useState, useEffect } from "react";
import api from "../services/api";

function Laporan({ onReportAdded }) {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clean up object URL to avoid memory leaks
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/laporan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Laporan berhasil dikirim 🔥");
      setJudul("");
      setIsi("");
      setImage(null);
      if (onReportAdded) onReportAdded();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal kirim laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-blue-900/5 dark:shadow-blue-900/20 border border-white/80 dark:border-slate-700/80 p-8 sm:p-10 relative overflow-hidden transition-all duration-300 hover:shadow-blue-900/10 dark:hover:shadow-blue-900/30">
      {/* Decorative gradient orb */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 relative z-10">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 dark:shadow-blue-900/50">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight transition-colors">Ajukan Pelaporan Baru</h3>
          <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors">Sampaikan rincian kejadian beserta bukti foto autentik secara langsung.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 pl-1 transition-colors">Judul Pengaduan</label>
          <input
            type="text"
            placeholder="Ketik judul singkat (Misal: Kerusakan Jalan Parah di RT 02)..."
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 dark:focus:bg-slate-900 outline-none transition-all shadow-sm text-slate-800 dark:text-white font-medium placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 pl-1 transition-colors">Rincian Kronologi</label>
          <textarea
            placeholder="Jelaskan secara mendetail mengenai kejadian yang Anda lihat atau alami..."
            rows="5"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            required
            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 dark:focus:bg-slate-900 outline-none transition-all shadow-sm resize-y text-slate-800 dark:text-white font-medium leading-relaxed placeholder-slate-400 dark:placeholder-slate-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 pl-1 transition-colors">Unggah Foto Bukti Kejadian (Opsional)</label>
          <div className="relative group mt-1">
            {/* Decorative dashed border that highlights on hover */}
            <div className={`absolute inset-0 border-2 border-dashed rounded-3xl transition-colors duration-300 pointer-events-none ${image ? 'border-blue-400' : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'}`}></div>

            <div className={`relative flex flex-col items-center justify-center px-6 py-10 rounded-3xl transition-all duration-300 overflow-hidden ${image ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900/80'}`}>

              {!image ? (
                <>
                  <div className="w-16 h-16 mb-4 rounded-full bg-white dark:bg-slate-800 text-slate-100 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300 transform">
                    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="text-center z-10">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 transition-colors">
                      <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline group-hover:text-blue-700 dark:group-hover:text-blue-300">Pilih Dokumen Foto</span> atau tarik ke sini
                    </p>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 transition-colors">Mendukung resolusi tinggi JPG, PNG, atau WEBP (Maks. 5MB)</p>
                  </div>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files[0])} />
                </>
              ) : (
                <div className="text-center w-full z-10 flex flex-col items-center">
                  <div className="relative inline-block group/preview">
                    <div className="w-48 h-32 sm:w-64 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-700 mx-auto mb-4 bg-slate-200 dark:bg-slate-800 transition-colors">
                      {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transform group-hover/preview:scale-105 transition-transform duration-500" />}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setImage(null); }}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all z-30"
                      aria-label="Hapus Foto"
                      title="Hapus Foto"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[250px] transition-colors">{image.name}</p>
                    <p className="text-[11px] font-bold text-emerald-500 mt-0.5 uppercase tracking-wider">Foto Siap Dilampirkan</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-700/50 transition-colors">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold tracking-wide rounded-2xl shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses Laporan...
              </>
            ) : (
              <>
                Kirim Laporan Resmi
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Laporan;