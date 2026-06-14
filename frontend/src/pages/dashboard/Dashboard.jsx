import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { 
    Users, 
    MonitorSmartphone, 
    Ticket, 
    CheckCircle2, 
    BadgeDollarSign, 
    AlertTriangle,
    ClipboardList,
    Search,
    Wrench
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function StatCard({ label, value, icon: Icon, color = "blue" }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-emerald-50 text-emerald-600 border-emerald-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        red: "bg-red-50 text-red-600 border-red-100",
        slate: "bg-slate-50 text-slate-600 border-slate-200",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">{label}</p>
                    <p className="text-xl xl:text-2xl font-bold text-slate-900 mt-1 truncate" title={value}>{value}</p>
                </div>
            </div>
        </div>
    );
}

function formatRupiah(num) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
}

export default function Dashboard() {
    const { isAdmin } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mengambil data dashboard setiap kali status admin berubah
    useEffect(() => {
        fetchDashboard();
    }, [isAdmin]);

    // Fungsi utama mengambil data dari backend
    async function fetchDashboard() {
        try {
            // Tentukan endpoint berdasarkan role
            const endpoint = isAdmin ? "/dashboard/admin" : "/dashboard/teknisi";
            const res = await api.get(endpoint);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isAdmin) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
                        <p className="text-sm text-slate-500 mt-1">Ringkasan performa bengkel hari ini</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <StatCard label="Total Customer" value={data?.totalCustomer || 0} icon={Users} color="blue" />
                    <StatCard label="Total Perangkat" value={data?.totalPerangkat || 0} icon={MonitorSmartphone} color="slate" />
                    <StatCard label="Tiket Aktif" value={data?.tiketAktif || 0} icon={Ticket} color="amber" />
                    <StatCard label="Tiket Selesai" value={data?.tiketSelesai || 0} icon={CheckCircle2} color="green" />
                    <StatCard label="Pendapatan (Bulan Ini)" value={formatRupiah(data?.pendapatanBulanIni || 0)} icon={BadgeDollarSign} color="indigo" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Distribusi Status Tiket</h2>
                        </div>
                        {data?.chartData?.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.3}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} dx={-10} />
                                        <Tooltip 
                                            cursor={{ fill: '#f8fafc', opacity: 0.4 }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                                            labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                                        />
                                        <Bar dataKey="value" fill="url(#colorValue)" radius={[8, 8, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-slate-400">Belum ada data tiket</div>
                        )}
                    </div>

                    {/* Sparepart hampir habis */}
                    <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-bold text-slate-900">Stok Menipis</h2>
                        </div>
                        {data?.sparepartHampirHabis?.length > 0 ? (
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                            <th className="font-semibold py-3 px-4 rounded-tl-lg">Nama Suku Cadang</th>
                                            <th className="font-semibold py-3 px-4 text-right rounded-tr-lg">Sisa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.sparepartHampirHabis.map((s) => (
                                            <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-4 font-medium text-slate-700">{s.nama}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                                        {s.stok}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 flex-1 flex flex-col justify-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mx-auto mb-3 text-emerald-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <p className="text-slate-600 font-medium">Stok Aman</p>
                                <p className="text-slate-400 text-sm mt-1">Semua sparepart mencukupi.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Dashboard Teknisi
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Teknisi</h1>
                    <p className="text-sm text-slate-500 mt-1">Tugas perbaikan dan diagnosis Anda hari ini</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Tiket Ditugaskan" value={data?.tiketDitugaskan || 0} icon={ClipboardList} color="blue" />
                <StatCard label="Menunggu Diagnosis" value={data?.menungguDiagnosis || 0} icon={Search} color="amber" />
                <StatCard label="Dalam Perbaikan" value={data?.dalamPerbaikan || 0} icon={Wrench} color="indigo" />
                <StatCard label="Selesai Diperbaiki" value={data?.tiketSelesai || 0} icon={CheckCircle2} color="green" />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Status Tugas Perbaikan Anda</h2>
                </div>
                {data?.chartData?.length > 0 ? (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValueTeknisi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                                        <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0.3}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} dx={-10} />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc', opacity: 0.4 }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                                />
                                <Bar dataKey="value" fill="url(#colorValueTeknisi)" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-400">Belum ada tugas tiket</div>
                )}
            </div>
        </div>
    );
}
