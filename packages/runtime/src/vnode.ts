/**
 * Virtual DOM node types and utilities.
 * @module
 */

/** Symbol used to identify Fragment nodes (multiple children without a wrapper) */
export const Fragment = Symbol('Fragment');

/** Symbol used to identify Text nodes */
export const Text = Symbol('Text');

/** The type of a virtual node - can be a tag name, component function, or special symbol */
export type VNodeType = string | ComponentFunction | typeof Fragment | typeof Text;

/**
 * A virtual DOM node representing an element, component, or text.
 */
export interface VNode {
  /** The type of node (tag name, component function, Fragment, or Text) */
  type: VNodeType;
  /** Properties/attributes passed to the node */
  props: Record<string, any>;
  /** Child nodes */
  children: VNodeChild[];
  /** Unique key for reconciliation optimization */
  key?: string | number | null;
  /** Reference to the actual DOM node after mounting */
  el?: Node | null;
  /** For component vnodes, the component instance */
  component?: ComponentInstance | null;
  /** For Fragment nodes, the anchor comment node */
  anchor?: Node | null;
}

/** A valid child of a virtual node */
export type VNodeChild = VNode | string | number | boolean | null | undefined;

/** Children can be a single child or an array */
export type VNodeChildren = VNodeChild | VNodeChild[];

/**
 * A component function that receives props and returns a virtual node tree.
 */
export interface ComponentFunction {
  (props: Record<string, any>): VNode | null;
  /** Optional display name for debugging */
  displayName?: string;
}

/**
 * Internal state for a mounted component instance.
 */
export interface ComponentInstance {
  /** The virtual node representing this component */
  vnode: VNode;
  /** Current props passed to the component */
  props: Record<string, any>;
  /** The rendered subtree */
  subTree: VNode | null;
  /** Whether the component has been mounted to the DOM */
  isMounted: boolean;
  /** Function to trigger a re-render */
  update: (() => void) | null;
  /** Callbacks to invoke after mounting */
  mounted: Array<() => void>;
  /** Callbacks to invoke before unmounting */
  unmounted: Array<() => void>;
  /** Callbacks to invoke after updates */
  updated: Array<() => void>;
  /** Hook state storage for React-style hooks */
  hooks: any[];
  /** Current hook index during render */
  hookIndex: number;
}

/**
 * Creates a virtual DOM node.
 *
 * @param type - The node type (tag name, component, Fragment, or Text)
 * @param props - Properties/attributes for the node
 * @param children - Child nodes
 * @returns A new virtual node
 *
 * @example
 * ```ts
 * const vnode = createVNode('div', { className: 'container' }, [
 *   createVNode('span', null, ['Hello']),
 *   createVNode('span', null, ['World'])
 * ]);
 * ```
 */
export function createVNode(
  type: VNodeType,
  props: Record<string, any> | null,
  children: VNodeChildren = []
): VNode {
  const normalizedChildren = normalizeChildren(children);

  return {
    type,
    props: props || {},
    children: normalizedChildren,
    key: props?.key ?? null,
    el: null,
    component: null,
  };
}

/**
 * Normalizes children into a flat array, filtering out invalid values.
 * Handles nested arrays and removes nullish/boolean values from conditional rendering.
 *
 * @param children - The children to normalize
 * @returns A flat array of valid children
 */
export function normalizeChildren(children: VNodeChildren): VNodeChild[] {
  if (children == null) {
    return [];
  }

  if (!Array.isArray(children)) {
    children = [children];
  }

  return children.flat(Infinity).filter(child => {
    return child != null && child !== false && child !== true && child !== '';
  }) as VNodeChild[];
}

/**
 * Creates a text virtual node.
 *
 * @param text - The text content
 * @returns A virtual node representing text
 *
 * @example
 * ```ts
 * const textNode = createTextVNode('Hello, world!');
 * ```
 */
export function createTextVNode(text: string | number): VNode {
  return {
    type: Text,
    props: {},
    children: [String(text)],
    key: null,
    el: null,
  };
}

/**
 * Checks if a value is a virtual node.
 *
 * @param value - The value to check
 * @returns True if the value is a VNode
 */
export function isVNode(value: any): value is VNode {
  return value != null && typeof value === 'object' && 'type' in value;
}
