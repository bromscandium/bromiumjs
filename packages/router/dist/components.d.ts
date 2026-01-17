/**
 * Router components: Link, RouterView, Redirect, and Navigate.
 * @module
 */
import { VNode } from '@bromium/runtime';
import { NavigationTarget } from './router.js';
/**
 * Props for the Link component.
 */
interface LinkProps {
    /** The target path or navigation object */
    to: string | NavigationTarget;
    /** Child elements to render inside the link */
    children?: any;
    /** CSS class name */
    className?: string;
    /** Class name to add when route is active (includes nested) */
    activeClassName?: string;
    /** Class name to add when route exactly matches */
    exactActiveClassName?: string;
    /** If true, replace current history entry instead of pushing */
    replace?: boolean;
    /** HTML target attribute (e.g., "_blank") */
    target?: string;
    /** HTML rel attribute for external links */
    rel?: string;
    /** Additional click handler */
    onClick?: (e: MouseEvent) => void;
    /** Additional attributes passed to the anchor element */
    [key: string]: any;
}
/**
 * A navigation link component that integrates with the router.
 * Handles click events to perform client-side navigation.
 *
 * @param props - Link component props
 * @returns An anchor element VNode
 *
 * @example
 * ```tsx
 * <Link to="/about">About</Link>
 *
 * <Link to="/dashboard" activeClassName="active">Dashboard</Link>
 *
 * <Link to={{ path: '/user', query: { id: '123' } }}>User</Link>
 * ```
 */
export declare function Link(props: LinkProps): VNode;
/**
 * Props for the RouterView component.
 */
interface RouterViewProps {
    /** The nesting depth for nested RouterViews (usually auto-detected) */
    depth?: number;
}
/**
 * Renders the component for the current matched route.
 * Handles lazy loading and layout wrapping automatically.
 *
 * @param props - RouterView component props
 * @returns The rendered route component or null
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <div>
 *       <nav>...</nav>
 *       <RouterView />
 *     </div>
 *   );
 * }
 * ```
 */
export declare function RouterView(props: RouterViewProps): VNode | null;
/**
 * Props for the Redirect component.
 */
interface RedirectProps {
    /** The target path or navigation object */
    to: string | NavigationTarget;
    /** If true, replace current history entry (default: true) */
    replace?: boolean;
}
/**
 * A component that performs a redirect when rendered.
 * Useful for redirecting from one route to another.
 *
 * @param props - Redirect component props
 * @returns null (performs navigation as side effect)
 *
 * @example
 * ```tsx
 * // In a route component
 * if (!isAuthenticated) {
 *   return <Redirect to="/login" />;
 * }
 * ```
 */
export declare function Redirect(props: RedirectProps): null;
/**
 * Props for the Navigate component.
 */
interface NavigateProps {
    /** The target path or navigation object */
    to: string | NavigationTarget;
    /** If true, replace current history entry instead of pushing */
    replace?: boolean;
}
/**
 * A component that performs navigation when rendered.
 * Alternative to using the router imperatively.
 *
 * @param props - Navigate component props
 * @returns null (performs navigation as side effect)
 *
 * @example
 * ```tsx
 * function AfterSubmit({ success }) {
 *   if (success) {
 *     return <Navigate to="/success" />;
 *   }
 *   return <div>Form</div>;
 * }
 * ```
 */
export declare function Navigate(props: NavigateProps): null;
export {};
//# sourceMappingURL=components.d.ts.map