# HenryTools

HenryTools adalah kumpulan perkakas PDF berbasis Next.js yang mengutamakan privasi. Fitur yang berstatus **Siap dipakai di browser** memproses file sepenuhnya di perangkat pengguna tanpa mengunggah dokumen ke server.

## Fitur browser

- Gabung, pisah, dan optimasi struktur PDF
- Gambar atau hasil kamera menjadi PDF
- Putar halaman dan hapus rentang halaman
- Watermark, teks, tanda tangan visual, dan nomor halaman
- Crop margin dan perbaikan struktur PDF yang masih dapat dibaca
- Perbandingan metadata dua PDF

Fitur yang membutuhkan konversi Office, enkripsi, OCR, PDF/A, redaksi aman, atau AI tetap memiliki halaman penjelasan dan tidak lagi menghasilkan 404 maupun simulasi keberhasilan.

## Menjalankan project

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Pemeriksaan sebelum deploy

```bash
npm run typecheck
npm run lint
npm run build
```

## Teknologi

- Next.js 14 dan React 18
- TypeScript dan Tailwind CSS
- `pdf-lib` untuk pemrosesan PDF lokal
