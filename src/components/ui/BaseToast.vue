<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded shadow px-4 py-2 text-gray-800"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
</script>
