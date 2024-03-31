import type { Todo } from "~/app/models/Todo";

export type ListTodoResponse = {
  todos: Todo[];
  pagination: Pagination;
};

export type Pagination = {
  currentPage: number;
  perPage: number;
};
