<script lang="ts" setup></script>

<template>
  <div class="my-4 cursor-pointer">
    <div class="rounded-lg border px-2 py-1">
      <div class="my-2">
        <Skeleton class="h-[10px] max-w-[200px]" />
      </div>
      <div class="mb-1">
        <Skeleton class="h-[10px] max-w-[250px]" />
      </div>
      <div class="my-1">
        <Skeleton class="h-[20px] max-w-[400px]" />
      </div>
      <div class="mb-2 flex justify-end">
        <Skeleton class="h-[10px] max-w-[150px]" />
      </div>
    </div>
  </div>
</template>
