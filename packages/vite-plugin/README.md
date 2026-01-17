# @bromscandium/vite-plugin

Vite plugin for BromiumJS with file-based routing and HMR support.

## Installation

```bash
npm install @bromscandium/vite-plugin -D
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import bromium from '@bromscandium/vite-plugin';

export default defineConfig({
  plugins: [
    bromium({
      pagesDir: 'src/pages',
      routesOutput: 'src/routes.generated.ts',
      generateTypes: true,
    })
  ],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'bromium'
  }
});
```

## File-based Routing

```
src/pages/
├── page.tsx              → /
├── about.tsx             → /about
├── users/
│   ├── page.tsx          → /users
│   ├── [id].tsx          → /users/:id
│   └── [id]/
│       └── settings.tsx  → /users/:id/settings
├── posts/
│   └── [...slug].tsx     → /posts/:slug* (catch-all)
└── (auth)/               → Route group (no URL segment)
    ├── login.tsx         → /login
    └── register.tsx      → /register
```

| Pattern | Example | Description |
|---------|---------|-------------|
| `page.tsx` | `/` | Index route |
| `about.tsx` | `/about` | Static route |
| `[id].tsx` | `/users/:id` | Dynamic segment |
| `[...slug].tsx` | `/posts/:slug*` | Catch-all route |
| `(folder)/` | - | Route group |
| `layout.tsx` | - | Layout component |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `pagesDir` | `'src/pages'` | Pages directory |
| `routesOutput` | `'src/routes.generated.ts'` | Output file |
| `base` | `''` | Base path for routes |
| `generateTypes` | `true` | Generate TypeScript types |

## License

MIT
