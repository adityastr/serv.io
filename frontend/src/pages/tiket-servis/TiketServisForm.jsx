import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft, Save, MonitorSmartphone, User, MessageSquare } from "lucide-react";

export default function TiketServisForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ perangkat_id: "", teknisi_id: "", keluhan: "" });
    const [perangkats, setPerangkats] = useState([]);
    const [teknisis, setTeknisis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        Promise.all([api.get("/perangkat"), api.get("/dashboard/teknisi-list")])
            .then(([perangkatRes, teknisiRes]) => {
                setPerangkats(perangkatRes.data);
                setTeknisis(teknisiRes.data);
            })
            .catch(() => alert("Gagal memuat data"))
            .finally(() => setFetching(false));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/tiket-servis", form);
            navigate("/tiket-servis");
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
                    onClick={() => navigate("/tiket-servis")}
                    className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Tiket Servis</h1>
                    <p className="text-sm text-slate-500">Mulai proses perbaikan baru</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <MonitorSmartphone className="w-4 h-4 text-slate-400" />
                        Perangkat <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.perangkat_id}
                        onChange={(e) => setForm({ ...form, perangkat_id: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                        required
                    >
                        <option value="">Pilih Perangkat</option>
                        {perangkats.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.customer?.nama} - {p.merek} {p.model}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Teknisi Penanggung Jawab
                    </label>
                    <select
                        value={form.teknisi_id}
                        onChange={(e) => setForm({ ...form, teknisi_id: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    >
                        <option value="">Belum Ditugaskan</option>
                        {teknisis.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        Keluhan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={form.keluhan}
                        onChange={(e) => setForm({ ...form, keluhan: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
                        rows={4}
                        placeholder="Deskripsikan keluhan customer secara detail..."
                        required
                    />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate("/tiket-servis")}
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
                        <span>{loading ? "Menyimpan..." : "Buat Tiket"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
