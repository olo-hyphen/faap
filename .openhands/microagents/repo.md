# FAAP - Fachowiec Application Project

## Project Description

FAAP (Fachowiec Application Project) is a comprehensive job management system designed for skilled tradespeople ("fachowiec" in Polish). The project consists of two complementary applications:

1. **PWA Fachowiec** - A lightweight Progressive Web App for basic job management with offline capabilities
2. **Fachowiec App** - A full-featured React application with advanced job management, client tracking, and calendar functionality

Both applications are designed to help tradespeople manage their jobs, clients, and schedules efficiently, with the PWA version providing offline functionality for field work and the main app offering comprehensive business management features.

## File Structure Overview

```
faap/
├── pwa-fachowiec/          # Progressive Web App
│   ├── src/
│   │   ├── data/           # IndexedDB job storage
│   │   ├── assets/         # Static assets
│   │   └── App.jsx         # Main PWA component
│   ├── server/             # Optional Express server
│   └── public/             # PWA assets and icons
├── fachowiec-app/          # Main React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Dashboard, Jobs, Clients, Calendar)
│   │   ├── context/        # React Context for state management
│   │   ├── routes/         # Routing configuration
│   │   ├── theme/          # Material-UI theme configuration
│   │   ├── data/           # Mock data and data management
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets
├── jules-scratch/          # Development scratch space
├── API_DOCUMENTATION.md    # Comprehensive API documentation
├── PROTOTYPE_SUMMARY.md    # Detailed project summary in Polish
└── README.md               # Basic project template
```

## Running the Applications

### PWA Fachowiec (Simple offline-capable app)
```bash
cd pwa-fachowiec
npm install
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Fachowiec App (Full-featured React app)
```bash
cd fachowiec-app
npm install
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

Both applications use Vite as the build tool and support hot module replacement during development.

## Key Technologies

- **Frontend**: React 19.1.1, Material-UI 7.3.4, React Router 7.9.5
- **Build Tool**: Vite 7.x
- **Storage**: IndexedDB via localforage (offline storage)
- **PWA**: vite-plugin-pwa for Progressive Web App features
- **Styling**: Material-UI with Emotion CSS-in-JS

## Development Notes

- No test suite is currently configured
- Both applications include comprehensive mock data for development
- The PWA version focuses on offline functionality with IndexedDB storage
- The main app includes authentication, routing, and advanced UI components
- All documentation is primarily in Polish, reflecting the target market
- Both applications are production-ready with successful build configurations

## Additional Resources

- `API_DOCUMENTATION.md` - Detailed technical documentation of all components and APIs
- `PROTOTYPE_SUMMARY.md` - Complete project overview and feature list (in Polish)
- Individual README files in each application directory contain specific setup instructions