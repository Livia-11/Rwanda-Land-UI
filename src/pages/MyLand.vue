<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8 text-center text-blue-800">Land Registration</h1>
    <BaseCard class="mb-10 bg-white/90 border-blue-100 shadow-lg">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Parcel ID <span class="text-red-500">*</span>
          </label>
          <BaseInput
            v-model="parcelId"
            type="text"
            placeholder="e.g. 12345"
            class="bg-blue-50 focus:ring-blue-400"
          />
          <span class="text-xs text-gray-500">Unique identifier for your land parcel.</span>
          <div v-if="parcelIdError" class="text-xs text-red-500 mt-1">{{ parcelIdError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Land Size (m²) <span class="text-red-500">*</span>
          </label>
          <BaseInput
            v-model="size"
            type="number"
            placeholder="e.g. 500"
            class="bg-blue-50 focus:ring-blue-400"
          />
          <span class="text-xs text-gray-500">Enter size in square meters.</span>
          <div v-if="sizeError" class="text-xs text-red-500 mt-1">{{ sizeError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Location <span class="text-red-500">*</span>
          </label>
          <BaseInput
            v-model="location"
            type="text"
            placeholder="e.g. Kigali, Rwanda"
            class="bg-blue-50 focus:ring-blue-400"
          />
          <span class="text-xs text-gray-500">Location of the land.</span>
          <div v-if="locationError" class="text-xs text-red-500 mt-1">{{ locationError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Ownership Type <span class="text-red-500">*</span>
          </label>
          <BaseSelect
            v-model="ownershipType"
            class="bg-blue-50 focus:ring-blue-400"
          >
            <option value="">Select Type</option>
            <option value="Individual">Individual</option>
            <option value="Joint">Joint</option>
            <option value="Company">Company</option>
          </BaseSelect>
          <div v-if="ownershipTypeError" class="text-xs text-red-500 mt-1">{{ ownershipTypeError }}</div>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Supporting Document URLs <span class="text-red-500">*</span>
          </label>
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
            <span v-else>Submit Application</span>
          </BaseButton>
        </div>
      </form>
    </BaseCard>
    <!-- Toast notification -->
    <BaseToast :show="toast.show" v-if="toast.show">
      <span class="font-semibold">{{ toast.message }}</span>
    </BaseToast>
    <!-- Step progress indicator -->
    <div class="mb-10">
      <BaseStepper :steps="['Pending', 'Under Review', 'Approved']" :active="0" />
    </div>
    <!-- List of submitted applications -->
    <BaseCard class="bg-white/90 border-blue-100 shadow">
      <h2 class="text-lg font-semibold text-blue-700 mb-4">Submitted Applications</h2>
      <BaseTable>
        <template #head>
          <th class="text-left px-4 py-2">Parcel ID</th>
          <th class="text-left px-4 py-2">Location</th>
          <th class="text-left px-4 py-2">Status</th>
          <th class="text-left px-4 py-2">Submission Date</th>
          <th class="text-left px-4 py-2">Documents</th>
        </template>
        <tr v-for="app in applications" :key="app.id">
          <td class="px-4 py-2">{{ app.parcel_id }}</td>
          <td class="px-4 py-2">{{ app.location }}</td>
          <td class="px-4 py-2">
            <span v-if="app.status === 'pending'" class="text-yellow-600 font-semibold">Pending</span>
            <span v-else-if="app.status === 'completed'" class="text-green-600 font-semibold">Completed</span>
            <span v-else-if="app.status === 'rejected'" class="text-red-600 font-semibold">Rejected</span>
          </td>
          <td class="px-4 py-2">{{ app.date }}</td>
          <td class="px-4 py-2">
            <div v-if="app.documents && app.documents.length">
              <a v-for="(doc, i) in app.documents" :key="i" :href="doc" target="_blank" class="text-blue-600 underline block">View {{ i + 1 }}</a>
            </div>
            <span v-else class="text-gray-400">—</span>
          </td>
        </tr>
      </BaseTable>
    </BaseCard>
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
import BaseStepper from '../components/ui/BaseStepper.vue'
import BaseTable from '../components/ui/BaseTable.vue'
import BaseToast from '../components/ui/BaseToast.vue'
import { useForm, useField } from 'vee-validate'
import { supabase } from '../lib/supabase'

interface Land {
  id: string
  parcel_id: string
  location: string
}
interface Application {
  id: string
  parcel_id: string
  size: string
  location: string
  ownership_type: string
  documents: string[]
  status: string
  created_at?: string
  date?: string
}

const initialValues = {
  parcel_id: '',
  size: '',
  location: '',
  ownership_type: '',
  documents: [''],
}

const { handleSubmit, resetForm } = useForm({
  initialValues,
  validationSchema: {
    parcel_id: (value: string) => typeof value === 'string' && value.trim() !== '' || 'Parcel ID is required',
    size: (value: string) => {
      const num = Number(value)
      return (!isNaN(num) && num > 0) || 'Land size is required'
    },
    location: (value: string) => typeof value === 'string' && value.trim() !== '' || 'Location is required',
    ownership_type: (value: string) => typeof value === 'string' && value.trim() !== '' || 'Ownership type is required',
    documents: (value: string[]) => Array.isArray(value) && value.length > 0 && value.every(url => /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url)) || 'At least one valid document URL is required',
  },
})

const { value: parcelId, errorMessage: parcelIdError } = useField<string>('parcel_id')
const { value: size, errorMessage: sizeError } = useField<string>('size')
const { value: location, errorMessage: locationError } = useField<string>('location')
const { value: ownershipType, errorMessage: ownershipTypeError } = useField<string>('ownership_type')
const { value: documents, errorMessage: documentsError } = useField<string[]>('documents')

const loading = ref(false)
const toast = ref({ show: false, message: '' })
const backendAvailable = true
const applications = ref<Application[]>([])

function showToast(message: string) {
  toast.value = { show: true, message }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

async function fetchApplications() {
  loading.value = true
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) throw new Error('User not authenticated')
    const { data, error } = await supabase
      .from('lands')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    applications.value = ((data as Application[]) || []).map(app => ({
      ...app,
      date: app.created_at ? app.created_at.slice(0, 10) : '',
    }))
  } catch (err) {
    showToast('Failed to fetch applications.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (backendAvailable) {
    fetchApplications()
  }
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) throw new Error('User not authenticated')
    const { error } = await supabase.from('lands').insert([
      {
        user_id: userData.user.id,
        parcel_id: values.parcel_id,
        size: values.size,
        location: values.location,
        ownership_type: values.ownership_type,
        documents: values.documents,
      },
    ])
    if (error) throw error
    showToast('Application submitted successfully!')
    resetForm()
    await fetchApplications()
  } catch (err) {
    showToast('Submission failed. Please try again.')
  } finally {
    loading.value = false
  }
})
</script>
