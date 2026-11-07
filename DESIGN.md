# Dokumentasi Desain Sistem & Spesifikasi UI/UX Mobile "UdaraJalan"
**Standar Desain:** Native Clean System Guidelines  
**Tipe Aplikasi:** Mobile Crowdsensing & Air Quality Intelligence (Mitra Driver View & Warga Public View)  
**Arsitektur UI:** Native SwiftUI & Interactive Web Prototype (Precision Mobile Design)

---

## 1. Pedoman Viso-Spasial & Bahasa Desain (Apple iOS 18 Modular Bento Grid)

### 1.1 Estetika Modular Widget Board (Bento Grid Style)
Antarmuka UdaraJalan didesain mengadopsi standar **Apple iOS 18 Modular Widget Board (Bento Grid Style)** sesuai standar Apple Health & Weather Widget (seperti referensi iOS Native Dashboard). Desain berfokus pada visual yang cepat dipahami (*glanceable*), bernuansa native, dan menghindari kesan SaaS generik.

* **Struktur Kartu Modular (2 Tipe Kartu):**
  1. **Atmospheric / Hero Widgets (Full Color):**
     - **Widget Cuaca:** WAJIB menggunakan latar Rich iOS Blue (`#0A84FF` / `#1D70B8`) dengan teks putih bersih (seperti Widget Apple Weather resmi).
     - **Widget Status Utama Sensor / PM2.5:** Latar Rich System Color dinamis (Mint Green `#34C759` jika baik, Orange `#FF9500` jika sedang, Red `#FF3B30` jika buruk) dengan teks kontras tinggi.
  2. **Data & Navigasi Widgets (Clean Surface):**
     - **Widget Trajektori Misi, Grafik Poin, dan Navigasi:** Menggunakan latar belakang murni White (`#FFFFFF`) dengan bayangan halus (`box-shadow: 0 4px 20px rgba(0,0,0,0.04)`).
* **Geometri & Material:**
  - **Corner Radius:** Menggunakan Continuous Squircle `22px` - `26px` untuk tiap modul widget.
  - **Inner Elements:** Sub-elemen di dalam Hero Widget menggunakan warna kontras semi-transparan (misal: *white with 15% opacity* `rgba(255, 255, 255, 0.15)` untuk background mini-badge / pill di dalam kartu biru/hijau).
  - Vibrancy & translucency (`.ultraThinMaterial`) dibatasi hanya pada bilah navigasi atas (*Navigation Bar*) dan bilah tab bawah (*Tab Bar*), memberikan efek kedalaman (*depth layering*) saat konten discroll di bawahnya.

### 1.2 Skema Warna Adaptif (System Palette)

```
┌──────────────────┬─────────────────┬───────────────────────────────────────────┐
│ Token Warna      │ Nilai Hex       │ Peran Fungsional                          │
├──────────────────┼─────────────────┼───────────────────────────────────────────┤
│ System Background│ #F2F2F7         │ Latar belakang utama Inset Grouped List   │
│ Clean Surface    │ #FFFFFF         │ Latar belakang Data & Navigasi Widgets    │
│ Hero Weather Blue│ #0A84FF /1D70B8 │ Latar belakang Widget Cuaca (Apple Weather)│
│ System Green     │ #34C759         │ Lolos Anti-Curang, Hero PM2.5 Baik        │
│ System Orange    │ #FF9500         │ Misi Heksagon 2x, Hero PM2.5 Sedang       │
│ System Red       │ #FF3B30         │ Peringatan Anomali, Hero PM2.5 Buruk      │
│ System Purple    │ #AF52DE         │ Kualitas Sangat Tidak Sehat / Bahaya      │
│ System Blue      │ #007AFF         │ Aksi utama (CTA), tombol aktif            │
│ Hero Text Primary│ #FFFFFF         │ Teks putih bersih pada Hero Widgets       │
│ Label Primary    │ #000000 (85%)   │ Judul halaman, teks pada Clean Surface    │
│ Label Secondary  │ #3C3C43 (60%)   │ Subheadline, deskripsi pada Clean Surface │
│ Separator        │ rgba(60,60,67)  │ Garis pemisah hairline 0.5pt              │
└──────────────────┴─────────────────┴───────────────────────────────────────────┘
```

