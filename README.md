# UdaraJalan (Mobile Native Clean Architecture & Clean Mobility IoT Sensing)

> **Platform Pemantauan Kualitas Udara dan Mikroklimat Hiper-Lokal Berbasis Armada Motor Listrik Bergerak (*Crowdsensed Fleet*) DKI Jakarta.**  
> Dibangun dengan standar **Native Clean Design Guidelines**, arsitektur **SwiftUI Native (Swift 6)**, serta **Prototipe Web Interaktif Responsif**.

---

## 1. Ikhtisar Produk & Spesifikasi Dokumen

Proyek ini dikerjakan secara menyeluruh berdasarkan dua dokumen acuan:
1. [**PRD.md**](file:///d:/Mufath/Project/UdaraJalan/PRD.md): Dokumen Kebutuhan Produk (Eksekutif, Personas, 7 Epics Fungsional, Non-Fungsional, Kepatuhan Privasi UU PDP No. 27/2022, Metrik Keberhasilan).
2. [**DESIGN.md**](file:///d:/Mufath/Project/UdaraJalan/DESIGN.md) & [**DESIGN_SYSTEM.md**](file:///d:/Mufath/Project/UdaraJalan/DESIGN_SYSTEM.md): Dokumentasi Desain Sistem Lengkap (Design Tokens, Component Hierarchy, Wireframes, State Interactions, Anti-Slop Constraints).

---

## 2. Prinsip Desain Anti-Slop (Strict Constraints)

* **No Dark Navy / Cyberpunk Glow:** Seluruh tampilan mitra menggunakan **Light Mode Standar** (`#F2F2F7` untuk *System Grouped Background* dan `#FFFFFF` untuk *Card Surface*).
* **Quiet Chrome & Focused Moments:** Navigasi dan latar chrome tetap tenang; warna hanya diberikan pada metrik esensial (gauge progres, polyline kualitas udara).
* **Peta Vektor Bersih:** Peta menggunakan estetika vektor bersih dengan jalanan bernuansa abu-abu dan kuning lembut.
* **Hierarki Tipografi Terstruktur:** Menggunakan skala tipografi terstruktur (Large Title 34pt, Headline 17pt, `tabular-nums` untuk angka telemetri tanpa lonjakan visual).
* **Bahan Translusen Terbatas:** Efek translusen hanya digunakan pada Top Navigation Bar dan Bottom Tab Bar.

---

## 3. Fitur Utama yang Telah Diimplementasikan

### 🛵 A. Dashboard Mitra (Driver View)
* **Header & Status Alat Clip-on:** Menampilkan nama pengemudi (Bang Rian), nomor armada EV (`EV-FLT #B-4819-SXX`), persentase baterai LiFePO4 (`84%`), dan status sensor Sensirion SPS30 "Normal".
* **Card Capaian:** Angka utama `14.850 Pts` (34pt Bold), konversi moneter langsung (`Rp1.782.000`), dan gauge `ProgressView` native (74% dari target 20.000 Pts).
* **Anti-Cheat Engine Monitor:** Validasi fusi multi-sensor real-time (Laju GNSS 10–65 km/j, Getaran Akselerometer motor listrik RMS > 0.15g, 1 Hz u-blox fix).
* **Simulasi Anomali Interaktif:** Tombol uji untuk beralih seketika antara berkendara normal vs skenario curang (*Mock GPS* / smartphone ditaruh di meja tanpa getaran 0.0g).
* **Card Misi Ruas Heksagon (Uber H3):** Widget mini vektor peta koridor Sudirman-Thamrin, multiplier `2x Points Zone` (Rp240/km), dan tombol *Mulai Navigasi*.
* **Status Telemetri & Auto-Cleaning:** Pembacaan Sensirion SPS30 (`18.2 µg/m³`) & SHT40 (`31.2°C / 68% RH`), buffer SQLite offline (0 pending), dan hitung mundur siklus auto-cleaning.

### 🏝️ B. Dynamic Island & Live Activity (Biker Mode)
* **Compact Mode:** Ikon motor listrik + jarak `6.2 Km` tervalidasi + titik hijau telemetri aktif.
* **Expanded Live Activity (Dapat Di-tap):** Tampilan interaktif pembacaan PM2.5 real-time, laju poin (`+Rp120/km`), sisa baterai LiFePO4, dan status validasi anti-curang.

### 🗺️ C. Peta Publik Warga (Air Quality View)
* **Vektor Peta DKI Jakarta:** Koridor Jl. Senopati, Jl. Rasuna Said, Jl. Jend. Sudirman, Jl. Gatot Subroto, dan Underpass Kuningan.
* **Kategori Warna Polyline Standar:**
  * 🟢 **Hijau (`#34C759`):** Baik (0 – 15.0 µg/m³)
  * 🟡 **Kuning (`#FF9500`):** Sedang (15.1 – 35.4 µg/m³)
  * 🔴 **Merah (`#FF3B30`):** Tidak Sehat (35.5 – 55.4 µg/m³)
  * 🟣 **Ungu (`#AF52DE`):** Sangat Tidak Sehat / Bahaya (> 55.5 µg/m³)
* **Top Floating Search Bar & Filter Layer:** Pencarian jalan + toggle antara layer PM2.5 vs Suhu Mikro SHT40.
* **Interactive Bottom Sheet:**
  * Detail ruas jalan yang dipilih + angka PM2.5.
  * Badge **Data Indikatif** & Pill **Skor Keyakinan (*Confidence Score*)**.
  * **Low-Exposure Route Planner:** Komparasi langsung Rute Tercepat (8 min @ 42 µg/m³) vs Rute Rendah Polusi (11 min @ 16 µg/m³ — menurunkan paparan PM2.5 hingga 62%).

### 💳 D. Dompet Mitra & Reward Engine
* Saldo aktif `Rp1.782.000` / `14.850 Pts` tervalidasi.
* Rincian tarif dasar Rp120/km dan tarif zona misi 2x lipat (Rp240/km).
* Modal pencairan instan ke dompet digital (GoPay, OVO, DANA).
* Opsi penukaran voucher penggantian baterai / servis motor listrik.
* Riwayat sesi perjalanan dengan label audit anti-curang.

### 🔒 E. Profil & Kepatuhan Privasi (UU PDP No. 27/2022)
* **Zona Privasi Kediaman (500m Geofence Cloaking):** Pengacakan / pemutusan logging koordinat di sekitar rumah tinggal mitra.
* **Pseudonimisasi Spasial:** Tokenisasi kriptografi SHA-256 antara pelat nomor EV dan data polusi publik.
* **Manajemen Buffer Offline:** Kapasitas hingga 72 jam telemetri saat blankspot.
* **Pembersihan Laser Otomatis:** Tombol manual untuk menjalankan prosedur *auto-cleaning* laser Sensirion SPS30.

---

## 4. Struktur Proyek

```
UdaraJalan/
├── PRD.md                                 # Product Requirement Document Lengkap
├── DESIGN.md                              # Dokumentasi Desain Sistem UI/UX
├── DESIGN_SYSTEM.md                       # Pedoman Desain Sistem Komprehensif
├── package.json                           # Root scripts runner
├── native/                                # KODE NATIVE SWIFTUI (Swift 6)
│   └── UdaraJalan/
│       ├── App/
│       │   └── UdaraJalanApp.swift        # App Lifecycle & Tab Navigation
│       ├── Models/
│       │   ├── TelemetryModels.swift      # Model Telemetri, Status Alat, H3 Zone
│       │   └── RouteModel.swift           # Model Ruas Jalan & Low-Exposure Route
│       ├── Services/
│       │   ├── AntiCheatEngine.swift      # Fusi GNSS + 3-Axis MEMS RMS Validator
│       │   └── BLETelemetryManager.swift  # BLE 5.2 Manager & Offline Buffer
│       ├── ViewModels/
│       │   ├── DriverViewModel.swift      # ViewModel Dashboard Mitra
│       │   └── PublicMapViewModel.swift   # ViewModel Peta Warga & Sheet
│       └── Views/
│           ├── MitraDashboardView.swift   # Skrin Utama Mitra Driver
│           ├── PublicMapView.swift        # Skrin Peta Warga & Sheet
│           ├── WalletView.swift           # Skrin Dompet & Penarikan Reward
│           ├── ProfilePrivacyView.swift   # Skrin Privasi UU PDP & Perangkat
│           └── DynamicIslandLiveActivity.swift # Widget Dynamic Island
└── web/                                   # PROTOTIPE WEB INTERAKTIF
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── types.ts                       # Type definitions
        ├── data/mockData.ts               # Data simulasi jalan Jakarta & telemetri
        ├── components/
        │   ├── PhoneFrame.tsx             # Layout Auto-Responsive Fluid
        │   ├── DynamicIsland.tsx          # Dynamic Island & Expanded Activity
        │   ├── MitraDashboard.tsx         # Dashboard Mitra (Driver View)
        │   ├── PublicMap.tsx              # Peta Vektor Interaktif Jakarta
        │   ├── WalletView.tsx             # Dompet & Riwayat Reward
        │   └── ProfilePrivacy.tsx         # Privasi & Pemeliharaan Sensor
        ├── App.tsx
        └── main.tsx
```

---

## 5. Cara Menjalankan Prototipe Web

Untuk menjalankan prototipe interaktif di browser Anda:

```bash
# Dari root direktori UdaraJalan:
npm run dev
```

Buka URL yang ditampilkan di terminal (biasanya `http://localhost:3000`).

Di dalam prototipe Anda dapat:
1. Mengetuk **Dynamic Island** di bagian atas untuk membuka mode *Expanded Biker Mode*.
2. Menekan tombol **"Simulasi Anomali"** untuk melihat reaksi proteksi *Anti-Cheat Engine*.
3. Berpindah tab ke **Peta Warga** dan mengetuk ruas-ruas jalan di Jakarta untuk membuka lembar informasi kualitas udara dan mencoba kalkulasi **Rute Rendah Polusi**.
4. Melakukan simulasi penarikan saldo di tab **Dompet**.
5. Menjalankan siklus pembersihan laser Sensirion SPS30 di tab **Privasi**.
6. Menikmati antarmuka yang otomatis menyesuaikan (*auto-adaptive*) dengan ukuran layar perangkat Anda tanpa frame buatan (smartphone, tablet, maupun desktop).
