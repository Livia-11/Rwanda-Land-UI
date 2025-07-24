<template>
  <div class="p-4 border rounded max-w-2xl mx-auto mt-20 bg-white shadow">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Active Land Leases</h2>
      <router-link to="/add-lease" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Add Lease</router-link>
    </div>
    <div v-if="isLoading || isFetching">Loading land leases...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else>
      <li v-for="lease in activeLeases" :key="lease.id" class="mb-4 border-b pb-2">
        <div class="font-medium">Lease #{{ lease.lease_number }} - {{ lease.lessee_name }}</div>
        <div class="text-gray-600 text-sm">Purpose: {{ lease.purpose || 'N/A' }}</div>
        <div class="text-gray-600 text-sm">Start: {{ formatDate(lease.start_date) }} | End: {{ formatDate(lease.end_date) }}</div>
        <div class="text-gray-600 text-sm">Payment: {{ formatAmount(lease.payment_amount) }}</div>
        <div class="text-gray-600 text-sm">Location: ({{ lease.latitude }}, {{ lease.longitude }})</div>
        <div class="text-xs text-green-700" v-if="lease.status === 'active'">Status: Active</div>
        <div class="text-xs text-red-700" v-else>Status: {{ lease.status }}</div>
      </li>
    </ul>
    <div class="flex items-center gap-4 mt-4 justify-center">
      <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Previous</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">Next</button>
      <button @click="() => refetch()" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Refetch</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery, useMutation } from '@tanstack/vue-query'
import { supabase } from '../lib/supabase'
import { computed, ref } from 'vue'

const PAGE_SIZE = 5
const page = ref(1)

// Form state
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

// Fetch function for paginated land leases
const fetchLandLeases = async ({ queryKey }: { queryKey: any[] }) => {
  const [_key, page] = queryKey
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, error, count } = await supabase
    .from('land_leases')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { data, count }
}

const { data, error, isLoading, refetch, isFetching } = useQuery({
  queryKey: ['land_leases', page],
  queryFn: fetchLandLeases,
})

const activeLeases = computed(() =>
  (data?.value?.data || []).filter(lease => lease.status === 'active')
)
const totalCount = computed(() => data?.value?.count || 0)
const totalPages = computed(() => Math.ceil(totalCount.value / PAGE_SIZE))

function formatDate(dateStr: string) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString()
}
function formatAmount(amount: number) {
  if (amount == null) return 'N/A'
  return `$${Number(amount).toLocaleString()}`
}
function nextPage() {
  if (page.value < totalPages.value) page.value++
}
function prevPage() {
  if (page.value > 1) page.value--
}

// Mutation for adding a new lease
const mutation = useMutation({
  mutationFn: async (newLease: any) => {
    const { error } = await supabase.from('land_leases').insert([newLease])
    if (error) throw error
  },
  onSuccess: () => {
    refetch()
    resetForm()
  },
})

function onSubmit() {
  // Validate required fields
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
.bg-white {
  background: #fff;
}
.shadow {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07), 0 1.5px 4px 0 rgba(0,0,0,0.03);
}
</style> 