# QuestionPro Frontend Assessment

This project implements two independent features:

1. Todo List with API integration, filter/search persistence, and pagination
2. Dynamic Form Builder with saved configuration and preview/submit flow

## Tech Stack

- React (functional components + hooks)
- React Router
- React Query (@tanstack/react-query)
- TypeScript
- CSS Modules
- Browser localStorage for persistence
- JSONPlaceholder APIs

## Routes

- /todos: Todo List page
- /form-builder: Dynamic form schema creation
- /form-preview: Render saved schema and submit values

## Setup Instructions

1. Install dependencies:

```bash
pnpm install
```

2. Run in development mode:

```bash
pnpm run dev
```

3. Build for production:

```bash
pnpm run build
```

4. Run linter:

```bash
pnpm run lint
```

## Approach

### Todo List

- Fetches todos from https://jsonplaceholder.typicode.com/todos
- Fetches users from https://jsonplaceholder.typicode.com/users
- Uses React Query to fetch/cache todo and user datasets
- Maps each todo userId to user name
- Filters:
  - Search by title
  - Filter by user
  - Filter by status (Completed/Pending)
- Pagination:
  - 10 items per page
  - Previous/Next controls
- Persistence:
  - Filters and search state are stored in localStorage
  - Returning to /todos preserves state

### Dynamic Form Builder

- Users can add/remove dynamic fields
- Each field supports:
  - Label
  - Name
  - Input type (text, textarea, number, select, date, checkbox)
  - Required flag
  - Select options (for dropdown fields)
- Form configuration is auto-saved in localStorage

### Form Preview

- Loads saved configuration from localStorage
- Renders inputs dynamically based on field type
- On submit:
  - Collects all values
  - Prints submitted data to browser console

## Project Structure

- src/components: shared layout/navigation
- src/pages: feature pages (todos, builder, preview)
- src/constants.ts: keys/defaults/page size
- src/lib.storage.ts: localStorage helpers
- src/types.ts: shared TypeScript models
