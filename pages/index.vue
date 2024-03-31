<script setup lang="ts">
import {useLogout} from '~/app/composables/logout'

const { logout } = useLogout()
</script>
<template>
    <div class="container">
        
        <div class="max-w-[800px] mx-auto my-4">
            <div class="flex justify-end">
                <Button @click="logout" label="Logout" severity="secondary"></Button>
            </div>
            <TodoList />
        </div>
    </div>
</template>