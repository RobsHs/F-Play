/**
 * F-Play: The Ultimate Movie & Anime Stream (Auto-Updating Engine)
 * Terhubung langsung ke API Global TMDB secara real-time.
 * Website ini otomatis memperbarui film terbaru, trending, dan klasik setiap saat
 * tanpa perlu koding ulang manual sampai tahun 2030 dan seterusnya.
 */

// TMDB Public API Configuration & Responsive Lightweight Image Optimizer
const isMobileClient = typeof window !== 'undefined' && (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const TMDB_IMAGE_BASE = isMobileClient ? 'https://image.tmdb.org/t/p/w342' : 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = isMobileClient ? 'https://image.tmdb.org/t/p/w780' : 'https://image.tmdb.org/t/p/w1280';

// Fallback Poster SVG Lokal Berkualitas Tinggi (Menjamin tidak ada thumbnail kosong)
const FALLBACK_POSTER_SVG = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22450%22%20viewBox%3D%220%200%20300%20450%22%3E%3Crect%20fill%3D%22%23161a24%22%20width%3D%22300%22%20height%3D%22450%22%2F%3E%3Ccircle%20cx%3D%22150%22%20cy%3D%22190%22%20r%3D%2236%22%20fill%3D%22%23e50914%22%20fill-opacity%3D%220.2%22%2F%3E%3Cpolygon%20points%3D%22143%2C175%20163%2C190%20143%2C205%22%20fill%3D%22%23e50914%22%2F%3E%3Ctext%20fill%3D%22%23ffffff%22%20font-family%3D%22system-ui%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%3EF-PLAY%3C%2Ftext%3E%3Ctext%20fill%3D%22%23949db0%22%20font-family%3D%22system-ui%2Csans-serif%22%20font-size%3D%2213%22%20x%3D%2250%25%22%20y%3D%22280%22%20text-anchor%3D%22middle%22%3ESinema%20HD%3C%2Ftext%3E%3C%2Fsvg%3E`;

// Kamus Nama Genre Resmi TMDB
const GENRE_MAP = {
  28: 'Action',
  12: 'Petualangan',
  16: 'Anime & Animasi',
  35: 'Komedi',
  80: 'Kriminal',
  99: 'Dokumenter',
  18: 'Drama',
  10751: 'Keluarga',
  14: 'Fantasi',
  36: 'Sejarah',
  27: 'Horor',
  10402: 'Musik',
  9648: 'Misteri',
  10749: 'Romansa',
  878: 'Sci-Fi',
  10770: 'Film TV',
  53: 'Thriller',
  10752: 'Perang',
  37: 'Western'
};

// 7 Provider Streaming Video Teruji & Bebas Sandbox Error (Optimal Audio Playback)
const STREAM_SERVERS = {
  server1: (tmdbId) => `https://vidlink.pro/movie/${tmdbId}?primaryColor=e50914&autoplay=false`,
  server2: (tmdbId) => `https://vidsrc.cc/v2/embed/movie/${tmdbId}?autoPlay=false`,
  server3: (tmdbId) => `https://embed.su/embed/movie/${tmdbId}`,
  server4: (tmdbId) => `https://vidsrc.to/embed/movie/${tmdbId}`,
  server5: (tmdbId) => `https://vidsrc.xyz/embed/movie/${tmdbId}`,
  server6: (tmdbId) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
  trailer: (trailerId) => `https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=0&rel=0`
};

// Fallback Cache Jika Pengguna Offline atau API Lambat
const FALLBACK_CATALOG = [
  {
    id: 'f1',
    tmdbId: '533535',
    title: 'Deadpool & Wolverine',
    year: '2024',
    rating: '8.9',
    quality: '4K ULTRA HD',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w342/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/yDHYTfaEtcuIMvxURQIahvtMRbt.jpg',
    trailerId: 'uJMCNJP2ipI',
    synopsis: 'Wade Wilson yang telah pensiun ditarik kembali oleh TVA untuk menghadapi krisis kehancuran semesta bersama Wolverine.'
  },
  {
    id: 'f2',
    tmdbId: '693134',
    title: 'Dune: Part Two',
    year: '2024',
    rating: '9.0',
    quality: '4K ULTRA HD',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg',
    trailerId: 'Way9Dexny3w',
    synopsis: 'Paul Atreides bersatu dengan Chani dan kaum Fremen untuk membalas dendam terhadap para konspirator di planet Arrakis.'
  },
  {
    id: 'f3',
    tmdbId: '278',
    title: 'The Shawshank Redemption',
    year: '1994',
    rating: '9.3',
    quality: 'HD',
    genres: ['Drama', 'Crime'],
    poster: 'https://image.tmdb.org/t/p/w342/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/kXfqNm225ZuzwnrLvTG4hw1ndDd.jpg',
    trailerId: 'PLl99DlL6b4',
    synopsis: 'Bankir Andy Dufresne menjalani hukuman seumur hidup di penjara Shawshank dan merajut harapan kebebasan yang luar biasa.'
  },
  {
    id: 'f4',
    tmdbId: '155',
    title: 'The Dark Knight',
    year: '2008',
    rating: '9.0',
    quality: '4K ULTRA HD',
    genres: ['Action', 'Crime', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    trailerId: 'EXeTwQWrcwY',
    synopsis: 'Batman menghadapi musuh paling berbahaya: The Joker, yang ingin menjerumuskan Gotham ke dalam anarki total.'
  }
];

// Global App State
let currentMovie = FALLBACK_CATALOG[0];
let currentServer = 'server1';
let activeCategoryFilter = 'all';
let activeGenreFilter = 'all';
let activeSearchQuery = '';
let searchDebounceTimer;

// Master In-Memory Store untuk semua film yang telah di-fetch
let memoryMovieStore = new Map();

/* --- Helper Pengubah Format Item TMDB ke Format Standar F-Play --- */
function formatTmdbMovie(item) {
  if (!item) return null;

  const genres = (item.genre_ids && Array.isArray(item.genre_ids))
    ? item.genre_ids.map(id => GENRE_MAP[id] || 'Film').slice(0, 3)
    : (item.genres && Array.isArray(item.genres) ? item.genres.map(g => g.name || g) : ['Film']);

  const year = item.release_date ? item.release_date.split('-')[0] : 'Terbaru';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '8.0';
  const quality = (item.vote_average && item.vote_average >= 8.2) ? '4K ULTRA HD' : 'HD 1080p';

  const poster = item.poster_path
    ? `${TMDB_IMAGE_BASE}${item.poster_path}`
    : (item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : FALLBACK_POSTER_SVG);

  const backdrop = item.backdrop_path
    ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}`
    : (item.poster_path ? `${TMDB_BACKDROP_BASE}${item.poster_path}` : '');

  const movieObj = {
    id: `m_${item.id}`,
    tmdbId: String(item.id),
    title: item.title || item.original_title || 'Film Sinema',
    year: year,
    rating: rating,
    quality: quality,
    genres: genres.length > 0 ? genres : ['Sinema'],
    poster: poster,
    backdrop: backdrop,
    trailerId: 'uJMCNJP2ipI', // Akan di-resolve secara dinamis saat tombol trailer diklik
    synopsis: item.overview || 'Film pilihan terbaik siap tonton di multi-server F-Play.'
  };

  memoryMovieStore.set(movieObj.tmdbId, movieObj);
  return movieObj;
}

/* --- TMDB Live API Fetchers --- */
async function fetchTmdbEndpoint(path, params = {}) {
  try {
    const query = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'id-ID',
      ...params
    });
    const res = await fetch(`https://api.themoviedb.org/3/${path}?${query.toString()}`);
    if (!res.ok) throw new Error(`TMDB error status ${res.status}`);
    const data = await res.json();
    return data.results ? data.results.map(formatTmdbMovie).filter(Boolean) : [];
  } catch (err) {
    console.warn(`Gagal memuat ${path}, menggunakan fallback offline:`, err);
    return [];
  }
}

// 1. Film Rilis Terbaru (Now Playing) Real-time
async function getNowPlayingMovies() {
  const live = await fetchTmdbEndpoint('movie/now_playing', { page: 1 });
  return live.length > 0 ? live : FALLBACK_CATALOG;
}

// 2. Film Lawas & Legendaris (Top Rated) Real-time
async function getClassicMovies() {
  const live = await fetchTmdbEndpoint('movie/top_rated', { page: 1 });
  return live.length > 0 ? live : FALLBACK_CATALOG;
}

// 3. Trending Minggu Ini Real-time
async function getTrendingMovies() {
  const live = await fetchTmdbEndpoint('trending/movie/week');
  return live.length > 0 ? live : FALLBACK_CATALOG;
}

// 4. Anime & Animasi Populer Real-time
async function getAnimeMovies() {
  const live = await fetchTmdbEndpoint('discover/movie', {
    with_genres: '16',
    sort_by: 'popularity.desc',
    page: 1
  });
  return live.length > 0 ? live : FALLBACK_CATALOG;
}

// 5. Film Berdasarkan Genre Spesifik Real-time
async function getMoviesByGenre(genreId) {
  if (genreId === 'classics') {
    return await getClassicMovies();
  }
  return await fetchTmdbEndpoint('discover/movie', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: 1
  });
}

// 6. Pencarian Film Global Real-time (Mencakup Semua Film di Dunia)
async function searchMoviesGlobal(query) {
  if (!query || query.trim().length === 0) return [];
  return await fetchTmdbEndpoint('search/movie', {
    query: query.trim(),
    include_adult: false
  });
}

