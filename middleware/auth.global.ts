export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    // Redirect to login if user has no token
    if(authStore.authToken === '' && (to.path !== '/auth/login' && to.path !== '/auth/register'))
    {
        return navigateTo('/auth/login', {redirectCode: 403 })
    }

    // Redirects authenticated users to home page
    if(authStore.authToken !== '' && (to.path === '/auth/login' || to.path === '/auth/register'))
    {
        return navigateTo('/')
    }
})