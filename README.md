# mern-ts-template

> **📚 Teaching Material**: This repository is designed as educational content to teach MERN full-stack project layout and architecture.

A professional full-stack MERN starter by Bashar AlWarad — built with TypeScript, Express, MongoDB, JWT auth, React, Tailwind CSS, and DaisyUI for rapid, scalable web development.

---

## Table of Contents

- [Frontend Setup](#frontend-setup)
  - [1. Initialize Vite + React + TypeScript](#1-initialize-vite--react--typescript)
  - [2. Install Tailwind CSS & DaisyUI](#2-install-tailwind-css--daisyui)
  - [3. Configure Project Structure](#3-configure-project-structure)
  - [4. Setup Path Aliases](#4-setup-path-aliases)
  - [5. Configure Routing](#5-configure-routing)
  - [6. Setup HTTP Client (Axios)](#6-setup-http-client-axios)
  - [7. Implement Auth Context](#7-implement-auth-context)

---

## Frontend Setup

### 1. Initialize Vite + React + TypeScript

Create and initialize the client application:

```bash
# Create client directory
mkdir client
cd client

# Initialize Vite with React TypeScript template
npm create vite@latest . -- --template react-ts

# Remove accidentally created git repo (if any)
rm -rf .git
```

**Clean up the boilerplate:**

- Remove default Vite assets and example components
- Clean up `App.tsx` and `main.tsx`
- Remove unnecessary imports and styles

---

### 2. Install Tailwind CSS & DaisyUI

Install styling dependencies:

```bash
npm install -D tailwindcss@latest @tailwindcss/vite@latest daisyui@latest
```

**Configure Vite** (`vite.config.ts`):

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
```

**Update styles** (`src/index.css`):

```css
@import 'tailwindcss';
@plugin "daisyui";
```

**Configure themes** (optional):

- [DaisyUI Themes Documentation](https://daisyui.com/docs/themes/?lang=en)
- Set theme in `index.html`: `<html lang="en" data-theme="light">`

**Resources:**

- [Tailwind CSS + Vite](https://tailwindcss.com/docs/installation/using-vite)
- [DaisyUI + Vite](https://daisyui.com/docs/install/vite/?lang=en)

---

### 3. Configure Project Structure

Create organized folder structure:

```bash
cd src
mkdir Pages Components Contexts Utils
```

**Create initial files:**

| Folder        | Files                                  |
| ------------- | -------------------------------------- |
| `Pages/`      | `Home.tsx`, `Signup.tsx`               |
| `Components/` | `Nav.tsx`, `Footer.tsx`                |
| `Contexts/`   | `AuthContext.tsx`, `useAuthContext.ts` |
| `Utils/`      | `api.ts`, `config.ts`                  |

---

### 4. Setup Path Aliases

Install the TypeScript path resolver:

```bash
npm install -D vite-tsconfig-paths
```

**Update `vite.config.ts`** (already shown above with `tsconfigPaths()` plugin).

**Add to `tsconfig.app.json`** (inside `compilerOptions`):

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["Components/*"],
      "@pages/*": ["Pages/*"],
      "@utils/*": ["Utils/*"],
      "@contexts/*": ["Contexts/*"]
    }
  }
}
```

**Usage example:**

```typescript
import Nav from '@components/Nav';
import Home from '@pages/Home';
import { useAuthContext } from '@contexts/useAuthContext';
```

---

### 5. Configure Routing

Install React Router:

```bash
npm install react-router-dom
```

**Setup routing in `App.tsx`:**

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from '@components/Nav';
import Footer from '@components/Footer';
import Home from '@pages/Home';
import Signup from '@pages/Signup';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
```

**Component Resources:**

- [DaisyUI Navbar Components](https://daisyui.com/components/navbar/)

---

### 6. Setup HTTP Client (Axios)

Install Axios:

```bash
npm install axios
```

**Create environment configuration** (`.env`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Create config utility** (`src/Utils/config.ts`):

```typescript
export const API_CONFIG = {
  MAIN_SERVICE: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
};
```

**Create Axios instance** (`src/Utils/api.ts`):

```typescript
import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.MAIN_SERVICE,
  withCredentials: true,
});

export default api;
```

**Usage example:**

```typescript
import api from '@utils/api';

const { data } = await api.get('/users');
```

---

### 7. Implement Auth Context

**Create context provider** (`src/Contexts/AuthContext.tsx`):

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from 'react';

// Teaching material: using any for simplicity
const UserContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = (userData: any) => {
    setLoading(true);
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const value: any = { user, setUser, loading, login, logout };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext };
```

**Create custom hook** (`src/Contexts/useAuthContext.ts`):

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { UserContext } from './AuthContext';

export const useAuthContext = (): any => useContext(UserContext);
```

**Wrap app with provider** (`src/main.tsx`):

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@contexts/AuthContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
```

**Usage in components:**

```typescript
import { useAuthContext } from '@contexts/useAuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useAuthContext();

  // Use context state and methods
  return <div>{user ? `Welcome ${user.name}` : 'Please login'}</div>;
}
```

---

> **📚 Teaching Material**: This app is designed as educational content to teach MERN full-stack project layout and architecture.

A professional full-stack MERN starter by Bashar AlWarad — built with TypeScript, Express, MongoDB, JWT auth, React, Tailwind CSS, and DaisyUI for rapid, scalable web development.

---

## Connect with Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Bashar%20AlWarad-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bashar-alwarad-2a960b1b6/)
