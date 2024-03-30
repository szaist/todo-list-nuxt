<script setup lang="ts">
import type { LoginUserRequest } from '~/app/contracts/auth/LoginUserRequest'
import { AuthRepositoryAPI } from "~/app/repositories/AuthRepository"

const authStore = useAuthStore()
const authRepository = new AuthRepositoryAPI()

const router = useRouter()

const form = ref<LoginUserRequest>({
    email: "",
    password: "",
})

const isLoading = ref<boolean>(false)

const login = async () => {
    // TODO: validate form
    try {
        isLoading.value = true
        const response = await authRepository.login(form.value)

        authStore.setToken(response.token)

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
                        <InputText id="email" v-model="form.email" :disabled="isLoading"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">Password</label>
                        <Password id="password" v-model="form.password" :feedback="false" :disabled="isLoading"/>
                    </div>
                    <div class="flex justify-end">
                        <Button @click="login" :loading="isLoading">Login</Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>