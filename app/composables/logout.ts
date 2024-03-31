export const useLogout = () => {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const logout = () => {
        authStore.setToken("")
        router.push('/auth/login')        
    }
    
    return {
        logout
    }
}