<script setup lang="ts">
import type { LoginUserRequest } from '~/app/contracts/auth/LoginUserRequest'
import { AuthRepositoryAPI } from "~/app/repositories/AuthRepository"
import { LoginFormValidation } from '~/app/validation/AuthValidation'
import { ValidationError } from 'yup'


const authStore = useAuthStore()
const authRepository = new AuthRepositoryAPI()

const router = useRouter()

const form = ref<LoginUserRequest>({
    email: "",
    password: "",
})
const errors = ref<Record<string, string>>({})

const isLoading = ref<boolean>(false)

const login = async () => {
    try {
        errors.value = {}
        await LoginFormValidation.validate(form.value, {abortEarly: false})

    } catch (error) {
        const err = error as ValidationError

        err.inner.forEach(e => {
            const name = e.path ?? ''
            errors.value[name] = e.message
        })
        return
    }

    try {
        isLoading.value = true
        const response = await authRepository.login(form.value)

        authStore.setToken(response.data.token)
        router.push('/')
    } catch (error) {
        console.log("ERROR: ", error);
    }

    isLoading.value = false
}
</script>
<template>
    <div class="mt-10 container flex items-center justify-center">
        <Card class="w-[600px]">
            <template #title>
                Log In
            </template>
            <template #content>
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="email">Email</label>
                        <InputText id="email" v-model="form.email" :disabled="isLoading" :invalid="!!errors.email"/>
                        <InlineMessage severity="error" v-if="errors?.email">{{ errors.email }}</InlineMessage>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">Password</label>
                        <Password id="password" v-model="form.password" :feedback="false" :disabled="isLoading" :invalid="!!errors.password"/>
                        <InlineMessage severity="error" v-if="errors?.password">{{ errors.password }}</InlineMessage>
                    </div>
                    <div class="flex justify-between items-center">
                        <nuxt-link to="/auth/register">Don't have an account? Register here</nuxt-link>
                        <Button @click="login" :loading="isLoading">Login</Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>