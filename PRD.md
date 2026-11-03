# UdaraJalan — Product Requirement Document (PRD)
**Dokumen:** Product Requirement Document (PRD)  
**Versi:** 1.0.0 (Tahap Prototipe & Validasi Lapangan)  
**Status:** Approved for Engineering & Prototyping  
**Pemilik Produk:** Senior Product Manager IoT & Mobility  
**Domain:** IoT Environmental Sensing, Microclimate Telemetry, Mobile Crowdsensing, Clean Mobility

---

## 1. Eksekutif & Tujuan Produk

### 1.1 Visi Produk
Membangun platform pemantauan kualitas udara dan paparan panas perkotaan secara hiper-lokal (*hyper-local street-level monitoring*) berbasis armada motor listrik bergerak (*crowdsensed fleet*). Dengan memanfaatkan kurir dan ojek online yang dilengkapi perangkat sensor mandiri (*clip-on*), UdaraJalan mengubah armada transportasi hijau menjadi jejaring stasiun pemantau lingkungan beresolusi spasial tinggi dengan biaya fraksional dibanding stasiun pemantau statis konvensional.

### 1.2 Tujuan Strategis (Product Goals & OKRs)
* **Goal 1 (Cakupan Spasial):** Memetakan kualitas udara jalanan (PM2.5) dan indeks panas mikro (suhu/kelembapan) pada minimal 80% jaringan jalan arteri dan kolektor di area pilot DKI Jakarta dalam jendela pembaruan data < 60 menit.
* **Goal 2 (Engagement & Keandalan Mitra):** Mencapai rasio kilometer tervalidasi > 85% dari total perjalanan mitra melalui sistem validasi anti-curang (*anti-cheat engine*) yang transparan dan adil, dengan insentif dasar Rp120/km tervalidasi.
* **Goal 3 (Dampak Pengguna Publik):** Menyediakan alternatif rute rendah paparan polusi (*Low-Exposure Route*) yang menurunkan estimasi dosis inhalasi PM2.5 warga komuter sebesar 15–30% pada jam sibuk.

### 1.3 Arsitektur Ekosistem Hardware IoT Clip-on
Perangkat keras UdaraJalan merupakan modul tahan cuaca (IP65) mandiri yang dijepitkan (*clip-on*) pada rak belakang atau behel motor listrik tanpa memotong kabel kendaraan:
* **Sensor Partikulat:** Sensirion SPS30 (Laser scattering optical particle counter, sertifikasi MCERTS, siklus auto-cleaning terintegrasi).
* **Sensor Iklim Mikro:** Sensirion SHT40 (Akurasi tinggi ±0.2°C suhu, ±1.8% RH kelembaban).
* **Modul Pemosisian:** u-blox GNSS receiver (Mendukung konstelasi GPS, GLONASS, Galileo, BeiDou dengan update rate 1 Hz).
* **Konektivitas Telemetri:** Modem Seluler Quectel 4G LTE-M / NB-IoT dengan fallback Bluetooth Low Energy (BLE 5.2) ke smartphone pengendara.
* **Sensor Inersia:** 3-Axis MEMS Accelerometer (Pengukuran getaran mesin dan pergerakan dinamis kendaraan).
* **Catu Daya Mandiri:** Baterai Lithium Iron Phosphate (LiFePO4) tipe 26650 kapasitas 3.200 mAh (tahan panas ekstrem perkotaan, masa pakai > 2.000 siklus, durasi operasional > 18 jam kontinu per pengisian).

---

## 2. Target Pengguna & User Persona

