<template>
  <select
    v-bind="$attrs"
    :value="props.modelValue"
    @change="emit('update:modelValue', $event.target.value)"
    class="block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | number
}>()
const emit = defineEmits(['update:modelValue'])
// Accepts all native select attributes via $attrs
</script>
