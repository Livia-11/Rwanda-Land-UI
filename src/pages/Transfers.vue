<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8 text-center text-blue-800">Land Transfer</h1>
    <BaseCard class="mb-10 bg-white/90 border-blue-100 shadow-lg">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Recipient ID <span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="recipientId" type="text" placeholder="e.g. user123" class="bg-blue-50 focus:ring-blue-400" />
          <div v-if="recipientIdError" class="text-xs text-red-500 mt-1">{{ recipientIdError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Parcel ID <span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="parcelId" type="text" placeholder="e.g. 12345" class="bg-blue-50 focus:ring-blue-400" />
          <div v-if="parcelIdError" class="text-xs text-red-500 mt-1">{{ parcelIdError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Contract (PDF/Image) <span class="text-red-500">*</span>
          </label>
          <BaseInput v-model="contractFileUrl" type="url" placeholder="Paste the link to your contract document (PDF/image)" class="bg-blue-50 focus:ring-blue-400" />
          <div v-if="contractFileUrlError" class="text-xs text-red-500 mt-1">{{ contractFileUrlError }}</div>
        </div>
        <div class="pt-2 text-center">
          <BaseButton type="submit" class="bg-blue-700 hover:bg-blue-800" :disabled="loading">
            <span v-if="loading">Submitting...</span>
            <span v-else>Initiate Transfer</span>
          </BaseButton>
        </div>
      </form>
    </BaseCard>
    <!-- Toast notification -->
    <BaseToast :show="toast.show" v-if="toast.show">
      <span class="font-semibold">{{ toast.message }}</span>
    </BaseToast>
    <!-- List of transfers -->
    <BaseCard class="bg-white/90 border-blue-100 shadow">
      <h2 class="text-lg font-semibold text-blue-700 mb-4">Transfers</h2>
      <BaseTable>
        <template #head>
          <th class="text-left px-4 py-2">Recipient ID</th>
          <th class="text-left px-4 py-2">Parcel ID</th>
          <th class="text-left px-4 py-2">Status</th>
          <th class="text-left px-4 py-2">Date</th>
          <th class="text-left px-4 py-2">Contract</th>
          <th class="text-left px-4 py-2">Actions</th>
        </template>
        <tr v-for="transfer in transfers" :key="transfer.id">
          <td class="px-4 py-2">{{ transfer.recipient_name }}</td>
          <td class="px-4 py-2">{{ transfer.parcel_id }}</td>
          <td class="px-4 py-2">
            <span v-if="transfer.status === 'Pending'" class="text-yellow-600 font-semibold">Pending</span>
            <span v-else-if="transfer.status === 'Completed'" class="text-green-600 font-semibold">Completed</span>
            <span v-else-if="transfer.status === 'Rejected'" class="text-red-600 font-semibold">Rejected</span>
          </td>
          <td class="px-4 py-2">{{ transfer.date }}</td>
          <td class="px-4 py-2">
            <a v-if="transfer.contract_document_url" :href="transfer.contract_document_url" target="_blank" class="text-blue-600 underline">View</a>
            <span v-else class="text-gray-400">—</span>
          </td>
          <td class="px-4 py-2 space-x-2">
            <BaseButton class="bg-blue-600 hover:bg-blue-700 px-2 py-1 text-xs" @click="openUpdateModal(transfer)">Update</BaseButton>
            <BaseButton class="bg-red-600 hover:bg-red-700 px-2 py-1 text-xs" @click="openDeleteModal(transfer)">Delete</BaseButton>
          </td>
        </tr>
      </BaseTable>
    </BaseCard>
    <!-- Update Modal Placeholder -->
    <BaseModal :open="showUpdateModal" @close="showUpdateModal = false">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">Update Transfer</h3>
        <p>Update form goes here...</p>
        <BaseButton class="mt-4" @click="showUpdateModal = false">Close</BaseButton>
      </div>
    </BaseModal>
    <!-- Delete Modal Placeholder -->
    <BaseModal :open="showDeleteModal" @close="showDeleteModal = false">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">Confirm Delete</h3>
        <p>Are you sure you want to delete this transfer?</p>
        <div class="flex justify-end space-x-2 mt-4">
          <BaseButton class="bg-gray-300" @click="showDeleteModal = false">Cancel</BaseButton>
          <BaseButton class="bg-red-600 hover:bg-red-700 text-white" @click="confirmDelete">Delete</BaseButton>
        </div>
      </div>
    </BaseModal>
    <div v-if="!backendAvailable" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <strong>Warning:</strong> Backend is not connected. Data is not saved to the server.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseFileUpload from '@/components/ui/BaseFileUpload.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseToast from '@/components/ui/BaseToast.vue'
import { supabase } from '@/lib/supabase'

// Form state
const recipientId = ref('')
const parcelId = ref('')
const contractFileUrl = ref('')
const recipientIdError = ref('')
const parcelIdError = ref('')
const contractFileUrlError = ref('')
const loading = ref(false)
const toast = ref({ show: false, message: '' })

const backendAvailable = true // Set to true to use Supabase backend

// Transfers list (mock data for now)
const transfers = ref([])

// Modal state
const showUpdateModal = ref(false)
const showDeleteModal = ref(false)
let transferToModify = null

function validateForm() {
  recipientIdError.value = recipientId.value.trim() === '' ? 'Recipient ID is required' : ''
  parcelIdError.value = parcelId.value.trim() === '' ? 'Parcel ID is required' : ''
  // Validate contractFileUrl as a URL
  const urlPattern = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/
  contractFileUrlError.value = !urlPattern.test(contractFileUrl.value) ? 'A valid contract document URL is required' : ''
  return !recipientIdError.value && !parcelIdError.value && !contractFileUrlError.value
}

function showBackendWarning() {
  toast.value = { show: true, message: 'Backend is not connected. Data will not be saved to the server.' }
  setTimeout(() => (toast.value.show = false), 2000)
}

async function fetchTransfers() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    transfers.value = (data || []).map(t => ({
      ...t,
      date: t.created_at ? t.created_at.slice(0, 10) : '',
    }))
  } catch (err) {
    showBackendWarning()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (backendAvailable) {
    fetchTransfers()
  }
})

async function onSubmit() {
  if (!validateForm()) return
  loading.value = true
  try {
    if (!backendAvailable) {
      showBackendWarning()
      transfers.value.unshift({
        id: Date.now(),
        recipient_name: recipientId.value,
        parcel_id: parcelId.value,
        status: 'Pending',
        date: new Date().toISOString().slice(0, 10),
        contract_document_url: contractFileUrl.value,
      })
      recipientId.value = ''
      parcelId.value = ''
      contractFileUrl.value = ''
      loading.value = false
      return
    }
    // Insert transfer record
    const { error } = await supabase.from('transfers').insert([
      {
        recipient_name: recipientId.value,
        parcel_id: parcelId.value,
        contract_document_url: contractFileUrl.value,
        status: 'Pending',
      },
    ])
    if (error) throw error
    toast.value = { show: true, message: 'Transfer initiated successfully!' }
    setTimeout(() => (toast.value.show = false), 2000)
    recipientId.value = ''
    parcelId.value = ''
    contractFileUrl.value = ''
    await fetchTransfers()
  } catch (err) {
    toast.value = { show: true, message: 'Submission failed. Please try again.' }
    setTimeout(() => (toast.value.show = false), 2000)
  } finally {
    loading.value = false
  }
}

function openUpdateModal(transfer: any) {
  transferToModify = transfer
  showUpdateModal.value = true
}
function openDeleteModal(transfer: any) {
  transferToModify = transfer
  showDeleteModal.value = true
}
function confirmDelete() {
  if (transferToModify) {
    transfers.value = transfers.value.filter(t => t.id !== transferToModify.id)
    toast.value = { show: true, message: 'Transfer deleted.' }
    setTimeout(() => (toast.value.show = false), 2000)
  }
  showDeleteModal.value = false
  transferToModify = null
}
</script>