### 2.1 Persona 1: Mitra Pengemudi Motor Listrik (Ojek Online / Kurir)
* **Nama Representatif:** Bang Rian (32 tahun, Pengemudi Ojol EV di Jakarta Selatan & Pusat).
* **Karakteristik & Kebiasaan:** Berkendara 8–10 jam per hari, menempuh 90–140 km, sangat memperhatikan efisiensi baterai motor dan pendapatan harian.
* **Kebutuhan Utama (*Needs*):**
  * Insentif moneter tambahan yang transparan dan dapat langsung ditarik (Rp120 per kilometer jalan yang valid terukur).
  * Panduan "Misi Ruas" yang memberi tahu jalan-jalan mana yang memiliki pengganda poin (multiplier 1.5x - 2.0x) agar rute perjalanannya lebih menguntungkan.
  * Status alat yang jelas tanpa repot: mengetahui sisa baterai alat *clip-on* dan kepastian bahwa data sensornya terkirim tanpa menguras kuota atau baterai smartphone pribadinya.
  * Kepastian validasi anti-curang yang adil (tidak digugurkan sepihak saat terjebak macet).
* **Titik Sakit (*Pain Points*):** Sering dituduh curang oleh sistem otomatis platform, aplikasi pengemudi yang boros baterai dan panas di stang motor, pemasangan alat yang ribet.

### 2.2 Persona 2: Warga Komuter & Pejalan Kaki Publik
* **Nama Representatif:** Mbak Nadia (27 tahun, Karyawan Swasta & Komuter Transportasi Umum / Pejalan Kaki, memiliki riwayat asma ringan).
* **Karakteristik & Kebiasaan:** Menggunakan ojol dari stasiun MRT/KRL ke kantor, sering berjalan kaki di trotoar saat jam makan siang.
* **Kebutuhan Utama (*Needs*):**
  * Data kualitas udara nyata per ruas jalan yang akan dilewatinya saat itu juga, bukan data rata-rata kota dari satu stasiun berjarak 10 km.
  * Fitur pencari rute yang merekomendasikan rute rendah polusi (*clean air path*) untuk meminimalkan kekambuhan asma dan iritasi paru-paru.
  * Peringatan dini (*push notification*) saat polusi di rute harian atau tempat tinggalnya memasuki level bahaya.
  * Transparansi data yang dapat dipercaya (mengetahui kapan data tersebut diambil dan tingkat keyakinan statistiknya).
* **Titik Sakit (*Pain Points*):** Aplikasi cuaca yang ada hanya memberikan satu indeks untuk seluruh kota, tidak ada panduan jalur alternatif yang lebih sehat.

---

## 3. Fitur Utama & Spesifikasi Fungsional (Epics & User Stories)

### EPIC 1: Hardware Pairing & Telemetri Mitra (Driver Module)

#### User Story 1.1: BLE Pairing & Status Monitoring
*Sebagai seorang* mitra pengemudi motor listrik,  
*Saya ingin* menghubungkan smartphone saya ke perangkat sensor *clip-on* UdaraJalan via Bluetooth Low Energy (BLE) secara instan,  
*Agar saya dapat* memantau daya baterai alat, kondisi sensor, dan kepastian pengiriman data sebelum mulai bekerja.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Koneksi awal BLE berhasil dan telemetri terbaca
  Given aplikasi UdaraJalan terinstal di smartphone mitra dan Bluetooth aktif
  And perangkat clip-on UdaraJalan berada dalam jarak kurang dari 2 meter dengan daya menyala
  When mitra membuka aplikasi dan menekan tombol "Hubungkan Sensor"
  Then aplikasi harus mendeteksi UUID perangkat dalam waktu kurang dari 3 detik
  And menampilkan status "Connected" dengan badge hijau
  And menampilkan persentase baterai LiFePO4 (misal: "84%") dan status sensor SPS30 "Normal"
