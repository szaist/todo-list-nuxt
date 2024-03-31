<script lang="ts" setup>
import type { Todo } from "~/app/models/Todo";
import { SIDE, Priority } from "~/app/types";

interface Props {
  item: Todo;
  index: number;
}

const props = defineProps<Props>();
const emit = defineEmits([
  "drop",
  "dragstart",
  "toggleCompleted",
  "toggleFavorite",
  "deleteTodo",
]);

const dateOptions = computed<Intl.DateTimeFormatOptions>(() => ({
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
}));

const router = useRouter();
const confirm = useConfirm();

const onDrop = (event: DragEvent, index: number, side: SIDE) => {
  emit("drop", event, index, side);
};

const startDrag = (event: DragEvent, item: Todo) => {
  emit("dragstart", event, item);
};

const toggleCompleted = () => {
  emit("toggleCompleted");
};

const toggleFavorite = () => {
  emit("toggleFavorite");
};

const navigateToEdit = () => {
  router.push(`/todo/${props.item.id}`);
};

const deleteTodo = () => {
  confirm.require({
    message: "Are you sure you want to delete this todo?",
    header: "Confirmation",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    accept: () => {
      emit("deleteTodo", props.item.id);
    },
  });
};
</script>

<template>
  <div
    :class="{ 'opacity-30': item.completed }"
    class="cursor-pointer"
    @click="toggleCompleted"
  >
    <div
      class="h-[15px]"
      @drop="onDrop($event, index, SIDE.BEFORE)"
      @dragenter.prevent
      @dragover.prevent
    />
    <div
      class="rounded-lg border px-2 py-1"
      draggable="true"
      @dragstart="startDrag($event, item)"
    >
      <div class="flex items-center justify-between">
        <div>
          <Tag
            :value="item.priority.toUpperCase()"
            rounded
            :severity="
              item.priority === Priority.LOW
                ? 'primary'
                : item.priority === Priority.MEDIUM
                  ? 'warning'
                  : 'danger'
            "
          />
        </div>
        <div class="flex gap-1">
          <Button
            rounded
            text
            aria-label="Edit"
            icon="pi pi-pencil"
            severity="info"
            @click.stop="navigateToEdit"
          />
          <Button
            v-tooltip.bottom="{
              value: item.fav ? 'Remove from favorites' : 'Add to favorites',
            }"
            rounded
            text
            aria-label="Favorite"
            icon="pi pi-heart"
            :severity="item.fav ? 'danger' : 'success'"
            @click.stop="toggleFavorite"
          />
          <Button
            rounded
            text
            aria-label="Delete"
            icon="pi pi-trash"
            severity="danger"
            @click.stop="deleteTodo"
          />
        </div>
      </div>
      <div class="text-xl font-bold">
        {{ item.title }}
      </div>
      <div>
        {{ item?.description }}
      </div>
      <div class="flex justify-end italic">
        {{
          item?.deadline
            ? new Date(item.deadline).toLocaleString("en-US", dateOptions)
            : ""
        }}
      </div>
    </div>
    <div
      class="h-[15px]"
      @drop="onDrop($event, index, SIDE.AFTER)"
      @dragenter.prevent
      @dragover.prevent
    />
  </div>
</template>
