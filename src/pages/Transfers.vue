<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8 text-center text-blue-800">Land Transfer</h1>
    <BaseCard class="mb-10 bg-white/90 border-blue-100 shadow-lg">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label class="block text-blue-700 font-semibold mb-1">Select Land <span class="text-red-500">*</span></label>
          <BaseSelect v-model="selectedLandId" class="bg-blue-50 focus:ring-blue-400 w-full">
            <option value="">Select your land</option>
            <option v-for="land in userLands" :key="land.id" :value="land.id">{{ land.parcel_id }} - {{ land.location }}</option>
          </BaseSelect>
          <div v-if="selectedLandIdError" class="text-xs text-red-500 mt-1">{{ selectedLandIdError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">Parcel ID <span class="text-red-500">*</span></label>
          <BaseInput v-model="parcelId" type="text" placeholder="e.g. 12345" class="bg-blue-50 focus:ring-blue-400" />
          <div v-if="parcelIdError" class="text-xs text-red-500 mt-1">{{ parcelIdError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">Transferee Name <span class="text-red-500">*</span></label>
          <BaseInput v-model="transfereeName" type="text" placeholder="e.g. John Doe" class="bg-blue-50 focus:ring-blue-400" />
          <div v-if="transfereeNameError" class="text-xs text-red-500 mt-1">{{ transfereeNameError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">Transferee Email <span class="text-red-500">*</span></label>
          <BaseInput v-model="transfereeEmail" type="email" placeholder="e.g. john@example.com" class="bg-blue-50 focus:ring-blue-400" />
          <div v-if="transfereeEmailError" class="text-xs text-red-500 mt-1">{{ transfereeEmailError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">Transfer Type <span class="text-red-500">*</span></label>
          <BaseSelect v-model="transferType" class="bg-blue-50 focus:ring-blue-400 w-full">
            <option value="">Select type</option>
            <option value="sale">Sale</option>
            <option value="gift">Gift</option>
            <option value="inheritance">Inheritance</option>
            <option value="other">Other</option>
          </BaseSelect>
          <div v-if="transferTypeError" class="text-xs text-red-500 mt-1">{{ transferTypeError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">Reason (optional)</label>
          <BaseInput v-model="reason" type="text" placeholder="Reason for transfer (optional)" class="bg-blue-50 focus:ring-blue-400" />
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">Supporting Document URLs <span class="text-red-500">*</span></label>
          <div v-for="(doc, i) in documents" :key="i" class="flex gap-2 mb-2">
            <BaseInput v-model="documents[i]" type="url" placeholder="Paste document link (PDF/image)" class="bg-blue-50 flex-1" />
            <BaseButton v-if="documents.length > 1" type="button" class="bg-red-500 hover:bg-red-600 px-2 py-1 text-xs" @click="documents.splice(i, 1)">Remove</BaseButton>
          </div>
          <BaseButton type="button" class="bg-green-600 hover:bg-green-700 px-2 py-1 text-xs mt-1" @click="documents.push('')">Add Another</BaseButton>
          <div v-if="documentsError" class="text-xs text-red-500 mt-1">{{ documentsError }}</div>
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
    <BaseCard class="bg-white/90 border-blue-100 shadow overflow-x-auto">
      <h2 class="text-lg font-semibold text-blue-700 mb-4">Transfers</h2>
      <div class="w-full">
        <BaseTable class="min-w-full">
          <template #head>
            <th class="text-left px-4 py-2 whitespace-nowrap">Parcel ID</th>
            <th class="text-left px-4 py-2 whitespace-nowrap">Transferee Name</th>
            <th class="text-left px-4 py-2 whitespace-nowrap">Transferee Email</th>
            <th class="text-left px-4 py-2 whitespace-nowrap">Type</th>
            <th class="text-left px-4 py-2 whitespace-nowrap">Status</th>
            <th class="text-left px-4 py-2 whitespace-nowrap">Date</th>
            <th class="text-left px-4 py-2 whitespace-nowrap">Documents</th>
            <th class="text-left px-4 py-2 whitespace-nowrap">Actions</th>
          </template>
          <tr v-for="transfer in transfers" :key="transfer.id" class="hover:bg-blue-50 transition-colors">
            <td class="px-4 py-2 whitespace-nowrap">{{ transfer.parcel_id }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ transfer.transferee_name }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ transfer.transferee_email }}</td>
            <td class="px-4 py-2 whitespace-nowrap capitalize">{{ transfer.transfer_type }}</td>
            <td class="px-4 py-2 whitespace-nowrap">
              <span v-if="transfer.status === 'pending'" class="text-yellow-600 font-semibold">Pending</span>
              <span v-else-if="transfer.status === 'completed'" class="text-green-600 font-semibold">Completed</span>
              <span v-else-if="transfer.status === 'rejected'" class="text-red-600 font-semibold">Rejected</span>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">{{ transfer.date }}</td>
            <td class="px-4 py-2 whitespace-nowrap">
              <div v-if="transfer.documents && transfer.documents.length">
                <a v-for="(doc, i) in transfer.documents" :key="i" :href="doc" target="_blank" class="text-blue-600 underline block truncate max-w-xs">View {{ i + 1 }}</a>
              </div>
              <span v-else class="text-gray-400">—</span>
            </td>
            <td class="px-4 py-2 whitespace-nowrap space-x-2">
              <BaseButton class="bg-blue-600 hover:bg-blue-700 px-2 py-1 text-xs" @click="openUpdateModal(transfer)">Update</BaseButton>
              <BaseButton class="bg-red-600 hover:bg-red-700 px-2 py-1 text-xs" @click="openDeleteModal(transfer)">Delete</BaseButton>
            </td>
          </tr>
        </BaseTable>
      </div>
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
import BaseInput from '../components/ui/BaseInput.vue'
import BaseSelect from '../components/ui/BaseSelect.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseTable from '../components/ui/BaseTable.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import BaseToast from '../components/ui/BaseToast.vue'
import { supabase } from '../lib/supabase'

interface Land {
  id: string
  parcel_id: string
  location: string
}
interface Transfer {
  id: string
  land_id: string
  parcel_id: string
  transferee_name: string
  transferee_email: string
  transfer_type: string
  reason?: string
  status: string
  documents: string[]
  created_at?: string
  date?: string
}

const parcelId = ref('')
const transfereeName = ref('')
const transfereeEmail = ref('')
const transferType = ref('')
const reason = ref('')
const documents = ref<string[]>([''])
const selectedLandId = ref('')
const userLands = ref<Land[]>([])

const parcelIdError = ref('')
const transfereeNameError = ref('')
const transfereeEmailError = ref('')
const transferTypeError = ref('')
const documentsError = ref('')
const selectedLandIdError = ref('')

const loading = ref(false)
const toast = ref({ show: false, message: '' })
const backendAvailable = true
const transfers = ref<Transfer[]>([])

const showUpdateModal = ref(false)
const showDeleteModal = ref(false)
let transferToModify: Transfer | null = null

function validateForm() {
  parcelIdError.value = parcelId.value.trim() === '' ? 'Parcel ID is required' : '';
  transfereeNameError.value = transfereeName.value.trim() === '' ? 'Transferee name is required' : '';
  transfereeEmailError.value = !/^\S+@\S+\.\S+$/.test(transfereeEmail.value) ? 'Valid email required' : '';
  transferTypeError.value = transferType.value.trim() === '' ? 'Transfer type is required' : '';
  selectedLandIdError.value = selectedLandId.value.trim() === '' ? 'Please select a land' : '';
  documentsError.value = !Array.isArray(documents.value) || documents.value.length === 0 || !documents.value.every(url => /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url)) ? 'At least one valid document URL is required' : '';
  return !parcelIdError.value && !transfereeNameError.value && !transfereeEmailError.value && !transferTypeError.value && !selectedLandIdError.value && !documentsError.value;
}

function showBackendWarning() {
  toast.value = { show: true, message: 'Backend is not connected. Data will not be saved to the server.' }
  setTimeout(() => (toast.value.show = false), 2000)
}

async function fetchUserLands() {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) return
  const { data, error } = await supabase
    .from('lands')
    .select('id, parcel_id, location')
    .eq('user_id', userData.user.id)
  if (!error) userLands.value = (data as Land[]) || []
}

async function fetchTransfers() {
  loading.value = true
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) throw new Error('User not authenticated')
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    transfers.value = ((data as Transfer[]) || []).map(t => ({
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
    fetchUserLands()
    fetchTransfers()
  }
})

async function onSubmit() {
  if (!validateForm()) {
    return;
  }
  loading.value = true
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) throw new Error('User not authenticated')
    const { error } = await supabase.from('transfers').insert([
      {
        user_id: userData.user.id,
        land_id: selectedLandId.value,
        parcel_id: parcelId.value,
        transferee_name: transfereeName.value,
        transferee_email: transfereeEmail.value,
        transfer_type: transferType.value,
        reason: reason.value,
        status: 'pending',
        documents: documents.value,
      },
    ])
    if (error) throw error
    toast.value = { show: true, message: 'Transfer initiated successfully!' }
    setTimeout(() => (toast.value.show = false), 2000)
    parcelId.value = ''
    transfereeName.value = ''
    transfereeEmail.value = ''
    transferType.value = ''
    reason.value = ''
    documents.value = ['']
    selectedLandId.value = ''
    await fetchTransfers()
  } catch (err) {
    toast.value = { show: true, message: 'Submission failed. Please try again.' }
    setTimeout(() => (toast.value.show = false), 2000)
  } finally {
    loading.value = false
  }
}

function openUpdateModal(transfer: Transfer) {
  transferToModify = transfer
  showUpdateModal.value = true
}
function openDeleteModal(transfer: Transfer) {
  transferToModify = transfer
  showDeleteModal.value = true
}
function confirmDelete() {
  if (transferToModify) {
    transfers.value = transfers.value.filter(t => t.id !== transferToModify!.id)
    toast.value = { show: true, message: 'Transfer deleted.' }
    setTimeout(() => (toast.value.show = false), 2000)
  }
  showDeleteModal.value = false
  transferToModify = null
}
</script>
