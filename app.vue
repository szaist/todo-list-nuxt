<script lang="ts" setup>
useHead({
  title: 'TodoApp',
})
</script>
<template>
  <div>
    <NuxtPage />
    <ConfirmDialog class="max-w-[600px]"></ConfirmDialog>
    <DynamicDialog />
  </div>
</template>
