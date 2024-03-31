<script lang="ts" setup>
</script>

<template>
     <div class="cursor-pointer my-4">        
        <div class="px-2 py-1 border rounded-lg">
            <div class="my-2">
                <Skeleton class="max-w-[200px] h-[10px]"/>
            </div>
            <div class="mb-1">
                <Skeleton class="max-w-[250px] h-[10px]"/>
            </div>
            <div class="my-1">
                <Skeleton class="max-w-[400px] h-[20px]"/>
            </div>
            <div class="flex justify-end mb-2">
                <Skeleton class="max-w-[150px] h-[10px]"/> 
            </div>
        </div>
    </div>
</template>