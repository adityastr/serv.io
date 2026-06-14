import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft, Save, MonitorSmartphone, User, Box, Hash } from "lucide-react";

export default function PerangkatForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [form, setForm] = useState({
        customer_id: "",
        jenis_perangkat: "",
        merek: "",
        model: "",
        serial_number: "",
    });
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get("/customer"),
            isEdit ? api.get(`/perangkat/${id}`) : null,
        ])
            .then(([customerRes, perangkatRes]) => {
                setCustomers(customerRes.data);
                if (perangkatRes) {
                    const p = perangkatRes.data;
                    setForm({
                        customer_id: p.customer_id,
                        jenis_perangkat: p.jenis_perangkat,
                        merek: p.merek,
                        model: p.model,
                        serial_number: p.serial_number || "",
                    });
                }
            })
            .catch(() => alert("Gagal memuat data"))
            .finally(() => setFetching(false));
    }, [id, isEdit]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await api.put(`/perangkat/${id}`, form);
            } else {
                await api.post("/perangkat", form);
            }
            navigate("/perangkat");
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
                    onClick={() => navigate("/perangkat")}
                    className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {isEdit ? "Edit Data Perangkat" : "Tambah Perangkat Baru"}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {isEdit ? "Perbarui informasi perangkat pelanggan" : "Masukkan informasi perangkat yang akan diservis"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Customer Pemilik <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.customer_id}
                        onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                        required
                    >
                        <option value="">Pilih Customer</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nama} - {c.nomor_telepon}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <MonitorSmartphone className="w-4 h-4 text-slate-400" />
                            Jenis Perangkat <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.jenis_perangkat}
                            onChange={(e) => setForm({ ...form, jenis_perangkat: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                            required
                        >
                            <option value="">Pilih Jenis</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Printer">Printer</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Box className="w-4 h-4 text-slate-400" />
                            Merek <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.merek}
                            onChange={(e) => setForm({ ...form, merek: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            placeholder="Contoh: ASUS, HP, Lenovo..."
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <MonitorSmartphone className="w-4 h-4 text-slate-400" />
                            Model <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.model}
                            onChange={(e) => setForm({ ...form, model: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            placeholder="Contoh: ROG Zephyrus G14"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            Serial Number
                        </label>
                        <input
                            type="text"
                            value={form.serial_number}
                            onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
                            placeholder="SN/Nomor Seri perangkat"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate("/perangkat")}
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
