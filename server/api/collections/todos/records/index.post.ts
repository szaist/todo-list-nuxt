import { CreateTodoRequest } from "~/app/contracts/todo/CreateTodoRequest";
import { Todo } from "~/app/models/Todo";
import { v4 as uuid } from 'uuid'

export default defineEventHandler(async (event) => {
    const storage = useStorage('db')

    const body = await readBody<CreateTodoRequest>(event)

    //TODO: Body validation

    console.log(`Body: ${JSON.stringify(body)}`);
    
    const todos = await storage.getItem<Array<Todo>>("todos") ?? []

    const todo = {
        id: uuid(),
        ...body,
    }

    todos.push(todo)

    await storage.setItem("todos", todos)

    setResponseStatus(event, 201)
    return {
        ...todo,
    }
})