```

#### User Story 1.2: Pemantauan Siklus Pembersihan Otomatis Sensor
*Sebagai seorang* teknisi armada dan mitra,  
*Saya ingin* sistem menjalankan prosedur auto-cleaning laser SPS30 setiap kali perangkat dinyalakan atau setelah 12 jam akumulasi operasi,  
*Agar* lensa optik bebas dari debu pekat dan pembacaan konsentrasi partikel tetap presisi.

---

### EPIC 2: Anti-Cheat Engine & Validasi Kilometer (Integrity Module)

#### User Story 2.1: Validasi Multi-Sensor Konsistensi Gerak
*Sebagai seorang* manajer operasional data lingkungan,  
*Saya ingin* sistem memvalidasi pergerakan kendaraan berdasarkan fusi data GNSS, kecepatan, dan getaran akselerometer,  
*Agar* insentif kilometer tervalidasi hanya diberikan kepada pengendara yang benar-benar berkendara (bukan simulator GPS, diam di tempat, atau dibawa lari santai).

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Pengendara berkendara normal di jalan raya
  Given alat clip-on aktif dan merekam laju pergerakan
  When kecepatan GPS berada di antara 10 km/jam hingga 65 km/jam
  And nilai akselerometer Root Mean Square (RMS) menunjukkan vibrasi dinamis motor listrik (ambang batas > 0.15g)
  And titik koordinat GNSS u-blox bergerak linier di atas ruas jalan resmi OSM
  Then status validasi anti-curang dinyatakan "Lolos" (Pill Hijau)
  And setiap meter yang ditempuh dihitung ke dalam "Km Tervalidasi" dengan reward dasar Rp120/km

Scenario: Indikasi manipulasi lokasi palsu (Mock Location / Joystick)
  Given mitra menggunakan aplikasi pihak ketiga untuk memanipulasi koordinat GPS
  When kecepatan koordinat GPS berubah melompat tidak wajar atau statis pada kecepatan konstan tanpa deviasi
  And nilai getaran akselerometer 3-axis mendekati 0.0g (perangkat diam di atas meja)
  Then sistem anti-cheat menandai sesi sebagai "Peringatan Anomali"
  And menghentikan penambahan akumulasi kilometer tervalidasi seketika
  And mencatat log insiden tanpa memblokir akun secara sepihak untuk pemeriksaan lanjut
```

---

### EPIC 3: Dynamic Hexagonal Geofence & Misi Ruas (Gamification & Coverage)

#### User Story 3.1: Pembagian Wilayah Heksagonal H3 & Multiplier Bonus
*Sebagai seorang* perancang strategi pengumpulan data,  
*Saya ingin* membagi peta operasional ke dalam sel heksagonal Uber H3 (resolusi 8 / radius ±500m) dengan interval waktu 1 jam,  
*Agar* wilayah yang jarang dilalui mitra diberi insentif lebih tinggi (Misi Ruas hingga 2x poin) demi pemerataan data.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Sel heksagonal belum terukur lebih dari 60 menit
  Given sel heksagonal H3 "ID-886541..." tidak memiliki data lintasan valid dalam 60 menit terakhir
  When sistem menghitung kebutuhan data spasial berkala
  Then sel tersebut berubah status menjadi "Misi Ruas Aktif" dengan badge "2x Points Zone"
  And mitra di sekitar radius 2 km menerima kartu rekomendasi misi pada Dashboard
  And mitra yang melintasi ruas di dalam sel tersebut mendapatkan insentif 2x lipat (Rp240/km)
```

---

### EPIC 4: Wallet & Reward Engine (Monetization & Partner Retention)

#### User Story 4.1: Pencatatan Poin & Konversi Saldo
*Sebagai seorang* mitra pengemudi,  
*Saya ingin* melihat akumulasi kilometer tervalidasi yang langsung dikonversi menjadi saldo poin rupiah di dompet aplikasi,  
*Agar saya dapat* mencairkannya ke dompet digital (GoPay/OVO/DANA) atau menukarkannya dengan diskon penggantian baterai / servis motor listrik.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Konversi kilometer tervalidasi ke saldo poin harian
  Given mitra telah menyelesaikan perjalanan dengan 20.0 Km tervalidasi standar dan 5.0 Km di zona misi 2x
  When sesi berkendara disinkronisasi ke server
  Then sistem mengkreditkan poin: (20 x Rp120) + (5 x Rp240) = Rp3.600 (3.000 poin aplikasi)
  And saldo dompet mitra bertambah seketika dengan bukti rincian riwayat per perjalanan
```

