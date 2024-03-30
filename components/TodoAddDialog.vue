<script lang="ts" setup>
import type { CreateTodoRequest } from '~/app/contracts/todo/CreateTodoRequest'
import { Priority } from '~/app/types'

const dialogRef = inject('dialogRef')
const todoStore = useTodoStore()
const currentTodo = ref<CreateTodoRequest>({
    title: '',
    description: '',
    order: 1,
    priority: Priority.LOW,
    completed: false,
    deadline: new Date(),
    fav: false,
})
const isLoading = ref<boolean>(false)
const needDeadline = ref<boolean>(false)

const priorityOptions = computed(() => Object.values(Priority))

const closeDialog = () => {
    dialogRef.value.close()
}

const save = async () => {
    try {
        const todoItem: CreateTodoRequest = {
            title: currentTodo.value.title,
            description: currentTodo.value.description,
            order: currentTodo.value.order,
            priority: currentTodo.value.priority,
            completed: currentTodo.value.completed,
            fav: currentTodo.value.fav,
        }

        if(needDeadline.value){
            todoItem.deadline = currentTodo.value.deadline
        }

        await todoStore.createTodo(todoItem)

        closeDialog()
    } catch (error) {
        console.log("save: ", error);
    }
}
</script>

<template>
    <form class="flex flex-col gap-6 py-1" v-if="currentTodo" @submit.prevent="save" @keyup.enter="save">
        <div class="flex items-center">
            <label for="" class="font-bold">Add to your favorites</label>
            <Button 
                rounded
                text
                aria-label="Favorite"
                icon="pi pi-heart"
                :severity="currentTodo.fav ? 'danger' : 'success'"
                @click="currentTodo.fav = !currentTodo.fav"
                v-tooltip.bottom="{
                    value: currentTodo.fav ? 'Remove from favorites' : 'Add to favorites'
                }"
                class="ml-2"
            />
        </div>
        <div class="flex flex-col gap-2">
            <label for="title">Title</label>
            <InputText id="title" v-model="currentTodo.title" :disabled="isLoading"/>
        </div>
        <div class="flex flex-col gap-2">
            <label for="description">Description</label>
            <InputText id="description" v-model="currentTodo.description" :disabled="isLoading"/>
        </div>
        <div>
            <Checkbox v-model="currentTodo.completed" binary input-id="completed"/>
            <label for="completed" class="ml-2">
                Completed
            </label>
        </div>
        <div class="flex flex-col gap-2">
            <div>
                <Checkbox v-model="needDeadline" binary input-id="deadline"/>
                <label for="deadline" class="ml-2">Need deadline?</label>
            </div>
            <Calendar v-model="currentTodo.deadline" showIcon showTime :showOnFocus="false" :disabled="!needDeadline"/>
        </div>
        <div class="flex flex-col">
            <label for="priority">Priority</label>
            <Dropdown :options="priorityOptions" v-model="currentTodo.priority" id="priority"></Dropdown>
        </div>
        <div class="flex flex-col">
            <label for="order">Order</label>
            <div class="mt-2">
                <InputNumber v-model="currentTodo.order" id="order" showButtons :min="1">
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
            <Button @click="save" :loading="isLoading">Save</Button>
        </div>
    </form>
</template>