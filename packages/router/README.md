# @bromscandium/router

Client-side router for BromiumJS with file-based routing support.

## Installation

```bash
npm install @bromscandium/router
```

## Usage

```tsx
import { createRouter, Link, RouterView, useParams } from '@bromscandium/router';

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/users/:id', component: UserProfile },
  ],
});

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/users/123">User</Link>
      </nav>
      <RouterView />
    </div>
  );
}

function UserProfile() {
  const params = useParams();
  return <div>User ID: {params.value.id}</div>;
}
```

### Router Hooks

```tsx
import { useRouter, useRoute, useParams, useQuery, useNavigate } from '@bromscandium/router';

function Component() {
  const router = useRouter();
  const route = useRoute();
  const params = useParams();
  const query = useQuery();
  const nav = useNavigate();

  const goHome = () => nav.push('/');
  const goBack = () => nav.back();

  return <button onClick={goHome}>Home</button>;
}
```

### Link Component

```tsx
<Link to="/about">About</Link>

<Link
  to="/about"
  activeClassName="active"
  exactActiveClassName="exact-active"
>
  About
</Link>
```

## API

| Export | Description |
|--------|-------------|
| `createRouter(options)` | Create router instance |
| `Link` | Navigation link component |
| `RouterView` | Route outlet component |
| `Navigate` | Programmatic navigation component |
| `Redirect` | Redirect component |
| `useRouter()` | Access router instance |
| `useRoute()` | Access current route (Ref) |
| `useParams()` | Access route parameters (ComputedRef) |
| `useQuery()` | Access query parameters (ComputedRef) |
| `useNavigate()` | Get navigation methods |

## License

MIT
