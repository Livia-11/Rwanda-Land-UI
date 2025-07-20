<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div
      class="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-lg w-full relative"
    >
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        &times;
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>();
</script>
