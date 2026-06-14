import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { Plus, Edit2, Trash2, Wrench } from "lucide-react";

function formatRupiah(num) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
}

export default function SparepartList() {
    const { isAdmin } = useAuth();
    const [spareparts, setSpareparts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpareparts();
    }, []);

    async function fetchSpareparts() {
        try {
            const res = await api.get("/sparepart");
            setSpareparts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id, nama) {
        if (!confirm(`Hapus sparepart "${nama}"?`)) return;

        try {
            await api.delete(`/sparepart/${id}`);
            setSpareparts(spareparts.filter((s) => s.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menghapus");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Data Sparepart</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola stok dan harga suku cadang</p>
                </div>
                {isAdmin && (
                    <Link
                        to="/sparepart/tambah"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Sparepart</span>
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : spareparts.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                                <Wrench className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Tidak ada sparepart</h3>
                            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Data sparepart masih kosong.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                                    <th className="px-6 py-4 font-semibold">No</th>
                                    <th className="px-6 py-4 font-semibold">Nama Sparepart</th>
                                    <th className="px-6 py-4 font-semibold text-right">Stok</th>
                                    <th className="px-6 py-4 font-semibold text-right">Harga</th>
                                    {isAdmin && <th className="px-6 py-4 font-semibold text-right">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {spareparts.map((s, i) => (
                                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900">{s.nama}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{s.kategori}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                s.stok <= 2 
                                                ? "bg-red-50 text-red-700 border-red-200" 
                                                : s.stok <= 5 
                                                ? "bg-amber-50 text-amber-700 border-amber-200" 
                                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            }`}>
                                                {s.stok} unit
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-700">{formatRupiah(s.harga)}</td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <Link
                                                        to={`/sparepart/edit/${s.id}`}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(s.id, s.nama)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
