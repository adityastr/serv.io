const prisma = require("../config/database");

// Dashboard Admin
async function adminDashboard(req, res) {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalCustomer,
            totalPerangkat,
            tiketAktif,
            tiketSelesai,
            sparepartHampirHabis,
            pendapatanBulanIni,
            tiketBerdasarkanStatus
        ] = await Promise.all([
            prisma.customer.count(),
            prisma.perangkat.count(),
            prisma.tiketServis.count({
                where: {
                    status: {
                        notIn: ["selesai", "diambil", "dibatalkan"],
                    },
                },
            }),
            prisma.tiketServis.count({
                where: { status: { in: ["selesai", "diambil"] } },
            }),
            prisma.sparepart.findMany({
                where: { stok: { lte: 5 } },
                orderBy: { stok: "asc" },
            }),
            prisma.invoice.aggregate({
                where: { created_at: { gte: startOfMonth } },
                _sum: { total_biaya: true },
            }),
            prisma.tiketServis.groupBy({
                by: ['status'],
                _count: { _all: true }
            })
        ]);

        // Transform chart data
        const chartData = tiketBerdasarkanStatus.map(item => ({
            name: item.status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            value: item._count._all
        }));

        return res.json({
            totalCustomer,
            totalPerangkat,
            tiketAktif,
            tiketSelesai,
            sparepartHampirHabis,
            pendapatanBulanIni: pendapatanBulanIni._sum.total_biaya || 0,
            chartData
        });
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
}

// Dashboard Teknisi
async function teknisiDashboard(req, res) {
    try {
        const teknisiId = req.user.id;

        const [tiketDitugaskan, menungguDiagnosis, dalamPerbaikan, tiketSelesai, tiketBerdasarkanStatus] =
            await Promise.all([
                prisma.tiketServis.count({
                    where: { teknisi_id: teknisiId },
                }),
                prisma.tiketServis.count({
                    where: { teknisi_id: teknisiId, status: "diterima" },
                }),
                prisma.tiketServis.count({
                    where: { teknisi_id: teknisiId, status: "dalam_perbaikan" },
                }),
                prisma.tiketServis.count({
                    where: {
                        teknisi_id: teknisiId,
                        status: { in: ["selesai", "diambil"] },
                    },
                }),
                prisma.tiketServis.groupBy({
                    by: ['status'],
                    where: { teknisi_id: teknisiId },
                    _count: { _all: true }
                })
            ]);

        // Transform chart data
        const chartData = tiketBerdasarkanStatus.map(item => ({
            name: item.status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            value: item._count._all
        }));

        return res.json({
            tiketDitugaskan,
            menungguDiagnosis,
            dalamPerbaikan,
            tiketSelesai,
            chartData
        });
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
}

// Daftar teknisi untuk dropdown
async function teknisiList(req, res) {
    try {
        const teknisis = await prisma.user.findMany({
            where: { role: "teknisi" },
            select: { id: true, nama: true, email: true },
        });

        return res.json(teknisis);
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
}

module.exports = { adminDashboard, teknisiDashboard, teknisiList };
