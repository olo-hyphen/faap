# Fachowiec PWA

<div align="center">

![PWA](https://img.shields.io/badge/PWA-Enabled-blue)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.1.12-646cff)
![License](https://img.shields.io/badge/License-MIT-green)

**Progressive Web Application for Tradespeople**

A modern, offline-first PWA designed for professionals managing their daily work orders, clients, and tasks.

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Demo](#demo)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [API Reference](#api-reference)
- [Development](#development)
- [PWA Features](#pwa-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Fachowiec PWA** (Tradesman PWA) is a progressive web application built for tradespeople such as plumbers, electricians, and general contractors. It provides a comprehensive solution for managing work orders, tracking time, organizing clients, and documenting work through photos.

### Why Fachowiec PWA?

- **📱 Works Offline**: Full functionality without internet connection
- **💾 Local-First**: Data stored locally in IndexedDB
- **🚀 Fast**: Instant loading with service worker caching
- **📲 Installable**: Install as a native app on any device
- **🔄 Auto-Sync**: Sync data when connection is available (future feature)
- **🇵🇱 Polish Language**: Native Polish language support

---

## ✨ Features

### Current Features (v1.0)

- ✅ **Job Management**: Create, view, and manage work orders
- ✅ **Offline Storage**: IndexedDB for persistent, offline-first storage
- ✅ **PWA Ready**: Installable as native app with service worker
- ✅ **Auto-Update**: Automatic application updates
- ✅ **Simple UI**: Clean, intuitive interface

### Planned Features (Roadmap)

- 🔲 Time Tracking: Timer for tracking work hours
- 🔲 Client Management: Customer database with contact info
- 🔲 Photo Gallery: Document work with before/after photos
- 🔲 Estimates: Create and manage project quotes
- 🔲 Calendar: Schedule and view upcoming jobs
- 🔲 Reports: Generate daily/weekly/monthly reports
- 🔲 Backend Sync: Synchronize with server API
- 🔲 Push Notifications: Reminders for scheduled jobs
- 🔲 Multi-language: Additional language support
- 🔲 Dark Mode: Theme customization

See the full [Feature Roadmap](./ROADMAP.md) for more details.

---

## 🛠 Tech Stack

### Core

- **[React 19.1.1](https://react.dev/)** - UI library
- **[Vite 7.1.12](https://vite.dev/)** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language

### Storage

- **[LocalForage 1.10.0](https://localforage.github.io/localForage/)** - IndexedDB wrapper
- **IndexedDB** - Browser-based persistent storage

### PWA

- **[vite-plugin-pwa 1.1.0](https://vite-pwa-org.netlify.app/)** - PWA plugin
- **[Workbox](https://developers.google.com/web/tools/workbox)** - Service worker library

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **PostCSS** - CSS processing

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pwa-fachowiec.git

# Navigate to project directory
cd pwa-fachowiec

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### First Use

1. **Add a Job**: Type a job description and click "Dodaj Zlecenie"
2. **View Jobs**: See your jobs listed below the input form
3. **Test Offline**: Open DevTools → Network → Set to "Offline", try adding more jobs
4. **Install as App**: Click the install button in your browser's address bar

---

## 📁 Project Structure

```
pwa-fachowiec/
├── public/                  # Static assets
│   ├── pwa-192x192.png     # PWA icon (192x192)
│   ├── pwa-512x512.png     # PWA icon (512x512)
│   └── vite.svg            # Vite logo
├── src/
│   ├── data/               # Data layer
│   │   └── jobStore.js     # IndexedDB operations
│   ├── assets/             # Images, fonts, etc.
│   ├── App.jsx             # Main component
│   ├── main.jsx            # Entry point
│   ├── App.css             # Component styles
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── eslint.config.js        # ESLint config
├── API_DOCUMENTATION.md    # API docs
├── COMPONENTS_GUIDE.md     # Component guide
├── USAGE_EXAMPLES.md       # Usage examples
└── README.md               # This file
```

---

## 📚 Documentation

Comprehensive documentation is available in separate files:

| Document | Description |
|----------|-------------|
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API reference with examples |
| [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) | Component architecture and patterns |
| [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) | Real-world usage examples |

### Quick Links

- **Data Layer**: See [jobStore API](./API_DOCUMENTATION.md#data-layer-api)
- **Components**: See [Component Guide](./COMPONENTS_GUIDE.md)
- **Examples**: See [Usage Examples](./USAGE_EXAMPLES.md)
- **PWA Config**: See [PWA Configuration](./API_DOCUMENTATION.md#pwa-configuration)

---

## 🔧 API Reference

### Core Functions

```javascript
import { saveJob, getAllJobs } from './src/data/jobStore';

// Save a new job
const jobId = await saveJob({
  description: "Install new sink",
  status: "Lokalny"
});

// Get all jobs
const jobs = await getAllJobs();
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

---

## 💻 Development

### Available Scripts

```bash
# Start development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Server

The dev server runs at `http://localhost:5173` with:
- ⚡ Hot Module Replacement (HMR)
- 🔄 PWA enabled in dev mode
- 🐛 Source maps for debugging
- 📊 IndexedDB accessible via DevTools

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory:
- Minified JavaScript and CSS
- Service worker (`sw.js`)
- Web app manifest (`manifest.webmanifest`)
- Optimized assets with content hashing

### Testing Offline

1. Build the production version: `npm run build`
2. Serve it: `npm run preview`
3. Open DevTools → Application → Service Workers
4. Check "Offline" mode
5. Reload page - should still work!

---

## 📱 PWA Features

### Installation

Users can install the app:
- **Desktop**: Click install button in address bar
- **Android**: "Add to Home Screen" prompt
- **iOS**: Share → "Add to Home Screen"

### Offline Support

- **Service Worker**: Caches all app resources
- **IndexedDB**: Stores job data locally
- **Auto-Update**: Updates automatically when online

### Manifest Configuration

```json
{
  "name": "PWA Fachowiec",
  "short_name": "Fachowiec",
  "description": "Aplikacja PWA dla fachowców",
  "theme_color": "#ffffff",
  "icons": [
    { "src": "pwa-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "pwa-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker Strategy

- **CacheFirst**: JS, CSS, images → Fast loading
- **NetworkFirst**: HTML → Fresh content
- **StaleWhileRevalidate**: API calls → Balance speed/freshness

---

## 🌐 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Add to package.json
{
  "homepage": "https://username.github.io/pwa-fachowiec",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

npm install --save-dev gh-pages
npm run deploy
```

### Deploy to Cloudflare Pages

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Fachowiec PWA (Dev)

# .env.production
VITE_API_URL=https://api.fachowiec.pl
VITE_APP_NAME=Fachowiec PWA
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Add a new job
- [ ] View job list
- [ ] Test offline mode (DevTools → Network → Offline)
- [ ] Install as PWA
- [ ] Test on mobile device
- [ ] Check IndexedDB in DevTools (Application → IndexedDB)
- [ ] Verify service worker registration (Application → Service Workers)

### Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 76+ | ✅ Full |

### Mobile Compatibility

- ✅ Android 8+ (Chrome, Firefox)
- ✅ iOS 14+ (Safari)
- ✅ Responsive design (320px - 2560px)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test offline functionality
- Ensure PWA features work

### Code Style

- Use ES6+ features
- Prefer functional components
- Use async/await for promises
- Keep functions small and focused
- Name variables descriptively

---

## 🐛 Troubleshooting

### Common Issues

**Problem: Jobs not persisting**
```javascript
// Check if IndexedDB is available
if (!window.indexedDB) {
  console.error('IndexedDB not supported');
}
```

**Problem: Service worker not registering**
```javascript
// Check in DevTools → Application → Service Workers
// Or run:
navigator.serviceWorker.getRegistrations().then(console.log);
```

**Problem: Install prompt not showing**
- Ensure you're using HTTPS (or localhost)
- Check that manifest.json is valid
- Verify icons are present

### Debug Mode

Enable verbose logging:
```javascript
// In jobStore.js
const DEBUG = true;

export async function saveJob(jobData) {
  if (DEBUG) console.log('Saving job:', jobData);
  // ... rest of code
}
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Development Team** - Initial work

---

## 🙏 Acknowledgments

- React team for the amazing library
- Vite team for the blazing-fast build tool
- LocalForage for the simple IndexedDB wrapper
- PWA community for best practices and patterns

---

## 📞 Support

- **Documentation**: See [docs folder](./API_DOCUMENTATION.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/pwa-fachowiec/issues)
- **Email**: support@fachowiec.pl

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Basic job management
- ✅ Offline storage
- ✅ PWA installation

### Version 1.1 (Planned)
- 🔲 Job editing and deletion
- 🔲 Status filtering
- 🔲 Search functionality
- 🔲 Dark mode

### Version 2.0 (Future)
- 🔲 Time tracking
- 🔲 Client management
- 🔲 Photo uploads
- 🔲 Backend API integration
- 🔲 Push notifications

See [ROADMAP.md](./ROADMAP.md) for detailed feature planning.

---

<div align="center">

**Made with ❤️ for tradespeople**

[Report Bug](https://github.com/your-username/pwa-fachowiec/issues) • [Request Feature](https://github.com/your-username/pwa-fachowiec/issues)

</div>
