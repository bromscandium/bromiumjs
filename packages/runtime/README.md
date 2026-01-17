# @bromscandium/runtime

JSX runtime, virtual DOM renderer, and hooks for BromiumJS.

## Installation

```bash
npm install @bromscandium/runtime
```

## Usage

```tsx
import { createApp, h, Fragment } from '@bromscandium/runtime';
import { ref } from '@bromscandium/core';

function Counter() {
  const count = ref(0);

  return h('div', null,
    h('p', null, `Count: ${count.value}`),
    h('button', { onClick: () => count.value++ }, 'Increment')
  );
}

createApp(Counter).mount('#app');
```

### With JSX

Configure your bundler to use `@bromscandium/runtime` as the JSX import source:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@bromscandium/runtime"
  }
}
```

```tsx
function Counter() {
  const count = ref(0);

  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}
```

### Hooks

```tsx
import { useState, useRef, useMemo, useCallback, onMounted, onUnmounted } from '@bromscandium/runtime';

function Component() {
  const count = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const doubled = useMemo(() => count.value * 2, [count.value]);

  onMounted(() => console.log('Mounted'));
  onUnmounted(() => console.log('Unmounted'));

  return <div>{doubled}</div>;
}
```

## API

| Export | Description |
|--------|-------------|
| `createApp(component)` | Create application instance |
| `render(vnode, container)` | Render VNode to DOM |
| `h(type, props, children)` | Create VNode (hyperscript) |
| `jsx`, `jsxs`, `jsxDEV` | JSX runtime functions |
| `Fragment` | Fragment component |
| `useState(initial)` | State hook (returns Ref) |
| `useRef(initial)` | Mutable ref hook |
| `useMemo(factory, deps)` | Memoized value hook |
| `useCallback(fn, deps)` | Memoized callback hook |
| `onMounted(callback)` | Mount lifecycle hook |
| `onUpdated(callback)` | Update lifecycle hook |
| `onUnmounted(callback)` | Unmount lifecycle hook |

## License

MIT
