# UdaraJalan — Mobile Native Design System & UI/UX Specification
**Versi:** 1.0.0 (Native Clean System / Swift 6 / ActivityKit)  
**Peran:** Principal UI/UX Designer & Systems Architect  
**Target Produk:** UdaraJalan Mobile (Mitra Driver View & Warga Public View)  
**Kepatuhan:** Human-Centered Design Standards, UU PDP No. 27/2022, Strict Anti-Slop Constraints

---

## 1. Filosofi Desain & Anti-Slop Principles

UdaraJalan dirancang dengan estetika **CleanTech Minimalist** yang tenang, presisi, dan fungsional. Kami menolak gaya visual AI-generated (*vibecoded slop*) seperti latar neon cyberpunk, gradient ungu/cyan acak, efek glowing HUD sci-fi, dan akumulasi badge berlebihan (*badge soup*).

### 1.1 Strict Negative Constraints (Anti-Slop Rules)
1. **No Dark Navy / Cyberpunk Glow:** Seluruh tampilan mitra menggunakan **Light Mode Standar** (`#F2F2F7` untuk *System Grouped Background* dan `#FFFFFF` untuk *Inset Cards*). Tidak ada gradasi neon atau border bercahaya (*no glow effects*).
2. **Quiet Chrome & Content Hierarchy:** Latar chrome, tombol sekunder, dan navigasi tetap tenang. Elemen kaya warna (*rich visual moments*) hanya dialokasikan untuk metrik inti (misal: gauge target harian, garis polyline peta kualitas udara).
3. **No Game Grid Map:** Peta jalan mengadopsi standar peta vektor bersih—ruas jalan berwarna abu-abu lembut dan kuning netral, bukan grid neon bernuansa permainan.
4. **Authentic System Typography:** Dilarang menggunakan font tebal seragam tanpa hierarki. Menggunakan sistem tipografi terstruktur dengan ukuran dan bobot native. Angka metrik menggunakan `tabular-nums`.
5. **Restrained Vibrancy:** Material transparan (*Ultra-thin Material Blur*) hanya digunakan pada Top Navigation Bar dan Bottom Tab Bar saat konten meluncur di bawahnya. Kartu konten tetap solid `#FFFFFF` dengan bayangan lembut berdimensi natural.

### 1.2 Cognitive Load Reduction (Theo Mandel's 2nd Golden Rule)
> *"Kurangi beban ingatan: Makin banyak yang harus diingat pengguna, makin mudah ia salah."* — **Theo Mandel**

Dalam antarmuka mobilitas tinggi seperti UdaraJalan, beban kognitif diminimalkan dengan 4 pilar HCD:
1. **Recognition over Recall:** Seluruh status fusi sensor dan integritas data diverifikasi secara visual dengan badge deklaratif (misal: `(✓) Validasi Anti-Curang: Lolos`) tanpa memaksa mitra mengingat ambang desimal RMS getaran atau frekuensi GNSS.
2. **Tabular Numerals & Anti-Jitter:** Penerapan `tabular-nums` pada seluruh angka telemetri, kilometer, dan rupiah agar digit angka tidak melompat secara horizontal, menjaga fiksasi visual mata pengemudi.
3. **Automated Conversion:** Poin langsung dikonversi otomatis ke Rupiah riil dan persentase target harian untuk mengeliminasi kalkulasi aritmatika di kepala pengemudi saat di jalan.
4. **Progressive Disclosure:** Detail teknis kalibrasi optik laser SPS30 dan data IMU ditempatkan pada level sekunder (*Footnote/Caption*) agar fokus utama navigasi tetap jernih.

---

## 2. Design Tokens (Spesifikasi Fondasi)

### 2.1 Color Tokens (System Palette)

