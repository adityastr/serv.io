import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, Edit2, Trash2, MonitorSmartphone } from "lucide-react";

export default function PerangkatList() {
    const [perangkats, setPerangkats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerangkats();
    }, []);

    async function fetchPerangkats() {
        try {
            const res = await api.get("/perangkat");
            setPerangkats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id, nama) {
        if (!confirm(`Hapus perangkat "${nama}"?`)) return;

        try {
            await api.delete(`/perangkat/${id}`);
            setPerangkats(perangkats.filter((p) => p.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menghapus");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Data Perangkat</h1>
                    <p className="text-sm text-slate-500 mt-1">Daftar perangkat yang terdaftar di bengkel</p>
                </div>
                <Link
                    to="/perangkat/tambah"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Perangkat</span>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : perangkats.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                                <MonitorSmartphone className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Tidak ada perangkat</h3>
                            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Anda belum menambahkan data perangkat satupun.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                                    <th className="px-6 py-4 font-semibold">No</th>
                                    <th className="px-6 py-4 font-semibold">Customer</th>
                                    <th className="px-6 py-4 font-semibold">Jenis</th>
                                    <th className="px-6 py-4 font-semibold">Merek</th>
                                    <th className="px-6 py-4 font-semibold">Model</th>
                                    <th className="px-6 py-4 font-semibold">Serial Number</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {perangkats.map((p, i) => (
                                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{p.customer?.nama}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.jenis_perangkat}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.merek}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.model}</td>
                                        <td className="px-6 py-4 text-slate-500">{p.serial_number || "-"}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <Link
                                                    to={`/perangkat/edit/${p.id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(p.id, p.model)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
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
