import { object, string } from "yup";

export const LoginFormValidation = object().shape({
    email: string().email().required(),
    password: string().required()
})

export const RegisterFormValidation = object().shape({
    email: string().email().required(),
    password: string().required(),
    first_name: string().required(),
    last_name: string().required()
})