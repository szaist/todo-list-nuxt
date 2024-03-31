<script setup lang="ts">
import { useLogout } from "~/app/composables/logout";

const { logout } = useLogout();
</script>
<template>
  <div class="container">
    <div class="mx-auto my-4 max-w-[800px]">
      <div class="flex justify-end">
        <Button label="Logout" severity="secondary" @click="logout"></Button>
      </div>
      <TodoList />
    </div>
  </div>
</template>
