import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, FileText } from "lucide-react";

function formatRupiah(num) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
}

export default function InvoiceList() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    async function fetchInvoices() {
        try {
            const res = await api.get("/invoice");
            setInvoices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Data Invoice</h1>
                    <p className="text-sm text-slate-500 mt-1">Daftar tagihan pembayaran pelanggan</p>
                </div>
                <Link
                    to="/invoice/tambah"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Buat Invoice</span>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Tidak ada invoice</h3>
                            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Belum ada invoice pembayaran yang diterbitkan.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                                    <th className="px-6 py-4 font-semibold">No Tiket</th>
                                    <th className="px-6 py-4 font-semibold">Customer</th>
                                    <th className="px-6 py-4 font-semibold text-right">Biaya Jasa</th>
                                    <th className="px-6 py-4 font-semibold text-right">Biaya Sparepart</th>
                                    <th className="px-6 py-4 font-semibold text-right">Total</th>
                                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-slate-700">{inv.tiket?.nomor_tiket}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{inv.tiket?.perangkat?.customer?.nama}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{formatRupiah(inv.biaya_jasa)}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">{formatRupiah(inv.biaya_sparepart)}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">{formatRupiah(inv.total_biaya)}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(inv.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}</td>
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
