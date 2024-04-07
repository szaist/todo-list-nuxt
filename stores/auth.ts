import { defineStore } from 'pinia'
import type { User } from '~/app/models/User'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie('authorization_token', {
    maxAge: 3600,
  })

  const user = useCookie<User | null>('current_user', {
    maxAge: 3600,
  })

  const authToken = computed(() => token.value ?? '')
  const currentUser = computed(() => user.value)

  const setToken = (newToken: string) => {
    token.value = newToken
  }

  const setUser = (newUser: User | null) => {
    user.value = newUser
  }

  return { authToken, setToken, setUser, currentUser }
})
