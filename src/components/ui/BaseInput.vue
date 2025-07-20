<template>
  <input
    :type="type"
    :placeholder="placeholder"
    v-bind="$attrs"
    class="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
  />
</template>

<script setup lang="ts">
defineProps<{
  type?: string
  placeholder?: string
}>()
</script> 