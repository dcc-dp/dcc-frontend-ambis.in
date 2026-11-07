# DESIGN.md — AMBIS.IN (Set A2: Kertas & Tinta)

Panduan visual untuk frontend siswa AMBIS.IN (SD dan SMP, usia sekitar 7-15 tahun). Semua teks antarmuka berbahasa Indonesia.

## 1. Arah desain

Keluarga "Kertas & Tinta" punya dua tema yang bisa dipindah dengan `<ThemeSwitcher />`:

- **Buku Tulis** (default, terang): buku latihan di siang hari. Krem kertas, tinta navy, biru pulpen, penanda kuning.
- **Papan Kapur** (gelap): papan tulis yang redup. Hijau-arang matte, kapur putih hangat, aksen kapur kuning dan biru muda.

Di luar warna, kedua tema berbeda bentuk:

| Aspek | Buku Tulis | Papan Kapur |
|---|---|---|
| Radius | 4 / 8 / 12 / 16 px | 2 / 3 / 4 / 6 px |
| Garis tepi | 1.5 px | 2 px |
| Bayangan | Bayangan kertas halus | Tanpa bayangan; garis kapur 1 px |
| Tekstur | Garis buku tipis | Debu kapur halus |

Prinsip: anak harus langsung merasa "ini halaman latihan" atau "ini papan kelas", tanpa kehilangan keterbacaan.

## 2. Token warna semantik

Nilai hex ada di file tema (`app/styles/themes/buku-tulis.css`, `app/styles/themes/papan-kapur.css`). Di kode komponen hanya nama token yang dipakai.

| Token | Peran | Buku Tulis | Papan Kapur |
|---|---|---|---|
| paper | latar halaman | #FBF6EA | #1E2823 |
| card | permukaan kartu, input | #FFFDF8 | #27332D |
| paper-deep | latar cekung, state disabled | #F3ECDA | #2F3D36 |
| ink | teks utama | #2A2722 | #ECEADF |
| ink-soft | teks sekunder, placeholder | #5C5648 | #B5BDB2 |
| line | garis pemisah dekoratif | #E0D6BE | #3B4A43 |
| edge | garis tepi kontrol | #8C8470 | #7D8B83 |
| accent | aksen utama (tombol, progres) | #2F4FA8 | #9CC3E6 |
| accent-ink | aksen untuk teks dan hover | #223A80 | #C6DDF2 |
| accent-soft | latar aksen lembut | #E4EAF8 | #23384A |
| accent-fill | aksen isian sekunder | #7F9AE0 | #4F78A6 |
| on-accent | teks di atas accent | #FFFDF8 | #1E2823 |
| correct | teks/ikon benar | #1F6B40 | #9FD9A8 |
| correct-soft | latar benar | #E3F1E6 | #22392B |
| attention | teks/ikon perhatikan | #8A5300 | #F2D27A |
| attention-soft | latar perhatikan | #FFF0CC | #3A3522 |
| wrong | teks/ikon salah | #A63A2B | #F2A7A0 |
| wrong-soft | latar salah | #FBE6E1 | #3D2A28 |
| mark | penanda kuning (label, highlight) | #F7D86A | #5A4C1E |
| mark-soft | penanda lembut | #FBF0C0 | #3D3822 |
| focus-ring | cincin fokus keyboard | #223A80 | #F2D27A |

## 3. Kontras yang dijamin

- Semua pasangan teks dengan latar >= 4.5:1 (WCAG AA).
- Garis tepi kontrol dan cincin fokus >= 3:1 terhadap latar sekitarnya.
- Pasangan teks terendah yang diperiksa: 4.52:1 (aturan rasio pada rampa warna).
- Kontras utama: ink di atas paper 13.79:1 (Buku Tulis) dan 12.58:1 (Papan Kapur).
- Jika menambah warna, cek dengan `node scripts/check-themes.mjs` sebelum dipakai.

## 4. Palette Tailwind dilarang

- Jembatan legacy (`bridge.css`) sudah dihapus: semua layar memakai token semantik.
- Kode baru TIDAK boleh memakai kelas palette Tailwind (gray, blue, red, dst.) maupun hex. `scripts/check-tokens.mjs` menolaknya.

## 5. Aturan main

1. Hanya token semantik (`bg-paper`, `text-ink`, `border-edge`, ...). Tidak ada hex atau rgb di komponen.
2. Tidak ada gradien.
3. Warna hanya untuk makna. Setiap warna yang menandakan status disertai teks label (mis. "Sudah benar:", "Belum tepat:").
4. Teks minimal 14px (`text-sm`). Teks isi utama `text-base` atau lebih besar.
5. Target sentuh minimal 44px (`min-h-11`).
6. Setiap tombol, input, textarea, select, tab, dan tautan memakai `focus-pop`. Semua primitive di `components/ui` memakainya; `ThemeSwitcher` dan `Modal` memakai outline fokus setara buatan sendiri (3px, offset 2px, warna `focus`).
7. Hormati `prefers-reduced-motion` (`motion-reduce:`).
8. Disabled tanpa `opacity-*`: pakai `disabled:bg-paper-deep disabled:text-ink-soft disabled:border-line disabled:cursor-not-allowed`.
9. Satu primitive untuk satu pekerjaan. Jangan membuat tombol kedua untuk fungsi yang sudah ada.
10. Garis tepi selalu bersama `border-theme` (lebar mengikuti tema) dan kelas warna border.
11. Komponen tidak punya komentar kode kecuali diminta.

