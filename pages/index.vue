<script setup lang="ts">
import {TodoRepositoryAPI} from "~/app/repositories/TodoRepository"

const todoRepository = new TodoRepositoryAPI()


const response = await todoRepository.list({perPage: 12, page: 1})

console.log(response);
</script>
<template>
    <div class="container">
        <div class="max-w-[400px] mx-auto">
            <Card v-for="r in response.todos" class="mb-2" :draggable="true">
                <template #title>
                    <div class="flex justify-between">
                        <div>
                            {{ r.title }}
                        </div>
                        <div class>
                            <Button rounded text :severity="r.fav ? 'danger': 'secondary'" icon="pi pi-heart"/>
                        </div>
                    </div>
                    
                </template>
                <template #content>
                    {{ r.description }}
                </template>
                <template #footer>
                    <div class="flex">
                        <div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>