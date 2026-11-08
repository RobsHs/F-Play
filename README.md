<p align="center">
  <img src="assets/logo.svg" width="320" alt="F-Play Cinema Logo" />
</p>

<p align="center">
  <b>The Ultimate Real-Time Movie & Anime Streaming Platform</b><br>
  <i>Multi-Server Failover • Cinema Theater Mode • Auto-Updating TMDB Engine (2024 - 2030+)</i>
</p>

<p align="center">
  <a href="https://fplay.web.app" target="_blank">
    <img src="https://img.shields.io/badge/LIVE%20WEB%20APP-FPLAY.WEB.APP-e50914?style=for-the-badge&logo=firebase&logoColor=ffffff" alt="Live Web App" />
  </a>
  <img src="https://img.shields.io/badge/STATUS-PRODUCTION%20READY-0c0f17?style=for-the-badge&logo=vercel&logoColor=10b981" alt="Production Status" />
  <img src="https://img.shields.io/badge/LICENSE-ALL%20RIGHTS%20RESERVED-0c0f17?style=for-the-badge&color=ff003c" alt="License" />
</p>

---

## ⚡ Overview & Architectural Vision

**F-Play** is a cutting-edge, zero-backend, pure frontend cinematic streaming web application engineered by the **F-Play Team**. 

Built with performance, durability, and clean aesthetic ergonomics at its core, F-Play solves the common pitfalls of typical streaming web apps: broken players, annoying pop-up redirects, ugly modal frames, missing poster art, and outdated hardcoded databases.

### 🌟 Key Capabilities

- 🎬 **Dedicated Cinema Theater Mode**: Replaces cramped floating pop-up modals with a majestic 16:9 widescreen stage centered with cinema ambient backlight glow on desktop, and edge-to-edge immersive view on mobile.
- 🔄 **Auto-Updating Real-Time Catalog (2024 - 2030+)**: Synchronizes directly with The Movie Database (TMDB) global API endpoints on runtime. Fresh cinema box-office releases in 2026, 2027, up through 2030 automatically appear without requiring manual database maintenance.
- 🚀 **7 Distributed Streaming Servers**: Instant one-click server failover (VidLink, VidSrc CC, Embed.su, VidSrc TO, VidSrc XYZ, MultiEmbed, and YouTube Official HD Trailers).
- 🛡️ **Zero Sandboxing Error**: Engineered to ensure full compatibility with modern embed video providers without triggering anti-tamper security exceptions.
- 🎨 **Anti-Slop Craftsmanship**:
  - Zero em dashes across all copy and documentation.
  - No dead buttons: Every interactive element has an active, tested event handler.
  - Complete UI states: Loading skeletons, empty search states, empty watchlist, and fallback vector SVG thumbnails.
  - High accessibility contrast conforming to WCAG AA guidelines.
  - Mobile touch targets strictly >= 44px.
- 💾 **Client-Side Persistence**: Watchlist saved locally via `localStorage` with zero server tracking or telemetry invasiveness.
- 🔗 **Deep Linking & Browser History**: Syncs video playback with URL hash (`#watch-[tmdbId]`) allowing direct link sharing and seamless browser Back/Forward navigation.

---

## 🛠️ Technology Arsenal

| Layer | Technologies & Implementations |
| :--- | :--- |
| **Frontend Core** | HTML5 Semantic Architecture, Modern Vanilla JavaScript (ES2022+), CSS3 Variables & Flex/Grid |
| **Design System** | Custom Cinema Obsidian Palette (`#08090d`, `#e50914`, `#f5c518`), Glassmorphism, Ambient Bloom |
| **API & Data** | The Movie Database (TMDB) RESTful v3 Endpoints (Now Playing, Trending, Top Rated, Discover, Search) |
| **Streaming Hosts** | VidLink Pro, VidSrc CC v2, Embed.su, VidSrc TO, VidSrc XYZ, MultiEmbed, YouTube Player Embed |
| **Assets & Branding** | Custom Vector SVG Brand Mark, Dynamic Embedded SVG Fallback Posters, Responsive Favicon |

---

## 📂 Project Directory Structure

```text
F-Play/
├── assets/
│   ├── favicon.svg          # High-resolution vector favicon
│   └── logo.svg             # Official F-Play Cinema vector logo
├── index.html               # Main application shell with Home & Theater views
├── style.css                # Pure modular CSS with tokens, theater stage, & mobile breakpoints
├── script.js                # Application controller, TMDB engine, multi-server logic, & watchlist
├── DESIGN.md                # Comprehensive design system and architectural documentation
├── firebase.json            # Firebase hosting configuration for fplay.web.app
├── LICENSE                  # Proprietary intellectual property license
└── README.md                # Project documentation
```

---

## 🚀 Quick Start & Local Execution

F-Play is entirely self-contained with **zero dependencies** and **zero build steps**. You can run it instantly using any static web server:

```bash
# Clone the repository (Private Repository)
git clone <private-repository-url>

# Enter the project directory
cd F-Play

# Launch with Python built-in server
python -m http.server 8080

# Or launch with Node.js npx serve
npx serve .
```

Open your browser at `http://localhost:8080` to experience F-Play.

---

## 📜 Disclaimer & Licensing

- **Disclaimer**: F-Play utilizes publicly accessible APIs from The Movie Database (TMDB) for metadata indexing and distributed third-party embed servers for video rendering. F-Play does not host, upload, or store any multimedia files on local servers.
- **License & Copyright**: Proprietary - All Rights Reserved. Copyright (c) 2026 F-Play. This project represents original creative conceptualization and architectural design. Copying, cloning, mirroring, redistributing, or commercial exploitation of any part of this source code or design without explicit written consent is strictly prohibited. See [LICENSE](LICENSE) for complete legal terms.
