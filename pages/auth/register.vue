<script setup lang="ts">
import { RegisterFormValidation } from '~/app/validation/AuthValidation'
import type { CreateUserRequest } from '~/app/contracts/auth/CreateUserRequest'
import { useRegister } from '~/composables/auth/useRegister'
import type { ValidationError } from 'yup'

const form = ref<CreateUserRequest>({
  email: '',
  password: '',
  passwordConfirm: '',
  first_name: '',
  last_name: '',
})

const isLoading = ref<boolean>(false)

const errors = ref<Record<string, string>>({})

const register = async () => {
  try {
    isLoading.value = true
    errors.value = {}

    await RegisterFormValidation.validate(form.value, {
      abortEarly: false,
    }).catch(err => {
      errors.value = useExtractYupValidationErrors(err as ValidationError)
    })

    if (Object.values(errors.value).length > 0) {
      isLoading.value = false
      return
    }

    await useRegister(form.value)
    navigateTo('/auth/login')
  } catch (error: any) {
    errors.value = useExtractApiValidationErrors(error)

    console.log(errors.value)
  }
  isLoading.value = false
}
</script>
<template>
  <div class="container mt-10 flex items-center justify-center">
    <Card class="w-[600px]">
      <template #title> Register an account </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              :disabled="isLoading"
              :invalid="!!errors.email"
            />
            <InlineMessage
              v-if="errors?.email"
              severity="error"
              >{{ errors.email }}</InlineMessage
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
          <div class="flex flex-col gap-2">
            <label for="passwordConfirm">Password confirmation</label>
            <Password
              id="passwordConfirm"
              v-model="form.passwordConfirm"
              :feedback="false"
              :disabled="isLoading"
              :invalid="!!errors.passwordConfirm"
            />
            <InlineMessage
              v-if="errors?.passwordConfirm"
              severity="error"
              >{{ errors.passwordConfirm }}</InlineMessage
            >
          </div>
          <div class="flex flex-col gap-2">
            <label for="firstname">First name</label>
            <InputText
              id="firstname"
              v-model="form.first_name"
              :disabled="isLoading"
              :invalid="!!errors.first_name"
            />
            <InlineMessage
              v-if="errors?.first_name"
              severity="error"
              >{{ errors.first_name }}</InlineMessage
            >
          </div>
          <div class="flex flex-col gap-2">
            <label for="lastname">Last name</label>
            <InputText
              id="lastname"
              v-model="form.last_name"
              :disabled="isLoading"
              :invalid="!!errors.last_name"
            />
            <InlineMessage
              v-if="errors?.last_name"
              severity="error"
              >{{ errors.last_name }}</InlineMessage
            >
          </div>
          <div class="flex items-center justify-between">
            <nuxt-link to="/auth/login"
              >Already have an account? Login here</nuxt-link
            >
            <Button
              :loading="isLoading"
              @click="register"
            >
              Register
            </Button>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
