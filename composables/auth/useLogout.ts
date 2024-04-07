export const useLogout = () => {
  const authStore = useAuthStore()
  const logout = () => {
    authStore.setToken('')
    authStore.setUser(null)

    navigateTo('/auth/login')
  }

  return {
    logout,
  }
}
