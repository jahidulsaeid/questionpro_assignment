# QuestionPro Frontend Assessment

This project contains two independent features:

1. Todo List
2. Dynamic Form Builder

## Tech Stack

- React (functional components + hooks)
- React Router
- React Query (`@tanstack/react-query`)
- TypeScript
- CSS Modules
- localStorage (state persistence)
- JSONPlaceholder APIs

## Routes

- `/todos` -> Todo List page
- `/form-builder` -> Dynamic form builder page
- `/form-preview` -> Dynamic form preview and submit page

## Setup

1. Install dependencies

```bash
pnpm install
```

2. Run development server

```bash
pnpm dev
```

3. Run lint

```bash
pnpm lint
```

4. Build production bundle

```bash
pnpm build
```

## Feature Details

### 1) Todo List (`/todos`)

- Fetches todos from `https://jsonplaceholder.typicode.com/todos`
- Fetches users from `https://jsonplaceholder.typicode.com/users`
- Uses React Query for API fetching and caching
- Displays each todo with:
  - title
  - status (`Completed` / `Pending`)
  - mapped user name (`userId -> user.name`)
- Supports filters:
  - search by title
  - filter by user
  - filter by status
- Supports pagination:
  - page size: 10
  - Previous/Next navigation
- Persists Todo filter/search/page state in localStorage

### 2) Dynamic Form Builder (`/form-builder`)

- Add and remove dynamic fields
- Configure field properties:
  - label
  - name (normalized)
  - input type (`text`, `textarea`, `number`, `select`, `date`, `checkbox`)
  - required flag
  - select options (comma-separated)
- Form schema is auto-saved to localStorage
- UI customization:
  - select fields use a customized dropdown icon style
  - checkbox color is customized globally using theme color (`accent-color`)

### 3) Form Preview (`/form-preview`)

- Loads saved form schema from localStorage
- Renders inputs dynamically by field type
- On submit, prints submitted form values in browser console

## Persistence Keys

- `task_builder.todo.filters.v1`
- `task_builder.form.fields.v1`

## Project Structure

- `src/main.tsx`: React Query provider + router
- `src/App.tsx`: route declarations
- `src/components/`: shared layout/navigation
- `src/pages/`: page-level features
  - `TodosPage.tsx`
  - `FormBuilderPage.tsx`
  - `FormPreviewPage.tsx`
- `src/constants/storageKeys.ts`: storage keys, defaults, todo page size
- `src/lib/localStorage.ts`: localStorage helper utilities
- `src/types/todo.ts`: todo-related types
- `src/types/form.ts`: form-related types
