# Dokumentacja API - Aplikacja Fachowiec PWA

## Spis treści

1. [Przegląd](#przegląd)
2. [PWA Fachowiec - Store API](#pwa-fachowiec---store-api)
3. [PWA Fachowiec - Komponenty](#pwa-fachowiec---komponenty)
4. [PWA Fachowiec - Server API](#pwa-fachowiec---server-api)
5. [Fachowiec App - Komponenty](#fachowiec-app---komponenty)
6. [Fachowiec App - Context API](#fachowiec-app---context-api)
7. [Fachowiec App - Strony](#fachowiec-app---strony)
8. [Fachowiec App - Routing](#fachowiec-app---routing)
9. [Fachowiec App - Temat](#fachowiec-app---temat)
10. [Fachowiec App - Dane](#fachowiec-app---dane)

---

## Przegląd

Aplikacja Fachowiec składa się z dwóch głównych projektów:

1. **PWA Fachowiec** (`/workspace/pwa-fachowiec`) - Prosta aplikacja PWA z funkcjonalnością przechowywania zleceń w IndexedDB
2. **Fachowiec App** (`/workspace/fachowiec-app`) - Kompleksowa aplikacja React z routingiem, autentykacją i Material-UI

---

## PWA Fachowiec - Store API

### Lokalizacja
`/workspace/pwa-fachowiec/src/data/jobStore.js`

### Opis
Moduł zarządzający przechowywaniem zleceń w IndexedDB przy użyciu biblioteki `localforage`. Wszystkie operacje działają w trybie offline.

### API

#### `saveJob(jobData)`

Zapisuje zlecenie do IndexedDB. Jeśli zlecenie nie ma ID, generuje je automatycznie.

**Parametry:**
- `jobData` (Object) - Obiekt zlecenia z następującymi właściwościami:
  - `id` (String, opcjonalne) - Unikalny identyfikator zlecenia
  - `description` (String) - Opis zlecenia
  - `status` (String, opcjonalne) - Status zlecenia (domyślnie 'Lokalny')
  - `...` - Dowolne inne właściwości

**Zwraca:**
- `Promise<String>` - ID zapisanego zlecenia

**Przykład użycia:**
```javascript
import { saveJob } from './data/jobStore';

// Zapisanie nowego zlecenia
const jobId = await saveJob({
  description: 'Naprawa instalacji elektrycznej',
  status: 'W trakcie',
  priority: 'Wysoki',
  client: 'Jan Kowalski'
});

console.log('Zapisano zlecenie z ID:', jobId);

// Aktualizacja istniejącego zlecenia
await saveJob({
  id: '1234567890',
  description: 'Naprawa instalacji elektrycznej - zakończone',
  status: 'Zakończone'
});
```

**Uwagi:**
- Jeśli `jobData.id` nie jest podane, funkcja generuje ID używając `Date.now().toString()`
- Status domyślnie ustawiany jest na 'Lokalny' jeśli nie został podany
- Wszystkie dane są przechowywane lokalnie w IndexedDB

---

#### `getAllJobs()`

Pobiera wszystkie zlecenia z IndexedDB.

**Parametry:**
- Brak

**Zwraca:**
- `Promise<Array>` - Tablica wszystkich zleceń

**Przykład użycia:**
```javascript
import { getAllJobs } from './data/jobStore';

// Pobranie wszystkich zleceń
const allJobs = await getAllJobs();
console.log('Liczba zleceń:', allJobs.length);

// Przetwarzanie zleceń
allJobs.forEach(job => {
  console.log(`${job.id}: ${job.description} - ${job.status}`);
});

// Filtrowanie zleceń
const activeJobs = allJobs.filter(job => job.status === 'W trakcie');
console.log('Aktywne zlecenia:', activeJobs);
```

**Uwagi:**
- Funkcja iteruje przez wszystkie klucze w IndexedDB
- Zwraca pustą tablicę jeśli nie ma żadnych zleceń
- Funkcja jest asynchroniczna i zawsze zwraca Promise

---

### Konfiguracja Store

Store jest skonfigurowany z następującymi parametrami:
- **Nazwa bazy danych**: `FachowiecPWA`
- **Nazwa magazynu**: `zlecenia`
- **Opis**: `Zlecenia i zadania klienta`

---

## PWA Fachowiec - Komponenty

### `App`

**Lokalizacja:** `/workspace/pwa-fachowiec/src/App.jsx`

**Opis:** Główny komponent aplikacji wyświetlający formularz dodawania zleceń i listę wszystkich zleceń.

**Props:**
- Brak (komponent główny)

**Stan:**
- `jobs` (Array) - Lista wszystkich zleceń
- `newJob` (String) - Wartość pola formularza dla nowego zlecenia

**Metody:**
- `handleAddJob(e)` - Obsługuje dodawanie nowego zlecenia

**Przykład użycia:**
```jsx
import App from './App';

function Root() {
  return <App />;
}
```

**Efekty uboczne:**
- Komponent automatycznie pobiera wszystkie zlecenia przy montowaniu (`useEffect`)

**Wizualizacja:**
```
┌─────────────────────────┐
│   PWA Fachowiec         │
├─────────────────────────┤
│   Nowe Zlecenie         │
│   [Input: Opis]         │
│   [Button: Dodaj]       │
├─────────────────────────┤
│   Lista Zleceń          │
│   • Zlecenie 1 - Status │
│   • Zlecenie 2 - Status │
└─────────────────────────┘
```

---

## PWA Fachowiec - Server API

### Lokalizacja
`/workspace/pwa-fachowiec/server/index.js`

### Opis
Prosty serwer Express do obsługi zapytań HTTP. Obecnie zawiera tylko endpoint główny.

### Endpointy

#### `GET /`

Zwraca prostą wiadomość powitalną.

**Request:**
```http
GET / HTTP/1.1
Host: localhost:3000
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

Hello from the PWA Fachowiec backend!
```

**Przykład użycia:**
```javascript
// Fetch API
fetch('http://localhost:3000/')
  .then(response => response.text())
  .then(data => console.log(data)); // "Hello from the PWA Fachowiec backend!"

// Axios
import axios from 'axios';
const response = await axios.get('http://localhost:3000/');
console.log(response.data); // "Hello from the PWA Fachowiec backend!"
```

**Uruchomienie serwera:**
```bash
cd /workspace/pwa-fachowiec/server
npm install
node index.js
# Server is running on http://localhost:3000
```

---

## Fachowiec App - Komponenty

### `MainLayout`

**Lokalizacja:** `/workspace/fachowiec-app/src/components/MainLayout.jsx`

**Opis:** Komponent layoutu zapewniający główną strukturę strony z nawigacją dolną i obszarem na zawartość.

**Props:**
- Brak (używa `<Outlet />` z React Router)

**Zwracany JSX:**
```jsx
<Box>
  <Box component="main">
    <Outlet /> {/* Zawartość stron */}
  </Box>
  <Paper>
    <BottomNavigationBar />
  </Paper>
</Box>
```

**Przykład użycia:**
```jsx
import MainLayout from './components/MainLayout';

// Używany wewnątrz ProtectedRoute
<Routes>
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<DashboardPage />} />
    {/* MainLayout renderuje się automatycznie */}
  </Route>
</Routes>
```

**Styling:**
- Główny kontener: `display: flex`, `flexDirection: column`, `minHeight: 100vh`
- Obszar główny: `flexGrow: 1`, `paddingBottom: 7` (aby nie zasłaniać nawigacji)
- Nawigacja: `position: fixed`, `bottom: 0`, `left: 0`, `right: 0`

**Zależności:**
- `@mui/material` (Box, Paper)
- `react-router-dom` (Outlet)
- `BottomNavigationBar` (komponent lokalny)

---

### `BottomNavigationBar`

**Lokalizacja:** `/workspace/fachowiec-app/src/components/BottomNavigationBar.jsx`

**Opis:** Dolna nawigacja mobilna z ikonami i etykietami dla głównych sekcji aplikacji.

**Props:**
- Brak

**Stan:**
- `value` (Number) - Indeks aktualnie wybranej zakładki

**Elementy nawigacji:**
```javascript
[
  { path: '/', label: 'Panel', icon: <Dashboard /> },
  { path: '/jobs', label: 'Zlecenia', icon: <ListAlt /> },
  { path: '/clients', label: 'Klienci', icon: <Group /> },
  { path: '/calendar', label: 'Kalendarz', icon: <CalendarMonth /> }
]
```

**Metody:**
- `getInitialValue()` - Określa początkową wartość na podstawie aktualnej ścieżki
- `handleChange(event, newValue)` - Obsługuje zmianę zakładki i nawigację

**Przykład użycia:**
```jsx
import BottomNavigationBar from './components/BottomNavigationBar';

// Używany wewnątrz MainLayout
<BottomNavigationBar />
```

**Zachowanie:**
- Automatycznie synchronizuje się z aktualną ścieżką URL
- Po kliknięciu zakładki nawiguje do odpowiedniej strony
- Wyświetla etykiety pod ikonami (`showLabels`)

**Zależności:**
- `@mui/material` (BottomNavigation, BottomNavigationAction)
- `@mui/icons-material` (Dashboard, ListAlt, Group, CalendarMonth)
- `react-router-dom` (useNavigate, useLocation)

---

## Fachowiec App - Context API

### `AuthContext`

**Lokalizacja:** `/workspace/fachowiec-app/src/context/AuthContext.jsx`

**Opis:** Context React do zarządzania stanem autentykacji użytkownika.

### `AuthProvider`

Komponent Provider udostępniający kontekst autentykacji.

**Props:**
- `children` (ReactNode) - Komponenty potomne

**Stan:**
- `user` (String | null) - Token użytkownika z localStorage lub null

**Metody w kontekście:**
- `login(token)` - Loguje użytkownika
- `logout()` - Wylogowuje użytkownika

**Przykład użycia:**
```jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
```

---

### `useAuth()`

Hook do uzyskiwania dostępu do kontekstu autentykacji.

**Zwraca:**
- `Object` z właściwościami:
  - `user` (String | null) - Token użytkownika lub null
  - `login(token)` (Function) - Funkcja logowania
  - `logout()` (Function) - Funkcja wylogowania

**Przykład użycia:**
```jsx
import { useAuth } from './context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = () => {
    login('user-token-123');
  };
  
  return <button onClick={handleLogin}>Zaloguj</button>;
}

function UserProfile() {
  const { user, logout } = useAuth();
  
  if (!user) {
    return <div>Nie jesteś zalogowany</div>;
  }
  
  return (
    <div>
      <p>Zalogowany jako: {user}</p>
      <button onClick={logout}>Wyloguj</button>
    </div>
  );
}
```

**Uwagi:**
- Token jest przechowywany w `localStorage` pod kluczem `userToken`
- Jeśli hook jest używany poza `AuthProvider`, zwróci `null`

---

## Fachowiec App - Strony

### `DashboardPage`

**Lokalizacja:** `/workspace/fachowiec-app/src/pages/DashboardPage.jsx`

**Opis:** Strona główna aplikacji wyświetlająca przegląd statystyk, przychodów i ostatniej aktywności.

**Props:**
- Brak

**Stan:**
- `tabValue` (Number) - Indeks aktualnie wybranej zakładki (0: Nadchodzące, 1: Ostatnie)

**Dane statyczne:**
- `summaryData` - Tablica z danymi podsumowującymi (aktywne zlecenia, zakończone)
- `revenueData` - Dane przychodu w bieżącym miesiącu
- `recentActivities` - Lista ostatnich aktywności

**Metody:**
- `handleTabChange(event, newValue)` - Obsługuje zmianę zakładki

**Przykład użycia:**
```jsx
import DashboardPage from './pages/DashboardPage';

<Route path="/" element={<DashboardPage />} />
```

**Struktura wizualna:**
```
┌─────────────────────────────────┐
│ [Ikona] Firma XYZ    [Avatar]  │
├─────────────────────────────────┤
│ Dzień dobry, Jan!               │
├─────────────────────────────────┤
│ Twój przegląd                  │
│ ┌──────────┐ ┌──────────┐     │
│ │ Aktywne  │ │Zakończone│     │
│ │   8      │ │   12     │     │
│ └──────────┘ └──────────┘     │
│ ┌──────────────────────────┐   │
│ │ Przychód w tym m-cu      │   │
│ │ 15,230 zł (+10%)        │   │
│ └──────────────────────────┘   │
├─────────────────────────────────┤
│ [Dodaj zlecenie] [Dodaj klienta]│
├─────────────────────────────────┤
│ Ostatnia aktywność             │
│ [Nadchodzące] [Ostatnie]        │
│ • Instalacja oświetlenia        │
│ • Naprawa kranu                 │
│ • Malowanie pokoju              │
└─────────────────────────────────┘
```

**Zależności:**
- `@mui/material` (komponenty UI)
- `@mui/icons-material` (ikony)

---

### `ClientListPage`

**Lokalizacja:** `/workspace/fachowiec-app/src/pages/ClientListPage.jsx`

**Opis:** Strona wyświetlająca listę klientów z możliwością wyszukiwania.

**Props:**
- Brak

**Stan:**
- `searchTerm` (String) - Termin wyszukiwania

**Dane:**
- Importuje `mockClients` z `../data/mockClients`

**Funkcje pomocnicze:**
- `getStatusColor(status)` - Zwraca kolor dla statusu klienta
  - `'active'` → `'success.main'`
  - `'pending'` → `'warning.main'`
  - `'problem'` → `'error.main'`
  - domyślnie → `'grey.500'`

**Filtrowanie:**
- Filtruje klientów po nazwie lub kontakcie (case-insensitive)

**Przykład użycia:**
```jsx
import ClientListPage from './pages/ClientListPage';

<Route path="/clients" element={<ClientListPage />} />
```

**Struktura wizualna:**
```
┌─────────────────────────────────┐
│ [Ikona] Klienci  [Szukaj] [Sort]│
├─────────────────────────────────┤
│ [🔍] Szukaj po nazwie, firmie...│
├─────────────────────────────────┤
│ [Avatar] Kowalski Jan           │
│          +48 123 456 789  [•] → │
│                                 │
│ [Avatar] Nowak Budownictwo      │
│          nowak-bud@example.com  │
│                         [•] →   │
└─────────────────────────────────┘
```

**Zależności:**
- `@mui/material` (komponenty UI)
- `@mui/icons-material` (ikony)
- `mockClients` (dane)

---

### `LoginPage`

**Lokalizacja:** `/workspace/fachowiec-app/src/pages/LoginPage.jsx`

**Opis:** Strona logowania z formularzem email/hasło.

**Props:**
- Brak

**Stan:**
- `showPassword` (Boolean) - Czy pokazać hasło w polu tekstowym

**Metody:**
- `handleClickShowPassword()` - Przełącza widoczność hasła
- `handleMouseDownPassword(event)` - Zapobiega domyślnemu zachowaniu przycisku
- `handleSubmit(event)` - Obsługuje logowanie (mock authentication)

**Przykład użycia:**
```jsx
import LoginPage from './pages/LoginPage';

<Route path="/login" element={<LoginPage />} />
```

**Funkcjonalność:**
- Po zalogowaniu ustawia mock token i przekierowuje na `/`
- Używa `useAuth()` hook do wywołania `login()`
- Formularz zawiera:
  - Pole email/nazwa użytkownika
  - Pole hasła z przyciskiem pokaż/ukryj
  - Checkbox "Zapamiętaj mnie"
  - Link "Nie pamiętasz hasła?"
  - Przycisk "Zaloguj się"
  - Link "Utwórz konto"

**Struktura wizualna:**
```
┌─────────────────────────────────┐
│         [Ikona budowy]          │
│      Witaj ponownie!            │
│  Zaloguj się, aby kontynuować  │
├─────────────────────────────────┤
│ [👤] Email lub nazwa użytkownika│
│                                 │
│ [🔒] Hasło          [👁]        │
│                                 │
│ ☑ Zapamiętaj mnie  Nie pamiętasz?│
│                                 │
│     [Zaloguj się]               │
│                                 │
│ Nie masz konta? Utwórz konto   │
└─────────────────────────────────┘
```

**Uwagi:**
- Obecnie używa mock authentication (token: `'12345-abcde'`)
- W rzeczywistej aplikacji należy zintegrować z API autentykacji

**Zależności:**
- `@mui/material` (komponenty UI)
- `@mui/icons-material` (ikony)
- `react-router-dom` (useNavigate)
- `useAuth` (hook z kontekstu)

---

## Fachowiec App - Routing

### `AppRouter`

**Lokalizacja:** `/workspace/fachowiec-app/src/routes/index.jsx`

**Opis:** Główny router aplikacji definiujący wszystkie ścieżki.

**Props:**
- Brak

**Struktura routingu:**
```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/clients" element={<ClientListPage />} />
    <Route path="/jobs" element={<JobsPage />} />
    <Route path="/calendar" element={<CalendarPage />} />
  </Route>
</Routes>
```

**Ścieżki publiczne:**
- `/login` - Strona logowania

**Ścieżki chronione:**
- `/` - Dashboard (strona główna)
- `/clients` - Lista klientów
- `/jobs` - Zlecenia (placeholder)
- `/calendar` - Kalendarz (placeholder)

**Przykład użycia:**
```jsx
import AppRouter from './routes';

function App() {
  return <AppRouter />;
}
```

**Uwagi:**
- Placeholder komponenty (`JobsPage`, `CalendarPage`) zwracają prosty `<div>`
- Wszystkie ścieżki poza `/login` są chronione przez `ProtectedRoute`

**Zależności:**
- `react-router-dom` (Routes, Route)
- Komponenty stron (LoginPage, DashboardPage, ClientListPage)
- ProtectedRoute

---

### `ProtectedRoute`

**Lokalizacja:** `/workspace/fachowiec-app/src/routes/ProtectedRoute.jsx`

**Opis:** Komponent HOC chroniący ścieżki wymagające autentykacji.

**Props:**
- Brak (używa `<Outlet />` z React Router)

**Logika:**
- Sprawdza czy użytkownik jest zalogowany (`user` z `useAuth()`)
- Jeśli nie jest zalogowany → przekierowuje na `/login`
- Jeśli jest zalogowany → renderuje `MainLayout` z `<Outlet />`

**Przykład użycia:**
```jsx
// W AppRouter
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<DashboardPage />} />
</Route>
```

**Zachowanie:**
```javascript
if (!user) {
  return <Navigate to="/login" replace />;
}
return <MainLayout />; // <Outlet /> jest wewnątrz MainLayout
```

**Zależności:**
- `react-router-dom` (Navigate, Outlet)
- `useAuth` (hook z kontekstu)
- `MainLayout` (komponent)

---

## Fachowiec App - Temat

### `theme`

**Lokalizacja:** `/workspace/fachowiec-app/src/theme/theme.js`

**Opis:** Konfiguracja tematu Material-UI dla aplikacji.

**Eksport:**
- `default` - Obiekt tematu Material-UI

**Paleta kolorów:**
```javascript
{
  mode: 'dark',
  primary: {
    main: '#1173d4'
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E'
  },
  text: {
    primary: '#ffffff',
    secondary: '#b3b3b3'
  }
}
```

**Typografia:**
```javascript
{
  fontFamily: 'Inter, sans-serif',
  h1: { fontSize: '2rem', fontWeight: 700 },
  h2: { fontSize: '1.75rem', fontWeight: 700 },
  h3: { fontSize: '1.5rem', fontWeight: 700 },
  body1: { fontSize: '1rem' },
  button: { textTransform: 'none' }
}
```

**Komponenty:**
- `MuiButton`: `borderRadius: 8`
- `MuiCard`: `borderRadius: 12`

**Przykład użycia:**
```jsx
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  );
}
```

**Uwagi:**
- Domyślny motyw to tryb ciemny (`mode: 'dark'`)
- Czcionka: Inter (należy zaimportować w CSS)

---

## Fachowiec App - Dane

### `mockClients`

**Lokalizacja:** `/workspace/fachowiec-app/src/data/mockClients.js`

**Opis:** Tablica mockowych danych klientów do celów deweloperskich.

**Eksport:**
- `default` - Tablica obiektów klientów

**Struktura obiektu klienta:**
```typescript
interface Client {
  id: number;
  name: string;
  contact: string;
  avatarUrl?: string;      // Opcjonalny URL do awatara
  initials?: string;       // Opcjonalne inicjały (jeśli brak avatarUrl)
  status: 'active' | 'pending' | 'problem';
}
```

**Przykład użycia:**
```javascript
import mockClients from './data/mockClients';

// Wyświetlenie wszystkich klientów
mockClients.forEach(client => {
  console.log(`${client.name} - ${client.contact} (${client.status})`);
});

// Filtrowanie aktywnych klientów
const activeClients = mockClients.filter(c => c.status === 'active');

// Znajdowanie klienta po ID
const client = mockClients.find(c => c.id === 1);
```

**Dostępne dane:**
1. **Kowalski Jan**
   - ID: 1
   - Kontakt: +48 123 456 789
   - Status: active
   - Ma avatarUrl

2. **Nowak Budownictwo**
   - ID: 2
   - Kontakt: nowak-bud@example.com
   - Status: pending
   - Ma initials: 'NB'

3. **Anna Zielińska**
   - ID: 3
   - Kontakt: +48 987 654 321
   - Status: active
   - Ma avatarUrl

4. **Tech Corp**
   - ID: 4
   - Kontakt: kontakt@techcorp.pl
   - Status: problem
   - Ma initials: 'TC'

**Uwagi:**
- To są dane mockowe do celów deweloperskich
- W produkcji należy zastąpić danymi z API

---

## Przykłady integracji

### Kompletny przykład użycia Store API

```javascript
import { saveJob, getAllJobs } from './data/jobStore';

// Przykład komponentu React używającego Store API
function JobsManager() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pobieranie zleceń przy montowaniu
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const allJobs = await getAllJobs();
      setJobs(allJobs);
    } catch (error) {
      console.error('Błąd pobierania zleceń:', error);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (description) => {
    try {
      const jobId = await saveJob({
        description,
        status: 'Lokalny',
        createdAt: new Date().toISOString()
      });
      await loadJobs(); // Odświeżenie listy
      return jobId;
    } catch (error) {
      console.error('Błąd zapisywania zlecenia:', error);
      throw error;
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const allJobs = await getAllJobs();
      const job = allJobs.find(j => j.id === jobId);
      if (job) {
        await saveJob({ ...job, status: newStatus });
        await loadJobs();
      }
    } catch (error) {
      console.error('Błąd aktualizacji zlecenia:', error);
    }
  };

  if (loading) return <div>Ładowanie...</div>;

  return (
    <div>
      <button onClick={() => addJob('Nowe zlecenie')}>
        Dodaj zlecenie
      </button>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            {job.description} - {job.status}
            <button onClick={() => updateJobStatus(job.id, 'Zakończone')}>
              Zakończ
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Przykład użycia AuthContext

```javascript
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Komponent wyższego rzędu
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

// Komponent korzystający z autentykacji
function UserMenu() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return (
      <button onClick={() => login('demo-token')}>
        Zaloguj się
      </button>
    );
  }

  return (
    <div>
      <span>Zalogowany: {user}</span>
      <button onClick={logout}>Wyloguj</button>
    </div>
  );
}
```

### Przykład tworzenia nowej strony

```javascript
import { Container, Typography, Box } from '@mui/material';
import MainLayout from '../components/MainLayout';

function NewPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1">
          Nowa Strona
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Treść nowej strony...
        </Typography>
      </Box>
    </Container>
  );
}

export default NewPage;

// Dodanie do routingu w routes/index.jsx
import NewPage from '../pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

---

## Słownik pojęć

- **PWA** - Progressive Web App, aplikacja internetowa z funkcjonalnościami aplikacji natywnej
- **IndexedDB** - NoSQL baza danych w przeglądarce do przechowywania dużych ilości danych
- **localforage** - Biblioteka JavaScript upraszczająca pracę z IndexedDB, localStorage i WebSQL
- **Material-UI (MUI)** - Biblioteka komponentów React oparta na Material Design
- **React Router** - Biblioteka routingu dla aplikacji React
- **Context API** - Mechanizm React do zarządzania globalnym stanem
- **Protected Route** - Ścieżka wymagająca autentykacji użytkownika

---

## Zależności i narzędzia

### PWA Fachowiec Dependencies

**Runtime:**
- `react`: ^19.1.1 - Biblioteka React
- `react-dom`: ^19.1.1 - React DOM renderer
- `localforage`: ^1.10.0 - Biblioteka do zarządzania IndexedDB

**Development:**
- `vite`: ^7.1.12 - Build tool i dev server
- `@vitejs/plugin-react`: ^5.0.4 - Plugin React dla Vite
- `vite-plugin-pwa`: ^1.1.0 - Plugin PWA dla Vite
- `eslint`: ^9.36.0 - Linter kodu
- `typescript` types dla React

**Skrypty:**
```bash
npm run dev      # Uruchamia serwer deweloperski
npm run build    # Buduje aplikację produkcyjną
npm run lint     # Uruchamia ESLint
npm run preview  # Podgląd zbudowanej aplikacji
```

### Fachowiec App Dependencies

**Runtime:**
- `react`: ^19.1.1 - Biblioteka React
- `react-dom`: ^19.1.1 - React DOM renderer
- `react-router-dom`: ^7.9.5 - Routing dla React
- `@mui/material`: ^7.3.4 - Material-UI komponenty
- `@mui/icons-material`: ^7.3.4 - Ikony Material-UI
- `@emotion/react`: ^11.14.0 - CSS-in-JS dla MUI
- `@emotion/styled`: ^11.14.1 - Styled components dla MUI

**Development:**
- `vite`: ^7.1.7 - Build tool i dev server
- `@vitejs/plugin-react`: ^5.0.4 - Plugin React dla Vite
- `eslint`: ^9.36.0 - Linter kodu
- `typescript` types dla React

**Skrypty:**
```bash
npm run dev      # Uruchamia serwer deweloperski
npm run build    # Buduje aplikację produkcyjną
npm run lint     # Uruchamia ESLint
npm run preview  # Podgląd zbudowanej aplikacji
```

---

## Konfiguracja PWA

### Manifest PWA (vite.config.js)

**Nazwa aplikacji:** PWA Fachowiec
**Krótka nazwa:** Fachowiec
**Kolor motywu:** #ffffff
**Ikony:**
- 192x192px: `pwa-192x192.png`
- 512x512px: `pwa-512x512.png`

**Funkcjonalności:**
- Auto-update: Włączone
- Dev mode: Włączony w trybie deweloperskim
- Assets: favicon.ico, apple-touch-icon.png, mask-icon.svg

---

## Wersjonowanie

- **PWA Fachowiec**: v0.0.0
- **Fachowiec App**: v0.0.0

---

## Rozszerzanie funkcjonalności

### Dodawanie nowych funkcji do jobStore

```javascript
// Przykład: Dodanie funkcji usuwania zlecenia
export async function deleteJob(jobId) {
  await jobStore.removeItem(jobId);
}

// Przykład: Pobieranie zlecenia po ID
export async function getJobById(jobId) {
  return await jobStore.getItem(jobId);
}

// Przykład: Aktualizacja zlecenia
export async function updateJob(jobId, updates) {
  const existingJob = await jobStore.getItem(jobId);
  if (existingJob) {
    await jobStore.setItem(jobId, { ...existingJob, ...updates });
  }
}
```

### Dodawanie nowych endpointów do serwera

```javascript
// W server/index.js
app.post('/api/jobs', async (req, res) => {
  // Logika dodawania zlecenia
  res.json({ success: true, jobId: '123' });
});

app.get('/api/jobs', async (req, res) => {
  // Logika pobierania zleceń
  res.json({ jobs: [] });
});

app.put('/api/jobs/:id', async (req, res) => {
  // Logika aktualizacji zlecenia
  res.json({ success: true });
});

app.delete('/api/jobs/:id', async (req, res) => {
  // Logika usuwania zlecenia
  res.json({ success: true });
});
```

### Tworzenie nowych komponentów Material-UI

```javascript
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function CustomCard({ title, content, onAction }) {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      borderRadius: theme.components?.MuiCard?.styleOverrides?.root?.borderRadius || 12 
    }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">{content}</Typography>
        {onAction && (
          <Button onClick={onAction} variant="contained" sx={{ mt: 2 }}>
            Akcja
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## Najlepsze praktyki

### Używanie Store API

1. **Zawsze używaj async/await** z funkcjami Store API
2. **Obsługuj błędy** przy operacjach na danych
3. **Odświeżaj stan** po modyfikacjach danych
4. **Unikaj bezpośredniego dostępu** do IndexedDB - używaj funkcji z jobStore

```javascript
// ✅ DOBRZE
try {
  const jobId = await saveJob(jobData);
  await loadJobs(); // Odświeżenie listy
} catch (error) {
  console.error('Błąd:', error);
  // Obsługa błędu dla użytkownika
}

// ❌ ŹLE
saveJob(jobData).then(id => {
  // Nieodświeżona lista
});
```

### Używanie Context API

1. **Używaj hooka useAuth** zamiast bezpośredniego dostępu do kontekstu
2. **Sprawdzaj user** przed renderowaniem chronionych komponentów
3. **Nie mutuj stanu** bezpośrednio - używaj funkcji z kontekstu

```javascript
// ✅ DOBRZE
const { user, login, logout } = useAuth();
if (!user) return <Navigate to="/login" />;

// ❌ ŹLE
const context = useContext(AuthContext);
if (!context.user) return <Navigate to="/login" />;
```

### Routing

1. **Zawsze używaj ProtectedRoute** dla chronionych ścieżek
2. **Używaj useNavigate** zamiast `<Link>` dla programowej nawigacji
3. **Nie duplikuj logiki** autentykacji - używaj ProtectedRoute

```javascript
// ✅ DOBRZE
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>

// ❌ ŹLE
<Route path="/dashboard" element={
  user ? <DashboardPage /> : <Navigate to="/login" />
} />
```

---

## Rozwiązywanie problemów

### Problem: Store API nie działa

**Rozwiązanie:**
- Sprawdź czy `localforage` jest zainstalowane: `npm list localforage`
- Sprawdź konsolę przeglądarki pod kątem błędów IndexedDB
- Upewnij się, że używasz async/await

### Problem: Context nie działa

**Rozwiązanie:**
- Upewnij się, że komponent jest wewnątrz `<AuthProvider>`
- Sprawdź czy używasz `useAuth()` zamiast bezpośredniego `useContext(AuthContext)`
- Sprawdź czy komponent nie jest renderowany przed inicjalizacją Providera

### Problem: Routing nie działa

**Rozwiązanie:**
- Upewnij się, że aplikacja jest opakowana w `<BrowserRouter>`
- Sprawdź czy wszystkie ścieżki są poprawnie zdefiniowane
- Sprawdź konsolę przeglądarki pod kątem błędów routingu

### Problem: Material-UI nie renderuje się poprawnie

**Rozwiązanie:**
- Upewnij się, że aplikacja jest opakowana w `<ThemeProvider>`
- Sprawdź czy wszystkie zależności MUI są zainstalowane
- Sprawdź czy Emotion jest poprawnie skonfigurowany

---

## Kontakt i wsparcie

Dokumentacja wygenerowana automatycznie na podstawie analizy kodu źródłowego aplikacji Fachowiec PWA.

**Projekty:**
- PWA Fachowiec: `/workspace/pwa-fachowiec`
- Fachowiec App: `/workspace/fachowiec-app`

---

## Licencja

Informacje o licencji znajdują się w plikach LICENSE w odpowiednich projektach.
