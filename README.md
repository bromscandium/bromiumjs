# BromiumJS

A modern JavaScript/TypeScript UI framework combining the best of Vue, React, and Next.js.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Proxy-based Reactivity** - Vue 3-inspired reactive system with `ref`, `reactive`, `computed`, and `watch`
- **JSX Support** - React-like JSX with virtual DOM and efficient diffing
- **Dual Hook Systems** - Both React-style hooks (`useState`, `useRef`, `useMemo`) and Vue-style lifecycle hooks (`onMounted`, `onUpdated`, `onUnmounted`)
- **File-based Routing** - Next.js-style automatic route generation with dynamic segments
- **Vite Integration** - First-class Vite plugin with HMR support

## Installation

```bash
npm install bromium
```

## Quick Start

```tsx
import { createApp, ref } from 'bromium';

function Counter() {
  const count = ref(0);

  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}

createApp(Counter).mount('#app');
```

## Core Concepts

### Reactivity

BromiumJS uses a Vue 3-inspired proxy-based reactivity system.

#### `ref()` - Primitive Values

```tsx
import { ref } from 'bromium';

const count = ref(0);
console.log(count.value); // 0
count.value++; // Triggers reactive updates
```

#### `reactive()` - Objects

```tsx
import { reactive } from 'bromium';

const state = reactive({
  user: { name: 'John' },
  items: []
});

state.user.name = 'Jane'; // Deeply reactive
state.items.push('item'); // Array mutations are tracked
```

#### `computed()` - Derived Values

```tsx
import { ref, computed } from 'bromium';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
console.log(fullName.value); // "John Doe"
```

#### `watch()` and `watchEffect()`

```tsx
import { ref, watch, watchEffect } from 'bromium';

const count = ref(0);

// Watch specific source
watch(
  () => count.value,
  (newVal, oldVal) => {
    console.log(`Changed from ${oldVal} to ${newVal}`);
  }
);

// Automatically track dependencies
watchEffect(() => {
  console.log(`Count is: ${count.value}`);
});
```

### Components & JSX

Components are simple functions that return JSX.

```tsx
import { Fragment, h } from 'bromium';

// JSX syntax
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Using h() function directly
function Greeting({ name }: { name: string }) {
  return h('h1', null, `Hello, ${name}!`);
}

// Fragments for multiple root elements
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}
```

### Hooks

#### React-style Hooks

```tsx
import { useState, useRef, useMemo, useCallback } from 'bromium';

function Component() {
  // State that persists across re-renders (returns a Ref)
  const count = useState(0);

  // Mutable ref that doesn't trigger re-renders
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoized computed value
  const doubled = useMemo(() => count.value * 2, [count.value]);

  // Memoized callback
  const increment = useCallback(() => {
    count.value++;
  }, []);

  return <button onClick={increment}>{doubled}</button>;
}
```

#### Vue-style Lifecycle Hooks

```tsx
import { onMounted, onUpdated, onUnmounted } from 'bromium';

function Component() {
  onMounted(() => {
    console.log('Component mounted to DOM');
  });

  onUpdated(() => {
    console.log('Component updated');
  });

  onUnmounted(() => {
    console.log('Component will unmount');
    // Cleanup subscriptions, timers, etc.
  });

  return <div>Hello</div>;
}
```

### Router

BromiumJS includes a built-in router with file-based route generation.

#### Creating a Router

```tsx
import { createRouter, RouterView, Link } from 'bromium';

// Routes are auto-generated from the pages directory
import { routes } from './routes.generated';

const router = createRouter({
  routes,
  base: '/', // Optional base path
});

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/123">User Profile</Link>
      </nav>
      <RouterView />
    </div>
  );
}
```

#### Router Hooks

```tsx
import {
  useRouter,
  useRoute,
  useParams,
  useQuery,
  useNavigate,
  useRouteMeta
} from 'bromium';

function UserProfile() {
  const router = useRouter();
  const route = useRoute();
  const params = useParams();   // ComputedRef<{ id: '123' }>
  const query = useQuery();     // ComputedRef<{ tab: 'settings' }>
  const meta = useRouteMeta();  // ComputedRef<Record<string, any>>
  const nav = useNavigate();

  const goHome = () => nav.push('/');
  const goBack = () => nav.back();

  return (
    <div>
      <p>User ID: {params.value.id}</p>
      <button onClick={goHome}>Go Home</button>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
}
```

#### Link Component

```tsx
import { Link } from 'bromium';

// Basic link
<Link to="/about">About</Link>

// With active class styling
<Link
  to="/about"
  className="nav-link"
  activeClassName="active"
  exactActiveClassName="exact-active"
>
  About
</Link>

// Replace instead of push
<Link to="/login" replace>Login</Link>

// External link (opens normally)
<Link to="https://example.com" target="_blank" rel="noopener">
  External
</Link>
```

#### Router Components

```tsx
import { RouterView, Navigate, Redirect } from 'bromium';

// Render current route
<RouterView />

// Nested routes with depth
<RouterView depth={1} />

// Programmatic navigation component
<Navigate to="/login" />

// Redirect component (uses replace by default)
<Redirect to="/dashboard" />
```

## Vite Configuration

### Basic Setup

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import bromium from '@bromium/vite-plugin';

export default defineConfig({
  plugins: [
    bromium({
      pagesDir: 'src/pages',                   // Default: 'src/pages'
      routesOutput: 'src/routes.generated.ts', // Default
      base: '',                                // Base path for routes
      generateTypes: true,                     // Generate TypeScript types
    })
  ],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'bromium'
  }
});
```

### File-based Routing Conventions

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
├── (auth)/               → Route group (no URL segment)
│   ├── layout.tsx        → Layout for auth pages
│   ├── login.tsx         → /login
│   └── register.tsx      → /register
└── layout.tsx            → Root layout
```

