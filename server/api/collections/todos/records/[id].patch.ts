import { UpdateTodoRequest } from "~/app/contracts/todo/UpdateTodoRequest";
import { Todo } from "~/app/models/Todo";

export default defineEventHandler(async (event) => {
  const storage = useStorage("db");

  const id = getRouterParam(event, "id");
  const body = await readBody<UpdateTodoRequest>(event);

  //TODO: Body validation

  console.log(`Param id: ${JSON.stringify(id)}`);
  console.log(`Body: ${JSON.stringify(body)}`);

  const todos = (await storage.getItem<Array<Todo>>("todos")) ?? [];

  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    setResponseStatus(event, 404);
    return {
      message: "Todo was not found.",
    };
  }

  const newTodo = { ...todos[todoIndex], ...body };

  todos.splice(todoIndex, 1, newTodo);

  await storage.setItem("todos", todos);

  setResponseStatus(event, 200);
  return {
    ...newTodo,
  };
});
