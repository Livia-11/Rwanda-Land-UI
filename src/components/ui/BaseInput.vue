<template>
  <input
    :type="type"
    :placeholder="placeholder"
    v-bind="$attrs"
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
    class="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number
  type?: string
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue'])
</script> 