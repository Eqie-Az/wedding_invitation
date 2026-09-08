# Wedding Invitation — Muhammad Wiranto & Aulia Fairouz Zahwa

Website undangan pernikahan digital, dibangun statis (tanpa framework) dengan
HTML5, CSS3, dan Vanilla JavaScript. Desain terinspirasi dari referensi visual
premium bernuansa dusty blue, cream, dan gold dengan ornamen floral.

## 1. Teknologi

- HTML5 (semantic markup)
- CSS3 (custom properties / CSS variables, Flexbox, Grid, `clamp()`)
- Vanilla JavaScript (tanpa library eksternal, tanpa build step)
- Google Fonts: Cormorant Garamond, Montserrat, Parisienne

Tidak ada dependency, tidak ada `npm install`, tidak ada bundler. File bisa
langsung dibuka atau di-deploy sebagai static site.

## 2. Struktur Folder

```
wedding-invitation/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── assets/
    └── images/
        ├── couple.jpg   (placeholder — ganti dengan foto berdua)
        ├── bride.jpg    (placeholder — ganti dengan foto mempelai wanita)
        └── groom.jpg    (placeholder — ganti dengan foto mempelai pria)
```

> **Catatan:** `couple.jpg`, `bride.jpg`, dan `groom.jpg` saat ini adalah
> ilustrasi/placeholder netral (bukan foto orang), karena foto asli belum
> tersedia. Ganti ketiga file ini dengan foto asli begitu tersedia — lihat
> langkah di bagian 4.

## 3. Cara Menjalankan Secara Lokal

Karena ini website statis murni, cukup jalankan local web server (disarankan
agar path gambar & fetch bekerja normal di semua browser):

**Opsi A — Python:**
```bash
cd wedding-invitation
python3 -m http.server 8000
```
Lalu buka `http://localhost:8000` di browser.

**Opsi B — VS Code:**
Gunakan ekstensi "Live Server", klik kanan `index.html` → "Open with Live Server".

**Opsi C — Node:**
```bash
npx serve wedding-invitation
```

Anda juga bisa membuka `index.html` langsung dua kali klik, tetapi
menjalankan lewat local server lebih disarankan.

## 4. Cara Mengganti Foto Mempelai

Tidak perlu mengubah kode sama sekali. Cukup:

1. Siapkan foto baru dengan rasio disarankan **4:5 (portrait)**.
2. Beri nama file **persis sama** dengan salah satu dari:
   - `couple.jpg` → foto Muhammad Wiranto & Aulia Fairouz Zahwa berdua
   - `bride.jpg` → foto Aulia Fairouz Zahwa
   - `groom.jpg` → foto Muhammad Wiranto
3. Hapus file placeholder lama di `assets/images/`.
4. Taruh file foto baru dengan nama yang sama di folder `assets/images/`.
5. Refresh browser — foto otomatis tampil mengisi frame (menggunakan
   `object-fit: cover`, jadi foto tidak akan gepeng/distorsi).

Jika sebuah file gambar hilang atau gagal dimuat, website tidak akan error —
frame foto tetap tampil dengan latar netral.

## 5. Cara Mengganti Alamat & Google Maps

Buka `script.js`, cari bagian `WEDDING_CONFIG` di bagian paling atas file:

```js
const WEDDING_CONFIG = {
  ...
  address: "",     // isi dengan alamat lengkap
  mapsUrl: "",     // isi dengan link Google Maps
  ...
};
```

- **Alamat:** isi `address` dengan teks alamat lengkap acara.
  Selama masih kosong (`""`), website otomatis menampilkan teks
  "Alamat acara akan segera diperbarui."
- **Google Maps:** isi `mapsUrl` dengan link share dari Google Maps
  (klik "Share" di Google Maps → "Copy link"). Selama kosong, tombol
  "Buka Lokasi GMaps" otomatis nonaktif (tidak bisa diklik, tidak error).

## 6. Cara Mengganti Tanggal & Waktu Acara

Masih di `WEDDING_CONFIG` dalam `script.js`:

```js
eventDate: "2026-09-19T09:00:00+07:00",
eventTime: "09.00 - 18.00 WIB",
```

- `eventDate` **wajib** dalam format ISO 8601 dengan offset zona waktu
  (`+07:00` untuk WIB). Ini yang dipakai countdown untuk menghitung mundur.
- `eventTime` adalah teks jam yang ditampilkan di bagian Resepsi.

