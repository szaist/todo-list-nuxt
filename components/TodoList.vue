<script lang="ts" setup>
import type { DropdownChangeEvent } from "primevue/dropdown";
import type { UpdateTodoRequest } from "~/app/contracts/todo/UpdateTodoRequest";
import type { Todo } from "~/app/models/Todo";
import { SIDE } from "~/app/types";
import TodoAddDialog from "~/components/TodoAddDialog.vue";
import TodoItemSkeleton from "./skeletons/TodoItemSkeleton.vue";

const todoStore = useTodoStore();

const { todos } = storeToRefs(todoStore);
const isLoading = ref<boolean>(true);
const sortOptions = computed(() => [
  { label: "Sort by order ASC", value: "+order" },
  { label: "Sort by order DESC", value: "-order" },
  { label: "Sort by title ASC", value: "+title" },
  { label: "Sort by title DESC", value: "-title" },
  { label: "Sort by created at ASC", value: "+created" },
  { label: "Sort by created at DESC", value: "-created" },
  { label: "Priority HIGH to LOW", value: "-priority" },
  { label: "Priority LOW to HIGH", value: "+priority" },
  { label: "Sort by completed ASC", value: "+completed" },
  { label: "Sort by completed DESC", value: "-completed" },
]);

const sortKey = ref(sortOptions.value[0]);

const onSortChange = async (event: DropdownChangeEvent) => {
  const sortValue = event.value.value;

  await todoStore.sortTodos(sortValue);
};

onMounted(async () => {
  isLoading.value = true;
  await todoStore.fetchTodos();
  isLoading.value = false;
});

const startDrag = (event: DragEvent, item: Todo) => {
  if (!event.dataTransfer) return;

  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itemID", item.id);
};

const onDrop = (event: DragEvent, index: number, side: SIDE) => {
  if (!event.dataTransfer) return;

  const itemID = event.dataTransfer.getData("itemID");
  const itemIndex = todos.value.findIndex((todo: Todo) => todo.id === itemID);
  const item = {
    ...todos.value.find((todo: Todo) => todo.id === itemID),
  } as Todo;

  // Place into first place
  if (index === 0 && side === SIDE.BEFORE) {
    todos.value = todos.value.filter((t: Todo) => t.id !== item.id);
    todos.value = [item, ...todos.value];
  }
  // Place into last place
  else if (index === todos.value.length - 1 && side === SIDE.AFTER) {
    todos.value = todos.value.filter((t: Todo) => t.id !== item.id);
    todos.value = [...todos.value, item];
  } else {
    todos.value[itemIndex].id = "remove";
    if (side === SIDE.BEFORE) {
      todos.value = [
        ...todos.value.slice(0, index),
        item,
        ...todos.value.slice(index),
      ];
    } else {
      todos.value = [
        ...todos.value.slice(0, index + 1),
        item,
        ...todos.value.slice(index + 1),
      ];
    }

    todos.value = todos.value.filter((t: Todo) => t.id !== "remove");
  }
};

const deleteTodo = async (todoId: string) => {
  try {
    await todoStore.deleteTodo(todoId);
  } catch (error) {
    console.log("deleteTodo:", error);
  }
};

const toggleCompleted = async (todoId: string, item: UpdateTodoRequest) => {
  try {
    const updatedItem = {
      ...item,
      completed: !item.completed,
    };
    await todoStore.patchTodo(todoId, updatedItem);
  } catch (error) {
    console.log("toggleCompleted: ", error);
  }
};

const toggleFavorite = async (todoId: string, item: UpdateTodoRequest) => {
  try {
    const updatedItem = {
      ...item,
      fav: !item.fav,
    };
    await todoStore.patchTodo(todoId, updatedItem);
  } catch (error) {
    console.log("toggleFavorite: ", error);
  }
};

const nextPage = async () => {
  isLoading.value = true;
  await todoStore.fetchNextPage();
  isLoading.value = false;
};

const prevPage = async () => {
  isLoading.value = true;
  await todoStore.fetchPrevPage();
  isLoading.value = false;
};

const isFirstPage = computed(() => todoStore.pagination.currentPage === 1);

const dialog = useDialog();
const openAddTaskDialog = () => {
  dialog.open(TodoAddDialog, {
    props: {
      modal: true,
      header: "Add new task",
    },
  });
};
</script>
<template>
  <div>
    <div
      class="mt-4 flex flex-col items-center md:flex-row md:items-stretch md:justify-between"
    >
      <div>
        <h1 class="text-3xl text-black dark:text-white">Tasks</h1>
      </div>
      <div class="mt-2 flex flex-col items-center gap-4 md:mt-0 md:flex-row">
        <Dropdown
          v-model="sortKey"
          :options="sortOptions"
          option-label="label"
          :disabled="isLoading"
          @change="onSortChange"
        />
        <Button
          label="Add new task"
          severity="info"
          size="small"
          class="ml-4"
          :disabled="isLoading"
          @click="openAddTaskDialog"
        />
      </div>
    </div>
    <div v-if="isLoading">
      <TodoItemSkeleton v-for="i in 4" />
    </div>
    <DataView v-else :value="todoStore.todos" data-key="id">
      <template #list="slotProps">
        <template v-for="(item, index) in slotProps.items" :key="item.id">
          <TodoItem
            :item="item"
            :index="index"
            @dragstart="startDrag"
            @drop="onDrop"
            @toggle-completed="() => toggleCompleted(item.id, item)"
            @toggle-favorite="() => toggleFavorite(item.id, item)"
            @delete-todo="deleteTodo"
          />
        </template>
      </template>
      <template #empty>
        <div class="mt-4 flex items-center justify-center">
          <h2 class="text-2xl">There is no task in the database</h2>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <Button
            icon="pi pi-angle-left"
            label="Previous page"
            :loading="isLoading"
            :disabled="isFirstPage"
            @click="prevPage"
          />
          <Button
            icon="pi pi-angle-right"
            label="Next page"
            icon-pos="right"
            :loading="isLoading"
            @click="nextPage"
          />
        </div>
      </template>
    </DataView>
  </div>
</template>
