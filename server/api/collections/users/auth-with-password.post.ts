import { CreateUserRequest } from "~/app/contracts/auth/CreateUserRequest";
import { LoginUserRequest } from "~/app/contracts/auth/LoginUserRequest";

export default defineEventHandler(async (event) => {
  const storage = useStorage("db");

  const body = await readBody<LoginUserRequest>(event);

  //TODO: Body validation

  console.log(`Body: ${JSON.stringify(body)}`);

  const users =
    (await storage.getItem<Array<CreateUserRequest>>("users")) ?? [];

  const user = users.find((u) => u.email === body.email);

  if (!user || user.password !== body.password) {
    setResponseStatus(event, 400);

    return {
      message: "Wrong credentials.",
    };
  }

  return {
    token: `valid-token-${user.email}`,
  };
});
