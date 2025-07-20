<template>
  <input
    type="file"
    :accept="accept"
    v-bind="$attrs"
    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
  />
</template>

<script setup lang="ts">
defineProps<{ accept?: string }>()
</script> 