<script lang="ts" setup>
const authStore = useAuthStore()
const { logout } = useLogout()

const confirm = useConfirm()
const requestLogout = () => {
  confirm.require({
    message: 'Are you sure you want to logout?',
    header: 'Confirmation',
    rejectLabel: 'Cancel',
    acceptLabel: 'Logout',
    accept: logout,
  })
}

const fullName = computed(() => {
  return `${authStore.currentUser?.first_name} ${authStore.currentUser?.last_name}`
})
</script>
<template>
  <div
    class="flex w-full items-center justify-between rounded-md border p-4"
    v-bind="$attrs"
  >
    <div class="text-black dark:text-white">
      <h1
        v-if="fullName"
        class="font-bold"
      >
        Welcome {{ fullName }}!
      </h1>
      <p class="">Email: {{ authStore.currentUser?.email }}</p>
    </div>
    <Button
      label="Logout"
      severity="danger"
      outlined
      icon="pi pi-sign-out"
      icon-class="pl-1"
      icon-pos="right"
      size="small"
      @click="requestLogout"
    />
  </div>
</template>
