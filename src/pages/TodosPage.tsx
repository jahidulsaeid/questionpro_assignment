import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_TODO_FILTERS, TODO_FILTERS_STORAGE_KEY, TODO_PAGE_SIZE } from "../constants/storageKeys";
import { loadFromStorage, saveToStorage } from "../lib/localStorage";
import type { TodoFilters, TodoItem, User } from "../types/todo";
import styles from "./TodosPage.module.css";

async function fetchTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  return (await response.json()) as TodoItem[];
}

async function fetchUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return (await response.json()) as User[];
}

function TodosPage() {
  const [filters, setFilters] = useState<TodoFilters>(() =>
    loadFromStorage(TODO_FILTERS_STORAGE_KEY, DEFAULT_TODO_FILTERS),
  );

  const {
    data: todos = [],
    isLoading: isTodosLoading,
    error: todosError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const {
    data: users = [],
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    saveToStorage(TODO_FILTERS_STORAGE_KEY, filters);
  }, [filters]);

  const loading = isTodosLoading || isUsersLoading;
  const error = todosError ?? usersError;

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesUser = filters.userId === "all" ? true : todo.userId === filters.userId;

      const matchesStatus =
        filters.status === "all" ? true : filters.status === "completed" ? todo.completed : !todo.completed;

      const matchesSearch = todo.title.toLowerCase().includes(filters.search.toLowerCase().trim());

      return matchesUser && matchesStatus && matchesSearch;
    });
  }, [todos, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / TODO_PAGE_SIZE));
  const currentPage = Math.min(filters.page, totalPages);

  const paginatedTodos = useMemo(() => {
    const start = (currentPage - 1) * TODO_PAGE_SIZE;
    return filteredTodos.slice(start, start + TODO_PAGE_SIZE);
  }, [filteredTodos, currentPage]);

  function updateFilter(partial: Partial<TodoFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>Todo List</h2>

      <div className={styles.filters}>
        <label className={styles.filterLabel}>
          Search
          <input
            value={filters.search}
            onChange={(event) => updateFilter({ search: event.target.value, page: 1 })}
            placeholder="Search by title"
          />
        </label>

        <label className={styles.filterLabel}>
          User
          <select
            value={String(filters.userId)}
            onChange={(event) => {
              const value = event.target.value;
              updateFilter({ userId: value === "all" ? "all" : Number(value), page: 1 });
            }}
          >
            <option value="all">All users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterLabel}>
          Status
          <select
            value={filters.status}
            onChange={(event) =>
              updateFilter({
                status: event.target.value as TodoFilters["status"],
                page: 1,
              })
            }
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </label>
      </div>

      {loading && <p className={styles.info}>Loading todos...</p>}
      {error && <p className={styles.error}>Could not load todos. Please try again.</p>}

      {!loading && !error && (
        <>
          <div className={styles.meta}>
            <span>
              Showing {paginatedTodos.length} of {filteredTodos.length} matched todos
            </span>
          </div>
          <ul className={styles.list}>
            {paginatedTodos.map((todo) => {
              const user = users.find((item) => item.id === todo.userId);
              return (
                <li key={todo.id} className={styles.card}>
                  <h3>{todo.title}</h3>
                  <p>
                    Status: <strong>{todo.completed ? "Completed" : "Pending"}</strong>
                  </p>
                  <p>
                    User: <strong>{user?.name ?? `User #${todo.userId}`}</strong>
                  </p>
                </li>
              );
            })}
          </ul>

          <div className={styles.pagination}>
            <button type="button" disabled={currentPage <= 1} onClick={() => updateFilter({ page: currentPage - 1 })}>
              Previous
            </button>
            <span>
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => updateFilter({ page: currentPage + 1 })}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default TodosPage;
