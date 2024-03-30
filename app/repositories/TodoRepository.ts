import type { CreateTodoRequest } from "../contracts/todo/CreateTodoRequest";
import type { ListTodoResponse } from "../contracts/todo/ListTodoResponse";
import type { UpdateTodoRequest } from "../contracts/todo/UpdateTodoRequest";
import type { Todo } from "../models/Todo";

export interface TodoRepository {
    create(request: CreateTodoRequest): Promise<Todo>
    list(params: Record<string, string>): Promise<ListTodoResponse>
    patch(todoId: string, request: UpdateTodoRequest): Promise<void>
    delete(todoId: string): Promise<void>
}

export class TodoRepositoryAPI implements TodoRepository {
    async create(request: CreateTodoRequest): Promise<Todo> {
        return await $fetch('/api/collections/todos/records', {
            method: 'POST',
            body: request,
        })
    }
    async list(params?: Record<string, string | number>): Promise<ListTodoResponse> {
        const urlParams = new URLSearchParams()

        if(params){
            Object.entries(params).map(([key, value]) => {
                urlParams.append(key, value.toString())
            })
        }

        return await $fetch(`/api/collections/todos/records${urlParams.size > 0 ? `?${urlParams.toString()}` : ''}`, )
    }
    async patch(todoId: string, request: UpdateTodoRequest): Promise<void> {
        return await $fetch(`/api/collections/todos/records/${todoId}`, {
            method: 'PATCH',
            body: request
        })
    }
    async delete(todoId: string): Promise<void> {
        return await $fetch(`/api/collections/todos/records/${todoId}`, {
            method: 'DELETE',
        })
    }
}