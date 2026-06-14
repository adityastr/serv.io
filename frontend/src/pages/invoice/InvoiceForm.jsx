import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft, Save, FileCheck, DollarSign, Info } from "lucide-react";

export default function InvoiceForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ tiket_id: "", biaya_jasa: "" });
    const [tikets, setTikets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        api
            .get("/tiket-servis")
            .then((res) => {
                // Filter tiket yang sudah selesai/diambil dan belum punya invoice
                // This assumes API doesn't return invoices in this endpoint or we just filter by status for simplicity
                setTikets(res.data.filter((t) => ["selesai", "diambil"].includes(t.status)));
            })
            .catch(() => alert("Gagal memuat data"))
            .finally(() => setFetching(false));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/invoice", form);
            navigate("/invoice");
        } catch (err) {
            alert(err.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/invoice")}
                    className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Invoice</h1>
                    <p className="text-sm text-slate-500">Buat tagihan pembayaran untuk perbaikan selesai</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-slate-400" />
                        Tiket Servis Selesai <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.tiket_id}
                        onChange={(e) => setForm({ ...form, tiket_id: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                        required
                    >
                        <option value="">Pilih Tiket</option>
                        {tikets.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nomor_tiket} - {t.perangkat?.customer?.nama} ({t.perangkat?.merek} {t.perangkat?.model})
                            </option>
                        ))}
                    </select>
                    {tikets.length === 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-sm">
                            <Info className="w-4 h-4" />
                            <p>Tidak ada tiket yang siap untuk dibuatkan invoice (status Selesai/Diambil).</p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        Biaya Jasa (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={form.biaya_jasa}
                        onChange={(e) => setForm({ ...form, biaya_jasa: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                        placeholder="Contoh: 150000"
                        min="0"
                        required
                    />
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
                        <Info className="w-4 h-4 text-slate-400" />
                        Biaya sparepart akan dihitung secara otomatis berdasarkan suku cadang yang digunakan.
                    </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate("/invoice")}
                        className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors shadow-sm w-full sm:w-auto text-center"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading || tikets.length === 0}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{loading ? "Menyimpan..." : "Buat Invoice"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
