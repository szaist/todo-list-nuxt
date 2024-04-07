<script setup lang="ts">
import type { LoginUserRequest } from '~/app/contracts/auth/LoginUserRequest'
import { LoginFormValidation } from '~/app/validation/AuthValidation'
import { ValidationError } from 'yup'
import { useLogin } from '~/composables/auth/useLogin'

const authStore = useAuthStore()

const form = ref<LoginUserRequest>({
  identity: '',
  password: '',
})
const errors = ref<Record<string, string>>({})

const isLoading = ref<boolean>(false)

const login = async () => {
  try {
    isLoading.value = true
    errors.value = {}

    await LoginFormValidation.validate(form.value, {
      abortEarly: false,
    }).catch(err => {
      errors.value = useExtractYupValidationErrors(err as ValidationError)
    })

    if (Object.values(errors.value).length > 0) {
      isLoading.value = false
      return
    }

    const { record: user, token } = await useLogin(form.value)

    authStore.setToken(token)
    authStore.setUser(user)

    navigateTo('/')
  } catch (error: any) {
    errors.value = useExtractApiValidationErrors(error)
    if (error.data.code === 400 && Object.keys(error.data.data).length === 0) {
      errors.value.wrongCredentials = 'Wrong email or password!'
    }
  }
  isLoading.value = false
}
</script>
<template>
  <div class="container mt-10 flex items-center justify-center">
    <Card class="w-[600px]">
      <template #title> Log In </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <InlineMessage v-if="errors?.wrongCredentials">
            {{ errors.wrongCredentials }}
          </InlineMessage>
          <div class="flex flex-col gap-2">
            <label for="identity">Email</label>
            <InputText
              id="identity"
              v-model="form.identity"
              :disabled="isLoading"
              :invalid="!!errors.identity"
            />
            <InlineMessage
              v-if="errors?.identity"
              severity="error"
              >{{ errors.identity }}</InlineMessage
            >
          </div>
          <div class="flex flex-col gap-2">
            <label for="password">Password</label>
            <Password
              id="password"
              v-model="form.password"
              :feedback="false"
              :disabled="isLoading"
              :invalid="!!errors.password"
            />
            <InlineMessage
              v-if="errors?.password"
              severity="error"
              >{{ errors.password }}</InlineMessage
            >
          </div>
          <div class="flex items-center justify-between">
            <nuxt-link to="/auth/register"
              >Don't have an account? Register here</nuxt-link
            >
            <Button
              :loading="isLoading"
              @click="login"
              >Login</Button
            >
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
