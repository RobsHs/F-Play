# DESIGN.md - F-Play: The Ultimate Movie & Anime Stream

## 1. Identity & Purpose

- **Brand**: F-Play
- **Tagline**: Streaming film bioskop terbaru, anime, dan film legendaris lama terlengkap dengan proteksi anti-iklan pop-up.
- **Tone**: Sinematik, berani, modern, bersih dari gangguan iklan, dan responsif.
- **No-AI Slop Guarantee**:
  - Tidak ada karakter em dash (tanda pisah panjang) di seluruh antarmuka.
  - Tidak ada tombol mati. Semua tombol (Play, Trailer, Bookmark, Switch Server, Anti-Iklan Shield, Tab Kategori) memiliki aksi nyata.
  - State lengkap: Loading player, Empty watchlist, Hasil pencarian kosong, dan Fallback server.
  - Kontras warna memenuhi standar WCAG AA (teks terbaca tajam di atas latar gelap).

## 2. Color Palette

- `--bg-primary`: `#08090d` (Obsidian hitam pekat ala bioskop)
- `--bg-secondary`: `#10131a` (Permukaan kartu dan bar navigasi)
- `--bg-surface`: `#161a24`
- `--bg-card-glass`: `rgba(18, 22, 31, 0.78)`
- `--border-subtle`: `rgba(255, 255, 255, 0.08)`
- `--color-accent`: `#e50914` (Crimson Red untuk CTA Play dan logo F-Play)
- `--color-accent-hover`: `#f41f2a`
- `--color-gold`: `#f5c518` (Amber Gold untuk rating dan badge)
- `--color-green-shield`: `#10b981` (Emerald untuk status Anti-Iklan Shield Aktif)
- `--color-text-main`: `#f5f6f8`
- `--color-text-muted`: `#949db0`

## 3. Typography

- **Headings & Hero**: `Plus Jakarta Sans` (Bobot 700-800, tajam dan ramah layar)
- **Body & Subtitles**: `Plus Jakarta Sans` (Bobot 400-500)
- **Badges & Metadata**: `JetBrains Mono` (Presisi untuk durasi waktu, tahun rilis, dan resolusi)

## 4. Auto-Updating Engine & Streaming Architecture (2024 - 2030+)

- **Sistem Real-Time Dinamis (Tanpa Perlu Update Manual Sampai 2030)**:
  - Mengambil data langsung dari TMDB API secara real-time pada setiap pemuatan halaman (`/movie/now_playing`, `/trending/movie/week`, `/movie/top_rated`, `/discover/movie`).
  - Tahun rilis selalu sinkron dengan kalender dunia: rilis 2026 otomatis muncul di 2026, rilis 2027 di 2027, dan seterusnya hingga 2030+.
  - Fitur pencarian global langsung memuat jutaan film lawas dan baru dari database dunia.
- **7 Server Mirror Alternatif (100% Kompatibel Bebas Sandboxing Error)**:
  1. Server 1: VidLink Pro (Rekomendasi Utama, paling bersih dari pop-up)
  2. Server 2: VidSrc CC v2 (Mirror generasi baru dengan CDN kencang)
  3. Server 3: Embed.su (Server cadangan modern berkecepatan tinggi)
  4. Server 4: VidSrc TO (Jalur streaming stabil)
  5. Server 5: VidSrc XYZ (Mirror klasik alternatif)
  6. Server 6: MultiEmbed Backup (Jalur darurat pelapis terakhir)
  7. Server 7: Trailer Resmi HD (Resolusi dinamis YouTube API)
- **Kompatibilitas Penuh Tanpa Eror Sandboxing**:
  - Iframe video player bebas dari atribut sandbox yang memicu script error "Sandboxing is not allowed".
  - Proteksi tab utama dari pengalihan tidak diinginkan melalui event handler parent window.

## 5. Dials & Liveliness

- **ENERGY**: 3
- **RHYTHM**: 3
- **MOTION**: 3

## 6. Cinema Theater Mode Architecture (Pengalaman Nonton Nyaman & Mewah)

- **Dedicated Cinema Theater View (Bukan Pop-up Modal Kaku)**:
  - Menggantikan modal melayang yang sempit dengan halaman panggung bioskop terdedikasi (`#theater-view`).
  - Transisi layar mulus dari katalog utama ke mode teater dan otomatis bergulir ke atas.
- **Panggung Layar Lebar Sinematik 16:9**:
  - Di PC / Desktop: Layar 16:9 widescreen berada di tengah dengan efek ambient glow sinematik di belakang player.
  - Di Smartphone / Mobile: Pemutar video memenuhi layar dari tepi ke tepi (edge-to-edge 100vw) tanpa margin terpotong.
- **Server Selector Pills Bersih (Bebas Scrollbar Jelek)**:
  - Tombol server berbentuk pil modern yang dapat digulir dengan sentuhan jari atau mouse tanpa memunculkan track scrollbar Windows yang mengganggu (`scrollbar-width: none`).
  - Indikator server aktif menyala dengan titik aksen merah.
- **Integrasi Deep Linking & Riwayat Browser**:
  - Sinkronisasi URL otomatis dengan hash `#watch-{tmdbId}`.
  - Tombol Kembali di browser atau tombol keyboard `Escape` otomatis mengembalikan penonton ke katalog utama.
  - Tombol "Bagi Link" memudahkan pengguna membagikan tautan tontonan langsung.
- **Rekomendasi Terus Berjalan (Up Next)**:
  - Grid film rekomendasi di bawah sinopsis memungkinkan penonton langsung beralih ke film lain tanpa kembali ke halaman awal.
