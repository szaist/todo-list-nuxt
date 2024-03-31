import { Todo } from "~/app/models/Todo";

export default defineEventHandler(async (event) => {
  const storage = useStorage("db");

  const query = getQuery(event);

  const page = (query?.page as number) ?? 1;
  const perPage = (query?.perPage as number) ?? 10;
  const sort = query?.sort ?? "-created";

  //TODO: Body validation

  console.log(`Query: ${JSON.stringify(query)}`);

  const todos = (await storage.getItem<Array<Todo>>("todos")) ?? [];

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  const pageItems = todos.slice(startIndex, endIndex);

  const totalPages = Math.ceil(todos.length / perPage);

  setResponseStatus(event, 200);
  return {
    todos: pageItems,
    pagination: {
      currentPage: page * 1,
      totalCount: todos.length,
      totalPages: totalPages,
    },
  };
});
