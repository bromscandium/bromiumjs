/**
 * DOM Renderer with virtual DOM reconciliation and diffing.
 * @module
 */

import { VNode, Fragment, Text, ComponentFunction, ComponentInstance } from './vnode.js';
import { effect, cleanup, EffectFn } from '@bromium/core';
import { setCurrentInstance, invokeLifecycleHooks } from './lifecycle.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

const SVG_TAGS = new Set([
  'svg', 'path', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'rect',
  'g', 'defs', 'symbol', 'use', 'image', 'text', 'tspan', 'textPath',
  'clipPath', 'mask', 'pattern', 'marker', 'linearGradient', 'radialGradient',
  'stop', 'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer',
  'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence',
  'foreignObject', 'animate', 'animateMotion', 'animateTransform', 'set'
]);

function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const componentMap = new WeakMap<VNode, ComponentInstance>();

/**
 * Renders a virtual DOM tree into a container element.
 * Handles mounting, updating, and unmounting based on the previous state.
 *
 * @param vnode - The virtual node to render, or null to unmount
 * @param container - The DOM element to render into
 *
 * @example
 * ```ts
 * const vnode = h('div', { className: 'app' }, 'Hello');
 * render(vnode, document.getElementById('root')!);
 *
 * // Update
 * render(h('div', { className: 'app' }, 'Updated'), container);
 *
 * // Unmount
 * render(null, container);
 * ```
 */
export function render(vnode: VNode | null, container: Element): void {
  const oldVNode = (container as any)._vnode as VNode | null;

  if (vnode == null) {
    if (oldVNode) {
      unmount(oldVNode);
    }
  } else if (oldVNode) {
    patch(oldVNode, vnode, container, null);
  } else {
    mount(vnode, container, null);
  }

  (container as any)._vnode = vnode;
}

function mount(
  vnode: VNode,
  container: Element,
  anchor: Node | null,
  isSVG: boolean = false
): void {
  const { type } = vnode;

  if (type === Fragment) {
    mountFragment(vnode, container, anchor, isSVG);
    return;
  }

  if (type === Text) {
    mountText(vnode, container, anchor);
    return;
  }

  if (typeof type === 'function') {
    mountComponent(vnode, container, anchor, isSVG);
    return;
  }

  mountElement(vnode, container, anchor, isSVG);
}

function mountElement(
  vnode: VNode,
  container: Element,
  anchor: Node | null,
  isSVG: boolean = false
): void {
  const { type, props, children } = vnode;
  const tagName = type as string;

  const isCurrentSVG = isSVG || SVG_TAGS.has(tagName);

  const el = isCurrentSVG
    ? document.createElementNS(SVG_NS, tagName)
    : document.createElement(tagName);
  vnode.el = el;

  for (const [key, value] of Object.entries(props)) {
    if (key === 'key' || key === 'ref') continue;
    setProp(el, key, value, null, isCurrentSVG);
  }

  children.forEach(child => {
    if (child == null) return;

    if (typeof child === 'object') {
      mount(child as VNode, el, null, isCurrentSVG);
    } else {
      el.appendChild(document.createTextNode(String(child)));
    }
  });

  container.insertBefore(el, anchor);
}

function mountText(
  vnode: VNode,
  container: Element,
  anchor: Node | null
): void {
  const textContent = vnode.children[0] as string;
  const el = document.createTextNode(textContent);
  vnode.el = el;
  container.insertBefore(el, anchor);
}

function mountFragment(
  vnode: VNode,
  container: Element,
  anchor: Node | null,
  isSVG: boolean = false
): void {
  const fragmentAnchor = document.createComment('');
  container.insertBefore(fragmentAnchor, anchor);
  vnode.anchor = fragmentAnchor;

  vnode.children.forEach(child => {
    if (child == null) return;

    if (typeof child === 'object') {
      mount(child as VNode, container, fragmentAnchor, isSVG);
    } else {
      const textNode = document.createTextNode(String(child));
      container.insertBefore(textNode, fragmentAnchor);
    }
  });
}

