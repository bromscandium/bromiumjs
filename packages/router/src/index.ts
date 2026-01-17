// Router package exports

export {
  createRouter,
  getRouter,
  setRouter,
  type Router,
  type Route,
  type RouteLocation,
  type MatchedRoute,
  type NavigationTarget,
  type NavigationGuard,
  type NavigationHook,
} from './router.js';

export {
  useRouter,
  useRoute,
  useParams,
  useQuery,
  useRouteMeta,
  useNavigate,
  useRouteMatch,
} from './hooks.js';

export {
  Link,
  RouterView,
  Redirect,
  Navigate,
} from './components.js';
