import type { LoginResponse } from '~/app/contracts/auth/LoginResponse'
import type { LoginUserRequest } from '~/app/contracts/auth/LoginUserRequest'

export const useLogin = async (
  request: LoginUserRequest,
): Promise<LoginResponse> => {
  return await usePublicFetch('collections/users/auth-with-password', {
    method: 'POST',
    body: request,
  })
}
