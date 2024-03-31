import { CreateUserRequest } from "~/app/contracts/auth/CreateUserRequest";

export default defineEventHandler(async (event) => {
  const storage = useStorage("db");

  const body = await readBody<CreateUserRequest>(event);

  //TODO: Body validation

  console.log(`Body: ${JSON.stringify(body)}`);

  const users =
    (await storage.getItem<Array<CreateUserRequest>>("users")) ?? [];

  const user = users.find((u) => u.email === body.email);

  if (user) {
    setResponseStatus(event, 400);
    return {
      message: "Email is already in use.",
    };
  }

  users.push(body);

  await storage.setItem("users", users);

  return {
    status: 200,
    message: "OK",
  };
});
