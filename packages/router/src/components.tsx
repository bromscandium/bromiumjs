/**
 * Router components: Link, RouterView, Redirect, and Navigate.
 * @module
 */

import {ref} from '@bromium/core';
import {jsx, VNode} from '@bromium/runtime';
import {useRoute, useRouter} from './hooks.js';
import {NavigationTarget} from './router.js';

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
export function Link(props: LinkProps): VNode {
  const router = useRouter();
  const route = useRoute();

  const {
    to,
    children,
    className = '',
    activeClassName = '',
    exactActiveClassName = '',
    replace = false,
    target,
    rel,
    onClick,
    ...rest
  } = props;

  const href = typeof to === 'string' ? to : (to.path || '/');

  const currentPath = route.value.path;
  const base = router.base || '';
  const comparePath = base ? href.replace(new RegExp(`^${base}`), '') || '/' : href;

  const isExactActive = currentPath === comparePath;
  const isActive = isExactActive || currentPath.startsWith(comparePath + '/');

  let finalClassName = className;
  if (isActive && activeClassName) {
    finalClassName = `${finalClassName} ${activeClassName}`.trim();
  }
  if (isExactActive && exactActiveClassName) {
    finalClassName = `${finalClassName} ${exactActiveClassName}`.trim();
  }

  function handleClick(e: MouseEvent) {
    onClick?.(e);

    if (e.defaultPrevented) return;

    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

    if (target) return;

    e.preventDefault();

    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }

  return jsx('a', {
    href,
    className: finalClassName || undefined,
    target,
    rel,
    onClick: handleClick,
    children,
    ...rest,
  });
}

/**
 * Props for the RouterView component.
 */
interface RouterViewProps {
  /** The nesting depth for nested RouterViews (usually auto-detected) */
  depth?: number;
}

let routerViewDepth = 0;

const componentCache = new Map<string, any>();

const layoutCache = new Map<string, any>();

const pendingLoads = new Map<string, Promise<any>>();

const renderVersion = ref(0);

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
export function RouterView(props: RouterViewProps): VNode | null {
  const { depth: explicitDepth } = props;
  const route = useRoute();

  void renderVersion.value;

  const currentDepth = explicitDepth ?? routerViewDepth;
  const matched = route.value.matched[currentDepth];

  if (!matched) {
    return null;
  }

  const routePath = matched.path;
  const routeConfig = matched.route;

  if (routeConfig.layout) {
    const layoutKey = `layout:${routePath}`;
    return loadAndRenderLayoutWithPage(
      routeConfig.layout,
      layoutKey,
      routeConfig.component,
      routePath,
      route.value.fullPath,
      currentDepth
    );
  }

  return loadAndRenderComponent(
    routeConfig.component,
    routePath,
    route.value.fullPath,
    currentDepth
  );
}

function loadAndRenderComponent(
  componentModule: () => Promise<{ default: any }> | { default: any },
  routePath: string,
  fullPath: string,
  currentDepth: number
): VNode | null {
  if (componentCache.has(routePath)) {
    const Component = componentCache.get(routePath);
    routerViewDepth = currentDepth + 1;
    try {
      return jsx(Component, {
        key: fullPath,
      });
    } finally {
      routerViewDepth = currentDepth;
    }
  }

  if (typeof componentModule === 'function') {
    if (!pendingLoads.has(routePath)) {
      const loadPromise = componentModule();

      if (loadPromise && typeof (loadPromise as any).then === 'function') {
        pendingLoads.set(routePath, loadPromise as Promise<any>);

        (loadPromise as Promise<any>).then((result) => {
          const Component = result.default || result;
          componentCache.set(routePath, Component);
          pendingLoads.delete(routePath);
          renderVersion.value++;
        }).catch((error) => {
          console.error('Failed to load route component:', error);
          pendingLoads.delete(routePath);
        });

        return jsx('div', {
          className: 'router-loading',
          children: '',
        });
      } else {
        const Component = (loadPromise as any).default || loadPromise;
        componentCache.set(routePath, Component);

        routerViewDepth = currentDepth + 1;
        try {
          return jsx(Component, {
            key: fullPath,
          });
        } finally {
          routerViewDepth = currentDepth;
        }
      }
    } else {
      return jsx('div', {
        className: 'router-loading',
        children: '',
      });
    }
  } else {
    const Component = (componentModule as any).default || componentModule;
    componentCache.set(routePath, Component);

    routerViewDepth = currentDepth + 1;
    try {
      return jsx(Component, {
        key: fullPath,
      });
    } finally {
      routerViewDepth = currentDepth;
    }
  }

  return null;
}

function loadAndRenderLayoutWithPage(
  layoutModule: () => Promise<{ default: any }> | { default: any },
  layoutKey: string,
  pageModule: () => Promise<{ default: any }> | { default: any },
  routePath: string,
  fullPath: string,
  currentDepth: number
): VNode | null {
  const layoutLoaded = layoutCache.has(layoutKey);
  const pageLoaded = componentCache.has(routePath);

  if (layoutLoaded && pageLoaded) {
    const Layout = layoutCache.get(layoutKey);
    const PageComponent = componentCache.get(routePath);

    routerViewDepth = currentDepth + 1;
    try {
      const pageElement = jsx(PageComponent, { key: fullPath });
      return jsx(Layout, { children: pageElement });
    } finally {
      routerViewDepth = currentDepth;
    }
  }

  if (!layoutLoaded && typeof layoutModule === 'function' && !pendingLoads.has(layoutKey)) {
    const loadPromise = layoutModule();

    if (loadPromise && typeof (loadPromise as any).then === 'function') {
      pendingLoads.set(layoutKey, loadPromise as Promise<any>);

      (loadPromise as Promise<any>).then((result) => {
        const Layout = result.default || result;
        layoutCache.set(layoutKey, Layout);
        pendingLoads.delete(layoutKey);
        renderVersion.value++;
      }).catch((error) => {
        console.error('Failed to load layout:', error);
        pendingLoads.delete(layoutKey);
      });
    } else {
      const Layout = (loadPromise as any).default || loadPromise;
      layoutCache.set(layoutKey, Layout);
    }
  }

  if (!pageLoaded && typeof pageModule === 'function' && !pendingLoads.has(routePath)) {
    const loadPromise = pageModule();

    if (loadPromise && typeof (loadPromise as any).then === 'function') {
      pendingLoads.set(routePath, loadPromise as Promise<any>);

      (loadPromise as Promise<any>).then((result) => {
        const PageComponent = result.default || result;
        componentCache.set(routePath, PageComponent);
        pendingLoads.delete(routePath);
        renderVersion.value++;
      }).catch((error) => {
        console.error('Failed to load page component:', error);
        pendingLoads.delete(routePath);
      });
    } else {
      const PageComponent = (loadPromise as any).default || loadPromise;
      componentCache.set(routePath, PageComponent);
    }
  }

  return jsx('div', {
    className: 'router-loading',
    children: '',
  });
}

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
export function Redirect(props: RedirectProps): null {
  const router = useRouter();
  const { to, replace = true } = props;

  if (replace) {
    router.replace(to);
  } else {
    router.push(to);
  }

  return null;
}

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
export function Navigate(props: NavigateProps): null {
  const router = useRouter();

  if (props.replace) {
    router.replace(props.to);
  } else {
    router.push(props.to);
  }

  return null;
}
