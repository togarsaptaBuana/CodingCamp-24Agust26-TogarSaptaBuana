# Mood & Habit Tracker — Project Steering

## Ringkasan Project

Website dashboard produktivitas harian untuk melacak suasana hati (mood) dan kebiasaan positif. Dibangun dengan Vanilla HTML, CSS, dan JavaScript tanpa framework eksternal.

## Struktur File

```
project-root/
├── index.html          ← Entry point utama
├── css/
│   └── style.css       ← Semua styling (1 file saja)
├── js/
│   └── script.js       ← Semua logika JS (1 file saja)
└── .kiro/
    └── steering/
        └── project.md  ← File ini
```

## Aturan Ketat

- **Jangan** menambahkan file CSS atau JS tambahan
- **Jangan** menggunakan framework (React, Vue, Angular, Bootstrap, jQuery)
- **Jangan** menggunakan backend atau database
- **Selalu** gunakan Vanilla HTML, CSS, dan JavaScript
- **Selalu** simpan data ke Browser Local Storage

## Local Storage Keys

| Key | Tipe | Deskripsi |
|-----|------|-----------|
| `habitTrackerTasks` | `Array<{id, name}>` | Definisi kebiasaan permanen |
| `habitTrackerName` | `string` | Nama pengguna |
| `habitTrackerTheme` | `"dark" \| "light"` | Preferensi tema |
| `habitTrackerMoods` | `{"YYYY-MM-DD": mood}` | Riwayat mood harian |
| `habitTrackerDailyStatus` | `{"YYYY-MM-DD": {id: bool}}` | Status centang per hari |

## Fitur MVP

### Greeting & Clock
- Salam berdasarkan waktu: Morning (05-11), Afternoon (12-17), Evening (18-04)
- Jam dan tanggal berjalan real-time (setInterval 1000ms)

### Mood Tracker
- 5 mood: great 😄, happy 🙂, neutral 😐, sad 😔, bad 😞
- Satu mood per hari, disimpan per tanggal
- Riwayat 7 hari terakhir ditampilkan di weekly grid

### Habit Tracker
- 3 default habits: Minum Air 2L, Olahraga 15 Menit, Membaca Buku
- CRUD: tambah, edit (via modal), hapus, toggle selesai
- Progress bar dinamis dihitung dari completed/total hari ini
- Status reset otomatis setiap hari baru

## 3 Challenges

1. **Light/Dark Mode** — CSS Variables + toggle disimpan di LS
2. **Custom Name** — Input nama tersimpan di LS, tampil di greeting
3. **Prevent Duplicate** — Cek case-insensitive sebelum tambah habit

## Desain & CSS

- CSS Variables untuk semua warna (dark/light theme)
- Card-based layout, 2 kolom desktop, 1 kolom mobile
- Breakpoints: 860px (tablet), 580px (mobile), 360px (xs)
- Warna mood per jenis: great=kuning, happy=hijau, neutral=biru, sad=ungu, bad=merah

## Konvensi Kode JavaScript

- Gunakan `'use strict'`
- Pisahkan fungsi berdasarkan tanggung jawab (clock, greeting, mood, habit, toast)
- Semua akses localStorage melalui helper `lsGet()` dan `lsSet()`
- Guard terhadap data rusak di localStorage (try/catch + fallback)
- Jangan buat lebih dari satu setInterval untuk clock

## GitHub Pages

- `index.html` ada di root
- Semua path CSS/JS menggunakan path relatif (`css/style.css`, `js/script.js`)
- Tidak ada backend, aman dijalankan sebagai static site
