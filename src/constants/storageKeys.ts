import type { TodoFilters } from '../types/todo'

export const TODO_FILTERS_STORAGE_KEY = 'task_builder.todo.filters.v1'
export const FORM_FIELDS_STORAGE_KEY = 'task_builder.form.fields.v1'
export const TODO_PAGE_SIZE = 10

export const DEFAULT_TODO_FILTERS: TodoFilters = {
  userId: 'all',
  status: 'all',
  search: '',
  page: 1,
}
