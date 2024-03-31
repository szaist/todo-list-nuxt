import { boolean, mixed, number, object, string } from "yup";
import { Priority } from "../types";

export const CreateTodoValidation = object().shape({
  title: string().required(),
  description: string(),
  order: number().required(),
  priority: mixed<Priority>().oneOf(Object.values(Priority)).required(),
  completed: boolean(),
  fav: boolean(),
});
