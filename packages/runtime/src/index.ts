// Runtime package exports

// Type exports from vnode
export type {
  VNode,
  VNodeChild,
  VNodeChildren,
  VNodeType,
  ComponentFunction,
  ComponentInstance,
} from './vnode.js';

// Value exports from vnode
export {
  Fragment,
  Text,
  createVNode,
  normalizeChildren,
  createTextVNode,
  isVNode,
} from './vnode.js';

// Value exports from jsx-runtime
export {
  jsx,
  jsxs,
  jsxDEV,
  createElement,
  h,
} from './jsx-runtime.js';

// Type exports from jsx-runtime
export type { JSXElement } from './jsx-runtime.js';

export {
  render,
  createApp,
} from './renderer.js';

export type { AppConfig } from './renderer.js';

export {
  onMounted,
  onUnmounted,
  onUpdated,
  getCurrentInstance,
  setCurrentInstance,
} from './lifecycle.js';

// Hooks for state persistence
export {
  useState,
  useRef,
  useMemo,
  useCallback,
} from './hooks.js';
