export const usePublicFetch = async <T>(
  request: string,
  opts: any,
): Promise<T> => {
  const config = useRuntimeConfig()

  return await $fetch(request, { baseURL: config.public.API_URL, ...opts })
}

export const useApiFetch = async <T>(
  request: string,
  opts: any,
): Promise<T> => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return await $fetch(request, {
    baseURL: config.public.API_URL,
    ...opts,
    headers: {
      ...opts?.headers,
      Authorization: `Bearer ${authStore.authToken}`,
    },
  })
}
