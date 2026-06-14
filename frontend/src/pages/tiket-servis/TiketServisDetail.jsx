import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { ArrowLeft, ArrowRight, MonitorSmartphone, User, Info, FileText, ClipboardList, PenTool, CheckCircle, Wrench, Package, FileCheck, Search, Save } from "lucide-react";


const STATUS_LABELS = {
    diterima: { label: "Diterima", color: "bg-blue-50 text-blue-700 border-blue-200" },
    didiagnosis: { label: "Didiagnosis", color: "bg-purple-50 text-purple-700 border-purple-200" },
    menunggu_persetujuan: { label: "Menunggu Persetujuan", color: "bg-amber-50 text-amber-700 border-amber-200" },
    disetujui: { label: "Disetujui", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    dalam_perbaikan: { label: "Dalam Perbaikan", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    selesai: { label: "Selesai", color: "bg-green-50 text-green-700 border-green-200" },
    diambil: { label: "Diambil", color: "bg-slate-50 text-slate-700 border-slate-200" },
    dibatalkan: { label: "Dibatalkan", color: "bg-red-50 text-red-600 border-red-200" },
};

const STATUS_TRANSITIONS = {
    diterima: ["didiagnosis"],
    didiagnosis: ["menunggu_persetujuan"],
    menunggu_persetujuan: ["disetujui", "dibatalkan"],
    disetujui: ["dalam_perbaikan"],
    dalam_perbaikan: ["selesai"],
    selesai: ["diambil"],
    diambil: [],
    dibatalkan: [],
};

function formatRupiah(num) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
}

export default function TiketServisDetail() {
    const { id } = useParams();
    const { isAdmin, isTeknisi } = useAuth();
    const [tiket, setTiket] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedStatus, setSelectedStatus] = useState("");

    // Sparepart use form
    const [spareparts, setSpareparts] = useState([]);
    const [sparepartForm, setSparepartForm] = useState({ sparepart_id: "", jumlah: 1 });
    const [useSparepartLoading, setUseSparepartLoading] = useState(false);

    useEffect(() => {
        fetchTiket();
        api.get("/sparepart").then((res) => setSpareparts(res.data)).catch(() => { });
    }, [id]);

    async function fetchTiket() {
        try {
            const res = await api.get(`/tiket-servis/${id}`);
            setTiket(res.data);
            setSelectedStatus("");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange() {
        if (!selectedStatus) return;
        if (!confirm(`Ubah status ke "${STATUS_LABELS[selectedStatus]?.label}"?`)) return;

        try {
            await api.put(`/tiket-servis/${id}`, { status: selectedStatus });
            fetchTiket();
        } catch (err) {
            alert(err.response?.data?.message || "Gagal mengubah status");
        }
    }

    async function handleUseSparepart(e) {
        e.preventDefault();
        setUseSparepartLoading(true);

        try {
            await api.post("/sparepart/use", {
                tiket_id: Number(id),
                sparepart_id: Number(sparepartForm.sparepart_id),
                jumlah: Number(sparepartForm.jumlah),
            });
            setSparepartForm({ sparepart_id: "", jumlah: 1 });
            fetchTiket();
            // Refresh sparepart list
            const res = await api.get("/sparepart");
            setSpareparts(res.data);
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menggunakan sparepart");
        } finally {
            setUseSparepartLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!tiket) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <FileText className="w-12 h-12 mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-900">Tiket tidak ditemukan</p>
                <Link to="/tiket-servis" className="mt-4 text-blue-600 hover:underline">Kembali ke Daftar Tiket</Link>
            </div>
        );
    }

    const allowedTransitions = STATUS_TRANSITIONS[tiket.status] || [];

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link 
                        to="/tiket-servis" 
                        className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-mono">{tiket.nomor_tiket}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${STATUS_LABELS[tiket.status]?.color}`}>
                                {STATUS_LABELS[tiket.status]?.label}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            Dibuat pada {new Date(tiket.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                        <MonitorSmartphone className="w-5 h-5 text-blue-500" />
                        <h2 className="text-base font-bold text-slate-900">Informasi Perangkat</h2>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">Customer</p>
                                <p className="font-medium text-slate-900">{tiket.perangkat?.customer?.nama}</p>
                                <p className="text-slate-500">{tiket.perangkat?.customer?.nomor_telepon}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">Detail Perangkat</p>
                                <p className="font-medium text-slate-900">{tiket.perangkat?.merek} {tiket.perangkat?.model}</p>
                                <p className="text-slate-600">{tiket.perangkat?.jenis_perangkat} • SN: {tiket.perangkat?.serial_number || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                        <FileText className="w-5 h-5 text-purple-500" />
                        <h2 className="text-base font-bold text-slate-900">Detail Tiket</h2>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <Wrench className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">Teknisi Penanggung Jawab</p>
                                <p className="font-medium text-slate-900">{tiket.teknisi?.nama || <span className="text-amber-600 italic">Belum ditugaskan</span>}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ClipboardList className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">Keluhan Pelanggan</p>
                                <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">{tiket.keluhan}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Actions */}
            {allowedTransitions.length > 0 && (
                <div className="bg-blue-50/50 rounded-2xl p-6 shadow-sm border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <h2 className="text-base font-bold text-blue-900">Perbarui Status Tiket</h2>
                    </div>
                    <p className="text-sm text-blue-700/80 mb-5">
                        Pilih status dari daftar di bawah ini untuk memperbarui progres perbaikan tiket.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full sm:w-auto flex-1 px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                        >
                            <option value="" disabled>Pilih Status Selanjutnya...</option>
                            {allowedTransitions.map((s) => (
                                <option key={s} value={s}>{STATUS_LABELS[s]?.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleStatusChange}
                            disabled={!selectedStatus}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Simpan Status</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Diagnosis */}
            {tiket.diagnosis && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                        <Search className="w-5 h-5 text-amber-500" />
                        <h2 className="text-base font-bold text-slate-900">Hasil Diagnosis</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1.5">Masalah Ditemukan</p>
                            <p className="text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100 h-[calc(100%-1.5rem)]">{tiket.diagnosis.masalah}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1.5">Solusi yang Ditawarkan</p>
                            <p className="text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100 h-[calc(100%-1.5rem)]">{tiket.diagnosis.solusi}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <p className="text-blue-800 font-semibold text-sm">Estimasi Biaya Perbaikan</p>
                        <p className="text-blue-900 font-bold text-xl">{formatRupiah(tiket.diagnosis.estimasi_biaya)}</p>
                    </div>
                </div>
            )}

            {/* Diagnosis Form Action */}
            {isTeknisi && tiket.status === "diterima" && !tiket.diagnosis && (
                <Link
                    to={`/tiket-servis/${id}/diagnosis`}
                    className="flex flex-col items-center justify-center p-8 bg-amber-50/50 border-2 border-dashed border-amber-200 rounded-2xl text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all group"
                >
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Search className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="font-bold text-lg">Mulai Diagnosis</span>
                    <span className="text-amber-600/70 text-sm mt-1">Periksa perangkat dan catat masalah yang ditemukan</span>
                </Link>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Log Perbaikan */}
                <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <PenTool className="w-5 h-5 text-slate-700" />
                            <h2 className="text-base font-bold text-slate-900">Log Perbaikan</h2>
                        </div>
                        <Link to={`/tiket-servis/${id}/log`} className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline">
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="flex-1">
                        {tiket.log_perbaikan?.length > 0 ? (
                            <div className="space-y-4">
                                {tiket.log_perbaikan.slice(0, 3).map((log, index) => (
                                    <div key={log.id} className="relative pl-6 pb-4 last:pb-0">
                                        {/* Timeline line */}
                                        {index !== tiket.log_perbaikan.slice(0, 3).length - 1 && (
                                            <div className="absolute left-[7px] top-6 bottom-[-8px] w-px bg-slate-200"></div>
                                        )}
                                        {/* Timeline dot */}
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm"></div>
                                        
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm text-sm">
                                            <p className="text-slate-800 mb-2 whitespace-pre-line">{log.catatan}</p>
                                            {log.foto_url && (
                                                <div className="mb-3">
                                                    <a href={log.foto_url} target="_blank" rel="noreferrer" className="block w-fit">
                                                        <img 
                                                            src={log.foto_url} 
                                                            alt="Dokumentasi Perbaikan" 
                                                            className="h-20 object-cover rounded-lg border border-slate-200 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                                                        />
                                                    </a>
                                                </div>
                                            )}
                                            <p className="text-xs font-medium text-slate-400">
                                                {new Date(log.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                                <ClipboardList className="w-10 h-10 text-slate-200 mb-3" />
                                <p className="text-sm font-medium text-slate-900">Belum ada log</p>
                                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Catatan perbaikan akan muncul di sini</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Penggunaan Sparepart */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                            <Package className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-base font-bold text-slate-900">Penggunaan Sparepart</h2>
                        </div>

                        {tiket.penggunaan_sparepart?.length > 0 ? (
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50/50">
                                            <th className="py-3 px-4 font-semibold rounded-tl-lg">Sparepart</th>
                                            <th className="py-3 px-4 font-semibold text-center">Jumlah</th>
                                            <th className="py-3 px-4 font-semibold text-right">Harga Satuan</th>
                                            <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {tiket.penggunaan_sparepart.map((ps) => (
                                            <tr key={ps.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-slate-900">{ps.sparepart?.nama}</td>
                                                <td className="py-3 px-4 text-center text-slate-600">{ps.jumlah}</td>
                                                <td className="py-3 px-4 text-right text-slate-600">{formatRupiah(ps.sparepart?.harga)}</td>
                                                <td className="py-3 px-4 text-right font-semibold text-slate-900">{formatRupiah(ps.sparepart?.harga * ps.jumlah)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t border-slate-200 font-semibold bg-slate-50/50">
                                        <tr>
                                            <td colSpan="3" className="py-3 px-4 text-right text-slate-700">Total Sparepart:</td>
                                            <td className="py-3 px-4 text-right text-slate-900">
                                                {formatRupiah(tiket.penggunaan_sparepart.reduce((acc, ps) => acc + (ps.sparepart?.harga * ps.jumlah), 0))}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 mb-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                <Package className="w-10 h-10 text-slate-300 mb-3" />
                                <p className="text-sm font-medium text-slate-900">Tidak ada sparepart</p>
                                <p className="text-xs text-slate-500 mt-1">Belum ada suku cadang yang digunakan untuk perbaikan ini.</p>
                            </div>
                        )}

                        {/* Form tambah sparepart */}
                        {(isTeknisi || isAdmin) && tiket.status === "dalam_perbaikan" && (
                            <div className="bg-indigo-50/30 p-5 rounded-xl border border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900 mb-3">Tambah Penggunaan Suku Cadang</h3>
                                <form onSubmit={handleUseSparepart} className="flex flex-col sm:flex-row gap-3 items-end">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pilih Sparepart</label>
                                        <select
                                            value={sparepartForm.sparepart_id}
                                            onChange={(e) => setSparepartForm({ ...sparepartForm, sparepart_id: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            required
                                        >
                                            <option value="">Pilih Suku Cadang...</option>
                                            {spareparts
                                                .filter((s) => {
                                                    if (s.stok <= 0) return false;
                                                    const kat = (s.kategori || "").toLowerCase();
                                                    const jp = (tiket.perangkat?.jenis_perangkat || "").toLowerCase();
                                                    return kat.includes("umum") || kat.includes(jp);
                                                })
                                                .map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.nama} (Sisa stok: {s.stok})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full sm:w-28 shrink-0">
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jumlah</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={sparepartForm.jumlah}
                                            onChange={(e) => setSparepartForm({ ...sparepartForm, jumlah: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-center"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={useSparepartLoading}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm shrink-0 whitespace-nowrap"
                                    >
                                        {useSparepartLoading ? "Memproses..." : "Tambahkan"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Invoice */}
                    {tiket.invoice && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                                <FileCheck className="w-5 h-5 text-emerald-500" />
                                <h2 className="text-base font-bold text-slate-900">Tagihan Pembayaran</h2>
                            </div>
                            
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Biaya Jasa Teknisi</span>
                                    <span className="text-slate-900 font-medium">{formatRupiah(tiket.invoice.biaya_jasa)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Biaya Suku Cadang</span>
                                    <span className="text-slate-900 font-medium">{formatRupiah(tiket.invoice.biaya_sparepart)}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-slate-800 font-bold uppercase tracking-wider text-sm">Total Tagihan</span>
                                    <span className="text-emerald-700 font-bold text-xl">{formatRupiah(tiket.invoice.total_biaya)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

