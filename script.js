/**
 * F-Play: The Ultimate Movie & Anime Stream (Auto-Updating Engine)
 * Terhubung langsung ke API Global TMDB secara real-time.
 * Website ini otomatis memperbarui film terbaru, trending, dan klasik setiap saat
 * tanpa perlu koding ulang manual sampai tahun 2030 dan seterusnya.
 */

// TMDB Public API Configuration
const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

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
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/yDHYTfaEtcuIMvxURQIahvtMRbt.jpg',
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
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg',
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
    poster: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/kXfqNm225ZuzwnrLvTG4hw1ndDd.jpg',
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
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
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
  const countEl = document.getElementById('watchlist-count');
  if (countEl) {
    countEl.textContent = getFavorites().length;
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
      <img src="${movie.poster || FALLBACK_POSTER_SVG}" alt="Poster ${movie.title}" class="card-poster" loading="lazy" onerror="this.onerror=null; this.src=FALLBACK_POSTER_SVG;">
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
function renderSkeletonGrid(containerEl, count = 8) {
  if (!containerEl) return;
  containerEl.innerHTML = '';
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
    containerEl.appendChild(skel);
  }
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
    if (gridLatest) {
      gridLatest.innerHTML = '';
      latest.forEach(movie => gridLatest.appendChild(createMovieCard(movie)));
    }

    // Render Grid 2: Film Lawas & Klasik Sepanjang Masa
    if (gridClassics) {
      gridClassics.innerHTML = '';
      classics.forEach(movie => gridClassics.appendChild(createMovieCard(movie)));
    }

    // Render Grid 3: Trending Minggu Ini
    if (gridTrending) {
      gridTrending.innerHTML = '';
      trending.forEach(movie => gridTrending.appendChild(createMovieCard(movie)));
    }

    // Render Grid 4: Anime & Animasi Populer
    if (gridAnime) {
      gridAnime.innerHTML = '';
      anime.forEach(movie => gridAnime.appendChild(createMovieCard(movie)));
    }

  } catch (err) {
    console.error('Error saat inisialisasi catalog:', err);
    // Fallback darurat
    if (gridLatest) {
      gridLatest.innerHTML = '';
      FALLBACK_CATALOG.forEach(m => gridLatest.appendChild(createMovieCard(m)));
    }
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
  const recs = (filtered.length >= 4) ? filtered.slice(0, 8) : FALLBACK_CATALOG.filter(m => m.tmdbId !== current.tmdbId);

  recs.forEach(m => {
    const card = createMovieCard(m);
    container.appendChild(card);
  });
}

/* --- Watchlist Drawer Renderer --- */
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
          <p class="watchlist-item-meta">${movie.year} • ⭐ ${movie.rating}</p>
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

function openWatchlistDrawer() {
  renderWatchlistDrawer();
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

/* --- About Creator & Architect Modal Controller --- */
function openAboutModal() {
  const modal = document.getElementById('about-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeAboutModal() {
  const modal = document.getElementById('about-modal');
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
      results.forEach(movie => {
        searchGrid.appendChild(createMovieCard(movie));
      });
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

  // 3. Watchlist Drawer
  const btnOpenWatchlist = document.getElementById('btn-open-watchlist');
  if (btnOpenWatchlist) {
    btnOpenWatchlist.addEventListener('click', openWatchlistDrawer);
  }

  const btnCloseWatchlist = document.getElementById('btn-close-watchlist');
  if (btnCloseWatchlist) {
    btnCloseWatchlist.addEventListener('click', closeWatchlistDrawer);
  }

  const watchlistBackdrop = document.getElementById('watchlist-backdrop-btn');
  if (watchlistBackdrop) {
    watchlistBackdrop.addEventListener('click', closeWatchlistDrawer);
  }

  // 3.1 About Creator Modal Listeners
  const btnOpenAbout = document.getElementById('btn-open-about');
  if (btnOpenAbout) {
    btnOpenAbout.addEventListener('click', openAboutModal);
  }

  const btnFooterAbout = document.getElementById('btn-footer-about');
  if (btnFooterAbout) {
    btnFooterAbout.addEventListener('click', openAboutModal);
  }

  const btnCloseAbout = document.getElementById('btn-close-about');
  if (btnCloseAbout) {
    btnCloseAbout.addEventListener('click', closeAboutModal);
  }

  const aboutBackdrop = document.getElementById('about-backdrop-btn');
  if (aboutBackdrop) {
    aboutBackdrop.addEventListener('click', closeAboutModal);
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
      closeAboutModal();
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
}

/* --- App Bootstrapper --- */
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
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