| Pattern | Example | Description |
|---------|---------|-------------|
| `page.tsx` | `/` | Index route for directory |
| `about.tsx` | `/about` | Static route |
| `[id].tsx` | `/users/:id` | Dynamic segment |
| `[...slug].tsx` | `/posts/:slug*` | Catch-all route |
| `(folder)/` | - | Route group (organization only) |
| `layout.tsx` | - | Layout component for nested routes |

### Layouts

Layouts wrap page components and receive the page as `children`:

```tsx
// src/pages/layout.tsx
function RootLayout({ children }: { children: any }) {
  return (
    <div className="app">
      <header>My App</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}

export default RootLayout;
```

## Project Structure

```
my-app/
├── src/
│   ├── pages/
│   │   ├── page.tsx           # Home page (/)
│   │   ├── layout.tsx         # Root layout
│   │   ├── about.tsx          # About page (/about)
│   │   └── users/
│   │       ├── page.tsx       # Users list (/users)
│   │       └── [id].tsx       # User detail (/users/:id)
│   ├── components/
│   │   └── Button.tsx
│   ├── routes.generated.ts    # Auto-generated routes
│   ├── App.tsx
│   └── main.tsx
├── public/
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## API Reference

### Core (`@bromium/core`)

| Export | Description |
|--------|-------------|
| `ref(value)` | Create a reactive reference for primitives |
| `reactive(object)` | Create a deeply reactive object |
| `computed(getter)` | Create a computed value |
| `effect(fn)` | Create a reactive effect |
| `watch(source, callback)` | Watch reactive sources |
| `watchEffect(effect)` | Auto-tracking effect |
| `isRef(value)` | Check if value is a Ref |
| `isReactive(value)` | Check if value is reactive |
| `unref(value)` | Unwrap a Ref |
| `toRef(object, key)` | Create a Ref from object property |
| `toRefs(object)` | Convert reactive object to Refs |
| `toRaw(proxy)` | Get raw object from reactive proxy |
| `shallowRef(value)` | Create a shallow reactive Ref |
| `triggerRef(ref)` | Manually trigger ref updates |
| `markRaw(object)` | Mark object as non-reactive |
| `queueJob(fn)` | Queue a job for batch execution |

### Runtime (`@bromium/runtime`)

| Export | Description |
|--------|-------------|
| `createApp(component, config?)` | Create application instance |
| `render(vnode, container)` | Render VNode to DOM |
| `h(type, props, children)` | Create VNode (hyperscript) |
| `createElement(type, props, ...children)` | Create VNode (React-style) |
| `jsx`, `jsxs`, `jsxDEV` | JSX runtime functions |
| `Fragment` | Fragment component for multiple roots |
| `Text` | Text node type |
| `createVNode(type, props, children)` | Create VNode directly |
| `createTextVNode(text)` | Create text VNode |
| `isVNode(value)` | Check if value is a VNode |
| `useState(initial)` | React-style state hook (returns Ref) |
| `useRef(initial)` | Mutable ref hook |
| `useMemo(factory, deps)` | Memoized value hook |
| `useCallback(fn, deps)` | Memoized callback hook |
| `onMounted(callback)` | Mount lifecycle hook |
| `onUpdated(callback)` | Update lifecycle hook |
| `onUnmounted(callback)` | Unmount lifecycle hook |
| `getCurrentInstance()` | Get current component instance |

### Router (`@bromium/router`)

| Export | Description |
|--------|-------------|
| `createRouter(options)` | Create router instance |
| `getRouter()` | Get current router instance |
| `Link` | Navigation link component |
| `RouterView` | Route outlet component |
| `Navigate` | Programmatic navigation component |
| `Redirect` | Redirect component |
| `useRouter()` | Access router instance |
| `useRoute()` | Access current route (Ref) |
| `useParams()` | Access route parameters (ComputedRef) |
| `useQuery()` | Access query parameters (ComputedRef) |
| `useRouteMeta()` | Access route metadata (ComputedRef) |
| `useNavigate()` | Get navigation methods object |
| `useRouteMatch(path)` | Check if route matches (ComputedRef) |

### Vite Plugin (`@bromium/vite-plugin`)

| Export | Description |
|--------|-------------|
| `bromiumPlugin(options)` | Vite plugin factory (default export) |
| `scanPages(dir)` | Scan pages directory for routes |
| `watchPages(dir, callback)` | Watch for page file changes |
| `generateRouteConfig(routes, options)` | Generate route configuration code |
| `generateRouteTypes(routes)` | Generate TypeScript type definitions |

## Package Architecture

BromiumJS is organized as a monorepo with the following packages:

| Package | Description |
|---------|-------------|
| `bromium` | Main package - re-exports all subpackages |
| `@bromium/core` | Reactive system (ref, reactive, computed, watch) |
| `@bromium/runtime` | JSX runtime, renderer, hooks, lifecycle |
| `@bromium/router` | Client-side router with file-based routing |
| `@bromium/vite-plugin` | Vite integration and route generation |

### Dependency Graph

```
bromium (main package)
├── @bromium/core      (no dependencies)
├── @bromium/runtime   (depends on @bromium/core)
├── @bromium/router    (depends on @bromium/core, @bromium/runtime)
└── @bromium/vite-plugin (build-time only)
```

## TypeScript Support

BromiumJS is written in TypeScript and provides full type definitions. Configure your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "bromium",
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

## License

MIT
