import axios, { type AxiosResponse } from "axios";
import type { CreateTodoRequest } from "../contracts/todo/CreateTodoRequest";
import type { ListTodoResponse } from "../contracts/todo/ListTodoResponse";
import type { UpdateTodoRequest } from "../contracts/todo/UpdateTodoRequest";
import type { Todo } from "../models/Todo";

export interface TodoRepository {
    create(request: CreateTodoRequest): Promise<AxiosResponse<Todo>>
    list(params: Record<string, string>): Promise<AxiosResponse<ListTodoResponse>>
    patch(todoId: string, request: UpdateTodoRequest): Promise<AxiosResponse<void>>
    delete(todoId: string): Promise<AxiosResponse<void>>
}

export class TodoRepositoryAPI implements TodoRepository {
    API_URL = ""

    constructor() {
        this.API_URL = useRuntimeConfig().public.API_URL
    }

    async create(request: CreateTodoRequest): Promise<AxiosResponse<Todo>> {
        return await axios.post(`${this.API_URL}/collections/todos/records`, {
            body: request,
        })
    }
    async list(params?: Record<string, string | number>): Promise<AxiosResponse<ListTodoResponse>> {
        const urlParams = new URLSearchParams()

        if(params){
            Object.entries(params).map(([key, value]) => {
                urlParams.append(key, value.toString())
            })
        }

        return await axios.get(`${this.API_URL}/collections/todos/records${urlParams.size > 0 ? `?${urlParams.toString()}` : ''}`, )
    }
    async patch(todoId: string, request: UpdateTodoRequest): Promise<AxiosResponse<void>> {
        return await axios.patch(`${this.API_URL}/collections/todos/records/${todoId}`, {
            body: request
        })
    }
    async delete(todoId: string): Promise<AxiosResponse<void>> {
        return await axios.delete(`${this.API_URL}/collections/todos/records/${todoId}`)
    }
}