<script setup lang="ts">
import type { UpdateTodoRequest } from "~/app/contracts/todo/UpdateTodoRequest";
import type { Todo } from "~/app/models/Todo";
import { Priority } from "~/app/types";
import { CreateTodoValidation } from "~/app/validation/TodoValidation";
import { ValidationError } from "yup";

const todoStore = useTodoStore();
const route = useRoute();
const router = useRouter();

const id = route.params.id.toString();

const isLoading = ref<boolean>(true);

const currentTodo = ref<Todo>();

const needDeadline = ref<boolean>();

const errors = ref<Record<string, string>>({});

const priorityOptions = computed(() => Object.values(Priority));

onMounted(async () => {
  if (!id) return;
  isLoading.value = true;
  await todoStore.fetchTodos();

  const todo = todoStore.getTodoById(id);

  if (!todo) {
    return router.push("/");
  }

  currentTodo.value = { ...todo };
  needDeadline.value = !!currentTodo.value.deadline;

  isLoading.value = false;
});

const save = async () => {
  if (currentTodo.value === undefined) return;

  const request: UpdateTodoRequest = {
    title: currentTodo.value?.title,
    order: currentTodo.value.order,
    completed: currentTodo.value.completed,
    description: currentTodo.value.description,
    fav: currentTodo.value.fav,
    priority: currentTodo.value.priority,
  };

  if (needDeadline.value) {
    request.deadline = currentTodo.value.deadline;
  }

  try {
    errors.value = {};
    await CreateTodoValidation.validate(request, { abortEarly: false });
  } catch (error) {
    const err = error as ValidationError;

    err.inner.forEach((e) => {
      const name = e.path ?? "";
      errors.value[name] = e.message;
    });
    return;
  }

  try {
    await todoStore.patchTodo(id, request);

    router.push("/");
  } catch (error) {
    console.log("save: ", error);
  }
};
</script>
<template>
  <div class="container">
    <Card class="mt-4">
      <template #title>
        <div v-if="currentTodo" class="flex items-center justify-between">
          <div>Task - {{ currentTodo.title }}</div>
          <div class="flex">
            <Button
              v-tooltip.bottom="{
                value: currentTodo.fav
                  ? 'Remove from favorites'
                  : 'Add to favorites',
              }"
              rounded
              text
              aria-label="Favorite"
              icon="pi pi-heart"
              :severity="currentTodo.fav ? 'danger' : 'success'"
              :disabled="isLoading"
              @click="currentTodo.fav = !currentTodo.fav"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div v-if="currentTodo" class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="title">Title</label>
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
            <Checkbox
              v-model="currentTodo.completed"
              binary
              input-id="completed"
              :disabled="isLoading"
            />
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
            <label for="order">Order</label>
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
        </div>
      </template>
    </Card>
  </div>
</template>
