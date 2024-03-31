<script lang="ts" setup>
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";
import type { CreateTodoRequest } from "~/app/contracts/todo/CreateTodoRequest";
import { Priority } from "~/app/types";
import { CreateTodoValidation } from "~/app/validation/TodoValidation";
import { ValidationError } from "yup";

const dialogRef = inject<Ref<DynamicDialogInstance>>("dialogRef");
const todoStore = useTodoStore();
const currentTodo = ref<CreateTodoRequest>({
  title: "",
  description: "",
  order: 1,
  priority: Priority.LOW,
  completed: false,
  deadline: new Date(),
  fav: false,
});
const isLoading = ref<boolean>(false);
const needDeadline = ref<boolean>(false);

const errors = ref<Record<string, string>>({});

const priorityOptions = computed(() => Object.values(Priority));

const closeDialog = () => {
  dialogRef?.value.close();
};

const save = async () => {
  const todoItem: CreateTodoRequest = {
    title: currentTodo.value.title,
    description: currentTodo.value.description,
    order: currentTodo.value.order,
    priority: currentTodo.value.priority,
    completed: currentTodo.value.completed,
    fav: currentTodo.value.fav,
  };

  if (needDeadline.value) {
    todoItem.deadline = currentTodo.value.deadline;
  }

  try {
    errors.value = {};
    await CreateTodoValidation.validate(todoItem, { abortEarly: false });
  } catch (error) {
    const err = error as ValidationError;

    err.inner.forEach((e) => {
      const name = e.path ?? "";
      errors.value[name] = e.message;
    });
    return;
  }

  try {
    await todoStore.createTodo(todoItem);

    closeDialog();
  } catch (error) {
    console.log("save: ", error);
  }
};
</script>

<template>
  <form
    v-if="currentTodo"
    class="flex flex-col gap-6 py-1"
    @submit.prevent="save"
    @keyup.enter="save"
  >
    <div class="flex items-center">
      <label for="" class="font-bold">Add to your favorites</label>
      <Button
        v-tooltip.bottom="{
          value: currentTodo.fav ? 'Remove from favorites' : 'Add to favorites',
        }"
        rounded
        text
        aria-label="Favorite"
        icon="pi pi-heart"
        :severity="currentTodo.fav ? 'danger' : 'success'"
        class="ml-2"
        :disabled="isLoading"
        @click="currentTodo.fav = !currentTodo.fav"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="title">Title*</label>
      <InputText
        id="title"
        v-model="currentTodo.title"
        :disabled="isLoading"
        :invalid="!!errors?.title"
      />
      <InlineMessage v-if="errors?.title" severity="error">{{
        errors.title
      }}</InlineMessage>
    </div>
    <div class="flex flex-col gap-2">
      <label for="description">Description</label>
      <InputText
        id="description"
        v-model="currentTodo.description"
        :disabled="isLoading"
      />
    </div>
    <div>
      <Checkbox v-model="currentTodo.completed" binary input-id="completed" />
      <label for="completed" class="ml-2"> Completed </label>
    </div>
    <div class="flex flex-col gap-2">
      <div>
        <Checkbox
          v-model="needDeadline"
          binary
          input-id="deadline"
          :disabled="isLoading"
        />
        <label for="deadline" class="ml-2">Need deadline?</label>
      </div>
      <Calendar
        v-model="currentTodo.deadline"
        show-icon
        show-time
        :show-on-focus="false"
        :disabled="!needDeadline || isLoading"
      />
    </div>
    <div class="flex flex-col">
      <label for="priority">Priority</label>
      <Dropdown
        id="priority"
        v-model="currentTodo.priority"
        :options="priorityOptions"
        :disabled="isLoading"
      ></Dropdown>
    </div>
    <div class="flex flex-col">
      <label for="order">Order* </label>
      <div class="mt-2">
        <InputNumber
          id="order"
          v-model="currentTodo.order"
          show-buttons
          :min="1"
          :disabled="isLoading"
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus text-sm" />
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus text-sm" />
          </template>
        </InputNumber>
      </div>
    </div>

    <div class="flex justify-end">
      <Button :loading="isLoading" @click="save">Save</Button>
    </div>
  </form>
</template>