## 6. Primitive (`components/ui`)

Impor semua dari `@/components/ui`.

| Primitive | Pakai untuk | Catatan |
|---|---|---|
| `Button` | Aksi teks: `primary` (satu per layar), `secondary`, `ghost` (aksi ringan), `danger` (hapus, reset) | `size` sm/md/lg; `loading` menjaga warna varian dan label, menampilkan spinner, memakai `aria-busy` dan `aria-disabled`, mengabaikan klik (tanpa atribut `disabled`); tampilan abu-abu hanya untuk `disabled`; `fullWidth` |
| `IconButton` | Aksi ikon saja (tutup, ulang) | `label` wajib, menjadi `aria-label`; `size` 44 atau 48 |
| `Card` | Pengelompokan konten | `tone`: card, sunken, outline; `padding` sm/md/lg; `as` div/section/article |
| `Badge` | Status kecil yang tidak bisa diklik | `tone`: neutral, accent, correct, attention, wrong, mark |
| `Callout` | Umpan balik atau catatan panjang | `tone`: info, success, warn, error; `live` polite/assertive untuk pesan yang muncul sendiri |
| `Field` + `Input` / `Textarea` | Form dengan label, petunjuk, dan error | Field menyambungkan `id`, `aria-describedby`, `aria-invalid` lewat konteks |
| `Tabs` + `TabPanel` | Pindah bagian dalam satu halaman | Panah kiri/kanan, Home, End; `idBase` opsional (default `useId()`); `Tabs` adalah root (`label`, `value`, `onChange`, `items`, `idBase?`, `trailing?`) dan `TabPanel value` wajib menjadi child `Tabs`; di luar `Tabs` akan melempar error |
| `ProgressBar` | Progres atau skor | `ratio` 0 sampai 1 (dibatasi); `kind` progressbar (default) atau meter; label dan persen selalu tampil |
| `Modal` | Konfirmasi atau detail yang menutup halaman | Native `<dialog>`; Escape, klik latar, dan tombol "Tutup" memanggil `onClose`; panel maksimal `90dvh` dan bisa digulir |

Pilih `Callout` untuk kalimat, `Badge` untuk kata pendek, `Card` untuk blok.

### className: tata letak saja

`cn` hanya menggabungkan kelas, jadi kelas konsumen tidak bisa menimpa kelas dasar dengan andal. Setiap primitive menaruh `className` konsumen paling akhir, tetapi `className` hanya untuk tata letak: margin, lebar, penempatan flex/grid, dan self-alignment. Jangan dipakai untuk warna, warna border, ukuran, atau radius; semuanya lewat prop `variant`, `size`, atau `tone`. Jika butuh tampilan baru, tambahkan varian.

## Batasan yang diketahui

- `--color-white` dipetakan ke card, sehingga `text-white` di atas foto atau overlay menjadi gelap di Papan Kapur. Tugas B menambah token `text-on-media`.
- `rounded-2xl` dan `rounded-3xl` runtuh ke radius xl.
- `app/styles/themes/papan-kapur.css` harus tetap diimpor setelah `buku-tulis.css` (diperiksa `check-themes`).
- `components/learning/ProgressBar.tsx` memakai nama yang sama dengan `components/ui/ProgressBar.tsx`; ganti nama di tugas berikutnya.
- Tema gelap Papan Kapur dibungkus `@media screen`, jadi cetak selalu terang.

## 7. Menambah tema

1. Buat file baru di `app/styles/themes/<nama-tema>.css` dengan set token yang sama persis (semua token di bagian 2).
2. Impor file itu di `app/globals.css` SETELAH `buku-tulis.css` dan `papan-kapur.css`, sebelum `tokens.css`.
3. Daftarkan nama tema di `lib/theme.ts` (`THEMES`, `THEME_LABELS`, `THEME_HINTS`) agar `ThemeSwitcher` menampilkannya.
4. Jalankan pemeriksaan:
   - `node scripts/check-themes.mjs` (kontras dan kelengkapan token)
   - `node scripts/check-tokens.mjs <path>` (memastikan file tidak memakai hex atau palette)
5. Buka `/dev/themes` dan cek kedua pane berdampingan.

## 8. Pemeriksaan

Jalankan dari root repo:

- `node scripts/check-themes.mjs`: kontras semua tema dan kelengkapan token.
- `node scripts/check-tokens.mjs components/ui app/dev`: tidak ada hex, rgb, atau palette di path yang diberikan.
- `node_modules/.bin/eslint components/ui app/dev`: harus bersih.
- `node_modules/.bin/tsc --noEmit -p .`: tidak ada error.
- Pencarian cepat: `grep -rnE "#[0-9a-fA-F]{3,8}\b|\b(bg|text|border)-(gray|blue|indigo|slate|zinc|white|black)" components/ui app/dev` harus kosong.

## 9. Galeri tema

- URL: `/dev/themes` (server dev, port 3001).
- Halaman ini TIDAK ditautkan dari navigasi mana pun. Hanya untuk pengembang.
- Isi: semua token dengan nilai yang terbaca, dan semua primitive dalam semua varian, dua pane berdampingan (tumpuk di layar sempit).
- `<ThemeSwitcher />` di atas halaman mengubah tema aplikasi yang sebenarnya.