### 1.3 Tipografi Hierarkis (Native System Typography)
* **Large Title (34pt Bold):** Digunakan untuk judul utama halaman seperti "Ringkasan Mitra".
* **Hero Metric Display (32pt - 40pt Bold `tabular-nums`):** Angka suhu dan PM2.5 utama pada Hero Widgets dengan alignment bersih.
* **Metric Display (34pt Bold `tabular-nums`):** Menampilkan angka poin (misal `14.850 Pts`) dan akumulasi kilometer pada Data Widgets.
* **Headline (17pt Semibold):** Judul kartu dan subseksi utama.
* **Body (17pt Regular):** Teks paragraf dan informasi kontekstual.
* **Subheadline (15pt Regular):** Keterangan sekunder di bawah metrik.
* **Footnote & Caption (13pt - 11pt Regular):** Waktu sinkronisasi terakhir, ID perangkat, dan label regulasi.
* **Mini Weather Forecast Strip:** Format kapsul vertikal soft grey/white di bagian bawah widget cuaca.
* **Tata Letak Grid:** Susunan bento 2 kolom & 3 kolom yang fleksibel, konsisten dengan jarak antar widget (*gap*) `12px` - `16px`.

---
## 1.4. Tipografi (Typography System)
- **Primary App UI Font**: **SF Pro** (iOS Native) / **Inter** (Web & Cross-Platform Fallback)
  - **Penggunaan**: Seluruh antarmuka aplikasi (body text, data telemetri, label tombol, status bar, mikro-UI).
  - **Alasan**: Memiliki tingkat netralitas tinggi dan legibilitas optimal pada ukuran mikro (seperti status baterai, koordinat, dan skor keyakinan).
- **Brand & Marketing Font**: **Plus Jakarta Sans**
  - **Penggunaan**: Khusus untuk judul besar di *landing page*, *pitch deck*, atau dokumen proposal.
  - **Batasan**: Tidak digunakan pada mikro-UI aplikasi mobile agar hierarki data tetap presisi dan tidak sesak.
- **Hierarki Ukuran Font (iOS Dynamic Type Standard)**:
  - Large Title: 34pt Bold
  - Title 1: 28pt Bold
  - Title 2: 22pt Bold
  - Headline: 17pt Semi-Bold
  - Body: 17pt Regular
  - Subhead: 15pt Regular
  - Footnote / Caption: 13pt / 12pt Regular

### 1.5 Penerapan Aturan Emas Theo Mandel: Mengurangi Beban Ingatan (Cognitive Load Reduction)
> *"Makin banyak yang harus diingat pengguna, makin mudah ia salah."* — **Theo Mandel (*The Elements of User Interface Design*)**

Dalam konteks mobilitas tinggi armada motor listrik di jalan raya DKI Jakarta, mitra pengemudi hanya memiliki atensi sepersekian detik (*split-second glance*). Setiap antarmuka dirancang agar pengguna langsung mengenali arti data tanpa proses mengingat kembali (*recognition over recall*).

#### 1.5.1 Sinergi Tipografi & Reduksi Beban Kognitif
1. **Familiaritas Instan (Zero Learning Curve):**
   - Pemilihan **SF Pro** (iOS) dan **Inter** (Web) memanfaatkan sistem tipografi native yang sudah menjadi memori implisit pengguna.
   - Tidak ada dekorasi bentuk huruf yang memerlukan proses parsing mental tambahan saat melirik ponsel di kemudi motor.
2. **Kestabilan Spasial (`tabular-nums`):**
   - Seluruh angka telemetri, poin, kecepatan, dan waktu menggunakan angka tabular proporsional tetap (*fixed-width numerals*). Angka yang bergoyang horizontal (*layout jitter*) dihindari agar posisi digit di retina pengguna selalu stabil.
3. **Isolasi Font Brand (Plus Jakarta Sans):**
   - Dilarang keras digunakan pada komponen mikro-UI, data telemetri, atau chip status untuk mencegah distorsi persepsi dan sesak visual (*visual clutter*).

#### 1.5.2 Prinsip Desain Beban Ingatan Minimum pada Fitur
1. **Pengenalan Langsung Status Sensor (Recognition over Recall):**
   - Mitra tidak perlu menghafal ambang batas getaran normal (0.28g) atau protokol GNSS; sistem langsung memberikan kartu evaluasi visual `(✓) Validasi Anti-Curang: Lolos` dengan warna hijau iOS standar `#34C759`.
