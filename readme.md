# Computer Repair Workshop Management System

## Deskripsi Proyek

Computer Repair Workshop Management System adalah aplikasi web fullstack yang dirancang untuk membantu operasional toko servis komputer dan laptop dalam mengelola customer, perangkat, tiket servis, diagnosis, proses perbaikan, penggunaan sparepart, invoice, serta riwayat servis.

Sistem ini berfokus pada proses bisnis nyata yang umum digunakan oleh toko servis komputer skala kecil hingga menengah.

Target pengembangan:

* Fullstack Web Application
* Mudah dipresentasikan
* Tidak over-engineered
* Fokus pada proses bisnis
* Mudah dipahami dan dikembangkan

---

# Tujuan Sistem

## Permasalahan

Banyak toko servis komputer masih menggunakan:

* Buku catatan
* Spreadsheet
* Catatan WhatsApp

Hal tersebut menimbulkan beberapa masalah:

* Status servis sulit dilacak
* Riwayat servis tidak terdokumentasi dengan baik
* Penggunaan sparepart tidak tercatat
* Sulit mengetahui progres pengerjaan
* Sulit membuat laporan sederhana

## Solusi

Membangun sistem yang mampu:

* Mengelola data customer
* Mengelola data perangkat
* Mengelola tiket servis
* Mencatat diagnosis
* Mencatat aktivitas perbaikan
* Mengelola stok sparepart
* Membuat invoice
* Menyimpan riwayat servis

---

# Prinsip Pengembangan

Project harus mengikuti prinsip berikut:

* Fokus pada kebutuhan bisnis
* Hindari fitur yang tidak diperlukan
* Hindari over-engineering
* Utamakan keterbacaan kode
* Utamakan maintainability
* Gunakan struktur project yang sederhana
* Gunakan naming yang konsisten
* Seluruh fitur harus mudah diuji melalui Postman
* Seluruh fitur harus dapat didemokan tanpa layanan pihak ketiga

---

# Scope Sistem

## Fitur Utama

### Authentication

* Login
* Logout
* JWT Authentication

### Dashboard

* Dashboard Admin
* Dashboard Teknisi

### Customer

* Tambah customer
* Edit customer
* Hapus customer
* Detail customer
* Pencarian customer

### Perangkat

* Tambah perangkat
* Edit perangkat
* Hapus perangkat
* Detail perangkat

### Tiket Servis

* Membuat tiket servis
* Melihat tiket servis
* Mengubah status servis
* Melihat riwayat tiket

### Diagnosis

* Input hasil diagnosis
* Input estimasi biaya

### Log Perbaikan

* Mencatat aktivitas perbaikan

### Sparepart

* CRUD sparepart
* Pengurangan stok otomatis

### Invoice

* Perhitungan biaya servis
* Riwayat invoice

### Tracking Servis

Customer dapat melakukan pengecekan status servis menggunakan:

* Nomor Telepon
* Nomor Tiket

Tanpa perlu login.

---

# Yang Tidak Masuk Scope

Fitur berikut tidak akan dibuat:

* Customer Login
* Customer Dashboard
* E-Sign
* Approval Digital
* WhatsApp Gateway
* Email Notification
* Live Chat
* QR Code
* Payment Gateway
* Upload Dokumen
* Upload Foto
* AI Diagnosis
* Machine Learning
* Multi Cabang
* Multi Gudang
* Docker
* Microservices
* Redis
* Websocket

---

# Role Pengguna

## Admin

Memiliki akses penuh terhadap sistem.

Dapat melakukan:

* Kelola customer
* Kelola perangkat
* Kelola tiket servis
* Kelola sparepart
* Kelola invoice
* Melihat dashboard
* Menentukan teknisi

---

## Teknisi

Bertanggung jawab terhadap proses servis.

Dapat melakukan:

* Melihat tiket yang ditugaskan
* Mengisi diagnosis
* Mengubah status servis
* Menambah log perbaikan
* Menambahkan penggunaan sparepart

---

# Alur Bisnis

Customer datang ke toko

↓

Admin mencatat customer

↓

Admin mencatat perangkat

↓

Admin membuat tiket servis

↓

Status = Diterima

↓

Teknisi melakukan diagnosis

↓

Status = Didiagnosis

↓

Admin menghubungi customer

↓

Customer menyetujui perbaikan

↓

Status = Disetujui

↓

Teknisi melakukan perbaikan

↓

Status = Dalam Perbaikan

↓

Perbaikan selesai

↓

Status = Selesai

↓

Customer mengambil perangkat

↓

Status = Diambil

---

# Workflow Status

Status yang tersedia:

* Diterima
* Didiagnosis
* Menunggu Persetujuan
* Disetujui
* Dalam Perbaikan
* Selesai
* Diambil
* Dibatalkan

Validasi perpindahan status:

Diterima

↓

Didiagnosis

↓

Menunggu Persetujuan

↓

Disetujui

↓

Dalam Perbaikan

↓

Selesai

↓

Diambil

Atau:

Menunggu Persetujuan

↓

Dibatalkan

Sistem harus menolak perpindahan status yang tidak valid.

