<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh]">
    <div class="p-6 border rounded-lg bg-white shadow max-w-5xl w-full">
      <h2 class="text-2xl font-bold mb-6 text-center">Add New Land Lease</h2>
      <form @submit.prevent="onSubmit" class="flex flex-wrap gap-4 items-end justify-center">
        <div class="flex flex-col w-48">
          <label class="text-sm font-medium mb-1">Lease Number*</label>
          <input v-model="form.lease_number" class="border rounded px-2 py-1" required />
        </div>
        <div class="flex flex-col w-48">
          <label class="text-sm font-medium mb-1">Lessee Name*</label>
          <input v-model="form.lessee_name" class="border rounded px-2 py-1" required />
        </div>
        <div class="flex flex-col w-48">
          <label class="text-sm font-medium mb-1">Purpose</label>
          <input v-model="form.purpose" class="border rounded px-2 py-1" />
        </div>
        <div class="flex flex-col w-40">
          <label class="text-sm font-medium mb-1">Start Date</label>
          <input v-model="form.start_date" type="date" class="border rounded px-2 py-1" />
        </div>
        <div class="flex flex-col w-40">
          <label class="text-sm font-medium mb-1">End Date</label>
          <input v-model="form.end_date" type="date" class="border rounded px-2 py-1" />
        </div>
        <div class="flex flex-col w-36">
          <label class="text-sm font-medium mb-1">Payment</label>
          <input v-model.number="form.payment_amount" type="number" min="0" class="border rounded px-2 py-1" />
        </div>
        <div class="flex flex-col w-36">
          <label class="text-sm font-medium mb-1">Latitude*</label>
          <input v-model.number="form.latitude" type="number" step="any" class="border rounded px-2 py-1" required />
        </div>
        <div class="flex flex-col w-36">
          <label class="text-sm font-medium mb-1">Longitude*</label>
          <input v-model.number="form.longitude" type="number" step="any" class="border rounded px-2 py-1" required />
        </div>
        <div class="flex flex-col w-32">
          <label class="text-sm font-medium mb-1">Status</label>
          <select v-model="form.status" class="border rounded px-2 py-1">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" :disabled="mutation.isPending.value" class="h-10 px-5 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition">Add Lease</button>
      </form>
      <div v-if="mutation.isError.value" class="text-red-700 mt-2 text-center">{{ mutation.error.value?.message || 'Error adding lease' }}</div>
      <div v-if="mutation.isSuccess.value" class="text-green-700 mt-4 text-center">
        Lease added successfully!
        <router-link to="/" class="ml-2 underline text-blue-700">Go to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { supabase } from '../lib/supabase'
import { ref } from 'vue'

const form = ref({
  lease_number: '',
  lessee_name: '',
  purpose: '',
  start_date: '',
  end_date: '',
  payment_amount: null,
  latitude: null,
  longitude: null,
  status: 'active',
})

const mutation = useMutation({
  mutationFn: async (newLease: any) => {
    const { error } = await supabase.from('land_leases').insert([newLease])
    if (error) throw error
  },
  onSuccess: () => {
    resetForm()
  },
})

function onSubmit() {
  if (!form.value.lease_number || !form.value.lessee_name || form.value.latitude == null || form.value.longitude == null) {
    alert('Please fill in all required fields.')
    return
  }
  mutation.mutate({ ...form.value })
}
function resetForm() {
  form.value = {
    lease_number: '',
    lessee_name: '',
    purpose: '',
    start_date: '',
    end_date: '',
    payment_amount: null,
    latitude: null,
    longitude: null,
    status: 'active',
  }
}
</script>

<style scoped>
@media (max-width: 1200px) {
  form {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  form > * {
    width: 100% !important;
    margin-bottom: 0.75rem;
  }
}
</style> 