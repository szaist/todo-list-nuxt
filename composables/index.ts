import type { ValidationError } from 'yup'

export const useExtractApiValidationErrors = (error: any) => {
  return Object.entries(error.data.data).reduce(
    (
      acc: Record<string, string>,
      [key, value]: [string, any],
    ): Record<string, string> => {
      acc[key] = value.message
      return acc
    },
    {},
  )
}

export const useExtractYupValidationErrors = (error: ValidationError) => {
  const errors: Record<string, string> = {}

  error.inner.forEach(e => {
    const name = e.path ?? ''
    errors[name] = e.message
  })

  return errors
}