| Token Name | Nilai Hex / RGBA | Peran & Penggunaan | Kontras WCAG |
| :--- | :--- | :--- | :--- |
| `color.systemBackground` | `#FFFFFF` | Background utama skrin standar | Base |
| `color.systemGroupedBackground` | `#F2F2F7` | Background untuk Inset Grouped List & Form | Base |
| `color.secondarySystemGroupedBackground` | `#FFFFFF` | Background untuk kartu konten (*Inset Card*) | Base |
| `color.systemBlue` | `#007AFF` | Primary Action / Tint tombol navigasi aktif | 4.6 : 1 |
| `color.systemGreen` | `#34C759` | Status Valid, Anti-Cheat lolos, PM2.5 Baik (0-15 µg/m³) | 4.5 : 1 (pada abu/hitam) |
| `color.systemOrange` | `#FF9500` | Misi Ruas Heksagon (2x Multiplier), PM2.5 Sedang (15.1-35.4) | 4.5 : 1 |
| `color.systemRed` | `#FF3B30` | Peringatan Anomali / Mock GPS, PM2.5 Tidak Sehat (35.5-55.4) | 4.8 : 1 |
| `color.systemPurple` | `#AF52DE` | PM2.5 Sangat Tidak Sehat / Bahaya (> 55.5 µg/m³) | 5.2 : 1 |
| `color.labelPrimary` | `#000000` (85% ink) | Teks judul utama, angka capaian poin | 16.0 : 1 |
| `color.labelSecondary` | `#3C3C43` (60% ink) | Label deskripsi, subheadline, status waktu | 7.0 : 1 |
| `color.labelTertiary` | `#3C3C43` (30% ink) | Teks bantuan, unit satuan, placeholder | 4.5 : 1 |
| `color.separator` | `rgba(60, 60, 67, 0.12)` | Garis pembatas list native (0.5pt hairline) | N/A |
| `color.pillBackground` | `rgba(52, 199, 89, 0.12)` | Latar belakang pill status Lolos Anti-Curang | N/A |

### 2.2 Typography Tokens (System Scale)

Seluruh komponen tipografi mengikuti pedoman Dynamic Type berskala:

