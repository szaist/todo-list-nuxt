import { defineStore } from "pinia"
import type { Pagination } from "~/app/contracts/todo/ListTodoResponse"
import type { UpdateTodoRequest } from "~/app/contracts/todo/UpdateTodoRequest"
import type { Todo } from "~/app/models/Todo"
import { TodoRepositoryAPI } from "~/app/repositories/TodoRepository"

export const useTodoStore = defineStore('todos', () => {
    const todos = ref<Array<Todo>>([])
    const pagination = ref<Pagination>({
        currentPage: 1,
        perPage: 10,
        totalCount: 0,
        totalPages: 0,
    })
    const todoRepository = new TodoRepositoryAPI()


    const fetchTodos = async (_page?: number, _perPage?: number, _sort?: string) => {
        try {
            const page = _page ?? 1
            const perPage = _perPage ?? 10
            const sort = _sort

            let parameters: Record<string, string | number> = {
                    page,
                    perPage,
            }

            if(sort){
                parameters.sort = sort 
            }
            

            const response = await todoRepository.list(parameters)

            todos.value = response.todos
            pagination.value = response.pagination

        } catch (error) {
            console.log("FetchTodos: ", error);
        }
    }

    const sortTodos = async (_sort?: string) => {
        await fetchTodos(pagination.value.currentPage, pagination.value.perPage, _sort)
    }

    const patchTodo = async (todoId: string, request: UpdateTodoRequest) => {
        try {
            await todoRepository.patch(todoId, request)

            const todoIndex = todos.value.findIndex((t: Todo) => t.id === todoId)
            todos.value[todoIndex] =  {
                ...todos.value[todoIndex],
                ...request,
            }
        } catch (error) {
            console.log("patchTodo: ", error);
        }
    }

    const deleteTodo = async (todoId: string) => {
        try {
            await todoRepository.delete(todoId)

            todos.value = todos.value.filter((t: Todo) => t.id !== todoId)
        } catch (error) {
            console.log("deleteTodo: ", error);
        }
    }

    const getTodoById = (todoId: string) => {
        return todos.value.find((t: Todo) => t.id === todoId)
    }

    const createTodo = async (request: CreateTodoRequest) => {
        try {
            const response = await todoRepository.create(request)

            todos.value.push(response)

        } catch (error) {
            console.log('createTodo: ', error);
        }
    }

    return { todos, fetchTodos, patchTodo, deleteTodo, sortTodos, getTodoById, createTodo }
})