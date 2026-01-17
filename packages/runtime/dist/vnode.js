/**
 * Virtual DOM node types and utilities.
 * @module
 */
/** Symbol used to identify Fragment nodes (multiple children without a wrapper) */
export const Fragment = Symbol('Fragment');
/** Symbol used to identify Text nodes */
export const Text = Symbol('Text');
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
export function createVNode(type, props, children = []) {
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
export function normalizeChildren(children) {
    if (children == null) {
        return [];
    }
    if (!Array.isArray(children)) {
        children = [children];
    }
    return children.flat(Infinity).filter(child => {
        return child != null && child !== false && child !== true && child !== '';
    });
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
export function createTextVNode(text) {
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
export function isVNode(value) {
    return value != null && typeof value === 'object' && 'type' in value;
}
//# sourceMappingURL=vnode.js.map