---

# Arsitektur Sistem

Frontend (React)

↓

REST API (Express)

↓

Prisma ORM

↓

MySQL Database

---

# Tech Stack

## Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

## Backend

* Node.js
* Express.js
* JWT
* bcrypt

## Database

* MySQL
* Prisma ORM

---

# Struktur Repository

```text
repair-workshop-system/

├── frontend/
├── backend/
└── README.md
```

---

# Struktur Frontend

```text
src/

├── assets/
├── components/
├── pages/
│
├── pages/dashboard/
├── pages/customer/
├── pages/perangkat/
├── pages/tiket-servis/
├── pages/diagnosis/
├── pages/sparepart/
├── pages/invoice/
├── pages/tracking/
│
├── routes/
├── services/
├── hooks/
├── utils/
└── App.jsx
```

---

# Struktur Backend

```text
src/

├── config/
├── middleware/
├── controllers/
├── services/
├── routes/
├── validations/
├── utils/
└── app.js
```

---

# Standar Penamaan

Gunakan Bahasa Indonesia.

Contoh:

```text
customer.controller.js
perangkat.controller.js
tiket-servis.controller.js
diagnosis.controller.js
log-perbaikan.controller.js
sparepart.controller.js
invoice.controller.js
```

Hindari nama file yang ambigu.

---

# Standar Komentar Kode

Gunakan Bahasa Indonesia.

Contoh:

```javascript
// Mengambil seluruh data customer
```

```javascript
// Memastikan status servis valid sebelum diperbarui
```

Komentar hanya digunakan jika benar-benar diperlukan.

Jangan menjelaskan kode yang sudah jelas.

---

# Desain Database

## users

```text
id
nama
email
password
role
created_at
```

---

## customer

```text
id
nama
nomor_telepon
alamat
created_at
```

---

## perangkat

```text
id
customer_id
jenis_perangkat
merek
model
serial_number
created_at
```

---

## tiket_servis

```text
id
nomor_tiket
perangkat_id
teknisi_id
keluhan
status
created_at
```

---

## diagnosis

```text
id
tiket_id
masalah
solusi
estimasi_biaya
created_at
```

---

## log_perbaikan

```text
id
tiket_id
catatan
created_at
```

---

## sparepart

```text
id
nama
stok
harga
created_at
```

---

## penggunaan_sparepart

```text
id
tiket_id
sparepart_id
jumlah
```

---

## invoice

```text
id
tiket_id
biaya_jasa
biaya_sparepart
total_biaya
created_at
```

---

# Dashboard Admin

Menampilkan:

* Total Customer
* Total Perangkat
* Total Tiket Aktif
* Total Tiket Selesai
* Sparepart Hampir Habis
* Pendapatan Bulan Ini

---

# Dashboard Teknisi

Menampilkan:

* Tiket Ditugaskan
* Menunggu Diagnosis
* Dalam Perbaikan
* Tiket Selesai

---

# REST API

## Authentication

```text
POST /auth/login
POST /auth/logout
```

## Customer

```text
GET /customer
GET /customer/:id
POST /customer
PUT /customer/:id
DELETE /customer/:id
```

## Perangkat

```text
GET /perangkat
GET /perangkat/:id
POST /perangkat
PUT /perangkat/:id
DELETE /perangkat/:id
```

## Tiket Servis

```text
GET /tiket-servis
GET /tiket-servis/:id
POST /tiket-servis
PUT /tiket-servis/:id
```

## Diagnosis

```text
POST /diagnosis
GET /diagnosis/:id
```

## Log Perbaikan

```text
POST /log-perbaikan
GET /log-perbaikan/:id
```

## Sparepart

```text
GET /sparepart
POST /sparepart
PUT /sparepart/:id
DELETE /sparepart/:id
```

## Invoice

```text
GET /invoice
POST /invoice
```

## Tracking

```text
POST /tracking
```

Request:

```json
{
  "nomorTelepon": "08123456789",
  "nomorTiket": "SRV-2026-001"
}
```

---

# UI/UX Guidelines

## Prinsip Desain

* Bersih
* Profesional
* Minimalis
* Mudah dibaca
* Fokus pada data

## Hindari

* Neon Color
* Cyberpunk Theme
* Glassmorphism berlebihan
* Gradient berlebihan
* AI-generated design pattern

## Warna

Primary:

* Slate 900
* Slate 800
* Slate 700

Accent:

* Blue 600
* Blue 700

Success:

* Green 600

Warning:

* Amber 500

Danger:

* Red 600

## Font

* Inter

atau

* Geist

## Layout

* Sidebar
* Top Navigation
* Responsive
* Data Table yang jelas
* Form yang sederhana

---


# Definition of Done

Project dianggap selesai apabila:

* Login berjalan
* Role berjalan
* CRUD berjalan
* Workflow servis berjalan
* Diagnosis berjalan
* Sparepart deduction berjalan
* Invoice berjalan
* Dashboard berjalan
* Tracking berjalan
* Seluruh endpoint dapat diuji melalui Postman
* Aplikasi dapat didemokan end-to-end tanpa error