---

### EPIC 5: Peta Publik Warga (MapKit Air Quality Visualizer)

#### User Story 5.1: Visualisasi Kualitas Udara Per Ruas Jalan Berwarna
*Sebagai seorang* warga komuter di Jakarta,  
*Saya ingin* melihat garis ruas jalan di peta MapKit yang diwarnai spesifik sesuai tingkat polusi PM2.5 terkini,  
*Agar saya dapat* mengetahui secara persis ruas jalan mana yang udaranya bersih, sedang, atau berbahaya untuk dilewati.

**Kategori Warna Standar:**
* **Hijau (`#34C759`):** Baik (PM2.5: 0 – 15.0 µg/m³)
* **Kuning (`#FF9500`):** Sedang (PM2.5: 15.1 – 35.4 µg/m³)
* **Merah (`#FF3B30`):** Tidak Sehat (PM2.5: 35.5 – 55.4 µg/m³)
* **Ungu (`#AF52DE`):** Sangat Tidak Sehat / Berbahaya (PM2.5 > 55.5 µg/m³)

#### User Story 5.2: Label Data Indikatif & Skor Keyakinan (Confidence Score)
*Sebagai seorang* analis atau warga yang kritis terhadap data lingkungan,  
*Saya ingin* melihat label "Data Indikatif" dan Skor Keyakinan (*Confidence Score*) pada setiap ruas jalan yang saya pilih,  
*Agar saya memahami* bahwa data bersumber dari sensor bergerak masyarakat (bukan stasiun referensi kelas riset laboratorium) dan mengetahui seberapa segar data tersebut.

**Rumus Keyakinan Data ($CS$):**
$$CS = f(N_{\text{lintasan}}, \Delta t_{\text{umur}}, \sigma_{\text{variansi}})$$
* **Tinggi (High):** $\ge 5$ lintasan mitra unik dalam 30 menit terakhir dengan $\sigma < 8$ µg/m³.
* **Sedang (Medium):** 2–4 lintasan mitra dalam 60 menit terakhir.
* **Rendah (Low):** 1 lintasan atau umur data antara 60–120 menit.
* *Kadaluarsa (Expired):* > 120 menit (ruas digambar abu-abu putus-putus tanda data belum tersedia).

---

### EPIC 6: Low-Exposure Route Planner & Navigasi Cerdas

#### User Story 6.1: Perhitungan Rute Minim Paparan Polutan
*Sebagai seorang* pejalan kaki atau komuter yang bepergian dari titik A ke titik B,  
*Saya ingin* aplikasi memberikan opsi "Rute Rendah Polusi" disamping rute tercepat,  
*Agar saya dapat* memilih jalan dengan akumulasi partikel PM2.5 paling rendah meskipun waktu tempuh berbeda 3–5 menit.

**Acceptance Criteria (Gherkin):**
```gherkin
Scenario: Pencarian rute dari Stasiun MRT Bundaran HI ke Menara BCA
  Given pengguna memasukkan titik asal dan tujuan
  When sistem menjalankan algoritma pembobotan graf rute (Dijkstra terbobot PM2.5 vs Jarak)
  Then aplikasi menampilkan dua opsi rute:
    | Opsi | Waktu Tempuh | Estimasi Paparan PM2.5 | Badge |
    | Rute Tercepat | 8 Menit | 42 µg/m³ (Tinggi - Jalur Utama Padat) | Standar |
    | Rute Rendah Polusi | 11 Menit | 16 µg/m³ (Rendah - Melalui Koridor Hijau) | Rekomendasi Sehat |
  And saat pengguna memilih "Rute Rendah Polusi", petunjuk arah navigasi aktif
```

---

### EPIC 7: Proactive Exposure Alerts & Push Notifications

