<template>
  <button
    v-bind="$attrs"
    class="inline-flex items-center justify-center rounded bg-primary-600 px-4 py-2 text-white font-semibold shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
// Accepts all native button attributes via $attrs
</script> 