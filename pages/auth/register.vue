<script setup lang="ts">

import { AuthRepositoryAPI } from "~/app/repositories/AuthRepository"
import { RegisterFormValidation } from '~/app/validation/AuthValidation'
import { ValidationError } from 'yup'
import type { CreateUserRequest } from '~/app/contracts/auth/CreateUserRequest';


const authStore = useAuthStore()
const authRepository = new AuthRepositoryAPI()

const router = useRouter()

const form = ref<CreateUserRequest>({
    email: "",
    password: "",
    first_name: "",
    last_name: ""
})
const errors = ref<Record<string, string>>({})

const isLoading = ref<boolean>(false)

const register = async () => {
    try {
        errors.value = {}
        await RegisterFormValidation.validate(form.value, {abortEarly: false})

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
         await authRepository.register(form.value)
        router.push('/auth/login')
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
                Register an account
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
                    <div class="flex flex-col gap-2">
                        <label for="firstname">First name</label>
                        <InputText id="firstname" v-model="form.first_name" :disabled="isLoading" :invalid="!!errors.first_name"/>
                        <InlineMessage severity="error" v-if="errors?.first_name">{{ errors.first_name }}</InlineMessage>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="lastname">Last name</label>
                        <InputText id="lastname" v-model="form.last_name" :disabled="isLoading" :invalid="!!errors.last_name"/>
                        <InlineMessage severity="error" v-if="errors?.last_name">{{ errors.last_name }}</InlineMessage>
                    </div>
                    <div class="flex justify-between items-center">
                        <nuxt-link to="/auth/login">Already have an account? Login here</nuxt-link>
                        <Button @click="register" :loading="isLoading">Login</Button>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>