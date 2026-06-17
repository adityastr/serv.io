const prisma = require("../config/database");
const { generateNomorTiket } = require("../utils/tiket");

// Validasi transisi status yang diizinkan
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

// Mengambil seluruh tiket servis
async function getAll(req, res) {
    try {
        const { status, teknisi_id } = req.query;
        const where = {};

        if (status) where.status = status;
        if (teknisi_id) where.teknisi_id = Number(teknisi_id);

        // Hapus pembatasan - Teknisi sekarang bisa melihat semua tiket di list.
        // Hak akses edit/update sudah diamankan di frontend (detail) dan validasi di route.
        if (req.user.role === "teknisi") {
            if (where.teknisi_id !== undefined) delete where.teknisi_id;
        }

        const tikets = await prisma.tiketServis.findMany({
            where,
            include: {
                perangkat: { include: { customer: true } },
                teknisi: { select: { id: true, nama: true } },
            },
            orderBy: { created_at: "desc" },
        });

        return res.json(tikets);
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
}

// Mengambil tiket servis berdasarkan ID
async function getById(req, res) {
    try {
        const tiket = await prisma.tiketServis.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                perangkat: { include: { customer: true } },
                teknisi: { select: { id: true, nama: true } },
                diagnosis: true,
                log_perbaikan: { orderBy: { created_at: "desc" } },
                penggunaan_sparepart: { include: { sparepart: true } },
                invoice: true,
            },
        });

        if (!tiket) {
            return res.status(404).json({ message: "Tiket servis tidak ditemukan" });
        }

        return res.json(tiket);
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
}

// Membuat tiket servis baru
async function create(req, res) {
    try {
        const { perangkat_id, teknisi_id, keluhan } = req.body;

        const perangkat = await prisma.perangkat.findUnique({ where: { id: Number(perangkat_id) } });
        if (!perangkat) {
            return res.status(404).json({ message: "Perangkat tidak ditemukan" });
        }

        // Generate nomor tiket
        const count = await prisma.tiketServis.count();
        const nomor_tiket = generateNomorTiket(count + 1);

        const tiket = await prisma.tiketServis.create({
            data: {
                nomor_tiket,
                perangkat_id: Number(perangkat_id),
                teknisi_id: teknisi_id ? Number(teknisi_id) : null,
                keluhan,
                status: "diterima",
            },
            include: {
                perangkat: { include: { customer: true } },
                teknisi: { select: { id: true, nama: true } },
            },
        });

        return res.status(201).json({ message: "Tiket servis berhasil dibuat", data: tiket });
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
}

// Memperbarui tiket servis (status, teknisi)
async function update(req, res) {
    try {
        const { status, teknisi_id, keluhan } = req.body;
        const id = Number(req.params.id);

        const tiket = await prisma.tiketServis.findUnique({ where: { id } });
        if (!tiket) {
            return res.status(404).json({ message: "Tiket servis tidak ditemukan" });
        }

        // Validasi transisi status
        if (status && status !== tiket.status) {
            const allowed = STATUS_TRANSITIONS[tiket.status] || [];
            if (!allowed.includes(status)) {
                return res.status(400).json({
                    message: `Transisi status tidak valid: ${tiket.status} → ${status}`,
                });
            }

            // RBAC: Teknisi hanya bisa mengubah status terkait perbaikan
            if (req.user.role === "teknisi" && !["dalam_perbaikan", "selesai"].includes(status)) {
                return res.status(403).json({
                    message: "Akses ditolak: Teknisi hanya diizinkan memperbarui status ke 'dalam_perbaikan' atau 'selesai'",
                });
            }
        }

        const updated = await prisma.tiketServis.update({
            where: { id },
            data: {
                status: status || undefined,
                teknisi_id: teknisi_id !== undefined ? (teknisi_id ? Number(teknisi_id) : null) : undefined,
                keluhan: keluhan || undefined,
            },
            include: {
                perangkat: { include: { customer: true } },
                teknisi: { select: { id: true, nama: true } },
            },
        });

        return res.json({ message: "Tiket servis berhasil diperbarui", data: updated });
    } catch (error) {
        return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
}

module.exports = { getAll, getById, create, update };
