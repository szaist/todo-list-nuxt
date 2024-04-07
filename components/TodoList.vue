<script lang="ts" setup>
import type { Todo } from '~/app/models/Todo'
import { SIDE } from '~/app/types'
import TodoItemSkeleton from './skeletons/TodoItemSkeleton.vue'
import TodoEditDialog from './TodoEditDialog.vue'
import type { PageState } from 'primevue/paginator'

const todoStore = useTodoStore()

const { todos } = storeToRefs(todoStore)

onMounted(async () => {
  await todoStore.fetchTodos()
})

const startDrag = (event: DragEvent, item: Todo) => {
  if (!event.dataTransfer) return

  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('itemID', item.id)
}

const onDrop = (event: DragEvent, index: number, side: SIDE) => {
  if (!event.dataTransfer) return

  const itemID = event.dataTransfer.getData('itemID')
  const itemIndex = todos.value.findIndex((todo: Todo) => todo.id === itemID)
  const item = {
    ...todos.value.find((todo: Todo) => todo.id === itemID),
  } as Todo

  // Place into first place
  if (index === 0 && side === SIDE.BEFORE) {
    todos.value = todos.value.filter((t: Todo) => t.id !== item.id)
    todos.value = [item, ...todos.value]
  }
  // Place into last place
  else if (index === todos.value.length - 1 && side === SIDE.AFTER) {
    todos.value = todos.value.filter((t: Todo) => t.id !== item.id)
    todos.value = [...todos.value, item]
  } else {
    todos.value[itemIndex].id = 'remove'
    if (side === SIDE.BEFORE) {
      todos.value = [
        ...todos.value.slice(0, index),
        item,
        ...todos.value.slice(index),
      ]
    } else {
      todos.value = [
        ...todos.value.slice(0, index + 1),
        item,
        ...todos.value.slice(index + 1),
      ]
    }

    todos.value = todos.value.filter((t: Todo) => t.id !== 'remove')
  }
}

const dialog = useDialog()
const openEditTaskDialog = (todoId: string) => {
  dialog.open(TodoEditDialog, {
    props: {
      modal: true,
      header: 'Edit task',
    },
    data: {
      todoId: todoId,
    },
  })
}

const onPageChange = (event: PageState) => {
  todoStore.pagination.page = event.page + 1
  todoStore.refetchTodos()
}
</script>
<template>
  <div>
    <TodoListHeader />
    <div v-if="todoStore.isLoading && todoStore.todos.length === 0">
      <TodoItemSkeleton
        v-for="i in 4"
        :key="i"
      />
    </div>
    <DataView
      v-else
      :value="todoStore.todos"
      data-key="id"
    >
      <template #list="slotProps">
        <template
          v-for="(item, index) in slotProps.items"
          :key="item.id"
        >
          <TodoItem
            :item="item"
            :index="index"
            @dragstart="startDrag"
            @drop="onDrop"
            @edit="openEditTaskDialog"
          />
        </template>
      </template>
      <template #empty>
        <div class="mt-4 flex items-center justify-center">
          <h2 class="my-10 text-2xl">
            There is no task in the database on this page
          </h2>
        </div>
      </template>
      <template #footer>
        <Paginator
          :rows="todoStore.pagination.perPage"
          :total-records="todoStore.pagination.totalItems"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          @page="onPageChange"
        />
      </template>
    </DataView>
  </div>
</template>
