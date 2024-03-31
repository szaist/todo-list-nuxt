import { Todo } from "~/app/models/Todo";

export default defineEventHandler(async (event) => {
  const storage = useStorage("db");

  const id = getRouterParam(event, "id");

  //TODO: Body validation

  console.log(`Param ID: ${JSON.stringify(id)}`);

  const todos = (await storage.getItem<Array<Todo>>("todos")) ?? [];

  const newTodos = todos.filter((t) => t.id !== id);

  if (todos.length === newTodos.length) {
    setResponseStatus(event, 404);
    return {
      message: "Todo was not found.",
    };
  }

  await storage.setItem("todos", newTodos);

  setResponseStatus(event, 200);
  return {};
});
