import type { CreateUserRequest } from '~/app/contracts/auth/CreateUserRequest'

export const useRegister = async (request: CreateUserRequest): Promise<any> => {
  return await usePublicFetch('collections/users/records', {
    method: 'POST',
    body: request,
  })
}