#### User Story 7.1: Notifikasi Lonjakan Polusi di Lokasi Tersimpan
*Sebagai seorang* orang tua komuter,  
*Saya ingin* menerima peringatan dini otomatis di smartphone saat kualitas udara di sekitar rute sekolah anak saya melebihi ambang batas tidak sehat (> 35.5 µg/m³),  
*Agar saya dapat* membekali anak dengan masker respirator N95 atau memilih moda transportasi tertutup.

---

## 4. Kebutuhan Non-Fungsional, Privasi & Keamanan

### 4.1 Kepatuhan Hukum Privasi (UU PDP No. 27/2022)
1. **Zonasi Privasi Kediaman Mitra (*Privacy Zones*):**
   * Sistem secara otomatis menerapkan *geofence cloaking* radius 500 meter di sekitar titik rumah tinggal terdaftar mitra.
   * Di dalam zona privasi ini, perekaman telemetri koordinat dinonaktifkan atau digeser (*noise injected*) sehingga lokasi persis tempat tinggal mitra tidak pernah tersimpan di basis data publik.
2. **Pseudonimisasi Data Spasial Publik:**
   * Data pengukuran kualitas udara yang disajikan kepada warga dan API pihak ketiga dipisahkan secara kriptografis (*tokenized*) dari identitas pengemudi, pelat nomor motor listrik, dan ID perangkat fisik.
3. **Penyimpanan & Retensi Data:**
   * Raw data telemetri per detik hanya disimpan selama 14 hari untuk keperluan audit validasi anti-cheat, setelah itu diagregasikan ke dalam data rata-rata ruas jalan (*street segment aggregate*) dan data mentah dihapus permanen.

### 4.2 Offline Telemetry Buffering & Sinkronisasi
1. **Penyimpanan Lokal Mandiri:**
   * Jika modem 4G LTE-M pada alat clip-on atau koneksi seluler smartphone mitra kehilangan sinyal (misalnya di area underpass atau blankspot gedung tinggi), data telemetri disimpan dalam memori non-volatile (Flash SPI 16MB pada alat / SQLite lokal terenkripsi di smartphone).
   * Kapasitas buffer lokal mampu menampung hingga **72 jam data pengukuran berkelanjutan** tanpa ada data poin yang hilang.
2. **Protokol Rekonsiliasi Otomatis:**
   * Saat koneksi internet pulih, antrian data lokal dikirim secara bertahap (*batched & compressed*) menggunakan format protokol biner ringan (Protocol Buffers via MQTT/HTTPS) dengan tanda waktu GNSS presisi.

### 4.3 Efisiensi Daya & Performa Sistem Smartphone
1. **ActivityKit & Dynamic Island Optimization:**
   * Pembaruan data ke Dynamic Island dan Lock Screen Live Activity dibatasi maksimum 1 pembaruan per 3–5 detik untuk menjaga konsumsi daya prosesor di bawah 1%.
2. **Konsumsi Baterai Smartphone:**
   * Pemanfaatan *Fused Location Provider* dan *Significant Location Change API* memastikan konsumsi baterai smartphone mitra **< 4% per 4 jam sesi berkendara aktif**.
3. **Daya Tahan Baterai Alat Clip-on:**
   * Baterai LiFePO4 26650 (3.200 mAh) wajib bertahan minimal **18 jam berturut-turut** dalam mode pengukuran standar (frekuensi pembacaan optik 1 Hz dan transmisi burst 10 detik).

---

## 5. Prioritas Fitur (MoSCoW Matrix)

