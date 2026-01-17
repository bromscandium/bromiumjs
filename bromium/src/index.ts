// BromiumJS - Main Package
// Re-exports all subpackages for convenience

// Core reactivity
export {
  // Reactive primitives
  ref,
  reactive,
  computed,

  // Effects
  effect,
  watch,
  watchEffect,

  // Utilities
  isRef,
  isReactive,
  unref,
  toRef,
  toRefs,
  toRaw,
  shallowRef,
  triggerRef,
  markRaw,

  // Batching
  queueJob,

  // Types
  type Ref,
  type ComputedRef,
  type ShallowRef,
  type EffectFn,
  type EffectOptions,
} from '@bromscandium/core';

// Runtime - JSX and rendering
export {
  // JSX
  jsx,
  jsxs,
  jsxDEV,
  createElement,
  h,
  Fragment,

  // Rendering
  render,
  createApp,

  // Lifecycle
  onMounted,
  onUnmounted,
  onUpdated,
  getCurrentInstance,

  // Hooks (React-style state persistence)
  useState,
  useRef,
  useMemo,
  useCallback,

  // VNode utilities
  createVNode,
  createTextVNode,
  isVNode,
  Text,

  // Types
  type VNode,
  type VNodeChild,
  type VNodeChildren,
  type VNodeType,
  type ComponentFunction,
  type ComponentInstance,
  type JSXElement,
  type AppConfig,
} from '@bromscandium/runtime';

// Router
export {
  // Router creation
  createRouter,

  // Hooks
  useRouter,
  useRoute,
  useParams,
  useQuery,
  useRouteMeta,
  useNavigate,
  useRouteMatch,

  // Components
  Link,
  RouterView,
  Redirect,
  Navigate,

  // Types
  type Router,
  type Route,
  type RouteLocation,
  type MatchedRoute,
  type NavigationTarget,
  type NavigationGuard,
  type NavigationHook,
} from '@bromscandium/router';
