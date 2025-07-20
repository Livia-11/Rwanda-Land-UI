<template>
  <div class="flex items-center space-x-4">
    <template v-for="(step, idx) in steps" :key="step">
      <div class="flex items-center">
        <div
          :class="[
            'rounded-full w-8 h-8 flex items-center justify-center font-bold',
            idx <= active
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-500',
          ]"
        >
          {{ idx + 1 }}
        </div>
        <span class="ml-2">{{ step }}</span>
      </div>
      <div
        v-if="idx < steps.length - 1"
        class="flex-1 h-1 bg-gray-300 mx-2"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{ steps: string[]; active: number }>();
</script>
