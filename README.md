# ambis.in Frontend

Antarmuka web **AMBIS.IN**, platform belajar adaptif untuk siswa SD–SMP. Siswa mengerjakan soal atau bertanya bebas, dan jawabannya berupa **kanvas visual** (alur langkah, analogi bergambar, garis bilangan, batang pecahan), bukan balasan chat. Backend ada di repo `dcc-backend-ambis.in`.

Teknologi: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · next-auth v5 (Google) · KaTeX.

> Proyek ini memakai Next.js 16 yang punya perubahan besar dibanding versi lama (API, konvensi, struktur berkas). Sebelum mengubah kode, baca panduan yang relevan di `node_modules/next/dist/docs/` (lihat `AGENTS.md`).

## Menjalankan

Prasyarat: Node.js 20+ dan backend berjalan di `http://localhost:8001` (atau aktifkan **Mode demo** di bawah).

```bash
pnpm install
pnpm run dev       # http://localhost:3001
```

Variabel lingkungan (`.env.local`, jangan di-commit):

| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL backend. Bawaan `http://localhost:8001` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Login Google (next-auth) |
| `NEXT_PUBLIC_DEMO_TOGGLE` | `1` menampilkan kotak centang **Mode demo (tanpa server)** di `/dashboard/canvas`; tanpa ini siswa hanya melihat mode online |
| `NEXT_PUBLIC_DISABLE_CHAT_LIMIT` | `true` mematikan batas percakapan di halaman `/` (chat lama) |

next-auth v5 juga membaca `AUTH_SECRET` dari environment; kemungkinan wajib di production (belum diverifikasi di repo ini).

### Package manager

Repo ini hanya memakai **pnpm** (`pnpm-lock.yaml`). `pnpm-workspace.yaml` wajib ada: pnpm 11 berhenti dengan `ERR_PNPM_IGNORED_BUILDS` tanpa `allowBuilds: { unrs-resolver: false }`. Jangan menambah lockfile lain.

## Halaman utama untuk demo: kanvas

| Rute | Isi |
|---|---|
| `/dashboard/canvas` | **Latihan soal** (pilih soal, jawab, lihat penjelasan bergambar, bar penguasaan) dan **Tanya bebas** |
| `/dashboard/canvas/preview` | Empat jenis kanvas dari fixture, **tanpa server**. Cadangan terakhir saat demo |

Jalankan dev server dengan `NEXT_PUBLIC_DEMO_TOGGLE=1`, lalu di `/dashboard/canvas` centang **Mode demo (tanpa server)** untuk jalan sepenuhnya di browser dengan data tiruan: jawab `4/9` (penjelasan), jawaban salah lain dua kali (petunjuk), salah ke-3 (contoh langkah), lalu `17/20` (benar).

Alur data (jalur Latihan): frontend memanggil `GET /api/v1/curriculum/practice` untuk daftar soal (tanpa kunci jawaban), lalu `POST /api/v1/agent/hermes` dengan SSE. Event `visual` membawa **VisualSpec** yang divalidasi dulu oleh `normalizeVisualSpec` sebelum digambar. Tab Tanya bebas memakai `POST /api/v1/ask/visual`.

## Rute lain

| Rute | Catatan |
|---|---|
| `/` | Chat lama (jalur teks backend yang dibekukan) |
| `/auth/login`, `/auth/register`, `/auth/error` | Autentikasi |
| `/dashboard/learning/...`, `/dashboard/learning-summary/[pathId]`, `/dashboard/progress`, `/dashboard/chat/new` | Learning path dan progres |

## Struktur

```
app/
  dashboard/canvas/          Halaman kanvas (+ preview/)
  hooks/
    useCanvasSession.ts      Latihan: kirim jawaban ke Hermes lewat SSE, simpan session/problem id
    useOfflineCanvasDemo.ts  Mode demo tanpa server
  components/                Ikon
  auth, api/auth/            next-auth
components/
  Visual/                    Renderer kanvas baru: VisualCanvas, blocks, FractionShape,
                             AnswerBox, FreeAsk, RichText
  Canvas/                    Panel kanvas LAMA untuk chat (LearningCanvas, StepFlowCanvas)
  Chat/  Layout/  Mascot/  learning/  Modal/
lib/
  visualSpec.ts              Tipe VisualSpec + parser defensif (membuang block tak dikenal)
  sse.ts                     Pembaca Server-Sent Events
  fixtures/                  Contoh VisualSpec untuk preview dan mode demo
```

`components/Visual` (baru, kontrak VisualSpec) dan `components/Canvas` (lama, parsing teks) mudah tertukar: kerja kanvas baru selalu di `components/Visual`.

## Tampilan

Arah desain kanvas: **"Kertas & Tinta"**, seperti halaman buku latihan sekolah untuk siswa 7–15 tahun. Kertas krem dengan teks tinta gelap, satu aksen biru pulpen, dan penanda kuning hanya pada hal yang harus dikerjakan siswa. Token warna dan tipografi ada di `app/globals.css` (`@theme inline`): `paper`, `card`, `ink`, `ink-soft`, `line`, `edge`, `accent`, `correct`, `attention`, `mark`, `wrong`. Aturan yang dipegang: semua teks minimal 4,5:1 kontrasnya, tidak ada teks di bawah 14px, target sentuh minimal 44px, `focus-pop` pada setiap kontrol, dan animasi menghormati `prefers-reduced-motion`. Font memakai Geist lewat `next/font`.

## Perintah

| Perintah | Fungsi |
|---|---|
| `pnpm run dev` | Dev server di port 3001 |
| `pnpm run build` / `pnpm run start` | Build produksi dan menjalankannya di port 3001 |
| `pnpm exec tsc --noEmit` | Cek tipe |
| `pnpm exec eslint app/dashboard/canvas components/Visual lib app/hooks/useCanvasSession.ts app/hooks/useOfflineCanvasDemo.ts` | Lint kode kanvas (bersih) |

Skrip `lint` di `package.json` memanggil `next lint`, yang sudah dihapus di Next.js 16 (perintahnya membaca `lint` sebagai nama folder), jadi gunakan `eslint` langsung. `pnpm exec eslint app components lib` untuk seluruh kode saat ini melaporkan 23 error dan 22 peringatan di kode lama (terbanyak `react-hooks/set-state-in-effect`, `no-explicit-any`, dan `no-unused-vars`, antara lain di `app/dashboard/learning/page.tsx` dan `app/auth/error/page.tsx`); kode kanvas tidak termasuk. Belum ada tes otomatis di repo ini.

## Docker

`Dockerfile` memakai pnpm (`corepack enable`, `pnpm install --frozen-lockfile`) dan menjalankan dev server (`pnpm run dev`) di port 3001. `next.config.ts` mengizinkan origin `localhost`, `127.0.0.1`, dan `host.docker.internal` pada port 3001.
