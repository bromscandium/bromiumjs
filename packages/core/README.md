# @bromscandium/core

Core reactivity system for BromiumJS - a Vue 3-inspired proxy-based reactive system.

## Installation

```bash
npm install @bromscandium/core
```

## Usage

```ts
import { ref, reactive, computed, watch, watchEffect } from '@bromscandium/core';

// Primitive values
const count = ref(0);
count.value++; // Triggers reactive updates

// Objects
const state = reactive({ name: 'John', items: [] });
state.name = 'Jane'; // Deeply reactive

// Computed values
const doubled = computed(() => count.value * 2);

// Watchers
watch(() => count.value, (newVal, oldVal) => {
  console.log(`Changed from ${oldVal} to ${newVal}`);
});

watchEffect(() => {
  console.log(`Count is: ${count.value}`);
});
```

## API

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

## License

MIT