2. **Otomatisasi Hitungan & Konversi Instan:**
   - Menghilangkan kalkulasi mental: Poin harian (`14.850 Pts`) langsung disandingkan dengan nilai riil (`Rp1.782.000`) dan persentase capaian target (`74.2% Tercapai`), serta tarif gabungan zona heksagon (`Rp120 + Rp120 = Rp240/km`).
3. **Preservasi Konteks Sistem (Continuous System Status):**
   - Lewat **Dynamic Island & Live Activity**, status perekaman (`SPS30: Normal • 84% Bat • 6.2 km`) tetap terlihat di bilah atas tanpa menuntut mitra mengingat apakah aplikasi sedang aktif merekam atau tertutup.
4. **Peta Udara Bebas Hafalan Angka:**
   - Skala kualitas udara PM2.5 disajikan langsung dengan kode warna baku rute (Hijau, Oranye, Merah, Ungu). Warga dan mitra tidak perlu menghafal ambang batas baku mutu 15 µg/m³ atau 35.5 µg/m³.
5. **Pengungkapan Progresif (Progressive Disclosure):**
   - Data teknis lanjutan (seperti RMS getaran IMU, waktu siklus purge laser 4.8 jam, dan sertifikasi MCERTS) ditempatkan pada tingkat visual sekunder (*Caption / Footnote 11–13pt*), menjaga permukaan utama tetap bersih dari banjir data (*data overwhelm*).

## 2. Spesifikasi Skrin Utama (Key Screens Wireframe)

### 2.1 Dashboard Mitra (Driver View - Apple iOS 18 Bento Grid Style)

```
+--------------------------------------------------------------+
| [14:32]                            [Battery 84%] [5G] [Cell] |
|                                                              |
| Ringkasan Mitra                                 [Avatar/Set] |
| Bang Rian (EV Fleet #B-4819-SXX)                             |
| Perangkat Clip-on: [x] Terhubung  * Baterai 84%              |
|--------------------------------------------------------------|
| [ MODULAR BENTO GRID (2 & 3 Col, Gap: 12-16px)             ] |
|                                                              |
| +----------------------------+ +---------------------------+ |
| | [HERO AQI - SQUIRCLE 24px] | | [HERO WEATHER - #0A84FF]  | |
| | Rich System Color (#34C759)| | Rich iOS Blue             | |
| | PM2.5: 18 ug/m3 (36pt)     | | Suhu: 32 C (36pt Bold)    | |
| | Teks Putih Kontras         | | Cuaca Cerah Berawan       | |
| | [Badge: Udara Bersih (15%)]| | [Capsule Forecast Strip]  | |
| +----------------------------+ +---------------------------+ |
|                                                              |
| +----------------------------------------------------------+ |
| | [DATA WIDGET: CAPAIAN POIN & JARAK - CLEAN WHITE #FFFFFF]| |
| | box-shadow: 0 4px 20px rgba(0,0,0,0.04) • Squircle 24px  | |
| | 14.850 Pts (34pt Bold) • Target: 74% (20.000 Pts)        | |
| | Equivalen: Rp1.782.000 • Jarak: 38.4 Km Valid            | |
| | [====================================---------]          | |
| +----------------------------------------------------------+ |
|                                                              |
| +----------------------------+ +---------------------------+ |
| | [ANTI-CHEAT ENGINE - WHITE]| | [SENSOR DIAGNOSTICS - WHT]| |
| | (V) Validasi: Lolos        | | SPS30: Normal (18 ug/m3)  | |
| | Speed: 34 km/h • RMS 0.28g | | SHT40: 31 C / 68% RH      | |
| | [Uji Anomali Sensor]       | | Buffer: 0 Pending         | |
| +----------------------------+ +---------------------------+ |
|                                                              |
| +----------------------------------------------------------+ |
| | [DATA WIDGET: MISI RUAS AKTIF (H3 Hex Multiplier 2x)]    | |
| | Clean Surface White (#FFFFFF) • Squircle 24px            | |
| | [Mini Map Vector View]                                   | |
| | Jalur Oranye: Koridor Sudirman-Thamrin (H3 Hex Zone)     | |
| | Bonus Poin: 2x Lipat (Rp240/km) • Radius: 500m           | |
| | [ Tombol: Mulai Navigasi Misi Ruas                     ] | |
| +----------------------------------------------------------+ |
|--------------------------------------------------------------|
| [TAB BAR: (Steeringwheel)   (Map)   (Wallet)   (Person)    ] |
+--------------------------------------------------------------+
```

### 2.2 Dynamic Island & Live Activity (Biker Mode)

