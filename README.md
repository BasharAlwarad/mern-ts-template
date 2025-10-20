# mern-ts-template

> **📚 Teaching Material**: This repository is designed as educational content to teach MERN full-stack project layout and architecture.

A professional full-stack MERN starter by Bashar AlWarad — built with TypeScript, Express, MongoDB, JWT auth, React, Tailwind CSS, and DaisyUI for rapid, scalable web development.

---

## Table of Contents

- [Backend Setup (Express + TypeScript)](#backend-setup-express--typescript)
  - [1. Initialize Server Project](#1-initialize-server-project)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure TypeScript](#3-configure-typescript)
  - [4. Setup Module System & Path Aliases](#4-setup-module-system--path-aliases)
  - [5. Configure Development Environment](#5-configure-development-environment)
  - [6. Create Server Entry Point](#6-create-server-entry-point)
  - [7. Setup MongoDB Connection](#7-setup-mongodb-connection)
  - [8. Configure Environment Variables](#8-configure-environment-variables)
  - [9. Run the Server](#9-run-the-server)

---

## Backend Setup (Express + TypeScript)

### 1. Initialize Server Project

Create the server directory and initialize npm:

```bash
mkdir server
cd server
npm init -y
```

**Create folder structure:**

```bash
mkdir -p src/db src/routes src/controllers src/models src/middlewares src/schemas src/utils src/types
```

**Your structure should look like:**

```
server/
├── src/
│   ├── db/           # Database connection logic
│   ├── routes/       # API route definitions
│   ├── controllers/  # Route handlers (business logic)
│   ├── models/       # Mongoose models
│   ├── middlewares/  # Custom middleware functions
│   ├── schemas/      # Validation schemas
│   ├── utils/        # Helper functions
│   ├── types/        # TypeScript type definitions
│   └── index.ts      # Server entry point
└── package.json
```

---

### 2. Install Dependencies

Install production dependencies:

```bash
npm install express cors dotenv mongoose
```

Install development dependencies:

```bash
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon cross-env tsx
```

**Dependency explanation:**

| Package      | Purpose                                         |
| ------------ | ----------------------------------------------- |
| `express`    | Web framework for Node.js                       |
| `cors`       | Enable Cross-Origin Resource Sharing            |
| `dotenv`     | Load environment variables from .env files      |
| `mongoose`   | MongoDB object modeling tool                    |
| `typescript` | TypeScript compiler                             |
| `@types/*`   | Type definitions for TypeScript                 |
| `ts-node`    | TypeScript execution for Node.js                |
| `tsx`        | Fast TypeScript runner (alternative to ts-node) |
| `nodemon`    | Auto-restart server on file changes             |
| `cross-env`  | Set environment variables across platforms      |

---

### 3. Configure TypeScript

Create `tsconfig.json` in the `server` directory:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "baseUrl": "./src",
    "paths": {
      "#controllers": ["./controllers/index.ts"],
      "#db": ["./db/index.ts"],
      "#middlewares": ["./middlewares/index.ts"],
      "#models": ["./models/index.ts"],
      "#routes": ["./routes/index.ts"],
      "#schemas": ["./schemas/index.ts"],
      "#utils": ["./utils/index.ts"],
      "#types": ["./types/index.ts"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key settings:**

- `baseUrl` and `paths`: Enable clean import aliases (e.g., `import { User } from '#models'`)
- `strict`: Enable all strict type-checking options
- `outDir`: Compiled JavaScript output directory
- `sourceMap`: Generate source maps for debugging

---

### 4. Setup Module System & Path Aliases

Update `package.json` to use ES modules and configure import aliases:

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "MERN TypeScript Express Server",
  "main": "dist/index.js",
  "type": "module",
  "imports": {
    "#controllers": "./src/controllers/index.ts",
    "#db": "./src/db/index.ts",
    "#middlewares": "./src/middlewares/index.ts",
    "#models": "./src/models/index.ts",
    "#routes": "./src/routes/index.ts",
    "#schemas": "./src/schemas/index.ts",
    "#utils": "./src/utils/index.ts",
    "#types": "./src/types/index.ts"
  },
  "scripts": {
    "dev": "cross-env NODE_ENV=development nodemon --watch src --ext ts --exec \"tsx --env-file=.env.development.local ./src/index.ts\"",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rm -rf dist"
  }
}
```

**Why use path aliases?**

- ✅ Clean imports: `import { User } from '#models'` instead of `'../../models/User'`
- ✅ Easier refactoring and file movement
- ✅ Better code organization

---

### 5. Configure Development Environment

Create `.env.development.local` for local development:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-ts-template
JWT_SECRET=your-secret-key-change-this-in-production
CLIENT_URL=http://localhost:5173
```

Create `.gitignore`:

```
node_modules
dist
.env
.env.development.local
.env.production.local
*.log
.DS_Store
```

**Environment file hierarchy:**

- `.env.development.local` - Local development settings (not committed)
- `.env` - Default/shared settings (can be committed)
- `.env.production.local` - Production settings (not committed)

---

### 6. Create Server Entry Point

Create `src/index.ts`:

```typescript
import express, { Express, Request, Response } from 'express';
import { mongoDBConnect } from '#db';
import cors from 'cors';

const app: Express = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware - CORS configuration
app.use(
  cors({
    origin: isProduction
      ? process.env.CLIENT_URL || 'http://localhost:5173'
      : true, // Allow all origins in development
    credentials: true,
  })
);

// Connect to MongoDB
mongoDBConnect();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'MERN TypeScript API Server' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 catch-all route - must be last
app.use(/.*/, (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

export default app;
```

---

### 7. Setup MongoDB Connection

Create `src/db/mongoDB.ts`:

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const mongoDBConnect = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('🟢🟢🟢 Connected to MongoDB 🤖 with Mongoose');
  } catch (error) {
    console.error('❌❌❌ Database connection error:', error);
    process.exit(1);
  }
};
```

Create `src/db/index.ts`:

```typescript
export * from './mongoDB';
```

**Now you can import anywhere with:**

```typescript
import { mongoDBConnect } from '#db';
```

---

### 8. Configure Environment Variables

**Option A: Local MongoDB (requires MongoDB installed)**

```env
MONGODB_URI=mongodb://localhost:27017/mern-ts-template
```

**Option B: MongoDB Atlas (Recommended - Free Cloud Database)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `.env.development.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern-ts-template?retryWrites=true&w=majority
```

**Important:** For MongoDB Atlas:

- Whitelist your IP address in Network Access
- Or allow access from anywhere (0.0.0.0/0) for development

---

### 9. Run the Server

Start the development server:

```bash
npm run dev
```

**You should see:**

```
⚡️[server]: Server is running at http://localhost:3000
🟢🟢🟢 Connected to MongoDB 🤖 with Mongoose
```

**Test the endpoints:**

```bash
# Basic route
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health
```

**Available scripts:**

```bash
npm run dev     # Development server with hot reload
npm run build   # Compile TypeScript to JavaScript
npm start       # Run production build
npm run clean   # Remove dist folder
```

---

## Next Steps (Coming Soon)

- Create Mongoose models (User, etc.)
- Build REST API routes
- Add JWT authentication
- Create controllers for business logic
- Add validation middleware
- Error handling
- API documentation

---

## Connect with Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Bashar%20AlWarad-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bashar-alwarad-2a960b1b6/)
