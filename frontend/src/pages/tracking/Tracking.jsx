import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Search, LogIn, Phone, Ticket as TicketIcon, SearchX, CheckCircle, PackageSearch, PenTool } from "lucide-react";

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

function formatRupiah(num) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
}

export default function Tracking() {
    const [nomorTelepon, setNomorTelepon] = useState("");
    const [nomorTiket, setNomorTiket] = useState("");
    const [results, setResults] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleTrack(e) {
        e.preventDefault();
        setError("");
        setResults(null);
        setLoading(true);

        try {
            const res = await api.post("/tracking", {
                nomorTelepon: nomorTelepon || undefined,
                nomorTiket: nomorTiket || undefined,
            });
            setResults(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal melacak servis");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <PenTool className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Serv.io</h1>
                    </div>
                    <Link 
                        to="/login" 
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                        <span>Login Staff</span>
                        <LogIn className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            <main className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Lacak Perbaikan Anda</h2>
                    <p className="mt-4 text-lg text-slate-500">Masukkan nomor telepon atau nomor tiket untuk melihat status terkini perangkat Anda.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleTrack} className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200 p-6 sm:p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor Telepon</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={nomorTelepon}
                                    onChange={(e) => setNomorTelepon(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none text-slate-900 transition-all placeholder:text-slate-400"
                                    placeholder="Contoh: 08123456789"
                                />
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center justify-center relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm font-medium">
                                <span className="bg-white px-3 text-slate-400 uppercase tracking-widest text-xs">ATAU</span>
                            </div>
                        </div>

                        <div className="sm:hidden flex items-center justify-center py-2 relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm font-medium">
                                <span className="bg-white px-3 text-slate-400 uppercase tracking-widest text-xs">ATAU</span>
                            </div>
                        </div>

                        <div className="sm:col-start-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor Tiket</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <TicketIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={nomorTiket}
                                    onChange={(e) => setNomorTiket(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none text-slate-900 transition-all font-mono placeholder:font-sans placeholder:text-slate-400"
                                    placeholder="Contoh: SRV-..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={loading || (!nomorTelepon && !nomorTiket)}
                            className="w-full sm:w-auto sm:min-w-[200px] mx-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:hover:bg-blue-600 shadow-md shadow-blue-600/20"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                                    <span>Mencari...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    <span>Lacak Servis</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-2">
                        <SearchX className="w-6 h-6 shrink-0" />
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                )}

                {/* Hasil */}
                {results && results.length > 0 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                            <span>Hasil Pencarian ({results.length})</span>
                        </h3>
                        
                        {results.map((t, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-slate-50/50">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono font-bold text-lg text-slate-900">{t.nomor_tiket}</span>
                                        </div>
                                        <h4 className="text-slate-600 font-medium">{t.perangkat}</h4>
                                    </div>
                                    <div className="shrink-0">
                                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wide ${STATUS_LABELS[t.status]?.color}`}>
                                            {STATUS_LABELS[t.status]?.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6">
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                        <div className="sm:col-span-2">
                                            <dt className="text-slate-500 font-medium mb-1">Keluhan</dt>
                                            <dd className="text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">{t.keluhan}</dd>
                                        </div>
                                        
                                        <div>
                                            <dt className="text-slate-500 font-medium mb-1">Teknisi</dt>
                                            <dd className="text-slate-900 font-medium">{t.teknisi || "-"}</dd>
                                        </div>

                                        {t.diagnosis && (
                                            <>
                                                <div className="sm:col-span-2 pt-4 border-t border-slate-100 mt-2">
                                                    <h5 className="font-semibold text-slate-900 mb-4">Hasil Diagnosis</h5>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <dt className="text-slate-500 font-medium mb-1">Masalah</dt>
                                                            <dd className="text-slate-900">{t.diagnosis.masalah}</dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-slate-500 font-medium mb-1">Solusi</dt>
                                                            <dd className="text-slate-900">{t.diagnosis.solusi}</dd>
                                                        </div>
                                                        <div className="sm:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2 flex justify-between items-center">
                                                            <dt className="text-blue-700 font-semibold">Estimasi Biaya</dt>
                                                            <dd className="text-blue-800 font-bold text-lg">{formatRupiah(t.diagnosis.estimasi_biaya)}</dd>
                                                        </div>
                                                    </div>
                                                </div>
                                            <div className="sm:col-span-2 pt-4 border-t border-slate-100 mt-2">
                                                <h5 className="font-semibold text-slate-900 mb-4">Riwayat Perbaikan</h5>
                                                {t.log_perbaikan && t.log_perbaikan.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {t.log_perbaikan.map((log, logIdx) => (
                                                            <div key={logIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                                <p className="text-slate-900 text-sm whitespace-pre-line mb-2">{log.catatan}</p>
                                                                {log.foto_url && (
                                                                    <div className="mb-3">
                                                                        <a href={log.foto_url} target="_blank" rel="noreferrer" className="block w-fit">
                                                                            <img src={log.foto_url} alt="Dokumentasi Perbaikan" className="h-24 object-cover rounded-lg border border-slate-200 hover:opacity-90 transition-opacity shadow-sm" />
                                                                        </a>
                                                                    </div>
                                                                )}
                                                                <p className="text-xs text-slate-400 font-medium">
                                                                    {new Date(log.created_at).toLocaleDateString("id-ID", { 
                                                                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                                                    })}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-500 italic">Belum ada riwayat perbaikan.</p>
                                                )}
                                            </div>
                                            </>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {results && results.length === 0 && (
                    <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 mt-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                            <PackageSearch className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Tidak Ditemukan</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">Kami tidak dapat menemukan riwayat servis dengan nomor tersebut. Silakan periksa kembali nomor tiket atau nomor telepon Anda.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
