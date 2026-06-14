import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft, Save, Package, Hash, DollarSign, Layers } from "lucide-react";

export default function SparepartForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({ nama: "", kategori: "Umum", stok: "", harga: "" });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            api
                .get("/sparepart")
                .then((res) => {
                    const sp = res.data.find((s) => s.id === Number(id));
                    if (sp) {
                        setForm({ nama: sp.nama, kategori: sp.kategori || "Umum", stok: String(sp.stok), harga: String(sp.harga) });
                    } else {
                        alert("Sparepart tidak ditemukan");
                        navigate("/sparepart");
                    }
                })
                .catch(() => alert("Gagal memuat data"))
                .finally(() => setFetching(false));
        }
    }, [id, isEdit, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await api.put(`/sparepart/${id}`, form);
            } else {
                await api.post("/sparepart", form);
            }
            navigate("/sparepart");
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
                    onClick={() => navigate("/sparepart")}
                    className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {isEdit ? "Edit Suku Cadang" : "Tambah Suku Cadang"}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {isEdit ? "Perbarui informasi dan stok suku cadang" : "Masukkan suku cadang baru ke dalam inventaris"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            Nama Suku Cadang <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.nama}
                            onChange={(e) => setForm({ ...form, nama: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            placeholder="Contoh: RAM 8GB DDR4, Print Head Epson..."
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-slate-400" />
                            Kompabilitas Perangkat <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {["Laptop", "Desktop", "Printer", "Lainnya", "Umum"].map((cat) => {
                                const isChecked = (form.kategori || "").split(",").map(c => c.trim()).includes(cat);
                                return (
                                    <label
                                        key={cat}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border cursor-pointer transition-all flex items-center gap-2 ${
                                            isChecked
                                                ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={isChecked}
                                            onChange={() => {
                                                let current = (form.kategori || "").split(",").map(c => c.trim()).filter(c => c);
                                                if (isChecked) {
                                                    current = current.filter(c => c !== cat);
                                                } else {
                                                    current.push(cat);
                                                }
                                                // Default to Umum if empty
                                                if (current.length === 0) current.push("Umum");
                                                setForm({ ...form, kategori: current.join(", ") });
                                            }}
                                        />
                                        {cat}
                                    </label>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Pilih satu atau lebih kategori perangkat yang kompatibel dengan suku cadang ini.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            Jumlah Stok <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={form.stok}
                            onChange={(e) => setForm({ ...form, stok: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            placeholder="Contoh: 10"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            Harga (Rp) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={form.harga}
                            onChange={(e) => setForm({ ...form, harga: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            placeholder="Contoh: 150000"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate("/sparepart")}
                        className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors shadow-sm w-full sm:w-auto text-center"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{loading ? "Menyimpan..." : "Simpan Data"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