| Typography Role | Size (pt) | Weight | Line Height | Tracking | Text Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Large Title` | 34pt | Bold (700) | 41pt | 0.37pt | Sentence case |
| `Title 1` | 28pt | Bold (700) | 34pt | 0.36pt | Sentence case |
| `Title 2` | 22pt | Bold (700) | 28pt | 0.35pt | Sentence case |
| `Title 3` | 20pt | Semibold (600) | 25pt | 0.38pt | Sentence case |
| `Headline` | 17pt | Semibold (600) | 22pt | -0.41pt | Sentence case |
| `Body` | 17pt | Regular (400) | 22pt | -0.41pt | Sentence case |
| `Callout` | 16pt | Regular (400) | 21pt | -0.32pt | Sentence case |
| `Subheadline` | 15pt | Regular (400) | 20pt | -0.24pt | Sentence case |
| `Footnote` | 13pt | Regular (400) | 18pt | -0.08pt | Sentence case |
| `Caption 1` | 12pt | Regular (400) | 16pt | 0.0pt | Sentence case |
| `Caption 2` | 11pt | Regular (400) | 13pt | 0.06pt | Sentence case |
| `Metric Display` | 34pt | Bold (`tabular-nums`) | 41pt | -0.5pt | Numeric |

### 2.3 Spacing & Grid System (4pt Scale)
- Grid: Kelipatan 4pt (`4pt`, `8pt`, `12pt`, `16pt`, `20pt`, `24pt`, `32pt`).
- Margin Layar Horisontal: `16pt` (Standard Inset).
- Jarak Antar Card (*Stack Gap*): `12pt` - `16pt`.
- Padding Internal Card: `16pt` vertikal, `16pt` horisontal.
- Corner Radius (*Continuous Curve / Squircle*):
  - Inset Grouped Cards: `18pt`
  - Inner Elements / Buttons: `12pt`
  - Badges & Status Pills: `9999pt` (Full capsule / Pill)
  - Bottom Sheet Presentation: `24pt` top radius

### 2.4 Depth, Elevation & Materials
- **Material Translucency:** Material ultra-tipis diterapkan pada bar navigasi atas dan tab bar bawah dengan backdrop blur `20px` dan saturasi `180%`.
- **Card Shadow:** Menggunakan bayangan neutral alami berdimensi halus:
  - `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);`
  - Border: `1px solid rgba(0, 0, 0, 0.06)`

---

## 3. Komponen Utama & Hirarki Layout

```
┌────────────────────────────────────────────────────────┐
│  STATUS BAR & KAPSUL STATUS DINAMIS                    │
├────────────────────────────────────────────────────────┤
│  TOP NAVIGATION BAR                                    │
│  Large Title: "Ringkasan Mitra"                        │
│  Sub-header: Bang Rian • Baterai 84% • SPS30 Normal    │
├────────────────────────────────────────────────────────┤
│  CARD CAPAIAN (HEALTH & GOAL STYLE)                    │
│  14.850 Pts (34pt Bold)        [Progress Indicator]   │
│  Rp1.782.000 Target: 74% (20.000 Pts)                  │
├────────────────────────────────────────────────────────┤
│  ANTI-CHEAT ENGINE MONITOR                             │
│  [Pill Hijau: Validasi Anti-Curang: Lolos]             │
│  Kecepatan: 32 km/h • Getaran RMS: 0.28g • GNSS: 1 Hz  │
├────────────────────────────────────────────────────────┤
│  CARD MISI RUAS (MINI MAP WIDGET)                      │
│  [Peta Vektor Mini + Rute Oranye + Hex H3 Radius 500m] │
│  "Zona Sudirman-Thamrin • 2x Points Zone (Rp240/km)"   │
│  [Button: Mulai Navigasi]                              │
├────────────────────────────────────────────────────────┤
│  LIVE TELEMETRY STREAM & BUFFER                        │
│  SPS30: 18.4 µg/m³ • SHT40: 31.2°C / 68% RH           │
│  Buffer Offline: 0 Pending (Tersinkron)                │
├────────────────────────────────────────────────────────┤
│  TAB BAR (BLUR MATERIAL)                               │
│  [Steeringwheel] [Map] [Wallet] [Gearshape/Person]     │
└────────────────────────────────────────────────────────┘
```

---

## 4. Spesifikasi Skrin Detail

### 4.1 Skrin 1: Dashboard Mitra (Driver View)
* **Karakter:** Tenang, fokus kerja, informatif sekilas pandang (*glanceable*).
* **Komponen 1 — Hero Capaian Poin (Goal Progress Style):**
  - Mengedepankan angka poin tervalidasi `14.850 Pts` dengan konversi nilai tukar moneter langsung di bawahnya (`Rp1.782.000`).
  - Baris progres linear native (`ProgressView`) berwarna `color.systemGreen` dengan persentase target harian `74% dari target 20.000 Pts`.
* **Komponen 2 — Anti-Cheat Status & Live Sensor Quality:**
  - Status Pill: Kapsul hijau muda dengan ikon centang kecil (`checkmark.shield.fill`). Teks: `Validasi: Lolos`.
  - Detail diagnostik: Kecepatan GPS saat ini (`34 km/jam`), getaran akselerometer motor listrik (`0.28g RMS`), dan akurasi GNSS u-blox (`1 Hz Fix`).
  - Tombol simulasi interaktif untuk pengujian: Toggle perbandingan antara pengendara normal vs skenario anomali *Mock GPS* / 0.0g getaran di atas meja.
* **Komponen 3 — Card Misi Ruas Heksagonal H3:**
  - Peta mini inset dengan kontur jalan Jakarta (Sudirman-Thamrin).
  - Garis rute berwarna `color.systemOrange` dengan indikator heksagonal Uber H3 (Radius ±500m) yang belum terukur selama > 60 menit.
  - Multiplier badge `2x Points Zone` (Rp240/km).
  - Tombol aksi utama bertuliskan "Mulai Navigasi".

### 4.2 Skrin 2: Live Activity & Dynamic Island (Biker Mode)
* **Dynamic Island Compact Leading:** Ikon motor listrik EV (`scooter` / `bicycle`).
* **Dynamic Island Compact Trailing:** Angka `6.2 Km` tervalidasi dengan titik hijau sensor aktif.
* **Dynamic Island Expanded:**
  - Kiri: Status sensor Sensirion SPS30 (`18 µg/m³ PM2.5 - Baik`) dan laju penambahan poin (`+Rp120/km`).
  - Kanan: Persentase baterai LiFePO4 (`84%`), estimasi waktu bertahan (`14 jam`).
  - Bawah: Mini sparkline kualitas udara 5 km terakhir.

### 4.3 Skrin 3: Peta Publik Warga (Clean Vector Air Quality View)
* **Tampilan Peta:** Vektor peta bersih menampilkan koridor utama Jakarta.
* **Garis Ruas Jalan Berwarna Transparan (Polylines):**
  - Hijau (`#34C759`): Baik (0–15 µg/m³) — Jalur hijau Senopati & SCBD.
  - Kuning (`#FF9500`): Sedang (15.1–35.4 µg/m³) — Jalur Rasuna Said.
  - Merah (`#FF3B30`): Tidak Sehat (35.5–55.4 µg/m³) — Jalur Gatot Subroto.
  - Ungu (`#AF52DE`): Sangat Tidak Sehat (> 55.5 µg/m³) — Underpass & persimpangan padat.
