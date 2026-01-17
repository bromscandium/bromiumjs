# BromiumJS

A modern JavaScript/TypeScript UI framework combining the best of Vue, React, and Next.js.

## Features

- **Proxy-based Reactivity** - Vue 3-inspired reactive system with `ref`, `reactive`, `computed`, and `watch`
- **JSX Support** - React-like JSX with virtual DOM and efficient diffing
- **Dual Hook Systems** - Both React-style hooks (`useState`, `useRef`) and Vue-style lifecycle hooks (`onMounted`, `onUnmounted`)
- **File-based Routing** - Next.js-style automatic route generation
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

## Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import bromium from 'bromium/vite-plugin';

export default defineConfig({
  plugins: [bromium()],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'bromium'
  }
});
```

## Documentation

See the [full documentation](https://github.com/bromscandium/bromiumjs#readme) for:

- Reactivity system (`ref`, `reactive`, `computed`, `watch`)
- Components and JSX
- Hooks (React-style and Vue-style)
- Router and file-based routing
- Vite plugin configuration

## Packages

| Package | Description |
|---------|-------------|
| `bromium` | Main package (this) |
| `@bromscandium/core` | Reactivity system |
| `@bromscandium/runtime` | JSX runtime and renderer |
| `@bromscandium/router` | Client-side router |
| `@bromscandium/vite-plugin` | Vite integration |

## License

MIT
