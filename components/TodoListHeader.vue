<script setup lang="ts">
import TodoAddDialog from '~/components/TodoAddDialog.vue'
import type { DropdownChangeEvent } from 'primevue/dropdown'
import { sortFieldOptions, perPageOptions } from '~/app/constants'

const todoStore = useTodoStore()

const sortKey = ref(sortFieldOptions[0])
const perPageCount = ref(perPageOptions[2])

const isLoading = computed(() => todoStore.isLoading)

const onSortChange = async (event: DropdownChangeEvent) => {
  todoStore.sortKey = event.value.value
  todoStore.refetchTodos()
}

const onPerPageChange = async (event: DropdownChangeEvent) => {
  todoStore.pagination.perPage = event.value.value
  todoStore.refetchTodos()
}

const dialog = useDialog()
const openAddTaskDialog = () => {
  dialog.open(TodoAddDialog, {
    props: {
      modal: true,
      header: 'Add new task',
    },
  })
}
</script>
<template>
  <div
    class="mt-4 flex flex-col items-center md:flex-row md:items-stretch md:justify-between"
  >
    <div>
      <h1 class="text-3xl font-bold text-black dark:text-white">Tasks</h1>
    </div>
    <div class="mt-2 flex flex-col items-center gap-4 md:mt-0 md:flex-row">
      <Dropdown
        v-model="sortKey"
        :options="sortFieldOptions"
        option-label="label"
        @change="onSortChange"
      />
      <Dropdown
        v-model="perPageCount"
        :options="perPageOptions"
        option-label="label"
        @change="onPerPageChange"
      />

      <Button
        label="Add new task"
        severity="info"
        icon="pi pi-plus"
        icon-pos="right"
        size="small"
        :disabled="isLoading"
        class="ml-4"
        @click="openAddTaskDialog"
      />
      <Button
        v-tooltip.bottom="'Refresh'"
        icon="pi pi-refresh"
        size="small"
        severity="info"
        outlined
        :disabled="isLoading"
        @click="todoStore.refetchTodos"
      />
    </div>
  </div>
</template>