* **Floating Search & Filter Bar:**
  - Search field berdesain frosted glass dengan segment control: `PM2.5` vs `Suhu/Heatmap (SHT40)`.
* **Interactive Bottom Sheet:**
  - Meluncur halus saat pengguna mengetuk ruas jalan di peta.
  - Menampilkan angka PM2.5 real-time, label **Data Indikatif**, dan Skor Keyakinan (*Confidence Score: Tinggi*).
  - Fitur **Rute Rendah Polusi (Low-Exposure Route)**: Tabel perbandingan langsung antara Rute Tercepat vs Rute Rekomendasi Sehat (menurunkan paparan partikel hingga 62%).

### 4.4 Skrin 4: Dompet Mitra & Pencairan Poin (Wallet Engine)
* **Saldo Akumulasi:** Saldo poin aktif dan nominal rupiah yang siap ditarik.
* **Rincian Penghasilan:** Kalkulasi transparan dari kilometer standar (Rp120/km) dan kilometer zona misi bonus 2x (Rp240/km).
* **Opsi Penarikan:** Pencairan instan ke e-wallet (GoPay, OVO, DANA) atau penukaran voucher potongan ganti baterai / servis motor listrik di bengkel mitra.
* **Riwayat Perjalanan:** Daftar log lintasan dengan status audit anti-curang tervalidasi.

### 4.5 Skrin 5: Kepatuhan Privasi (UU PDP No. 27/2022) & Pengaturan Perangkat
* **Geofence Cloaking (Privacy Zone):** Radius 500 meter otomatis di sekitar kediaman mitra yang mengacak atau mematikan logging telemetri GPS untuk melindungi privasi tempat tinggal.
* **Pseudonimisasi Data:** Penjelasan audit kriptografi bahwa data spasial publik terpisah dari identitas pribadi mitra.
* **Status Buffer Offline:** Menampilkan kapasitas memori Flash SPI / SQLite lokal (mampu menampung hingga 72 jam data telemetri tanpa sinyal 4G).
* **Pemeliharaan Sensor:** Pemicu siklus pembersihan debu otomatis optik laser Sensirion SPS30 (*Manual Clean Trigger*).

---

## 5. State Interaksi & Mikro-Interaksi

1. **Default State:** Card berlatar putih solid `#FFFFFF`, border halus `0.5pt`, bayangan natural, teks kontras tinggi.
2. **Pressed State (Touch Feedback):** Skala mengecil halus `scale(0.98)` dengan durasi transisi `120ms ease-out` dan opasitas `0.85`.
3. **Peringatan Anomali (Anti-Cheat Warning):** Status pill beralih ke warna kuning/oranye dengan teks `Peringatan Anomali (Vibrasi 0.0g)`. Penambahan kilometer tervalidasi dijeda seketika tanpa pemblokiran sepihak.
4. **Offline Mode:** Indikator koneksi beralih ke `Buffer Offline Aktif (12 Telemetri Tersimpan)`. Data dikirim otomatis saat jaringan pulih.
5. **Haptic Feedback Guidelines:**
   - Light Impact: Berpindah tab bar atau menyentuh filter peta.
   - Medium Impact: Menyelesaikan Misi Ruas 2x Poin.
   - Warning Haptic: Terdeteksi ketidakcocokan getaran akselerometer vs kecepatan GPS.

---

## 6. Arsitektur Kode Prototipe

Prototipe UdaraJalan diwujudkan dalam dua bentuk:
1. **SwiftUI Native Architecture (Swift 6 / ActivityKit):**
   - `UdaraJalanApp.swift` (App Lifecycle)
   - `MitraDashboardView.swift` (Driver View)
   - `PublicMapView.swift` (Air Quality & Low-Exposure Route Sheet)
   - `DynamicIslandLiveActivity.swift` (ActivityKit Widget Extension)
   - `AntiCheatEngine.swift` (Multi-sensor validation engine)
2. **Interactive Web Prototype (React + Tailwind CSS + Lucide Icons):**
   - Prototipe web responsif dengan simulator frame smartphone native yang interaktif.
   - Menyediakan simulasi data sensor real-time, pengujian engine anti-cheat, peta vektor interaktif jalanan Jakarta, kalkulasi rute bersih, dan penarikan saldo dompet.