// 7. Resolusi Trailer Resmi YouTube Secara Dinamis
async function resolveMovieTrailer(tmdbId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
    if (!res.ok) return 'uJMCNJP2ipI';
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
                      data.results.find(v => v.site === 'YouTube') ||
                      data.results[0];
      return trailer ? trailer.key : 'uJMCNJP2ipI';
    }
  } catch (e) {
    console.warn('Gagal memuat trailer video:', e);
  }
  return 'uJMCNJP2ipI';
}

/* --- LocalStorage Watchlist / Favorit Handler --- */
const STORAGE_KEY = 'fplay_favorites_v2';

function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Gagal membaca localStorage:', e);
    return [];
  }
}

function isMovieFavorite(movieId) {
  const favs = getFavorites();
  return favs.some(f => f.tmdbId === String(movieId) || f.id === String(movieId));
}

function toggleMovieFavorite(movie) {
  if (!movie) return;
  const tmdbId = String(movie.tmdbId || movie.id);
  let favs = getFavorites();
  const index = favs.findIndex(f => f.tmdbId === tmdbId || f.id === tmdbId);
  let isAdded = false;

  if (index > -1) {
    favs.splice(index, 1);
    isAdded = false;
  } else {
    favs.push({
      id: movie.id,
      tmdbId: tmdbId,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      poster: movie.poster,
      quality: movie.quality || 'HD'
    });
    isAdded = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  } catch (e) {
    console.error('Gagal menulis ke localStorage:', e);
  }

  updateWatchlistBadge();
  updateAllHeartIcons();
  renderWatchlistDrawer();

  showToast(isAdded ? `"${movie.title}" ditambahkan ke Favorit` : `"${movie.title}" dihapus dari Favorit`);
}

function updateWatchlistBadge() {
  const favs = getFavorites();
  const countEl = document.getElementById('watchlist-count');
  if (countEl) {
    countEl.textContent = favs.length;
  }
  const drawerCountEl = document.getElementById('drawer-fav-count');
  if (drawerCountEl) {
    drawerCountEl.textContent = favs.length;
  }
}

function updateAllHeartIcons() {
  const favs = getFavorites();

  // Update Hero Bookmark
  const heroBtn = document.getElementById('btn-hero-bookmark');
  const heroHeart = heroBtn ? heroBtn.querySelector('.heart-icon') : null;
  const heroText = document.getElementById('hero-bookmark-text');
  if (heroHeart && currentMovie) {
    const isHeroFav = isMovieFavorite(currentMovie.tmdbId || currentMovie.id);
    if (isHeroFav) {
      heroHeart.classList.add('icon-red');
      if (heroText) heroText.textContent = 'Favorit Tersimpan';
    } else {
      heroHeart.classList.remove('icon-red');
      if (heroText) heroText.textContent = 'Simpan Favorit';
    }
  }

  // Update Theater Bookmark
  const theaterBtn = document.getElementById('btn-theater-bookmark');
  const theaterHeart = theaterBtn ? theaterBtn.querySelector('.heart-icon') : null;
  const theaterText = document.getElementById('theater-bookmark-label');
  if (theaterHeart && currentMovie) {
    const isPlayerFav = isMovieFavorite(currentMovie.tmdbId || currentMovie.id);
    if (isPlayerFav) {
      theaterHeart.classList.add('icon-red');
      if (theaterText) theaterText.textContent = 'Tersimpan di Favorit';
    } else {
      theaterHeart.classList.remove('icon-red');
      if (theaterText) theaterText.textContent = 'Simpan Favorit';
    }
  }

  // Update Catalog Cards
  document.querySelectorAll('.card-bookmark-btn').forEach(btn => {
    const cardId = btn.dataset.id;
    if (favs.some(f => f.tmdbId === cardId || f.id === cardId)) {
      btn.classList.add('saved');
      btn.setAttribute('title', 'Hapus dari Favorit');
    } else {
      btn.classList.remove('saved');
      btn.setAttribute('title', 'Simpan ke Favorit');
    }
  });
}

/* --- Watch History Manager (fplay_history_v1) --- */
const HISTORY_STORAGE_KEY = 'fplay_history_v1';

function getWatchHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Gagal membaca riwayat dari localStorage:', e);
    return [];
  }
}

function saveWatchHistory(list) {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Gagal menulis riwayat ke localStorage:', e);
  }
}

function updateHistoryBadge() {
  const list = getWatchHistory();
  const countEl = document.getElementById('history-count');
  if (countEl) {
    countEl.textContent = list.length;
  }
  const drawerHistCountEl = document.getElementById('drawer-hist-count');
  if (drawerHistCountEl) {
    drawerHistCountEl.textContent = list.length;
  }
}

function addToWatchHistory(movie) {
  if (!movie) return;
  const tmdbId = String(movie.tmdbId || movie.id);
  let list = getWatchHistory();

  // Hapus jika sudah pernah ditonton agar posisinya pindah ke paling atas
  list = list.filter(item => String(item.tmdbId || item.id) !== tmdbId);

  list.unshift({
    id: movie.id,
    tmdbId: tmdbId,
    title: movie.title,
    year: movie.year || '2026',
    rating: movie.rating || '8.5',
    poster: movie.poster || '',
    duration: movie.duration || 'Lengkap',
    quality: movie.quality || '4K ULTRA HD',
    genres: movie.genres || [],
    trailerId: movie.trailerId || '',
    synopsis: movie.synopsis || '',
    watchedAt: Date.now()
  });

  // Simpan maksimal 50 riwayat tontonan terakhir
  if (list.length > 50) {
    list = list.slice(0, 50);
  }

  saveWatchHistory(list);
  updateHistoryBadge();
}

function removeFromWatchHistory(tmdbId) {
  const targetId = String(tmdbId);
  let list = getWatchHistory();
  list = list.filter(item => String(item.tmdbId || item.id) !== targetId);
  saveWatchHistory(list);
  updateHistoryBadge();
  showToast('Film dihapus dari riwayat tontonan.');
}

function clearWatchHistory() {
  saveWatchHistory([]);
  updateHistoryBadge();
  showToast('Semua riwayat tontonan berhasil dibersihkan.');
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Baru saja';
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);
  if (diffSec < 60) return 'Baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/* --- CineStreak Gamification Engine (fplay_streak_v1) --- */
const STREAK_STORAGE_KEY = 'fplay_streak_v1';

function getLocalDateString(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

function getStreakData() {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        currentStreak: Number(data.currentStreak) || 0,
        longestStreak: Number(data.longestStreak) || 0,
        lastWatchDate: data.lastWatchDate || null,
        watchDates: Array.isArray(data.watchDates) ? data.watchDates : [],
        totalWatched: Number(data.totalWatched) || 0
      };
    }
  } catch (e) {
    console.warn('Gagal membaca data streak:', e);
  }
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastWatchDate: null,
    watchDates: [],
    totalWatched: 0
  };
}

function saveStreakData(data) {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Gagal menyimpan data streak:', e);
  }
}

function updateStreakBadge() {
  const streakData = getStreakData();
  const navCountEl = document.getElementById('nav-streak-count');
  if (navCountEl) {
    navCountEl.textContent = streakData.currentStreak;
  }
}

function initStreak() {
  const data = getStreakData();
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  if (data.lastWatchDate) {
    if (data.lastWatchDate === today) {
      // Masih aktif menonton hari ini
    } else if (data.lastWatchDate === yesterday) {
      // Streak kemarin masih bertahan, menunggu tontonan hari ini
    } else {
      // Lebih dari 1 hari lalu terlewat, streak terputus
      if (data.currentStreak > 0) {
        data.currentStreak = 0;
        saveStreakData(data);
      }
    }
  }
  updateStreakBadge();
}

function recordWatchForStreak() {
  const data = getStreakData();
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  data.totalWatched = (data.totalWatched || 0) + 1;

  if (!data.watchDates.includes(today)) {
    data.watchDates.push(today);
    if (data.watchDates.length > 45) {
      data.watchDates = data.watchDates.slice(-45);
    }
  }

  if (data.lastWatchDate === today) {
    // Sudah tercatat menonton hari ini
    saveStreakData(data);
    updateStreakBadge();
    return;
  }

  if (data.lastWatchDate === yesterday) {
    data.currentStreak = (data.currentStreak || 0) + 1;
    data.lastWatchDate = today;
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }
    saveStreakData(data);
    updateStreakBadge();
    showToast(`🔥 CineStreak Naik: ${data.currentStreak} Hari Berturut-turut!`);
  } else {
    data.currentStreak = 1;
    data.lastWatchDate = today;
    if (data.longestStreak < 1) {
      data.longestStreak = 1;
    }
    saveStreakData(data);
    updateStreakBadge();
    showToast('🔥 CineStreak Dimulai: Hari ke-1!');
  }
}