| Kategori | Fitur / Komponen | Target Rilis | Rasionalisasi & Dampak |
| :--- | :--- | :--- | :--- |
| **Must Have (M)** | BLE Pairing & Health Sensor Indicator (Baterai & Status SPS30) | MVP / Prototipe V1 | Kebutuhan esensial koneksi hardware mitra |
| **Must Have (M)** | Anti-Cheat Engine Fusi GPS + Akselerometer | MVP / Prototipe V1 | Mencegah kecurangan klaim kilometer reward |
| **Must Have (M)** | Peta MapKit Polyline Ruas Jalan (Hijau/Kuning/Merah) | MVP / Prototipe V1 | Inti proposisi nilai visual bagi warga |
| **Must Have (M)** | Label "Data Indikatif" & Skor Keyakinan (*Confidence Score*) | MVP / Prototipe V1 | Kepatuhan regulasi dan transparansi metodologi |
| **Must Have (M)** | Wallet & Reward Engine Rp120/km Tervalidasi | MVP / Prototipe V1 | Penggerak utama adopsi dan retensi mitra EV |
| **Must Have (M)** | Kepatuhan Privacy Zone UU PDP No. 27/2022 | MVP / Prototipe V1 | Kewajiban kepatuhan hukum perlindungan data pribadi |
| **Should Have (S)** | Dynamic Island & Live Activity (Biker Mode) | Prototipe V1.1 | Pengalaman berkendara aman tanpa distraksi HP |
| **Should Have (S)** | Misi Ruas Heksagonal Uber H3 (2x Multiplier) | Prototipe V1.1 | Menghindari over-sampling rute padat semata |
| **Should Have (S)** | Low-Exposure Route Planner (Navigasi Rendah Polusi) | Prototipe V1.2 | Nilai guna tinggi bagi pejalan kaki & komuter |
| **Should Have (S)** | Offline Data Buffering (SQLite & Flash Memory) | Prototipe V1.1 | Menjamin integritas data saat blankspot 4G |
| **Could Have (C)** | Layer Heatmap Paparan Panas Mikro (SHT40 Temp/RH) | Prototipe V1.2 | Analisis iklim mikro perkotaan tambahan |
| **Could Have (C)** | Push Notification Peringatan Asap/ISPA Otomatis | Prototipe V1.2 | Fitur protektif kesehatan preventif |
| **Could Have (C)** | Penukaran Poin ke Voucher Servis Motor Listrik | Prototipe V1.3 | Kemitraan B2B dengan bengkel & produsen EV |
| **Won't Have (W)** | Sensor Gas Tambahan (NO2, SO2, CO elektrokimia) | Fase 2 (V2.0) | Membutuhkan kalibrasi rumit dan daya baterai besar |
| **Won't Have (W)** | Integrasi Turn-by-Turn Voice Navigation Penuh | Fase 2 (V2.0) | Menggunakan handoff ke peta navigasi eksternal |

---

## 6. Metrik Keberhasilan Produk (Success Metrics)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PIRAMIDA METRIK UDARAJALAN                        │
├────────────────────────────────────────────────────────────────────────┤
│  NORTH STAR METRIC:                                                    │
│  "Jumlah Kilometer Ruas Jalan Terverifikasi dan Terbarukan per Hari"   │
│  (Target MVP Pilot: 1.500 Km Jalan Unik Terdata Setiap 60 Menit)       │
├────────────────────────────────────────────────────────────────────────┤
│  METRIK MITRA (PENGEMUDI):                                             │
│  • Rasio Validasi Anti-Curang: > 92% perjalanan disetujui              │
│  • Tingkat Penyelesaian Misi Ruas Heksagon (2x Multiplier): > 40%      │
│  • Nilai Pendapatan Tambahan Rata-Rata: Rp25.000 - Rp45.000 / hari     │
├────────────────────────────────────────────────────────────────────────┤
│  METRIK PUBLIK (WARGA & KOMUTER):                                      │
│  • Kueri Rute Rendah Polusi (Low-Exposure Route Queries): > 5.000/hari │
│  • Skor Kepuasan Akurasi Data (Confidence Trust Index): > 4.2 / 5.0    │
│  • Retensi Warga Mingguan (WAU): > 45%                                 │
└────────────────────────────────────────────────────────────────────────┘
```
