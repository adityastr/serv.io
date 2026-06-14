# Serv.io
Sistem Manajemen Bengkel Perbaikan Perangkat Elektronik dengan fitur terintegrasi mulai dari pendaftaran customer, inventarisasi suku cadang, pelacakan status perbaikan, log pengerjaan teknisi, hingga pembuatan invoice pembayaran.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL dengan Prisma ORM.
- **Autentikasi**: JSON Web Token (JWT).

---

## Struktur Relasi Database (ERD)
Sistem ini menggunakan struktur relasional untuk menghubungkan entitas Customer, Perangkat, Tiket Servis, Sparepart, dan Log Perbaikan. 

```mermaid
erDiagram
    User ||--o{ TiketServis : "teknisi"
    User {
        int id PK
        string nama
        string email
        string password
        enum role "admin, teknisi"
    }

    Customer ||--o{ Perangkat : "memiliki"
    Customer ||--o{ TiketServis : "mengajukan"
    Customer {
        int id PK
        string nama
        string email
        string telepon
        string alamat
    }

    Perangkat ||--o{ TiketServis : "diperbaiki di"
    Perangkat {
        int id PK
        int customer_id FK
        string jenis_perangkat
        string merk
        string nomor_seri
    }

    TiketServis ||--o{ Diagnosis : "memiliki"
    TiketServis ||--o{ LogPerbaikan : "mencatat"
    TiketServis ||--o{ TiketSparepart : "menggunakan"
    TiketServis ||--o| Invoice : "ditagihkan"
    TiketServis {
        int id PK
        int customer_id FK
        int perangkat_id FK
        int teknisi_id FK
        string keluhan
        string status "Diterima, Dalam Perbaikan, Selesai, dll"
        string nomor_resi "Unik untuk Tracking"
    }

    Sparepart ||--o{ TiketSparepart : "digunakan pada"
    Sparepart {
        int id PK
        string nama
        string kategori
        int stok
        int harga
    }

    TiketSparepart {
        int id PK
        int tiket_id FK
        int sparepart_id FK
        int jumlah
        int harga_satuan
    }

    LogPerbaikan {
        int id PK
        int tiket_id FK
        string keterangan
        string foto_url
        datetime created_at
    }

    Invoice {
        int id PK
        int tiket_id FK
        int total_biaya
        string status_pembayaran "Belum Dibayar, Lunas"
    }
```

---

## Diagram Alur (System Flowchart)

```mermaid
flowchart TD
    A[Customer Datang bawa Perangkat] --> B{Pernah Terdaftar?};
    B -- Belum --> C[Admin Mendaftarkan Data Customer];
    B -- Sudah --> D[Admin Mendaftarkan Data Perangkat Baru/Pilih yang Ada];
    C --> D;
    D --> E[Admin Membuat Tiket Servis & Menugaskan Teknisi];
    E --> F[Generate Nomor Resi Tracking];
    
    F --> G[Teknisi Melakukan Diagnosis Perangkat];
    G --> H{Butuh Suku Cadang?};
    H -- Ya --> I[Teknisi Request Sparepart];
    I --> J[Persetujuan Cost oleh Customer];
    J -- Disetujui --> K;
    H -- Tidak --> K[Teknisi Memulai Perbaikan];
    
    K --> L[Teknisi Upload Foto & Catat Log Perbaikan berkala];
    L --> M[Perbaikan Selesai];
    M --> N[Admin Menerbitkan Invoice];
    N --> O[Customer Membayar & Mengambil Barang];
```

---

## Alur Pengguna (Use Case Diagram)

```mermaid
usecaseDiagram
    actor Admin
    actor Teknisi
    actor CustomerPublic as Customer (Publik)

    package "Serv.io System" {
        usecase "Akses Dashboard & Statistik" as UC1
        usecase "Kelola Data Customer & Perangkat" as UC2
        usecase "Buat Tiket Servis" as UC3
        usecase "Kelola Stok Sparepart" as UC4
        usecase "Terbitkan Invoice" as UC5
        
        usecase "Diagnosis Perangkat" as UC6
        usecase "Input Log & Foto Perbaikan" as UC7
        usecase "Ubah Status Perbaikan" as UC8
        
        usecase "Lacak Status via No. Resi" as UC9
    }

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5

    Teknisi --> UC1
    Teknisi --> UC6
    Teknisi --> UC7
    Teknisi --> UC8
    Teknisi --> UC4

    CustomerPublic --> UC9
```

---

## Cara Instalasi dan Setup

### Prasyarat Sistem
- Node.js versi 18 atau lebih baru.
- MySQL Server (bisa menggunakan XAMPP atau Docker).

### 1. Setup Database
1. Buka MySQL server Anda.
2. Buat database kosong dengan nama `repair_workshop` (atau nama lain sesuai preferensi).

### 2. Setup Backend
1. Buka terminal, masuk ke direktori `backend`.
2. Jalankan perintah `npm install`.
3. Buat file `.env` di dalam folder `backend` dengan isi format berikut:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/repair_workshop"
   JWT_SECRET="rahasia_super_aman"
   PORT=5000
   ```
   *Catatan: Sesuaikan username (`root`), password (`:password`), dan nama database jika berbeda.*
4. Sinkronisasi struktur database menggunakan Prisma:
   ```bash
   npx prisma db push
   ```
5. Masukkan data awal (akun Admin, Teknisi, dan data dummy) ke dalam database:
   ```bash
   node seed.js
   ```
6. Jalankan server backend:
   ```bash
   npm run dev
   ```
   *Server akan berjalan di http://localhost:5000.*

### 3. Setup Frontend
1. Buka terminal baru, masuk ke direktori `frontend`.
2. Jalankan perintah `npm install`.
3. Jalankan server frontend:
   ```bash
   npm run dev
   ```
4. Buka URL yang diberikan di terminal (biasanya `http://localhost:5173`) pada browser Anda.

### Akun Akses Default
Gunakan akun berikut untuk login pertama kali (dibuat oleh `seed.js`):
- **Admin**: Email `admin@repair.com` | Password `password123`
- **Teknisi**: Email `teknisi@repair.com` | Password `password123`
