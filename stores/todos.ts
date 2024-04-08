import { defineStore } from 'pinia'
import type { CreateTodoRequest } from '~/app/contracts/todo/CreateTodoRequest'
import type { Pagination } from '~/app/contracts/todo/ListTodoResponse'
import type { UpdateTodoRequest } from '~/app/contracts/todo/UpdateTodoRequest'
import type { Todo } from '~/app/models/Todo'
import type { PaginationProps } from '~/composables/todo/useFetchTodos'

export const useTodoStore = defineStore('todos', () => {
  const abortController = ref<AbortController>()
  const todos = ref<Array<Todo>>([])
  const pagination = ref<Pagination>({
    page: 1,
    perPage: 30,
    totalItems: 0,
    totalPages: 0,
  })
  const sortKey = ref<string>('+order')

  const loading = ref<boolean>(true)
  const isLoading = computed(() => loading.value)
  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const fetchTodos = async (params?: PaginationProps) => {
    try {
      setLoading(true)
      const { items, page, perPage, totalItems, totalPages } =
        await useFetchTodos(params)

      todos.value = items
      pagination.value = { page, perPage, totalItems, totalPages }
    } catch (error) {
      console.log('FetchTodos: ', error)
    }
    setLoading(false)
  }

  const refetchTodos = async () => {
    await fetchTodos({
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      sort: sortKey.value,
    })
  }

  const fetchNextPage = async () => {
    await fetchTodos({
      page: pagination.value.page + 1,
      perPage: pagination.value.perPage,
      sort: sortKey.value,
    })
  }

  const fetchPrevPage = async () => {
    if (pagination.value.page - 1 < 1) return
    await fetchTodos({
      page: pagination.value.page - 1,
      perPage: pagination.value.perPage,
      sort: sortKey.value,
    })
  }

  const patchTodo = async (todoId: string, request: UpdateTodoRequest) => {
    setLoading(true)
    await usePatchTodo(todoId, request)

    const todoIndex = todos.value.findIndex((t: Todo) => t.id === todoId)
    todos.value[todoIndex] = {
      ...todos.value[todoIndex],
      ...request,
    }

    setLoading(false)
  }

  const deleteTodo = async (todoId: string) => {
    try {
      setLoading(true)
      await useDeleteTodo(todoId)

      todos.value = todos.value.filter((t: Todo) => t.id !== todoId)
    } catch (error) {
      console.log('deleteTodo: ', error)
    }
    setLoading(false)
  }

  const getTodoById = (todoId: string) => {
    return todos.value.find((t: Todo) => t.id === todoId)
  }

  const createTodo = async (request: CreateTodoRequest) => {
    setLoading(true)
    const todo = await useAddTodo(request)

    todos.value.push(todo)

    setLoading(false)
  }

  const toggleCompleted = async (todoId: string) => {
    try {
      const item = getTodoById(todoId)
      const updatedItem = {
        ...item,
        completed: !item?.completed,
      }
      await patchTodo(todoId, updatedItem as UpdateTodoRequest)
    } catch (error) {
      console.log('toggleCompleted: ', error)
    }
  }

  const toggleFavorite = async (todoId: string) => {
    try {
      const item = getTodoById(todoId)
      const updatedItem = {
        ...item,
        fav: !item?.fav,
      }
      await patchTodo(todoId, updatedItem as UpdateTodoRequest)
    } catch (error) {
      console.log('toggleFavorite: ', error)
    }
  }

  return {
    abortController,
    todos,
    pagination,
    fetchTodos,
    patchTodo,
    deleteTodo,
    refetchTodos,
    sortKey,
    getTodoById,
    createTodo,
    fetchNextPage,
    fetchPrevPage,
    setLoading,
    isLoading,
    toggleCompleted,
    toggleFavorite,
  }
})
