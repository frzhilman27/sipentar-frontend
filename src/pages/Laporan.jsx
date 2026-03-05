import { useState, useEffect } from "react";
import api from "../services/api";
import { compressImageToBase64 } from "../utils/imageUtils";

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

    let base64Image = null;
    if (image) {
      base64Image = await compressImageToBase64(image, 800, 800, 0.7);
    }

    const payload = {
      judul: judul,
      isi: isi,
      imageUrl: base64Image
    };

    try {
      await api.post("/laporan", payload);
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
    <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-8 sm:p-10 relative overflow-hidden transition-all duration-300 group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
      {/* Decorative gradient orb (Emerald) */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-400/30 transition-colors duration-700"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 relative z-10">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-village-emerald-500 to-village-emerald-700 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-village-emerald-400/30 transition-transform group-hover:scale-105 group-hover:rotate-3">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
        <div>
          <h3 className="font-outfit text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">Ajukan Pelaporan Baru</h3>
          <p className="text-sm sm:text-base font-medium text-white/70 mt-1">Sampaikan rincian kejadian beserta bukti foto autentik secara langsung.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-bold text-emerald-100 mb-2 pl-1 tracking-wide uppercase">Judul Pengaduan</label>
          <input
            type="text"
            placeholder="Ketik judul singkat (Misal: Kerusakan Jalan Parah di RT 02)..."
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 focus:bg-white/10 backdrop-blur-md outline-none transition-all shadow-inner text-white font-medium placeholder-white/40"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-emerald-100 mb-2 pl-1 tracking-wide uppercase">Rincian Kronologi</label>
          <textarea
            placeholder="Jelaskan secara mendetail mengenai kejadian yang Anda lihat atau alami..."
            rows="4"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            required
            className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 focus:bg-white/10 backdrop-blur-md outline-none transition-all shadow-inner resize-y text-white font-medium leading-relaxed placeholder-white/40"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-emerald-100 mb-2 pl-1 tracking-wide uppercase">Unggah Foto (Opsional)</label>
          <div className="relative group/upload mt-1">
            {/* Decorative dashed border that highlights on hover */}
            <div className={`absolute inset-0 border-2 border-dashed rounded-3xl transition-colors duration-300 pointer-events-none ${image ? 'border-emerald-400/50' : 'border-white/20 group-hover/upload:border-emerald-400/50'}`}></div>

            <div className={`relative flex flex-col items-center justify-center px-6 py-10 rounded-3xl transition-all duration-300 overflow-hidden ${image ? 'bg-emerald-500/10' : 'bg-white/5 hover:bg-white/10 backdrop-blur-sm'}`}>

              {!image ? (
                <>
                  <div className="w-16 h-16 mb-4 rounded-full bg-white/10 text-emerald-300 shadow-inner border border-emerald-400/30 flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 transform">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="text-center z-10 w-full max-w-sm">
                    <p className="text-sm font-bold text-white mb-1 transition-colors">
                      <span className="text-emerald-400 cursor-pointer group-hover/upload:underline drop-shadow-sm">Pilih Dokumen Foto</span> atau seret ke sini
                    </p>
                    <p className="text-[11px] font-bold tracking-wider uppercase text-white/50 mt-2">Mendukung resolusi tinggi JPG, PNG, WEBP</p>
                  </div>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files[0])} />
                </>
              ) : (
                <div className="text-center w-full z-10 flex flex-col items-center">
                  <div className="relative inline-block group/preview">
                    <div className="w-48 h-32 sm:w-64 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 mx-auto mb-4 bg-black/40 transition-colors">
                      {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transform group-hover/preview:scale-105 transition-transform duration-500" />}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setImage(null); }}
                      className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.6)] hover:bg-rose-600 hover:scale-110 transition-all z-30 border border-white/20"
                      aria-label="Hapus Foto"
                      title="Hapus Foto"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-inner border border-white/20 transition-colors">
                    <p className="text-sm font-bold text-white truncate max-w-[200px] drop-shadow-sm">{image.name}</p>
                    <p className="text-[10px] font-black text-emerald-400 mt-1 uppercase tracking-widest">Siap Dilampirkan</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/10 transition-colors">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-village-emerald-500 to-village-emerald-700 hover:from-village-emerald-400 hover:to-village-emerald-600 text-white font-black tracking-widest uppercase rounded-2xl shadow-[0_10px_20px_-10px_rgba(16,185,129,0.6)] border border-village-emerald-400/30 transition-all transform hover:-translate-y-1 hover:shadow-[0_15px_25px_-10px_rgba(16,185,129,0.8)] disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
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