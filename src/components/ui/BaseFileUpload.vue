<template>
  <div>
    <input
      type="file"
      :accept="accept"
      v-bind="$attrs"
      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
      @change="onFileChange"
    />
    <div v-if="fileName" class="mt-1 text-xs text-blue-700">Selected: {{ fileName }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ accept?: string }>()
const fileName = ref('')
function onFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  fileName.value = files && files.length > 0 ? files[0].name : ''
}
</script> 