/* --- Floating Toast Notification --- */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notify');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* --- Hero Billboard Spotlight Renderer --- */
function renderHero(movie) {
  if (!movie) return;
  currentMovie = movie;

  const bgEl = document.getElementById('hero-bg');
  const titleEl = document.getElementById('hero-title');
  const ratingEl = document.getElementById('hero-rating');
  const yearEl = document.getElementById('hero-year');
  const durationEl = document.getElementById('hero-duration');
  const genreEl = document.getElementById('hero-genre');
  const synopsisEl = document.getElementById('hero-synopsis');

  if (bgEl && movie.backdrop) bgEl.style.backgroundImage = `url('${movie.backdrop}')`;
  if (titleEl) titleEl.textContent = movie.title;
  if (ratingEl) ratingEl.textContent = `⭐ ${movie.rating} / 10`;
  if (yearEl) yearEl.textContent = movie.year;
  if (durationEl) durationEl.textContent = movie.duration || 'Lengkap';
  if (genreEl) genreEl.textContent = (movie.genres || []).join(', ');
  if (synopsisEl) synopsisEl.textContent = movie.synopsis;

  updateAllHeartIcons();
}

/* --- Card Generator --- */
function createMovieCard(movie) {
  const isFav = isMovieFavorite(movie.tmdbId || movie.id);

  const card = document.createElement('div');
  card.className = 'movie-card';
  card.dataset.id = movie.tmdbId || movie.id;

  const genresText = Array.isArray(movie.genres) ? movie.genres.join(' • ') : 'Film';
  const displayRating = movie.rating || '8.0';
  const displayYear = movie.year || 'Terbaru';

  card.innerHTML = `
    <div class="card-poster-wrapper">
      <img src="${movie.poster || FALLBACK_POSTER_SVG}" alt="Poster ${movie.title}" class="card-poster" loading="lazy" decoding="async" width="342" height="513" onerror="this.onerror=null; this.src=FALLBACK_POSTER_SVG;">
      <div class="card-badges">
        <span class="card-rating-badge">⭐ ${displayRating}</span>
        <span class="card-quality-badge">${movie.quality || 'HD'}</span>
      </div>
      <button class="card-bookmark-btn ${isFav ? 'saved' : ''}" data-id="${movie.tmdbId || movie.id}" title="${isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}" aria-label="Favorit">
        <svg class="heart-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
      <div class="card-play-overlay">
        <div class="play-circle-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
      </div>
    </div>
    <div class="card-details">
      <h3 class="card-title" title="${movie.title}">${movie.title}</h3>
      <div class="card-meta">
        <span>${displayYear}</span>
        <span>•</span>
        <span>${movie.duration || 'Lengkap'}</span>
      </div>
      <p class="card-genre">${genresText}</p>
    </div>
  `;

  // Event: Bookmark
  const bookmarkBtn = card.querySelector('.card-bookmark-btn');
  bookmarkBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMovieFavorite(movie);
  });

  // Event: Buka Layar Putar Video
  card.addEventListener('click', () => {
    openPlayerModal(movie);
  });

  return card;
}

/* --- Render Skeleton Loading Cards --- */
function renderSkeletonGrid(containerEl, count = (isMobileClient ? 4 : 8)) {
  if (!containerEl) return;
  containerEl.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const skel = document.createElement('div');
    skel.className = 'movie-card';
    skel.style.opacity = '0.5';
    skel.innerHTML = `
      <div class="card-poster-wrapper" style="background:#161a24; aspect-ratio:2/3;"></div>
      <div class="card-details" style="padding:0.85rem;">
        <div style="height:14px; background:#222838; border-radius:4px; margin-bottom:8px; width:70%;"></div>
        <div style="height:10px; background:#1b202d; border-radius:4px; width:40%;"></div>
      </div>
    `;
    fragment.appendChild(skel);
  }
  containerEl.appendChild(fragment);
}

/* --- High Performance DOM Grid Renderer (Single Paint via DocumentFragment) --- */
function populateMovieGrid(gridEl, movies) {
  if (!gridEl) return;
  gridEl.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const maxItems = isMobileClient ? 10 : 16;
  const list = movies.slice(0, maxItems);
  list.forEach(movie => {
    fragment.appendChild(createMovieCard(movie));
  });
  gridEl.appendChild(fragment);
}

/* --- Master Section Loader (Otomatis & Real-Time) --- */
async function loadAllSections() {
  const gridLatest = document.getElementById('grid-latest');
  const gridClassics = document.getElementById('grid-classics');
  const gridTrending = document.getElementById('grid-trending');
  const gridAnime = document.getElementById('grid-anime');

  // Pasang skeleton placeholder dulu
  renderSkeletonGrid(gridLatest);
  renderSkeletonGrid(gridClassics);
  renderSkeletonGrid(gridTrending);
  renderSkeletonGrid(gridAnime);

  // Fetch semua kategori secara paralel
  try {
    const [latest, classics, trending, anime] = await Promise.all([
      getNowPlayingMovies(),
      getClassicMovies(),
      getTrendingMovies(),
      getAnimeMovies()
    ]);

    // Update Hero Billboard dengan film trending #1 saat ini
    if (trending.length > 0) {
      renderHero(trending[0]);
    } else if (latest.length > 0) {
      renderHero(latest[0]);
    }

    // Render Grid 1: Rilis Terbaru & Sedang Tayang
    populateMovieGrid(gridLatest, latest);

    // Render Grid 2: Film Lawas & Klasik Sepanjang Masa
    populateMovieGrid(gridClassics, classics);

    // Render Grid 3: Trending Minggu Ini
    populateMovieGrid(gridTrending, trending);

    // Render Grid 4: Anime & Animasi Populer
    populateMovieGrid(gridAnime, anime);

  } catch (err) {
    console.error('Error saat inisialisasi catalog:', err);
    // Fallback darurat
    populateMovieGrid(gridLatest, FALLBACK_CATALOG);
  }

  updateWatchlistBadge();
}

/* --- Dedicated Cinema Theater Player Controller --- */
async function openPlayerModal(movie, serverMode = 'server1') {
  if (!movie) return;
  currentMovie = movie;
  currentServer = serverMode;

  const homeView = document.getElementById('home-view');
  const theaterView = document.getElementById('theater-view');
  const iframe = document.getElementById('video-stream-iframe');
  const loader = document.getElementById('theater-loader');

  if (!theaterView || !iframe) return;

  // Catat riwayat tontonan dan perbarui CineStreak gamification
  addToWatchHistory(movie);
  recordWatchForStreak();

  // Sembunyikan katalog utama, tampilkan bioskop sinematik
  if (homeView) homeView.style.display = 'none';
  theaterView.style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update Top Navigation Bar Judul Film
  const titleTopEl = document.getElementById('theater-movie-title-top');
  if (titleTopEl) titleTopEl.textContent = movie.title;

  // Update Informasi Detail Film
  const titleEl = document.getElementById('theater-movie-title');
  const ratingEl = document.getElementById('theater-rating');
  const yearEl = document.getElementById('theater-year');
  const qualityEl = document.getElementById('theater-quality');
  const durationEl = document.getElementById('theater-duration');
  const synopsisEl = document.getElementById('theater-synopsis');
  const genresEl = document.getElementById('theater-genres');

  if (titleEl) titleEl.textContent = movie.title;
  if (ratingEl) ratingEl.textContent = `⭐ ${movie.rating || '8.5'} / 10`;
  if (yearEl) yearEl.textContent = movie.year || 'Terbaru';
  if (qualityEl) qualityEl.textContent = movie.quality || '4K ULTRA HD';
  if (durationEl) durationEl.textContent = movie.duration || 'Lengkap';
  if (synopsisEl) synopsisEl.textContent = movie.synopsis || 'Tersedia di F-Play dengan audio jernih dan multi-server.';

  // Render Genre Pills
  if (genresEl) {
    genresEl.innerHTML = '';
    const genres = Array.isArray(movie.genres) ? movie.genres : ['Sinema'];
    genres.forEach(g => {
      const tag = document.createElement('span');
      tag.className = 'genre-tag-pill';
      tag.textContent = g;
      genresEl.appendChild(tag);
    });
  }

  // Update Status Tombol Server Aktif
  document.querySelectorAll('.pill-server').forEach(btn => {
    if (btn.dataset.server === serverMode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Tampilkan loading skeleton
  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = '1';
  }

  // Tentukan URL Streaming Video
  let streamUrl = '';
  if (serverMode === 'trailer') {
    // Resolusi YouTube Trailer resmi secara dinamis dari TMDB
    let ytKey = movie.trailerId;
    if (!ytKey || ytKey === 'uJMCNJP2ipI') {
      ytKey = await resolveMovieTrailer(movie.tmdbId);
      movie.trailerId = ytKey;
    }
    streamUrl = STREAM_SERVERS.trailer(ytKey);
  } else if (STREAM_SERVERS[serverMode]) {
    streamUrl = STREAM_SERVERS[serverMode](movie.tmdbId);
  }

  // Set URL ke iframe
  iframe.src = streamUrl;

  iframe.onload = () => {
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 300);
    }
  };

  setTimeout(() => {
    if (loader && loader.style.display !== 'none') {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 300);
    }
  }, 2200);

  // Render Rekomendasi Film di Bawah Player
  renderTheaterRecommendations(movie);

  // Render Komentar Komunitas Gaya YouTube
  renderMovieComments(movie.tmdbId || movie.id);

  // Update Status Ikon Favorit
  updateAllHeartIcons();

  // Sinkronisasi URL Hash (Mendukung tombol Back browser)
  if (location.hash !== `#watch-${movie.tmdbId}`) {
    history.pushState({ view: 'theater', tmdbId: movie.tmdbId }, '', `#watch-${movie.tmdbId}`);
  }
  document.title = `${movie.title} - Nonton di F-Play`;
}