function mountComponent(
  vnode: VNode,
  container: Element,
  anchor: Node | null,
  isSVG: boolean = false
): void {
  const component = vnode.type as ComponentFunction;

  const propsWithChildren = {
    ...vnode.props,
    children: vnode.children.length > 0 ? vnode.children : undefined,
  };

  const instance: ComponentInstance = {
    vnode,
    props: propsWithChildren,
    subTree: null,
    isMounted: false,
    update: null,
    mounted: [],
    unmounted: [],
    updated: [],
    hooks: [],
    hookIndex: 0,
  };

  vnode.component = instance;
  componentMap.set(vnode, instance);

  const updateFn = () => {
    setCurrentInstance(instance);
    instance.hookIndex = 0;

    try {
      const subTree = component(instance.props);

      if (!instance.isMounted) {
        if (subTree) {
          mount(subTree, container, anchor, isSVG);
          instance.subTree = subTree;
        }
        instance.isMounted = true;

        queueMicrotask(() => {
          invokeLifecycleHooks(instance.mounted, 'onMounted');
        });
      } else {
        if (instance.subTree && subTree) {
          patch(instance.subTree, subTree, container, anchor, isSVG);
        } else if (subTree) {
          mount(subTree, container, anchor, isSVG);
        } else if (instance.subTree) {
          unmount(instance.subTree);
        }
        instance.subTree = subTree;

        queueMicrotask(() => {
          invokeLifecycleHooks(instance.updated, 'onUpdated');
        });
      }
    } finally {
      setCurrentInstance(null);
    }
  };

  instance.update = effect(updateFn) as unknown as () => void;
}

function patch(
  oldVNode: VNode,
  newVNode: VNode,
  container: Element,
  anchor: Node | null,
  isSVG: boolean = false
): void {
  if (oldVNode.type !== newVNode.type) {
    unmount(oldVNode);
    mount(newVNode, container, anchor, isSVG);
    return;
  }

  newVNode.el = oldVNode.el;

  if (newVNode.type === Text) {
    patchText(oldVNode, newVNode);
    return;
  }

  if (newVNode.type === Fragment) {
    patchFragment(oldVNode, newVNode, container, isSVG);
    return;
  }

  if (typeof newVNode.type === 'function') {
    patchComponent(oldVNode, newVNode, isSVG);
    return;
  }

  const tagName = newVNode.type as string;
  const isCurrentSVG = isSVG || SVG_TAGS.has(tagName);
  patchElement(oldVNode, newVNode, isCurrentSVG);
}

function patchElement(oldVNode: VNode, newVNode: VNode, isSVG: boolean = false): void {
  const el = (newVNode.el = oldVNode.el) as Element;

  const oldProps = oldVNode.props;
  const newProps = newVNode.props;

  for (const key of Object.keys(newProps)) {
    if (key === 'key' || key === 'ref') continue;
    if (oldProps[key] !== newProps[key]) {
      setProp(el, key, newProps[key], oldProps[key], isSVG);
    }
  }

  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) {
      setProp(el, key, null, oldProps[key], isSVG);
    }
  }

  patchChildren(oldVNode, newVNode, el, isSVG);
}

function patchText(oldVNode: VNode, newVNode: VNode): void {
  const el = (newVNode.el = oldVNode.el) as Text;
  const oldText = oldVNode.children[0] as string;
  const newText = newVNode.children[0] as string;

  if (oldText !== newText) {
    el.textContent = newText;
  }
}

function patchFragment(
  oldVNode: VNode,
  newVNode: VNode,
  container: Element,
  isSVG: boolean = false
): void {
  newVNode.anchor = oldVNode.anchor;
  patchChildren(oldVNode, newVNode, container, isSVG);
}

function patchComponent(oldVNode: VNode, newVNode: VNode, _isSVG: boolean = false): void {
  const instance = oldVNode.component!;
  newVNode.component = instance;
  instance.vnode = newVNode;

  const oldPropsWithChildren: Record<string, any> = {
    ...oldVNode.props,
    children: oldVNode.children.length > 0 ? oldVNode.children : undefined,
  };
  const newPropsWithChildren: Record<string, any> = {
    ...newVNode.props,
    children: newVNode.children.length > 0 ? newVNode.children : undefined,
  };

  let hasChanged = false;

  for (const key of Object.keys(newPropsWithChildren)) {
    if (oldPropsWithChildren[key] !== newPropsWithChildren[key]) {
      hasChanged = true;
      break;
    }
  }

  if (!hasChanged) {
    for (const key of Object.keys(oldPropsWithChildren)) {
      if (!(key in newPropsWithChildren)) {
        hasChanged = true;
        break;
      }
    }
  }

  if (hasChanged) {
    instance.props = newPropsWithChildren;
    instance.update?.();
  }
}