* **Compact Leading:** Ikon motor listrik EV (`scooter`).
* **Compact Trailing:** `6.2 Km` (Titik hijau telemetri aktif).
* **Expanded View (Long Press):**
  - **Atas:** Status Perjalanan Aktif & Laju Poin (`+Rp120/km`).
  - **Tengah:** Indikator PM2.5 real-time dari sensor SPS30 (`18 µg/m³ - Baik`).
  - **Bawah:** Status baterai alat LiFePO4 (`84% - 14 Jam Operasional`) dan tombol cepat jeda sesi.

### 2.3 Peta Publik Warga (Clean Vector Air Quality View)

```
+--------------------------------------------------------------+
| [ Top Floating Search Bar: "Cari ruas jalan atau area..."  ] |
| [ Segment Filter: [ PM2.5 (Partikulat) ] [ Suhu Mikro ]    ] |
|                                                              |
|  [ FULL SCREEN MAP CANVAS ]                                  |
|   ~ Garis Hijau: Jl. Senopati (12 ug/m3 - Baik)              |
|   ~ Garis Kuning: Jl. Rasuna Said (26 ug/m3 - Sedang)        |
|   ~ Garis Merah: Jl. Gatot Subroto (44 ug/m3 - Tidak Sehat)  |
|   ~ Garis Ungu: Underpass Kuningan (62 ug/m3 - Bahaya)       |
|                                                              |
| +----------------------------------------------------------+ |
| | [ BOTTOM SHEET: DETAIL RUAS JALAN ]                      | |
| | Jl. Gatot Subroto (Arah Barat)                           | |
| | 44 ug/m3  -  Kualitas Udara: Tidak Sehat                 | |
| |                                                          | |
| | [Badge: Data Indikatif]   [Pill: Skor Keyakinan: Tinggi] | |
| | (Sumber: 6 lintasan armada motor listrik dlm 25 menit)   | |
| |                                                          | |
| | Opsi Rute Perjalanan Rendah Paparan:                     | |
| | - Rute Tercepat: 8 Menit (Paparan PM2.5: 42 ug/m3)       | |
| | - Rute Bersih Rekomendasi: 11 Menit (Paparan: 16 ug/m3)  | |
| |   * Menurunkan dosis inhalasi polutan hingga 62%         | |
| | [ Tombol: Ikuti Rute Rendah Polusi                     ] | |
| +----------------------------------------------------------+ |
+--------------------------------------------------------------+
```

---

## 3. Matriks State Interaksi

| Komponen | Default State | Pressed State | State Peringatan / Anomali | State Terputus / Offline |
| :--- | :--- | :--- | :--- | :--- |
| **Card Poin** | Latar putih, border 0.5pt, shadow halus | Opasitas 0.88, skala 0.985 | N/A | Tanda seru kecil: Menunggu rekonsiliasi |
| **Pill Anti-Cheat** | Background hijau muda, centang hijau, teks "Lolos" | Opasitas 0.80 | Background oranye/merah muda, tanda peringatan "Anomali Vibrasi (0.0g)" | Background abu-abu muda, teks "Mencari Sinyal GNSS" |
| **Tombol Navigasi** | System Blue solid, teks putih tebal | Opasitas 0.75, skala 0.98 | N/A | Latar abu-abu `#D1D1D6`, teks putih redup |
| **Garis Peta Ruas** | Stroke 4pt solid sesuai warna PM2.5 | Stroke 6pt dengan highlight ring halus | Garis putus-putus merah jika anomali | Garis abu-abu putus-putus (Data kadaluarsa > 120m) |

---

## 4. Kepatuhan Regulasi & Privasi (UU PDP No. 27/2022)

1. **Privacy Zone Cloaking (500m):** Sistem aplikasi menyembunyikan titik koordinat pasti dalam radius 500m dari kediaman mitra yang terdaftar. Data yang dikirim ke server publik otomatis dipotong atau ditambahkan derau spasial acak (*spatial noise injection*).
2. **Kriptografi Tokenisasi:** ID perangkat keras *clip-on* dan nomor pelat motor listrik dipisahkan secara kriptografis menggunakan *one-way salted hash* sebelum data polusi dipublikasikan ke peta warga.
3. **Penyimpanan Lokal & Retensi Audit:** Raw telemetri lokal disimpan maksimal 14 hari di SQLite lokal sebelum dihapus otomatis dan dikonversi menjadi statistik ruas agregat.
