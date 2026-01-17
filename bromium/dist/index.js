// BromiumJS - Main Package
// Re-exports all subpackages for convenience
// Core reactivity
export { 
// Reactive primitives
ref, reactive, computed, 
// Effects
effect, watch, watchEffect, 
// Utilities
isRef, isReactive, unref, toRef, toRefs, toRaw, shallowRef, triggerRef, markRaw, 
// Batching
queueJob, } from '@bromium/core';
// Runtime - JSX and rendering
export { 
// JSX
jsx, jsxs, jsxDEV, createElement, h, Fragment, 
// Rendering
render, createApp, 
// Lifecycle
onMounted, onUnmounted, onUpdated, getCurrentInstance, 
// Hooks (React-style state persistence)
useState, useRef, useMemo, useCallback, 
// VNode utilities
createVNode, createTextVNode, isVNode, Text, } from '@bromium/runtime';
// Router
export { 
// Router creation
createRouter, 
// Hooks
useRouter, useRoute, useParams, useQuery, useRouteMeta, useNavigate, useRouteMatch, 
// Components
Link, RouterView, Redirect, Navigate, } from '@bromium/router';
//# sourceMappingURL=index.js.map