function closePlayerModal() {
  const homeView = document.getElementById('home-view');
  const theaterView = document.getElementById('theater-view');
  const iframe = document.getElementById('video-stream-iframe');

  if (theaterView) theaterView.style.display = 'none';
  if (homeView) homeView.style.display = 'block';
  if (iframe) iframe.src = '';

  document.title = 'F-Play - Platform Streaming Film & Anime Gratis Multi-Server';

  if (location.hash.startsWith('#watch-')) {
    history.pushState(null, '', window.location.pathname + window.location.search);
  }
}

// Render Rekomendasi Film di Theater View
function renderTheaterRecommendations(current) {
  const container = document.getElementById('grid-theater-recommended');
  if (!container) return;
  container.innerHTML = '';

  const allList = Array.from(memoryMovieStore.values());
  const filtered = allList.filter(m => m.tmdbId !== current.tmdbId);
  const recLimit = isMobileClient ? 4 : 8;
  const recs = (filtered.length >= 4) ? filtered.slice(0, recLimit) : FALLBACK_CATALOG.filter(m => m.tmdbId !== current.tmdbId).slice(0, recLimit);

  const fragment = document.createDocumentFragment();
  recs.forEach(m => {
    fragment.appendChild(createMovieCard(m));
  });
  container.appendChild(fragment);
}

/* ==========================================================================
   YouTube-Style Interactive Community Comments Engine
   Generator Prosedural dengan Ratusan Ribu Kemungkinan Variasi Unik
   ========================================================================== */
const COMMENT_AUTHORS_POOL = [
  'Reza_Sinema', 'DimasPratama', 'AdityaCine', 'Fajar_G', 'Budi_MovieID', 'BayuKusuma',
  'Naufal_Film', 'SatriaNusantara', 'Aris_W', 'KevinKurnia', 'AldoRev', 'Bintang_Cinephile',
  'IlhamSantoso', 'Andi_LayarKaca', 'Rafi_Director', 'Siti_Review', 'Dewi_Sinematik', 'Nadia_Filmlover',
  'AlyaCine', 'Maya_Popcorn', 'Salsabila_K', 'RaniCinema', 'Putri_MovieBuff', 'CinemaAddictID',
  'MovieGeek_ID', 'LayarLebar21', 'KritikusSantai', 'NontonTerus', 'WibuSinema', 'MaratonFilm',
  'CinephileID', 'FilmEnak', 'BioskopMania', 'LensaSinema', 'SudutKamera', 'DuniaSinema',
  'PecintaKarya', 'KolektorFilm', 'ReviewJujur', 'SukaFilm', 'PenontonSetia', 'PenggemarSinema',
  'CineZoneID', 'KritikSantuy', 'FilmManiaID', 'RizalCinema', 'Hendra_Movie', 'Fikri_Film'
];

const COMMENT_OPENERS_POOL = [
  'Gila sih ini film,',
  'Beneran ga nyangka,',
  'Baru beres nonton dan jujur,',
  'Salah satu rilisan paling berkesan,',
  'Asli ini keren banget,',
  'Ekspektasi awal biasa aja, tapi pas ditonton',
  'Dari awal sampai akhir ceritanya',
  'Buat yang belum nonton,',
  'Jujur sempet ragu di awal, tapi ternyata',
  'Keren parah pokoknya,',
  'Salut banget sama sutradara dan cast-nya,',
  'Pengalaman nonton yang beneran memuaskan,',
  'Plotnya bener-bener dieksekusi dengan matang,',
  'Udah lama ga ngerasain sensasi nonton seseru ini,',
  'Akting dan visualnya bener-bener padu,',
  'Karakter utamanya kuat banget karismanya,',
  'Nonton di F-Play berasa layar bioskop pribadi,',
  'Timing ceritanya beneran pas banget,',
  'Detail kecil di setiap adegannya dipikirin matang,',
  'Visual effects sama audio mixing-nya berkelas dunia,',
  'Gokil sih dari awal sampe akhir,',
  'Ga salah banyak yang rekomendasiin film ini,',
  'Bener-bener ga kerasa durasinya udah abis,',
  'Salah satu karya sinema paling bernyawa,'
];

const COMMENT_BODIES_POOL = [
  'plot twist di babak kedua beneran bikin melongo dan ga ketebak sama sekali.',
  'pacing ceritanya rapi banget, ga ada bagian yang bertele-tele atau ngebosenin.',
  'sinematografinya megah dan pencahayaan setiap adegannya artistik banget.',
  'karakterisasinya dapet banget, penonton beneran diajak peduli sama nasib karakternya.',
  'adegan aksinya beneran intens dan koreografinya fluid tanpa goyangan kamera berlebih.',
  'emosi ceritanya dapet banget, sampe bikin merinding di 20 menit terakhir.',
  'soundtrack dan scoring musiknya bener-bener ngangkat tensi film ke level berikutnya.',
  'dialognya berbobot dan kerasa natural, ga ada kesan kaku sama sekali.',
  'world-building sama suasananya kerasa hidup dan meyakinkan dari awal tayang.',
  'konflik moral di ceritanya bikin mikir panjang bahkan setelah filmnya tamat.',
  'visual efeknya mulus banget, detail CGI di adegan klimaksnya luar biasa rapi.',
  'pemeran utamanya bener-bener totalitas, ekspresinya natural dan sangat menyentuh.',
  'koreografi dan tata suaranya enak banget didenger pake earphone atau speaker.',
  'alur misterinya rapi, setiap petunjuk di awal akhirnya kejawab dengan memuaskan.',
  'komedinya segar dan ga maksa, tapi pesan emosionalnya tetep ngena ke hati.',
  'beneran ngerasain atmosfer mencekam dari pembuka sampai penutupan adegan.',
  'alur ceritanya bikin penasaran dari menit pertama sampai kredit bergulir.',
  'kombinasi drama dan aksinya proporsional banget tanpa terasa timpang.',
  'transisi antar adegannya halus banget, editingnya layak dapet apresiasi tinggi.',
  'penyelesaian konflik di adegan puncaknya terasa sangat pantas dan melegakan.',
  'penjiwaan aktornya juara, tiap tatapan dan intonasi dialognya kerasa dari hati.',
  'eksplorasi temanya berani dan fresh, beda dari film sejenis pada umumnya.',
  'adegan heningnya justru yang paling dalem dan ngasih dampak emosional kuat.',
  'kualitas gambarnya tajem banget di F-Play, warna-warna gelapnya ga pecah.',
  'arah kameranya puitis tapi tetep gampang diikuti tanpa bikin pusing.',
  'endingnya bener-bener nempel di kepala, bukan tipe film yang gampang dilupain.',
  'tiap karakter pendukung punya porsi peran yang pas dan ga cuma jadi pajangan.',
  'build-up ketegangannya terencana banget, nafas berasa ikut ketahan pas klimaks.',
  'desain produksinya jempolan, kostum dan tata artistiknya detail banget.',
  'dinamika relasi antar tokohnya berkembang alami dan sangat meyakinkan.',
  'banyak adegan ikonik yang bakal terus diingat para pecinta film.',
  'eksekusi konsepnya matang dari menit awal sampai konklusi akhir.'
];

const COMMENT_CLOSERS_POOL = [
  'Wajib banget masuk daftar tontonan wajib minggu ini!',
  'Bakal gua tonton ulang lagi bareng temen-temen besok.',
  'Rating pribadi dari gua solid 9/10, sangat direkomendasikan!',
  'Server 1 di F-Play juga jernih banget tanpa macet sedikitpun, mantap.',
  'Bener-bener pengalaman nonton 10/10 tanpa gangguan iklan sama sekali.',
  'Ga nyesel luangin waktu 2 jam buat mahakarya satu ini.',
  'Definisi film yang bakal tetep relevan bertahun-tahun ke depan.',
  'Buat yang masih ragu, langsung tonton sekarang juga sebelum kena spoiler.',
  'Salut buat F-Play yang nyediain kualitas se-HD ini secara gratis!',
  'Pasti bakal jadi salah satu film favorit sepanjang masa di watchlist gua.',
  'Bagus banget, cocok ditonton sendirian atau rame-rame pas weekend.',
  'Layak dapet penghargaan di festival film internasional, gokil.',
  'Kualitas audionya jernih, dialog terdengar jelas tanpa distorsi.',
  'Jangan diskip, tonton sampai bener-bener selesai biar dapet feel-nya.',
  'Auto masuk deretan film terbaik tahun ini versi gua pribadi.',
  'Semoga ada sekuel atau cerita lanjutan dengan standar kualitas yang sama!',
  'Puas banget nontonnya, ga sia-sia nungguin rilisnya.',
  'Keren abis, rekomen banget buat kalian yang suka cerita berbobot.'
];

const REPLY_TEMPLATES_POOL = [
  { text: 'Setuju banget bro, terutama pas adegan klimaksnya beneran merinding!' },
  { text: 'Bener, Server 1 sama Server 2 lancar pol di HP tanpa buffering sama sekali.' },
  { text: 'Gua nonton dari kemarin malem masih terngiang-ngiang sama endingnya.' },
  { text: 'Iya parah, sinematografinya level bioskop kelas atas.' },
  { text: 'Awalnya mikir biasa aja, pas udah setengah jalan langsung gabisa berhenti nonton.' },
  { text: 'Sama! Akting pemeran utamanya emang ga pernah gagal bikin takjub.' },
  { text: 'Tips: pake headset biar audio dolby-nya makin berasa menggelegar.' },
  { text: 'Udah gua share link film ini ke grup temen-temen, pada ketagihan juga.' },
  { text: 'Valid banget ulasannya, salah satu film paling berkesan tahun ini.' },
  { text: 'Sepakat, bagian twist-nya emang beneran gila dan di luar nalar.' },
  { text: 'Kualitas 1080p di sini bening banget, ga nyesel streaming di F-Play.' },
  { text: 'Haha bener, gua sampe ga sempet buka cemilan saking fokusnya.' }
];

