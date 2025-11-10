# Faap - Fachowiec Application Project

## Project Description

Faap is a comprehensive project containing two Polish craftsman/tradesman management applications. The project includes both a simple Progressive Web App (PWA) and a more complex React application with Material-UI, designed to help tradespeople manage their jobs, clients, and schedules.

## File Structure

The repository contains two main applications:

### 1. PWA Fachowiec (`/pwa-fachowiec/`)
- Simple Progressive Web App built with React 19 and Vite
- Offline-first architecture using IndexedDB (localforage) for data storage
- PWA capabilities with service worker and app manifest
- Key files:
  - `src/App.jsx` - Main application component
  - `src/data/jobStore.js` - IndexedDB job storage management
  - `public/pwa-*.png` - PWA icons
  - `server/` - Optional Express server

### 2. Fachowiec App (`/fachowiec-app/`)
- Full-featured React application with Material-UI
- Includes routing, authentication, and comprehensive UI components
- Key directories:
  - `src/pages/` - Application pages (Dashboard, Login, Jobs, Clients, Calendar)
  - `src/components/` - Reusable UI components
  - `src/context/` - React Context for state management
  - `src/theme/` - Material-UI theme configuration
  - `src/data/` - Mock data and data management

### Documentation
- `API_DOCUMENTATION.md` - Comprehensive API documentation for both apps
- `PROTOTYPE_SUMMARY.md` - Detailed summary of implemented features (in Polish)
- `README.md` - Basic project template

## Running the Applications

### PWA Fachowiec
```bash
cd pwa-fachowiec
npm install
npm run dev
```

### Fachowiec App
```bash
cd fachowiec-app
npm install
npm run dev
```

Both applications use Vite as the build tool and support:
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - ESLint code linting

## Key Technologies

- **React 19.1.1** - Frontend framework
- **Vite** - Build tool and dev server
- **Material-UI 7.3.4** - UI component library (fachowiec-app only)
- **React Router 7.9.5** - Client-side routing (fachowiec-app only)
- **localforage** - IndexedDB wrapper for offline storage
- **vite-plugin-pwa** - PWA functionality (pwa-fachowiec only)

## Development Notes

- No test suite is currently configured
- Both applications include mock data for demonstration
- The PWA version focuses on offline functionality
- The full app includes authentication, job management, client management, and calendar features
- All documentation is primarily in Polish, reflecting the target market