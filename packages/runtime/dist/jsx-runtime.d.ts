/**
 * JSX Runtime for TypeScript/Vite.
 * Configure in tsconfig.json: "jsx": "react-jsx", "jsxImportSource": "@bromium/runtime"
 * @module
 */
import { Fragment, VNode, VNodeType } from './vnode.js';
export { Fragment };
/**
 * JSX element type alias for VNode.
 */
export interface JSXElement extends VNode {
}
/**
 * Creates a virtual node from JSX syntax (React 17+ automatic runtime).
 * This is called automatically by the TypeScript/Babel JSX transform.
 *
 * @param type - Element type (tag name or component function)
 * @param props - Props object including children
 * @param key - Optional key for list reconciliation
 * @returns A virtual node
 */
export declare function jsx(type: VNodeType, props: Record<string, any> | null, key?: string | number | null): VNode;
/**
 * Creates a virtual node with static children (optimization hint).
 * Functionally identical to jsx() but indicates children won't change.
 *
 * @param type - Element type (tag name or component function)
 * @param props - Props object including children
 * @param key - Optional key for list reconciliation
 * @returns A virtual node
 */
export declare function jsxs(type: VNodeType, props: Record<string, any> | null, key?: string | number | null): VNode;
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
export declare function jsxDEV(type: VNodeType, props: Record<string, any> | null, key?: string | number | null, _isStatic?: boolean, _source?: {
    fileName: string;
    lineNumber: number;
    columnNumber: number;
}, _self?: any): VNode;
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
export declare function createElement(type: VNodeType, props: Record<string, any> | null, ...children: any[]): VNode;
/**
 * Alias for createElement, providing a shorter hyperscript-style API.
 *
 * @example
 * ```ts
 * const vnode = h('div', { className: 'app' }, h('span', null, 'Hello'));
 * ```
 */
export declare const h: typeof createElement;
//# sourceMappingURL=jsx-runtime.d.ts.map