const TIME_AGO_POOL = [
  { label: '14 menit yang lalu', ms: 14 * 60000 },
  { label: '35 menit yang lalu', ms: 35 * 60000 },
  { label: '1 jam yang lalu', ms: 3600000 },
  { label: '2 jam yang lalu', ms: 2 * 3600000 },
  { label: '4 jam yang lalu', ms: 4 * 3600000 },
  { label: '7 jam yang lalu', ms: 7 * 3600000 },
  { label: '12 jam yang lalu', ms: 12 * 3600000 },
  { label: '1 hari yang lalu', ms: 86400000 },
  { label: '2 hari yang lalu', ms: 2 * 86400000 },
  { label: '3 hari yang lalu', ms: 3 * 86400000 },
  { label: '5 hari yang lalu', ms: 5 * 86400000 },
  { label: '1 minggu yang lalu', ms: 7 * 86400000 }
];

const AVATAR_PALETTE = [
  'linear-gradient(135deg, #e50914, #990000)',
  'linear-gradient(135deg, #2563eb, #1d4ed8)',
  'linear-gradient(135deg, #059669, #047857)',
  'linear-gradient(135deg, #7c3aed, #6d28d9)',
  'linear-gradient(135deg, #ea580c, #c2410c)',
  'linear-gradient(135deg, #0891b2, #0e7490)'
];