function patchChildren(
  oldVNode: VNode,
  newVNode: VNode,
  container: Element,
  isSVG: boolean = false
): void {
  const oldChildren = oldVNode.children;
  const newChildren = newVNode.children;
  const anchor = newVNode.anchor || null;

  if (oldChildren.length === 1 && newChildren.length === 1 &&
      typeof oldChildren[0] !== 'object' && typeof newChildren[0] !== 'object') {
    const oldText = String(oldChildren[0] ?? '');
    const newText = String(newChildren[0] ?? '');
    if (oldText !== newText) {
      const textNode = Array.from(container.childNodes).find(
        n => n.nodeType === Node.TEXT_NODE
      );
      if (textNode) {
        textNode.textContent = newText;
      }
    }
    return;
  }

  const hasOnlyVNodeChildren = oldChildren.every(c => c == null || typeof c === 'object') &&
                                newChildren.every(c => c == null || typeof c === 'object');

  if (!hasOnlyVNodeChildren) {
    oldChildren.forEach((child) => {
      if (child && typeof child === 'object') {
        unmount(child as VNode);
      }
    });

    while (container.firstChild && container.firstChild !== anchor) {
      container.removeChild(container.firstChild);
    }

    newChildren.forEach((child) => {
      if (child == null) return;

      if (typeof child === 'object') {
        mount(child as VNode, container, anchor, isSVG);
      } else {
        const textNode = document.createTextNode(String(child));
        container.insertBefore(textNode, anchor);
      }
    });
    return;
  }

  const oldKeyed = new Map<string | number, VNode>();
  const oldUnkeyed: VNode[] = [];

  oldChildren.forEach((child) => {
    if (child && typeof child === 'object') {
      const vnode = child as VNode;
      if (vnode.key != null) {
        oldKeyed.set(vnode.key, vnode);
      } else {
        oldUnkeyed.push(vnode);
      }
    }
  });

  let unkeyedIndex = 0;

  newChildren.forEach((child) => {
    if (child == null) return;

    if (typeof child === 'object') {
      const newChild = child as VNode;
      let oldChild: VNode | undefined;

      if (newChild.key != null) {
        oldChild = oldKeyed.get(newChild.key);
        if (oldChild) {
          oldKeyed.delete(newChild.key);
        }
      } else {
        oldChild = oldUnkeyed[unkeyedIndex++];
      }

      if (oldChild) {
        patch(oldChild, newChild, container, anchor, isSVG);
      } else {
        mount(newChild, container, anchor, isSVG);
      }
    }
  });

  oldKeyed.forEach(child => unmount(child));

  for (let i = unkeyedIndex; i < oldUnkeyed.length; i++) {
    unmount(oldUnkeyed[i]);
  }
}

