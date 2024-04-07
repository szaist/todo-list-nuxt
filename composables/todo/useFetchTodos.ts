import type { ListTodoResponse } from '~/app/contracts/todo/ListTodoResponse'

export type PaginationProps = {
  page?: number
  perPage?: number
  sort?: string
}

export const useFetchTodos = async (
  queryParams?: PaginationProps,
): Promise<ListTodoResponse> => {
  const todoStore = useTodoStore()
  const { abortController } = toRefs(todoStore)
  const params = new URLSearchParams()
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      params.append(key, String(value))
    })
  }

  if (abortController.value) {
    abortController.value.abort()
  }

  abortController.value = new AbortController()

  return await useApiFetch(
    `collections/todos/records${params.size > 0 ? '?' + params.toString() : ''}`,
    {
      method: 'GET',
      signal: abortController.value.signal,
    },
  )
}
