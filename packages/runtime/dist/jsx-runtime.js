/**
 * JSX Runtime for TypeScript/Vite.
 * Configure in tsconfig.json: "jsx": "react-jsx", "jsxImportSource": "@bromium/runtime"
 * @module
 */
import { createVNode, Fragment } from './vnode.js';
export { Fragment };
/**
 * Creates a virtual node from JSX syntax (React 17+ automatic runtime).
 * This is called automatically by the TypeScript/Babel JSX transform.
 *
 * @param type - Element type (tag name or component function)
 * @param props - Props object including children
 * @param key - Optional key for list reconciliation
 * @returns A virtual node
 */
export function jsx(type, props, key) {
    const { children, ...restProps } = props || {};
    return createVNode(type, { ...restProps, key: key ?? restProps?.key }, children);
}
/**
 * Creates a virtual node with static children (optimization hint).
 * Functionally identical to jsx() but indicates children won't change.
 *
 * @param type - Element type (tag name or component function)
 * @param props - Props object including children
 * @param key - Optional key for list reconciliation
 * @returns A virtual node
 */
export function jsxs(type, props, key) {
    return jsx(type, props, key);
}
/**
 * Development version of jsx() with extra validation and warnings.
 * Only performs validation when import.meta.env.DEV is true.
 *
 * @param type - Element type (tag name or component function)
 * @param props - Props object including children
 * @param key - Optional key for list reconciliation
 * @param _isStatic - Unused static children hint
 * @param _source - Source location for error messages
 * @param _self - Component reference for error messages
 * @returns A virtual node
 */
export function jsxDEV(type, props, key, _isStatic, _source, _self) {
    if (import.meta.env?.DEV) {
        if (typeof type === 'string' && type !== type.toLowerCase() && !type.includes('-')) {
            console.warn(`Invalid element type: "${type}". HTML elements must be lowercase. ` +
                `Did you mean to use a component? Components should start with uppercase.`);
        }
        if (props) {
            if ('class' in props && !('className' in props)) {
                console.warn(`Invalid prop "class" detected. Use "className" instead.`);
            }
        }
    }
    return jsx(type, props, key);
}
/**
 * Creates a virtual node using classic createElement syntax.
 * Use this for manual VNode creation without JSX.
 *
 * @param type - Element type (tag name or component function)
 * @param props - Props object (without children)
 * @param children - Child elements as rest parameters
 * @returns A virtual node
 *
 * @example
 * ```ts
 * const vnode = createElement('div', { className: 'app' },
 *   createElement('h1', null, 'Hello'),
 *   createElement('p', null, 'World')
 * );
 * ```
 */
export function createElement(type, props, ...children) {
    const normalizedProps = props || {};
    const flatChildren = children.length === 1 ? children[0] : children;
    return createVNode(type, normalizedProps, flatChildren);
}
/**
 * Alias for createElement, providing a shorter hyperscript-style API.
 *
 * @example
 * ```ts
 * const vnode = h('div', { className: 'app' }, h('span', null, 'Hello'));
 * ```
 */
export const h = createElement;
//# sourceMappingURL=jsx-runtime.js.map