require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
    console.log("Memulai proses seeding data realistis...");

    // Clear existing data (optional, but good for fresh seed)
    await prisma.invoice.deleteMany();
    await prisma.penggunaanSparepart.deleteMany();
    await prisma.logPerbaikan.deleteMany();
    await prisma.diagnosis.deleteMany();
    await prisma.tiketServis.deleteMany();
    await prisma.perangkat.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.sparepart.deleteMany();
    await prisma.user.deleteMany();

    const password = await bcrypt.hash("password123", 10);

    console.log("1. Membuat Users...");
    const admin = await prisma.user.create({
        data: { nama: "Admin Utama", email: "admin@workshop.com", password, role: "admin" }
    });
    
    const teknisis = await Promise.all([
        prisma.user.create({ data: { nama: "Budi Santoso", email: "teknisi1@workshop.com", password, role: "teknisi" } }),
        prisma.user.create({ data: { nama: "Andi Wijaya", email: "teknisi2@workshop.com", password, role: "teknisi" } }),
        prisma.user.create({ data: { nama: "Reza Rahadian", email: "teknisi3@workshop.com", password, role: "teknisi" } }),
    ]);

    console.log("2. Membuat Customers...");
    const customerData = [
        { nama: "Rizky Pratama", nomor_telepon: "08123456789", alamat: "Jl. Sudirman No. 10, Jakarta" },
        { nama: "Siti Nurhaliza", nomor_telepon: "08567890123", alamat: "Jl. Thamrin No. 25, Bandung" },
        { nama: "Dewi Lestari", nomor_telepon: "08789012345", alamat: "Jl. Gatot Subroto No. 5, Surabaya" },
        { nama: "Ahmad Dahlan", nomor_telepon: "08112233445", alamat: "Jl. Merdeka No. 11, Yogyakarta" },
        { nama: "Kevin Sanjaya", nomor_telepon: "08223344556", alamat: "Jl. Pahlawan No. 4, Semarang" },
        { nama: "Agnes Monica", nomor_telepon: "08334455667", alamat: "Jl. Asia Afrika No. 9, Bandung" },
        { nama: "Deddy Corbuzier", nomor_telepon: "08445566778", alamat: "Jl. Bintaro Utama No. 7, Tangsel" },
        { nama: "Raisa Andriana", nomor_telepon: "08556677889", alamat: "Jl. Kemang Raya No. 12, Jakarta" }
    ];
    
    const customers = [];
    for (const data of customerData) {
        customers.push(await prisma.customer.create({ data }));
    }

    console.log("3. Membuat Perangkat...");
    const perangkatData = [
        { c: 0, jenis: "Laptop", merk: "ASUS", mod: "ROG Zephyrus G14", sn: "ASUS-2024-001" },
        { c: 0, jenis: "Laptop", merk: "Apple", mod: "MacBook Pro M2", sn: "MAC-2023-992" },
        { c: 1, jenis: "Desktop PC", merk: "HP", mod: "Pavilion Desktop", sn: "HP-2024-002" },
        { c: 2, jenis: "Laptop", merk: "Lenovo", mod: "ThinkPad X1 Carbon", sn: "LEN-2024-003" },
        { c: 3, jenis: "Desktop PC", merk: "Lenovo", mod: "ThinkCentre M70s", sn: "LEN-1122-334" },
        { c: 4, jenis: "Laptop", merk: "Acer", mod: "Predator Helios 300", sn: "ACR-2021-004" },
        { c: 4, jenis: "Desktop PC", merk: "ASUS", mod: "ROG Strix GT15", sn: "ROG-5544-332" },
        { c: 5, jenis: "Laptop", merk: "Dell", mod: "XPS 15", sn: "DEL-2023-005" },
        { c: 6, jenis: "Desktop PC", merk: "Custom Build", mod: "PC Gaming Rakitan", sn: "-" },
        { c: 7, jenis: "Laptop", merk: "MSI", mod: "Modern 14", sn: "MSI-2022-006" }
    ];

    const perangkats = [];
    for (const p of perangkatData) {
        perangkats.push(await prisma.perangkat.create({
            data: {
                customer_id: customers[p.c].id,
                jenis_perangkat: p.jenis,
                merek: p.merk,
                model: p.mod,
                serial_number: p.sn,
            }
        }));
    }

    console.log("4. Membuat Spareparts...");
    const sparepartData = [
        { kategori: "Laptop, Desktop PC", nama: "RAM DDR4 8GB", stok: 15, harga: 450000 },
        { kategori: "Laptop, Desktop PC", nama: "RAM DDR4 16GB", stok: 10, harga: 850000 },
        { kategori: "Laptop, Desktop PC", nama: "RAM DDR5 16GB", stok: 8, harga: 1250000 },
        { kategori: "Laptop, Desktop PC", nama: "SSD NVMe 512GB", stok: 12, harga: 650000 },
        { kategori: "Laptop, Desktop PC", nama: "SSD NVMe 1TB", stok: 5, harga: 1150000 },
        { kategori: "Desktop PC", nama: "HDD SATA 1TB", stok: 4, harga: 550000 },
        { kategori: "Desktop PC", nama: "Power Supply 550W 80+", stok: 6, harga: 750000 },
        { kategori: "Laptop, Desktop PC", nama: "Thermal Paste Arctic MX-4", stok: 25, harga: 85000 },
        { kategori: "Laptop", nama: "Kipas Laptop Universal", stok: 10, harga: 150000 },
        { kategori: "Laptop", nama: "Keyboard Laptop ASUS ROG", stok: 2, harga: 850000 },
        { kategori: "Laptop", nama: "Layar LCD 14 inch FHD", stok: 3, harga: 1250000 },
        { kategori: "Laptop", nama: "Baterai MacBook Pro M2", stok: 1, harga: 2500000 },
        { kategori: "Desktop PC", nama: "Casing Fan RGB 120mm", stok: 20, harga: 85000 },
        { kategori: "Desktop PC", nama: "Motherboard PC H610", stok: 4, harga: 1350000 },
        { kategori: "Desktop PC", nama: "CPU Cooler Tower", stok: 2, harga: 550000 },
        { kategori: "Desktop PC", nama: "Kabel SATA III Data", stok: 5, harga: 125000 }
    ];

    const spareparts = [];
    for (const sp of sparepartData) {
        spareparts.push(await prisma.sparepart.create({ data: sp }));
    }

    console.log("5. Membuat Tiket Servis, Diagnosis, Log Perbaikan, Penggunaan Sparepart, dan Invoice...");
    
    // Helper for numbering
    let count = 0;
    const generateNomorTiket = () => {
        count++;
        return `SRV-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    };

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // tickets from past 30 days

    // Tiket 1: Diterima (Baru masuk, belum ditugaskan/diambil)
    await prisma.tiketServis.create({
        data: {
            nomor_tiket: generateNomorTiket(),
            perangkat_id: perangkats[0].id,
            teknisi_id: null,
            keluhan: "Laptop mati total terkena tumpahan air kopi.",
            status: "diterima",
            created_at: randomDate(new Date(Date.now() - 1 * 86400000), new Date())
        }
    });

    // Tiket 2: Didiagnosis (Menunggu estimasi dari admin)
    await prisma.tiketServis.create({
        data: {
            nomor_tiket: generateNomorTiket(),
            perangkat_id: perangkats[4].id, // Lenovo Desktop
            teknisi_id: teknisis[1].id,
            keluhan: "Sering mati sendiri saat digunakan lebih dari 1 jam.",
            status: "didiagnosis",
            created_at: randomDate(new Date(Date.now() - 4 * 86400000), new Date(Date.now() - 3 * 86400000)),
            diagnosis: {
                create: {
                    masalah: "Thermal paste prosesor kering dan kipas kotor parah (Overheating).",
                    solusi: "Pembersihan total, ganti thermal paste, dan ganti kipas pendingin CPU.",
                    estimasi_biaya: 350000
                }
            }
        }
    });

    // Tiket 3: Menunggu Persetujuan (Sudah didiagnosis, nunggu konfirmasi user)
    await prisma.tiketServis.create({
        data: {
            nomor_tiket: generateNomorTiket(),
            perangkat_id: perangkats[1].id, // MacBook Pro
            teknisi_id: teknisis[2].id,
            keluhan: "Baterai bocor parah, tahan cuma 30 menit kalau cabut charger.",
            status: "menunggu_persetujuan",
            created_at: randomDate(new Date(Date.now() - 5 * 86400000), new Date(Date.now() - 4 * 86400000)),
            diagnosis: {
                create: {
                    masalah: "Cycle count baterai sudah melebihi 1000, sel baterai menggembung.",
                    solusi: "Ganti baterai original MacBook Pro M2.",
                    estimasi_biaya: 2800000
                }
            }
        }
    });

    // Tiket 4: Disetujui (User setuju, siap dikerjakan)
    await prisma.tiketServis.create({
        data: {
            nomor_tiket: generateNomorTiket(),
            perangkat_id: perangkats[8].id, // PC Rakitan
            teknisi_id: teknisis[0].id,
            keluhan: "PC sering bluescreen saat booting Windows.",
            status: "disetujui",
            created_at: randomDate(new Date(Date.now() - 6 * 86400000), new Date(Date.now() - 5 * 86400000)),
            diagnosis: {
                create: {
                    masalah: "SSD Bad sector dan health sisa 10%.",
                    solusi: "Ganti SSD NVMe baru 512GB dan instalasi ulang Windows.",
                    estimasi_biaya: 850000
                }
            }
        }
    });

    // Tiket 5: Dalam Perbaikan
    const t5 = await prisma.tiketServis.create({
        data: {
            nomor_tiket: generateNomorTiket(),
            perangkat_id: perangkats[7].id, // Dell XPS
            teknisi_id: teknisis[1].id,
            keluhan: "Engsel layar patah sebelah kanan.",
            status: "dalam_perbaikan",
            created_at: randomDate(new Date(Date.now() - 10 * 86400000), new Date(Date.now() - 8 * 86400000)),
            diagnosis: {
                create: {
                    masalah: "Dudukan engsel pada casing LCD pecah.",
                    solusi: "Repair dudukan engsel dengan lem khusus dan resin.",
                    estimasi_biaya: 350000
                }
            }
        }
    });
    
    // Log perbaikan untuk Tiket 5
    await prisma.logPerbaikan.createMany({
        data: [
            { tiket_id: t5.id, catatan: "Membongkar casing layar Dell XPS.", created_at: randomDate(new Date(Date.now() - 3 * 86400000), new Date(Date.now() - 2 * 86400000)) },
            { tiket_id: t5.id, catatan: "Membersihkan serpihan plastik patah dan mulai mengecor resin pada dudukan baut engsel.", created_at: randomDate(new Date(Date.now() - 2 * 86400000), new Date(Date.now() - 1 * 86400000)) }
        ]
    });

    // Tiket 6: Selesai
    const t6 = await prisma.tiketServis.create({
        data: {
            nomor_tiket: generateNomorTiket(),
            perangkat_id: perangkats[5].id, // Acer Predator
            teknisi_id: teknisis[2].id,
            keluhan: "Keyboard beberapa tombol tidak fungsi (W, A, S, D).",
            status: "selesai",
            created_at: randomDate(new Date(Date.now() - 15 * 86400000), new Date(Date.now() - 12 * 86400000)),
            diagnosis: {
                create: {
                    masalah: "Jalur matriks keyboard putus karena indikasi pernah kena air ringan.",
                    solusi: "Ganti modul keyboard Acer Predator.",
                    estimasi_biaya: 650000
                }
            }
        }
    });

    // Log perbaikan untuk Tiket 6
    await prisma.logPerbaikan.create({
        data: { tiket_id: t6.id, catatan: "Bongkar total karena keyboard tanam dengan palmrest.", created_at: randomDate(new Date(Date.now() - 10 * 86400000), new Date(Date.now() - 9 * 86400000)) }
    });
    await prisma.logPerbaikan.create({
        data: { tiket_id: t6.id, catatan: "Keyboard baru berhasil dipasang dan di-solder ulang rivet plastiknya.", created_at: randomDate(new Date(Date.now() - 9 * 86400000), new Date(Date.now() - 8 * 86400000)) }
    });
    await prisma.logPerbaikan.create({
        data: { tiket_id: t6.id, catatan: "Testing seluruh tombol OK, perbaikan selesai.", created_at: randomDate(new Date(Date.now() - 8 * 86400000), new Date(Date.now() - 7 * 86400000)) }
    });

    // Invoice Tiket 6
    await prisma.invoice.create({
        data: {
            tiket_id: t6.id,
            biaya_jasa: 250000,
            biaya_sparepart: 400000, // asumsikan keyboard harga 400rb, walau di db ga dicatat usage nya
            total_biaya: 650000,
            created_at: new Date()
        }
    });

    // Tiket 7: Diambil
    const t7 = await prisma.tiketServis.create({
        data: {
            nomor_tiket: generateNomorTiket(),
            perangkat_id: perangkats[2].id, // HP Desktop
            teknisi_id: teknisis[0].id,
            keluhan: "Mati total. Tidak ada tanda kehidupan saat tombol power ditekan.",
            status: "diambil",
            created_at: randomDate(new Date(Date.now() - 25 * 86400000), new Date(Date.now() - 22 * 86400000)),
            diagnosis: {
                create: {
                    masalah: "Power Supply rusak/short akibat lonjakan tegangan.",
                    solusi: "Ganti Power Supply Unit dengan kapasitas yang setara (550W).",
                    estimasi_biaya: 900000
                }
            }
        }
    });

    // Penggunaan Sparepart Tiket 7
    await prisma.penggunaanSparepart.create({
        data: {
            tiket_id: t7.id,
            sparepart_id: spareparts[6].id, // Power supply 550W
            jumlah: 1
        }
    });

    // Log perbaikan Tiket 7
    await prisma.logPerbaikan.create({
        data: { tiket_id: t7.id, catatan: "Membongkar casing PC dan melepas PSU lama yang rusak.", created_at: randomDate(new Date(Date.now() - 20 * 86400000), new Date(Date.now() - 19 * 86400000)) }
    });
    await prisma.logPerbaikan.create({
        data: { tiket_id: t7.id, catatan: "Memasang PSU baru dan merapikan kabel (cable management). PC berhasil booting.", created_at: randomDate(new Date(Date.now() - 19 * 86400000), new Date(Date.now() - 18 * 86400000)) }
    });

    // Invoice Tiket 7
    await prisma.invoice.create({
        data: {
            tiket_id: t7.id,
            biaya_jasa: 150000,
            biaya_sparepart: 750000,
            total_biaya: 900000,
            created_at: randomDate(new Date(Date.now() - 18 * 86400000), new Date(Date.now() - 15 * 86400000))
        }
    });

    // Tiket 8: Dibatalkan
    await prisma.tiketServis.create({
        data: {
            nomor_tiket: generateNomorTiket(),
            perangkat_id: perangkats[6].id, // ASUS Desktop
            teknisi_id: teknisis[1].id,
            keluhan: "VGA Card tidak terbaca, artefak saat render 3D.",
            status: "dibatalkan",
            created_at: randomDate(new Date(Date.now() - 14 * 86400000), new Date(Date.now() - 12 * 86400000)),
            diagnosis: {
                create: {
                    masalah: "VRAM pada VGA Card rusak parah, tidak bisa diperbaiki.",
                    solusi: "Perlu ganti unit VGA Card baru.",
                    estimasi_biaya: 4500000
                }
            }
        }
    });

    console.log("Seeding selesai dengan suskes!");
    console.log("\n--- Akun Login ---");
    console.log("Admin  : admin@workshop.com / password123");
    console.log("Teknisi 1: teknisi1@workshop.com / password123");
    console.log("Teknisi 2: teknisi2@workshop.com / password123");
    console.log("Teknisi 3: teknisi3@workshop.com / password123");
}

main()
    .catch((e) => {
        console.error("Error saat seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