function getAvatarColor(name) {
  const str = String(name || 'Pengunjung');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

let activeCommentSort = 'top';

function createPrng(seedStr) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  return function() {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateDynamicMovieComments(movieId) {
  const rng = createPrng(`fplay_seed_${movieId}_v2`);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const pickIndex = (arr, usedIndices) => {
    let idx = Math.floor(rng() * arr.length);
    let attempts = 0;
    while (usedIndices.has(idx) && attempts < 10) {
      idx = (idx + 1) % arr.length;
      attempts++;
    }
    usedIndices.add(idx);
    return arr[idx];
  };

  // Jumlah komentar per film: antara 5 sampai 8 komentar
  const commentCount = 5 + Math.floor(rng() * 4);
  const usedAuthors = new Set();
  const usedBodies = new Set();
  const comments = [];

  const now = Date.now();

  for (let i = 0; i < commentCount; i++) {
    const author = pickIndex(COMMENT_AUTHORS_POOL, usedAuthors);
    const opener = pick(COMMENT_OPENERS_POOL);
    const body = pickIndex(COMMENT_BODIES_POOL, usedBodies);
    const closer = pick(COMMENT_CLOSERS_POOL);
    const fullText = `${opener} ${body} ${closer}`;

    const timeObj = TIME_AGO_POOL[Math.min(TIME_AGO_POOL.length - 1, i + Math.floor(rng() * 3))];
    const likes = 8 + Math.floor(rng() * 85) + (i === 0 ? 40 : 0);

    // 1 atau 2 komentar pertama memiliki balasan komunitas
    const hasReplies = (i === 0 || (i === 1 && rng() > 0.35));
    const replies = [];
    if (hasReplies) {
      const replyCount = 1 + (rng() > 0.5 ? 1 : 0);
      const usedReplyAuthors = new Set([author]);
      for (let r = 0; r < replyCount; r++) {
        const replyAuthor = pickIndex(COMMENT_AUTHORS_POOL, usedReplyAuthors);
        const replyTpl = pick(REPLY_TEMPLATES_POOL);
        replies.push({
          id: `rep_${movieId}_${i}_${r}`,
          author: replyAuthor,
          text: replyTpl.text,
          timeAgo: 'Baru saja'
        });
      }
    }

    comments.push({
      id: `gen_${movieId}_${i}`,
      author: author,
      text: fullText,
      likes: likes,
      dislikes: 0,
      timeAgo: timeObj.label,
      timestamp: now - timeObj.ms,
      isCritic: i === 0,
      replies: replies
    });
  }

  return comments;
}

function getUserReactions() {
  try {
    const raw = localStorage.getItem('fplay_user_reactions_v1');
    return raw ? JSON.parse(raw) : { likes: {}, dislikes: {} };
  } catch (e) {
    return { likes: {}, dislikes: {} };
  }
}

function saveUserReactions(reactions) {
  try {
    localStorage.setItem('fplay_user_reactions_v1', JSON.stringify(reactions));
  } catch (e) {
    console.warn('Gagal menyimpan reaksi komentar:', e);
  }
}

function getMovieComments(movieId) {
  const key = `fplay_comments_v2_${movieId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Gagal memuat komentar dari localStorage:', e);
  }

  // Generate ribuan kemungkinan komentar deterministik untuk film ini
  const dynamicComments = generateDynamicMovieComments(movieId);

  try {
    localStorage.setItem(key, JSON.stringify(dynamicComments));
  } catch (e) {
    console.warn('Gagal menyimpan komentar ke localStorage:', e);
  }

  return dynamicComments;
}

function saveMovieComments(movieId, list) {
  const key = `fplay_comments_v2_${movieId}`;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.warn('Gagal menyimpan komentar:', e);
  }
}

function renderMovieComments(movieId, sortMode = activeCommentSort) {
  activeCommentSort = sortMode;
  const listEl = document.getElementById('comments-list');
  const countEl = document.getElementById('comments-count');
  if (!listEl) return;

  const comments = getMovieComments(movieId);
  const reactions = getUserReactions();

  // Hitung total komentar termasuk balasan
  let totalCount = comments.length;
  comments.forEach(c => {
    if (Array.isArray(c.replies)) totalCount += c.replies.length;
  });

  if (countEl) countEl.textContent = totalCount;

  // Update status tombol sort
  const btnTop = document.getElementById('btn-sort-top');
  const btnNew = document.getElementById('btn-sort-new');
  if (btnTop && btnNew) {
    btnTop.classList.toggle('active', sortMode === 'top');
    btnNew.classList.toggle('active', sortMode === 'new');
  }

  // Urutkan komentar
  const sorted = [...comments].sort((a, b) => {
    if (sortMode === 'top') {
      return (b.likes || 0) - (a.likes || 0);
    } else {
      return (b.timestamp || 0) - (a.timestamp || 0);
    }
  });

  listEl.innerHTML = '';
  const fragment = document.createDocumentFragment();

  sorted.forEach(comment => {
    const isLiked = !!(reactions.likes && reactions.likes[comment.id]);
    const isDisliked = !!(reactions.dislikes && reactions.dislikes[comment.id]);
    const avatarBg = getAvatarColor(comment.author);
    const initial = (comment.author || 'P').charAt(0).toUpperCase();

    const item = document.createElement('div');
    item.className = 'comment-item';
    item.dataset.id = comment.id;

    // Render Balasan Jika Ada
    let repliesHtml = '';
    if (Array.isArray(comment.replies) && comment.replies.length > 0) {
      const repliesItems = comment.replies.map(r => `
        <div class="reply-item">
          <div class="reply-item-avatar" style="background:${getAvatarColor(r.author)};">${(r.author || 'U').charAt(0).toUpperCase()}</div>
          <div class="reply-item-content">
            <div class="reply-item-header">
              <strong class="comment-author-name">${escapeCommentHtml(r.author)}</strong>
              <span class="comment-timestamp">${r.timeAgo || 'Baru saja'}</span>
            </div>
            <p class="reply-item-text">${escapeCommentHtml(r.text)}</p>
          </div>
        </div>
      `).join('');

      repliesHtml = `
        <div class="comment-replies-container">
          ${repliesItems}
        </div>
      `;
    }

    item.innerHTML = `
      <div class="comment-item-avatar" style="background:${avatarBg};">${initial}</div>
      <div class="comment-item-content">
        <div class="comment-item-header">
          <span class="comment-author-name">${escapeCommentHtml(comment.author)}</span>
          ${comment.isCritic ? '<span class="comment-badge-critic">Ulasan Populer</span>' : ''}
          <span class="comment-timestamp">${comment.timeAgo || 'Baru saja'}</span>
        </div>
        <p class="comment-item-text">${escapeCommentHtml(comment.text)}</p>
        <div class="comment-item-actions">
          <button class="btn-comment-action btn-like ${isLiked ? 'liked' : ''}" aria-label="Suka komentar">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span class="like-count">${comment.likes || 0}</span>
          </button>
          <button class="btn-comment-action btn-dislike ${isDisliked ? 'disliked' : ''}" aria-label="Tidak suka komentar">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
            </svg>
          </button>
          <button class="btn-comment-action btn-reply">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="9 17 4 12 9 7"></polyline>
              <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
            </svg>
            <span>Balas</span>
          </button>
        </div>

        <!-- Inline Reply Form (Tersembunyi secara default) -->
        <div class="comment-reply-form" style="display:none;">
          <input type="text" class="comment-reply-input" placeholder="Tulis balasan publik..." maxlength="200">
          <button type="button" class="btn btn-primary btn-sm btn-submit-reply">Kirim</button>
          <button type="button" class="btn btn-glass btn-sm btn-cancel-reply">Batal</button>
        </div>

        ${repliesHtml}
      </div>
    `;

    // Event: Like
    const likeBtn = item.querySelector('.btn-like');
    likeBtn.addEventListener('click', () => {
      toggleCommentLike(movieId, comment.id, item);
    });

    // Event: Dislike
    const dislikeBtn = item.querySelector('.btn-dislike');
    dislikeBtn.addEventListener('click', () => {
      toggleCommentDislike(movieId, comment.id, item);
    });

    // Event: Buka Form Balas
    const replyBtn = item.querySelector('.btn-reply');
    const replyForm = item.querySelector('.comment-reply-form');
    const replyInput = item.querySelector('.comment-reply-input');
    const submitReplyBtn = item.querySelector('.btn-submit-reply');
    const cancelReplyBtn = item.querySelector('.btn-cancel-reply');

    replyBtn.addEventListener('click', () => {
      const isVisible = replyForm.style.display !== 'none';
      replyForm.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible && replyInput) replyInput.focus();
    });

    cancelReplyBtn.addEventListener('click', () => {
      replyForm.style.display = 'none';
      if (replyInput) replyInput.value = '';
    });

    submitReplyBtn.addEventListener('click', () => {
      const replyText = replyInput.value.trim();
      if (!replyText) return;
      submitCommentReply(movieId, comment.id, replyText);
    });

    if (replyInput) {
      replyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitReplyBtn.click();
        }
      });
    }

    fragment.appendChild(item);
  });

  listEl.appendChild(fragment);
}

function escapeCommentHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

function toggleCommentLike(movieId, commentId, itemEl) {
  const comments = getMovieComments(movieId);
  const target = comments.find(c => c.id === commentId);
  if (!target) return;

  const reactions = getUserReactions();
  reactions.likes = reactions.likes || {};
  reactions.dislikes = reactions.dislikes || {};

  const wasLiked = !!reactions.likes[commentId];
  if (wasLiked) {
    delete reactions.likes[commentId];
    target.likes = Math.max(0, (target.likes || 1) - 1);
  } else {
    reactions.likes[commentId] = true;
    target.likes = (target.likes || 0) + 1;
    if (reactions.dislikes[commentId]) {
      delete reactions.dislikes[commentId];
    }
  }

  saveUserReactions(reactions);
  saveMovieComments(movieId, comments);

  const likeBtn = itemEl.querySelector('.btn-like');
  const dislikeBtn = itemEl.querySelector('.btn-dislike');
  const countEl = itemEl.querySelector('.like-count');

  if (likeBtn) likeBtn.classList.toggle('liked', !wasLiked);
  if (dislikeBtn) dislikeBtn.classList.remove('disliked');
  if (countEl) countEl.textContent = target.likes;
}

function toggleCommentDislike(movieId, commentId, itemEl) {
  const reactions = getUserReactions();
  reactions.likes = reactions.likes || {};
  reactions.dislikes = reactions.dislikes || {};

  const wasDisliked = !!reactions.dislikes[commentId];
  if (wasDisliked) {
    delete reactions.dislikes[commentId];
  } else {
    reactions.dislikes[commentId] = true;
    if (reactions.likes[commentId]) {
      delete reactions.likes[commentId];
      const comments = getMovieComments(movieId);
      const target = comments.find(c => c.id === commentId);
      if (target) {
        target.likes = Math.max(0, (target.likes || 1) - 1);
        saveMovieComments(movieId, comments);
        const countEl = itemEl.querySelector('.like-count');
        if (countEl) countEl.textContent = target.likes;
      }
    }
  }

  saveUserReactions(reactions);
  const likeBtn = itemEl.querySelector('.btn-like');
  const dislikeBtn = itemEl.querySelector('.btn-dislike');

  if (dislikeBtn) dislikeBtn.classList.toggle('disliked', !wasDisliked);
  if (likeBtn) likeBtn.classList.remove('liked');
}

function submitCommentReply(movieId, parentCommentId, replyText) {
  const comments = getMovieComments(movieId);
  const target = comments.find(c => c.id === parentCommentId);
  if (!target) return;

  target.replies = target.replies || [];
  const authorInput = document.getElementById('comment-author-name');
  const author = (authorInput && authorInput.value.trim()) || localStorage.getItem('fplay_preferred_author') || 'Penonton F-Play';

  target.replies.push({
    id: `rep_${Date.now()}`,
    author: author,
    text: replyText,
    timeAgo: 'Baru saja'
  });

  saveMovieComments(movieId, comments);
  renderMovieComments(movieId, activeCommentSort);
  showToast('Balasan kamu berhasil diposting!');
}

/* --- Tabbed Activity Drawer (Favorit & Riwayat Tontonan) --- */
let activeDrawerTab = 'watchlist';

function renderWatchlistDrawer() {
  const container = document.getElementById('watchlist-grid');
  const emptyState = document.getElementById('watchlist-empty');
  if (!container || !emptyState) return;

  const favs = getFavorites();
  container.innerHTML = '';

  if (favs.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    favs.forEach(movie => {
      const item = document.createElement('div');
      item.className = 'watchlist-item';
      item.innerHTML = `
        <img src="${movie.poster || FALLBACK_POSTER_SVG}" alt="${movie.title}" class="watchlist-thumb" onerror="this.onerror=null; this.src=FALLBACK_POSTER_SVG;">
        <div class="watchlist-info">
          <h4 class="watchlist-item-title">${movie.title}</h4>
          <p class="watchlist-item-meta">${movie.year || '2026'} • ⭐ ${movie.rating || '8.5'}</p>
          <div class="watchlist-item-actions">
            <button class="btn-item-play" data-id="${movie.tmdbId}">Nonton</button>
            <button class="btn-item-remove" data-id="${movie.tmdbId}">Hapus</button>
          </div>
        </div>
      `;

      item.querySelector('.btn-item-play').addEventListener('click', () => {
        closeWatchlistDrawer();
        openPlayerModal(movie);
      });

      item.querySelector('.btn-item-remove').addEventListener('click', () => {
        toggleMovieFavorite(movie);
      });

      container.appendChild(item);
    });
  }
}

function renderWatchHistory() {
  const container = document.getElementById('history-list');
  const emptyState = document.getElementById('history-empty');
  const actionsBar = document.getElementById('history-actions-bar');
  if (!container || !emptyState) return;

  const list = getWatchHistory();
  updateHistoryBadge();
  container.innerHTML = '';

  if (list.length === 0) {
    emptyState.style.display = 'block';
    if (actionsBar) actionsBar.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    if (actionsBar) actionsBar.style.display = 'flex';

    list.forEach(movie => {
      const item = document.createElement('div');
      item.className = 'history-item';
      const timeStr = formatRelativeTime(movie.watchedAt);
      item.innerHTML = `
        <img src="${movie.poster || FALLBACK_POSTER_SVG}" alt="${movie.title}" class="history-thumb" onerror="this.onerror=null; this.src=FALLBACK_POSTER_SVG;">
        <div class="history-info">
          <h4 class="history-item-title">${movie.title}</h4>
          <p class="history-item-meta">${movie.year || '2026'} • ⭐ ${movie.rating || '8.5'}</p>
          <div class="history-item-time">Ditonton ${timeStr}</div>
          <div class="history-item-actions">
            <button class="btn-item-play" data-id="${movie.tmdbId}">Putar Ulang</button>
            <button class="btn-item-remove" data-id="${movie.tmdbId}">Hapus</button>
          </div>
        </div>
      `;

      item.querySelector('.btn-item-play').addEventListener('click', () => {
        closeWatchlistDrawer();
        openPlayerModal(movie);
      });

      item.querySelector('.btn-item-remove').addEventListener('click', () => {
        removeFromWatchHistory(movie.tmdbId);
        renderWatchHistory();
      });

      container.appendChild(item);
    });
  }
}

function switchDrawerTab(tabName) {
  activeDrawerTab = tabName;
  const tabWatchlist = document.getElementById('tab-btn-watchlist');
  const tabHistory = document.getElementById('tab-btn-history');
  const paneWatchlist = document.getElementById('pane-watchlist');
  const paneHistory = document.getElementById('pane-history');

  if (tabName === 'history') {
    if (tabWatchlist) tabWatchlist.classList.remove('active');
    if (tabHistory) tabHistory.classList.add('active');
    if (paneWatchlist) paneWatchlist.style.display = 'none';
    if (paneHistory) paneHistory.style.display = 'block';
    renderWatchHistory();
  } else {
    if (tabHistory) tabHistory.classList.remove('active');
    if (tabWatchlist) tabWatchlist.classList.add('active');
    if (paneHistory) paneHistory.style.display = 'none';
    if (paneWatchlist) paneWatchlist.style.display = 'block';
    renderWatchlistDrawer();
  }
}

function openWatchlistDrawer() {
  switchDrawerTab('watchlist');
  const drawer = document.getElementById('watchlist-drawer');
  if (drawer) {
    drawer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function openHistoryDrawer() {
  switchDrawerTab('history');
  const drawer = document.getElementById('watchlist-drawer');
  if (drawer) {
    drawer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeWatchlistDrawer() {
  const drawer = document.getElementById('watchlist-drawer');
  if (drawer) {
    drawer.style.display = 'none';
    document.body.style.overflow = '';
  }
}

/* --- CineStreak Gamification Modal Controller --- */
function renderStreakModal() {
  const data = getStreakData();
  const today = getLocalDateString();

  // 1. Update Hero Counter & Tagline
  const countEl = document.getElementById('modal-streak-count');
  const taglineEl = document.getElementById('modal-streak-tagline');
  if (countEl) countEl.textContent = data.currentStreak;

  if (taglineEl) {
    if (data.currentStreak === 0) {
      taglineEl.textContent = 'Mulai petualanganmu hari ini! Tonton minimal 1 film untuk menyalakan api CineStreak kamu.';
    } else if (data.currentStreak === 1) {
      taglineEl.textContent = 'Awal yang membara! Tonton 1 film lagi besok untuk mempertahankan apimu.';
    } else if (data.currentStreak < 7) {
      taglineEl.textContent = `Hebat! Kamu sudah ${data.currentStreak} hari berturut-turut menikmati sinema F-Play.`;
    } else if (data.currentStreak < 14) {
      taglineEl.textContent = `Luar biasa! Konsistensi ${data.currentStreak} hari tanpa putus. Kamu seorang maraton sejati!`;
    } else {
      taglineEl.textContent = `Legenda Cinephile! Api streak kamu berkobar selama ${data.currentStreak} hari berturut-turut!`;
    }
  }

  // 2. 7-Day Activity Matrix (6 hari lalu sampai hari ini)
  const gridEl = document.getElementById('streak-week-grid');
  if (gridEl) {
    gridEl.innerHTML = '';
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = getLocalDateString(d);
      const dayName = dayNames[d.getDay()];
      const isToday = dateStr === today;
      const isWatched = data.watchDates.includes(dateStr);

      const chip = document.createElement('div');
      chip.className = `streak-day-chip${isWatched ? ' active' : ''}${isToday ? ' today' : ''}`;
      chip.title = `${dayName}, ${dateStr}${isWatched ? ' (Menonton)' : ' (Belum menonton)'}`;

      chip.innerHTML = `
        <span class="streak-day-name">${isToday ? 'Kini' : dayName}</span>
        <span class="streak-day-icon">${isWatched ? '🔥' : '⚪'}</span>
      `;
      gridEl.appendChild(chip);
    }
  }

  // 3. Tiers & Cinephile Achievements
  const tiersEl = document.getElementById('streak-tiers-list');
  if (tiersEl) {
    tiersEl.innerHTML = '';
    const tiers = [
      {
        icon: '🍿',
        name: 'Penonton Santai',
        req: 'Tonton minimal 1 film di F-Play',
        unlocked: data.totalWatched >= 1 || data.currentStreak >= 1
      },
      {
        icon: '🎬',
        name: 'Penggemar Sinema',
        req: 'Streak aktif mencapai 3 hari berturut-turut',
        unlocked: data.currentStreak >= 3 || data.longestStreak >= 3
      },
      {
        icon: '🏆',
        name: 'Maraton Master',
        req: 'Streak aktif mencapai 7 hari berturut-turut',
        unlocked: data.currentStreak >= 7 || data.longestStreak >= 7
      },
      {
        icon: '💎',
        name: 'Cinephile Sejati',
        req: 'Streak aktif mencapai 14 hari berturut-turut',
        unlocked: data.currentStreak >= 14 || data.longestStreak >= 14
      },
      {
        icon: '👑',
        name: 'Legenda Layar Lebar',
        req: 'Streak aktif mencapai 30 hari berturut-turut',
        unlocked: data.currentStreak >= 30 || data.longestStreak >= 30
      }
    ];

    tiers.forEach(t => {
      const row = document.createElement('div');
      row.className = `streak-tier-item${t.unlocked ? ' unlocked' : ''}`;
      row.innerHTML = `
        <div class="streak-tier-info">
          <span class="streak-tier-icon">${t.icon}</span>
          <div>
            <div class="streak-tier-name">${t.name}</div>
            <div class="streak-tier-req">${t.req}</div>
          </div>
        </div>
        <span class="streak-tier-badge ${t.unlocked ? 'unlocked' : 'locked'}">
          ${t.unlocked ? '✓ TERBUKA' : 'TERKUNCI'}
        </span>
      `;
      tiersEl.appendChild(row);
    });
  }
}

function openStreakModal() {
  renderStreakModal();
  const modal = document.getElementById('streak-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeStreakModal() {
  const modal = document.getElementById('streak-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}


/* --- Live Search & Genre Filter Engine --- */
async function performFilterAndSearch() {
  const sectionLatest = document.getElementById('section-latest');
  const sectionClassics = document.getElementById('section-classics');
  const sectionTrending = document.getElementById('section-trending');
  const sectionAnime = document.getElementById('section-anime');
  const sectionSearch = document.getElementById('section-search-results');
  const searchGrid = document.getElementById('grid-search-results');
  const searchEmpty = document.getElementById('search-empty');
  const statusBar = document.getElementById('search-status');
  const statusText = document.getElementById('search-status-text');

  const query = activeSearchQuery.trim();
  const isSearchingText = query.length > 0;
  const isFilteringGenre = activeGenreFilter !== 'all';
  const isNavSpecific = activeCategoryFilter !== 'all';

  // Mode 1: Kembali ke tampilan normal jika semua filter default
  if (!isSearchingText && !isFilteringGenre && !isNavSpecific) {
    if (sectionLatest) sectionLatest.style.display = 'flex';
    if (sectionClassics) sectionClassics.style.display = 'flex';
    if (sectionTrending) sectionTrending.style.display = 'flex';
    if (sectionAnime) sectionAnime.style.display = 'flex';
    if (sectionSearch) sectionSearch.style.display = 'none';
    if (statusBar) statusBar.style.display = 'none';
    return;
  }

  // Mode 2: Tampilkan hasil pencarian / filter aktif
  if (sectionLatest) sectionLatest.style.display = 'none';
  if (sectionClassics) sectionClassics.style.display = 'none';
  if (sectionTrending) sectionTrending.style.display = 'none';
  if (sectionAnime) sectionAnime.style.display = 'none';
  if (sectionSearch) sectionSearch.style.display = 'flex';

  renderSkeletonGrid(searchGrid, 10);

  if (statusBar && statusText) {
    statusBar.style.display = 'flex';
    statusText.innerHTML = `Memuat film dari pusat data TMDB...`;
  }

  let results = [];

  // Jalur A: Pencarian Teks Bebas (Bisa Judul Apa Saja di Dunia)
  if (isSearchingText) {
    results = await searchMoviesGlobal(query);
  }
  // Jalur B: Filter Genre Spesifik Real-time
  else if (isFilteringGenre) {
    results = await getMoviesByGenre(activeGenreFilter);
  }
  // Jalur C: Filter Tab Navigasi Spesifik
  else if (isNavSpecific) {
    if (activeCategoryFilter === 'now_playing') results = await getNowPlayingMovies();
    else if (activeCategoryFilter === 'classics') results = await getClassicMovies();
    else if (activeCategoryFilter === 'trending') results = await getTrendingMovies();
    else if (activeCategoryFilter === 'anime') results = await getAnimeMovies();
  }

  // Update Status Bar
  if (statusBar && statusText) {
    let label = [];
    if (query) label.push(`Kata Kunci: "${query}"`);
    if (isFilteringGenre) label.push(`Genre: ${GENRE_MAP[activeGenreFilter] || activeGenreFilter}`);
    if (isNavSpecific) label.push(`Kategori: ${activeCategoryFilter}`);
    statusText.innerHTML = `Ditemukan <strong>${results.length} film</strong> (${label.join(' • ')})`;
  }

  // Render Grid Hasil
  if (searchGrid && searchEmpty) {
    searchGrid.innerHTML = '';
    if (results.length === 0) {
      searchEmpty.style.display = 'block';
    } else {
      searchEmpty.style.display = 'none';
      const fragment = document.createDocumentFragment();
      const maxResults = isMobileClient ? 16 : 28;
      results.slice(0, maxResults).forEach(movie => {
        fragment.appendChild(createMovieCard(movie));
      });
      searchGrid.appendChild(fragment);
    }
  }
}

/* --- Event Listeners Initialization --- */
function setupEventListeners() {
  // 1. Hero Action Buttons
  const btnHeroPlay = document.getElementById('btn-hero-play');
  if (btnHeroPlay) {
    btnHeroPlay.addEventListener('click', () => {
      openPlayerModal(currentMovie, 'server1');
    });
  }

  const btnHeroTrailer = document.getElementById('btn-hero-trailer');
  if (btnHeroTrailer) {
    btnHeroTrailer.addEventListener('click', () => {
      openPlayerModal(currentMovie, 'trailer');
    });
  }

  const btnHeroBookmark = document.getElementById('btn-hero-bookmark');
  if (btnHeroBookmark) {
    btnHeroBookmark.addEventListener('click', () => {
      if (currentMovie) toggleMovieFavorite(currentMovie);
    });
  }

  // 2. Dedicated Theater Controls
  const btnTheaterBack = document.getElementById('btn-theater-back');
  if (btnTheaterBack) {
    btnTheaterBack.addEventListener('click', closePlayerModal);
  }

  const btnTheaterShare = document.getElementById('btn-theater-share');
  if (btnTheaterShare) {
    btnTheaterShare.addEventListener('click', () => {
      const shareUrl = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('Link tonton berhasil disalin ke clipboard!');
        }).catch(() => {
          showToast('Link tonton: ' + shareUrl);
        });
      } else {
        showToast('Link tonton: ' + shareUrl);
      }
    });
  }

  // Multi-Server Switch Pills (7 Pilihan Server)
  document.querySelectorAll('.pill-server').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetServer = btn.dataset.server;
      if (currentMovie && targetServer) {
        openPlayerModal(currentMovie, targetServer);
        showToast(`Beralih ke ${btn.textContent.trim()}`);
      }
    });
  });

  const btnTheaterBookmark = document.getElementById('btn-theater-bookmark');
  if (btnTheaterBookmark) {
    btnTheaterBookmark.addEventListener('click', () => {
      if (currentMovie) toggleMovieFavorite(currentMovie);
    });
  }

  const btnTheaterFs = document.getElementById('btn-theater-fullscreen');
  if (btnTheaterFs) {
    btnTheaterFs.addEventListener('click', () => {
      const stage = document.querySelector('.theater-stage') || document.getElementById('video-stream-iframe');
      if (stage) {
        if (!document.fullscreenElement) {
          if (stage.requestFullscreen) {
            stage.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
          } else if (stage.webkitRequestFullscreen) {
            stage.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
          }
        }
      }
    });
  }

  // 3. Watchlist & History Activity Drawer
  const btnOpenWatchlist = document.getElementById('btn-open-watchlist');
  if (btnOpenWatchlist) {
    btnOpenWatchlist.addEventListener('click', openWatchlistDrawer);
  }

  const btnOpenHistory = document.getElementById('btn-open-history');
  if (btnOpenHistory) {
    btnOpenHistory.addEventListener('click', openHistoryDrawer);
  }

  const btnCloseWatchlist = document.getElementById('btn-close-watchlist');
  if (btnCloseWatchlist) {
    btnCloseWatchlist.addEventListener('click', closeWatchlistDrawer);
  }

  const watchlistBackdrop = document.getElementById('watchlist-backdrop-btn');
  if (watchlistBackdrop) {
    watchlistBackdrop.addEventListener('click', closeWatchlistDrawer);
  }

  const tabBtnWatchlist = document.getElementById('tab-btn-watchlist');
  if (tabBtnWatchlist) {
    tabBtnWatchlist.addEventListener('click', () => switchDrawerTab('watchlist'));
  }

  const tabBtnHistory = document.getElementById('tab-btn-history');
  if (tabBtnHistory) {
    tabBtnHistory.addEventListener('click', () => switchDrawerTab('history'));
  }

  const btnClearHistory = document.getElementById('btn-clear-history');
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      clearWatchHistory();
      renderWatchHistory();
    });
  }

  // 3b. CineStreak Gamification Modal
  const btnOpenStreak = document.getElementById('btn-open-streak');
  if (btnOpenStreak) {
    btnOpenStreak.addEventListener('click', openStreakModal);
  }

  const btnCloseStreak = document.getElementById('btn-close-streak');
  if (btnCloseStreak) {
    btnCloseStreak.addEventListener('click', closeStreakModal);
  }

  const streakBackdrop = document.getElementById('streak-backdrop-btn');
  if (streakBackdrop) {
    streakBackdrop.addEventListener('click', closeStreakModal);
  }

  const btnStreakContinue = document.getElementById('btn-streak-continue');
  if (btnStreakContinue) {
    btnStreakContinue.addEventListener('click', closeStreakModal);
  }


  // 4. Live Search Input dengan Debounce 350ms
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      if (searchClear) {
        searchClear.style.display = activeSearchQuery.length > 0 ? 'block' : 'none';
      }
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        performFilterAndSearch();
      }, 350);
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      activeSearchQuery = '';
      searchClear.style.display = 'none';
      performFilterAndSearch();
      searchInput.focus();
    });
  }

  // 5. Category Navigation Tabs (Semua, Terbaru, Klasik, Trending, Anime)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      // Jika sedang dalam theater view, kembalikan ke home view
      closePlayerModal();

      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      activeCategoryFilter = item.dataset.category || 'all';
      performFilterAndSearch();
    });
  });

  // 6. Genre Chips Filter Real-Time
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      // Jika sedang dalam theater view, kembalikan ke home view
      closePlayerModal();

      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      activeGenreFilter = chip.dataset.genre || 'all';
      performFilterAndSearch();
    });
  });

  // 7. Reset Filter
  const btnReset = document.getElementById('btn-reset-filter');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      closePlayerModal();

      activeCategoryFilter = 'all';
      activeGenreFilter = 'all';
      activeSearchQuery = '';

      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';

      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const navAll = document.getElementById('nav-all');
      if (navAll) navAll.classList.add('active');

      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      const chipAll = document.querySelector('.filter-chip[data-genre="all"]');
      if (chipAll) chipAll.classList.add('active');

      performFilterAndSearch();
    });
  }

  // 8. Keyboard Shortcuts (Escape to close, / to search)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePlayerModal();
      closeWatchlistDrawer();
      closeStreakModal();
    } else if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  // 9. Popstate Listener (Browser Back & Forward Navigation)
  window.addEventListener('popstate', () => {
    if (location.hash.startsWith('#watch-')) {
      const id = location.hash.replace('#watch-', '');
      const movie = memoryMovieStore.get(id);
      if (movie) {
        openPlayerModal(movie, currentServer);
      }
    } else {
      const theaterView = document.getElementById('theater-view');
      if (theaterView && theaterView.style.display !== 'none') {
        closePlayerModal();
      }
    }
  });

  // 10. Logo Click resets to Home
  const logoLink = document.getElementById('logo-link');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      closePlayerModal();
      const btnResetEl = document.getElementById('btn-reset-filter');
      if (btnResetEl) btnResetEl.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 11. YouTube-Style Community Comments Handlers
  const commentInput = document.getElementById('comment-input-text');
  const commentAuthor = document.getElementById('comment-author-name');
  const commentAvatar = document.getElementById('comment-current-avatar');
  const btnCommentSubmit = document.getElementById('btn-comment-submit');
  const btnCommentCancel = document.getElementById('btn-comment-cancel');
  const btnSortTop = document.getElementById('btn-sort-top');
  const btnSortNew = document.getElementById('btn-sort-new');

  // Load preferred author name from storage
  const savedAuthor = localStorage.getItem('fplay_preferred_author');
  if (savedAuthor && commentAuthor) {
    commentAuthor.value = savedAuthor;
    if (commentAvatar) {
      commentAvatar.textContent = savedAuthor.charAt(0).toUpperCase();
      commentAvatar.style.background = getAvatarColor(savedAuthor);
    }
  }

  if (commentAuthor) {
    commentAuthor.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        localStorage.setItem('fplay_preferred_author', val);
        if (commentAvatar) {
          commentAvatar.textContent = val.charAt(0).toUpperCase();
          commentAvatar.style.background = getAvatarColor(val);
        }
      } else {
        if (commentAvatar) {
          commentAvatar.textContent = 'U';
          commentAvatar.style.background = 'linear-gradient(135deg, #e50914, #8b0000)';
        }
      }
    });
  }

  if (commentInput) {
    commentInput.addEventListener('input', () => {
      commentInput.style.height = 'auto';
      commentInput.style.height = Math.min(commentInput.scrollHeight, 180) + 'px';

      const hasText = commentInput.value.trim().length > 0;
      if (btnCommentSubmit) btnCommentSubmit.disabled = !hasText;
    });
  }

  if (btnCommentCancel && commentInput) {
    btnCommentCancel.addEventListener('click', () => {
      commentInput.value = '';
      commentInput.style.height = 'auto';
      if (btnCommentSubmit) btnCommentSubmit.disabled = true;
    });
  }

  if (btnCommentSubmit && commentInput) {
    btnCommentSubmit.addEventListener('click', () => {
      const text = commentInput.value.trim();
      if (!text || !currentMovie) return;

      const author = (commentAuthor && commentAuthor.value.trim()) || localStorage.getItem('fplay_preferred_author') || 'Penonton F-Play';
      const movieId = currentMovie.tmdbId || currentMovie.id;

      const newComment = {
        id: `c_${Date.now()}`,
        author: author,
        text: text,
        likes: 0,
        dislikes: 0,
        timeAgo: 'Baru saja',
        timestamp: Date.now(),
        isCritic: false,
        replies: []
      };

      const comments = getMovieComments(movieId);
      comments.unshift(newComment);
      saveMovieComments(movieId, comments);

      commentInput.value = '';
      commentInput.style.height = 'auto';
      btnCommentSubmit.disabled = true;

      renderMovieComments(movieId, activeCommentSort);
      showToast('Komentar kamu berhasil dipublikasikan!');
    });
  }

  if (btnSortTop) {
    btnSortTop.addEventListener('click', () => {
      if (currentMovie) renderMovieComments(currentMovie.tmdbId || currentMovie.id, 'top');
    });
  }

  if (btnSortNew) {
    btnSortNew.addEventListener('click', () => {
      if (currentMovie) renderMovieComments(currentMovie.tmdbId || currentMovie.id, 'new');
    });
  }
}

/* --- App Bootstrapper --- */
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  updateWatchlistBadge();
  updateHistoryBadge();
  initStreak();

  await loadAllSections();

  // Cek deep link jika URL memiliki hash tontonan (contoh: #watch-533535)
  if (location.hash.startsWith('#watch-')) {
    const id = location.hash.replace('#watch-', '');
    let movie = memoryMovieStore.get(id);
    if (!movie) {
      const fetched = await fetchTmdbEndpoint(`movie/${id}`);
      if (fetched && fetched.length > 0) movie = fetched[0];
    }
    if (movie) {
      openPlayerModal(movie, 'server1');
    }
  }
});
