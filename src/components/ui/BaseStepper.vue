<template>
  <div class="flex items-center space-x-4">
    <template v-for="(step, idx) in steps" :key="step">
      <div class="flex items-center">
        <div :class="[
          'w-8 h-8 flex items-center justify-center font-bold text-lg rounded-full border-2',
          idx < active ? 'bg-blue-600 text-white border-blue-600' : idx === active ? 'bg-blue-100 text-blue-700 border-blue-600 animate-pulse' : 'bg-gray-200 text-gray-400 border-gray-300'
        ]">
          <span v-if="idx < active">✔️</span>
          <span v-else-if="idx === active">⏳</span>
          <span v-else>⬤</span>
        </div>
        <span class="ml-2 text-sm font-medium" :class="idx === active ? 'text-blue-700' : 'text-gray-500'">{{ step }}</span>
      </div>
      <div v-if="idx < steps.length - 1" class="flex-1 h-1 bg-gray-300 mx-2"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{ steps: string[]; active: number }>()
</script>