function setProp(
  el: Element,
  key: string,
  newValue: any,
  oldValue: any,
  isSVG: boolean = false
): void {
  if (key.startsWith('on')) {
    const event = key.slice(2).toLowerCase();

    if (oldValue) {
      el.removeEventListener(event, oldValue);
    }
    if (newValue) {
      el.addEventListener(event, newValue);
    }
  } else if (key === 'className') {
    if (isSVG) {
      if (newValue) {
        el.setAttribute('class', newValue);
      } else {
        el.removeAttribute('class');
      }
    } else {
      if (newValue) {
        el.setAttribute('class', newValue);
      } else {
        el.removeAttribute('class');
      }
    }
  } else if (key === 'style') {
    if (typeof newValue === 'object' && newValue !== null) {
      const style = (el as HTMLElement).style;
      if (typeof oldValue === 'object' && oldValue !== null) {
        for (const prop of Object.keys(oldValue)) {
          if (!(prop in newValue)) {
            style.setProperty(prop, '');
          }
        }
      }
      for (const [prop, value] of Object.entries(newValue)) {
        style.setProperty(prop, String(value));
      }
    } else if (typeof newValue === 'string') {
      (el as HTMLElement).style.cssText = newValue;
    } else {
      el.removeAttribute('style');
    }
  } else if (key === 'dangerouslySetInnerHTML') {
    if (newValue?.__html != null) {
      el.innerHTML = newValue.__html;
    }
  } else if (!isSVG && key === 'value' && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
    const newVal = newValue ?? '';
    if (el.value !== newVal) {
      el.value = newVal;
    }
  } else if (!isSVG && key === 'checked' && el instanceof HTMLInputElement) {
    el.checked = !!newValue;
  } else if (key === 'disabled') {
    if (newValue) {
      el.setAttribute('disabled', '');
    } else {
      el.removeAttribute('disabled');
    }
  } else if (newValue == null || newValue === false) {
    const attrName = isSVG ? camelToKebab(key) : key;
    el.removeAttribute(attrName);
  } else if (newValue === true) {
    const attrName = isSVG ? camelToKebab(key) : key;
    el.setAttribute(attrName, '');
  } else {
    const attrName = isSVG ? camelToKebab(key) : key;
    el.setAttribute(attrName, String(newValue));
  }
}

function unmount(vnode: VNode): void {
  const { type, el, component, children, anchor } = vnode;

  if (typeof type === 'function' && component) {
    invokeLifecycleHooks(component.unmounted, 'onUnmounted');

    if (component.subTree) {
      unmount(component.subTree);
    }

    if (component.update) {
      cleanup(component.update as unknown as EffectFn);
    }
    return;
  }

  if (type === Fragment) {
    children.forEach(child => {
      if (child && typeof child === 'object') {
        unmount(child as VNode);
      }
    });
    anchor?.parentNode?.removeChild(anchor);
    return;
  }

  children.forEach(child => {
    if (child && typeof child === 'object') {
      unmount(child as VNode);
    }
  });

  if (el?.parentNode) {
    el.parentNode.removeChild(el);
  }
}

/**
 * Configuration options for creating a Bromium application.
 */
export interface AppConfig {
  /** Path to the favicon image */
  favicon?: string;
}

function setupFavicon(faviconPath: string) {
  let baseUrl = (import.meta as any).env?.BASE_URL || '/';

  if (faviconPath.startsWith('/') || faviconPath.startsWith('http')) {
    baseUrl = '';
  }

  const fullPath = baseUrl + faviconPath;

  let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;

  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }

  favicon.href = fullPath;
}

/**
 * Creates a new Bromium application instance.
 *
 * @param rootComponent - The root component function to render
 * @param config - Optional application configuration
 * @returns An app instance with mount and unmount methods
 *
 * @example
 * ```ts
 * function App() {
 *   return <div>Hello, Bromium!</div>;
 * }
 *
 * const app = createApp(App, { favicon: '/icon.png' });
 * app.mount('#app');
 *
 * // Later: app.unmount();
 * ```
 */
export function createApp(rootComponent: ComponentFunction, config?: AppConfig) {
  let isMounted = false;
  let rootVNode: VNode | null = null;
  let container: Element | null = null;

  if (config?.favicon) {
    setupFavicon(config.favicon);
  }

  const app = {
    /**
     * Mounts the application to a DOM element.
     *
     * @param selector - A CSS selector string or DOM Element to mount to
     * @returns The app instance for chaining
     */
    mount(selector: string | Element) {
      container =
        typeof selector === 'string'
          ? document.querySelector(selector)
          : selector;

      if (!container) {
        throw new Error(`Mount target "${selector}" not found`);
      }

      if (!isMounted) {
        rootVNode = {
          type: rootComponent,
          props: {},
          children: [],
          key: null,
          el: null,
        };

        render(rootVNode, container);
        isMounted = true;
      }

      return app;
    },

    /**
     * Unmounts the application and cleans up resources.
     */
    unmount() {
      if (isMounted && container) {
        render(null, container);
        isMounted = false;
        rootVNode = null;
      }
    },
  };

  return app;
}
