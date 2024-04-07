import { object, string, ref } from 'yup'

export const LoginFormValidation = object().shape({
  identity: string().email().required(),
  password: string().required(),
})

export const RegisterFormValidation = object().shape({
  email: string().email().required(),
  password: string().required(),
  passwordConfirm: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required(),
  first_name: string().required(),
  last_name: string().required(),
})
