<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <slot name="head" />
      </tr>
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>

<style scoped>
tbody tr:hover {
  background-color: #f0f6ff;
}
</style>

<script setup lang="ts">
// Table wrapper
</script> 