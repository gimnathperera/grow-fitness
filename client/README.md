# Grow Fitness - React + TypeScript + Vite

This project provides a modern React application built with TypeScript, Vite, and comprehensive code quality tools.

## Code Quality & CI/CD Setup

This project uses several tools to ensure code quality and consistency, with automated CI/CD pipelines for reliable deployments.

### Pre-commit Hooks (Husky)

The project uses Husky to run pre-commit hooks that ensure code quality:

- **Prettier**: Automatically formats code
- **ESLint**: Checks for code quality issues and enforces best practices
- **TypeScript**: Performs type checking
- **Commitlint**: Validates commit message format

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint with auto-fix
pnpm type-check   # Run TypeScript type checking
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

## RTK Query & Auth Setup

The client now uses Redux Toolkit with RTK Query for API access and a centralized authentication layer.

- `src/services/baseApi.ts` defines a shared `fetchBaseQuery` with automatic bearer token injection, 401 retry logic, and error normalization.
- Generated OpenAPI types live in `src/types/api`; run `pnpm openapi-typescript docs/openapi.json -o src/types/api/generated.ts` to regenerate them after backend changes.
- Feature endpoints are organized under `src/services` (e.g., `authApi`, `usersApi`, `clientsApi`) and expose hooks such as `useLoginMutation` and `useGetProfileQuery`.
- Auth state is managed by `src/auth/authSlice.ts`, which persists tokens to `localStorage`, hydrates on app start, and works with `baseApi` to keep headers in sync.
- Use the `useAuth()` hook for UI integration. It returns `login`, `logout`, role/permission helpers, and the current user state.
- `RequireAuth` / `withAuthGuard` provide declarative guards for routes or components and support optional role/permission checks.
- Set `VITE_API_BASE_URL` in your environment to point to the backend; it defaults to `http://localhost:3000` for local development.

### Quick Usage Example

```tsx
import { useAuth } from '@/auth/useAuth';

function ProfileButton() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return <button onClick={logout}>Sign out {user?.name}</button>;
}
```

### Commit Message Format

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages should follow this format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:

- `feat: add user authentication`
- `fix(auth): resolve login issue`
- `docs: update README`
- `style: format code with prettier`
- `refactor: simplify component logic`

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