Tanggal & waktu resepsi yang tampil di bagian lain (misalnya "Sabtu, 19
September 2026") ditulis langsung di `index.html` — cari teks tersebut di
bagian `<section id="lokasi">` bila ingin diubah.

## 7. Cara Mengganti Nama Mempelai

Nama mempelai, nama orang tua, dan status ("Putra dari" / "Putri dari")
ditulis langsung di `index.html` (bukan di config), karena menyangkut
markup teks yang lebih panjang. Cari bagian:

```html
<section id="mempelai" class="section couple-section">
```

di dalamnya ada dua `<article class="card person-card">` — satu untuk
mempelai wanita, satu untuk mempelai pria. Ubah teks nama dan nama orang
tua langsung di situ.

Nama di bagian Hero (`<section id="home">`) dan Ucapan Terima Kasih
(bagian footer) juga ditulis langsung di HTML dan bisa diubah dengan cara
yang sama.

## 8. Cara Deploy

Karena ini static site murni, bisa di-deploy ke berbagai platform gratis:

**Netlify (drag & drop):**
1. Buka [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag & drop folder `wedding-invitation` ke halaman tersebut.
3. Selesai — dapat URL langsung.

**Vercel:**
```bash
npm i -g vercel
cd wedding-invitation
vercel
```

**GitHub Pages:**
1. Push folder ini ke repository GitHub.
2. Masuk ke Settings → Pages → pilih branch `main` dan folder `/ (root)`.
3. Website akan tersedia di `https://<username>.github.io/<repo>/`.

Tidak ada proses build yang diperlukan — file `index.html`, `style.css`,
`script.js`, dan folder `assets/` cukup diunggah apa adanya.

## 9. Fitur yang Sudah Diimplementasikan

- Opening gate (layar pembuka) dengan tombol "Buka Undangan"
- Hero/cover dengan nama mempelai & foto couple
- Section ayat (QS. Ar-Rum: 21)
- Section kedua mempelai dengan frame foto oval elegan
- Countdown realtime (hari/jam/menit/detik) menuju tanggal acara, dengan
  penanganan aman untuk: tanggal tidak valid, acara sudah lewat/dimulai
  (menampilkan "Hari bahagia telah tiba."), dan tidak pernah menghasilkan
  `NaN` atau angka negatif
- Section resepsi dengan alamat & tombol Google Maps yang otomatis
  nonaktif bila data belum diisi
- Section ucapan terima kasih
- Floating navigation (Home, Mempelai, Tanggal, Lokasi) dengan efek
  translucent + backdrop blur, dan highlight otomatis sesuai section
  yang sedang dilihat
- Smooth scrolling antar section
- Animasi fade-in/slide-up ringan saat scroll (menghormati
  `prefers-reduced-motion`)
- Fallback aman bila gambar gagal dimuat — tidak menghentikan halaman
- Semua JavaScript dibungkus try/catch per-modul, sehingga satu error
  tidak menghentikan seluruh website
- Semantic HTML (`header`, `main`, `section`, `nav`, `footer`), atribut
  `alt` pada semua gambar, kontras warna yang cukup, tombol dapat diakses
  keyboard, dan `aria-live` pada countdown
- Meta tag SEO dasar + Open Graph tags
- Tidak ada `eval()`, tidak ada API key/secret, semua link eksternal
  memakai `target="_blank" rel="noopener noreferrer"`

## 10. Hasil Testing

Sudah diverifikasi di lingkungan pengembangan ini:

| Item | Status |
|---|---|
| Sintaks JavaScript (`node --check script.js`) | ✅ Lolos, tanpa error |
| Struktur HTML (validasi dengan `tidy`) | ✅ Tidak ada error struktural (hanya warning non-kritis terkait atribut HTML5 modern yang tidak dikenali linter versi lama) |
| Sintaks CSS (kurung kurawal seimbang, dicek otomatis) | ✅ Seimbang |
| Server lokal (`python3 -m http.server`) | ✅ `index.html` merespons HTTP 200 |
| Logika countdown | ✅ Ditelusuri manual: perhitungan hari/jam/menit/detik benar, menangani tanggal invalid, menangani acara yang sudah lewat, di-update tiap 1 detik via `setInterval` |
| Logika alamat/maps kosong | ✅ Ditelusuri manual: tombol otomatis disabled saat `mapsUrl` kosong, teks fallback tampil saat `address` kosong |
| Placeholder foto | ✅ Dibuat sebagai ilustrasi floral netral (bukan foto orang sungguhan), sesuai instruksi |

**Keterbatasan lingkungan pengerjaan ini:** sandbox tempat saya membangun
project ini tidak memiliki akses browser headless (Playwright/Chromium
gagal ter-install karena domain unduhannya diblokir oleh konfigurasi
jaringan sandbox), sehingga saya tidak bisa mengambil screenshot render
sungguhan atau menjalankan visual-diff otomatis terhadap gambar referensi
Anda dari sini. Yang sudah saya lakukan sebagai gantinya:
- Menjalankan server lokal dan memverifikasi file termuat dengan benar (HTTP 200)
- Memvalidasi HTML, CSS, dan JavaScript secara statis (lihat tabel di atas)
- Menelusuri setiap breakpoint responsive (360/375/390/414/768/1024/1440px)
  secara manual di CSS untuk memastikan tidak ada nilai yang bisa
  menyebabkan overflow horizontal atau elemen terpotong

**Yang perlu Anda lakukan:** buka website ini di browser sungguhan
(langkah di bagian 3) dan bandingkan langsung dengan referensi. Jika ada
bagian visual yang menurut Anda masih kurang sesuai (warna, ukuran,
spacing tertentu), beri tahu saya bagian mana persisnya — saya akan
perbaiki di iterasi berikutnya.

## 11. Data yang Masih Perlu Anda Isi

Sesuai instruksi awal, hal-hal berikut **sengaja tidak dikarang** dan masih
kosong / placeholder, menunggu data asli dari Anda:

1. **Foto asli mempelai** — `assets/images/couple.jpg`, `bride.jpg`,
   `groom.jpg` masih berupa ilustrasi placeholder.
2. **Alamat lengkap acara** — `WEDDING_CONFIG.address` di `script.js`
   masih kosong.
3. **Link Google Maps** — `WEDDING_CONFIG.mapsUrl` di `script.js` masih
   kosong.
4. **Gambar Open Graph (`og:image`)** — saat ini menunjuk ke
   `assets/images/couple.jpg`; akan otomatis ikut terupdate begitu Anda
   mengganti file tersebut dengan foto asli.

Semua bagian lain (nama mempelai, nama orang tua, tanggal 19 September
2026, jam 09.00–18.00 WIB, teks ayat, teks ucapan terima kasih) sudah
diisi sesuai data yang Anda berikan di prompt.