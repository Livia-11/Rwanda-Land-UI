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
            Address <span class="text-red-500">*</span>
          </label>
          <BaseInput
            v-model="address"
            type="text"
            placeholder="e.g. Kigali, Rwanda"
            class="bg-blue-50 focus:ring-blue-400"
          />
          <span class="text-xs text-gray-500">Location of the land.</span>
          <div v-if="addressError" class="text-xs text-red-500 mt-1">{{ addressError }}</div>
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
            Proof of Ownership (PDF/Image) <span class="text-red-500">*</span>
          </label>
          <BaseFileUpload
            accept=".pdf,image/*"
            class="bg-blue-50 focus:ring-blue-400"
            @change="e => handleProofFileChange(e.target.files)"
          />
          <span class="text-xs text-gray-500">Upload a PDF or image file.</span>
          <div v-if="proofFileError" class="text-xs text-red-500 mt-1">{{ proofFileError }}</div>
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
          <th class="text-left px-4 py-2">Address</th>
          <th class="text-left px-4 py-2">Status</th>
          <th class="text-left px-4 py-2">Submission Date</th>
        </template>
        <tr v-for="app in applications" :key="app.id">
          <td class="px-4 py-2">{{ app.parcel_id }}</td>
          <td class="px-4 py-2">{{ app.address }}</td>
          <td class="px-4 py-2">
            <span v-if="app.statusa === 'Pending'" class="text-yellow-600 font-semibold">Pending</span>
            <span v-else-if="app.statusa === 'Completed'" class="text-green-600 font-semibold">Completed</span>
            <span v-else-if="app.statusa === 'Rejected'" class="text-red-600 font-semibold">Rejected</span>
          </td>
          <td class="px-4 py-2">{{ app.date }}</td>
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
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseFileUpload from '@/components/ui/BaseFileUpload.vue'
import BaseStepper from '@/components/ui/BaseStepper.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseToast from '@/components/ui/BaseToast.vue'

import { useForm, useField } from 'vee-validate'
import { supabase } from '@/lib/supabase'

const initialValues = {
  parcel_id: '',
  address: '',
  size: '',
  ownership_type: '',
  proof_file: [], // Store as array for consistency
}

const { handleSubmit, resetForm } = useForm({
  initialValues,
  validationSchema: {
    parcel_id: value => typeof value === 'string' && value.trim() !== '' || 'Parcel ID is required',
    address: value => typeof value === 'string' && value.trim() !== '' || 'Address is required',
    size: value => {
      const num = Number(value)
      return (!isNaN(num) && num > 0) || 'Land size is required'
    },
    ownership_type: value => typeof value === 'string' && value.trim() !== '' || 'Ownership type is required',
    proof_file: value => Array.isArray(value) && value.length > 0 && value[0] instanceof File || 'Proof file is required',
  },
})

const { value: parcelId, errorMessage: parcelIdError } = useField('parcel_id')
const { value: address, errorMessage: addressError } = useField('address')
const { value: size, errorMessage: sizeError } = useField('size')
const { value: ownershipType, errorMessage: ownershipTypeError } = useField('ownership_type')
const { value: proofFile, errorMessage: proofFileError, setValue: setProofFile } = useField('proof_file')

const loading = ref(false)
const toast = ref({ show: false, message: '' })
const backendAvailable = false // Set to true when backend is ready
const applications = ref([
  {
    id: 1,
    parcel_id: 12345,
    address: 'Kigali, Rwanda',
    size: 500,
    ownership_type: 'Individual',
    supporting_document_url: '',
    statusa: 'Pending',
    date: '2024-05-01',
  },
  {
    id: 2,
    parcel_id: 54321,
    address: 'Huye, Rwanda',
    size: 300,
    ownership_type: 'Joint',
    supporting_document_url: '',
    statusa: 'Completed',
    date: '2024-05-02',
  },
  {
    id: 3,
    parcel_id: 67890,
    address: 'Musanze, Rwanda',
    size: 200,
    ownership_type: 'Company',
    supporting_document_url: '',
    statusa: 'Rejected',
    date: '2024-05-03',
  },
  {
    id: 4,
    parcel_id: 11223,
    address: 'Rubavu, Rwanda',
    size: 150,
    ownership_type: 'Individual',
    supporting_document_url: '',
    statusa: 'Pending',
    date: '2024-05-04',
  },
  {
    id: 5,
    parcel_id: 33445,
    address: 'Nyagatare, Rwanda',
    size: 400,
    ownership_type: 'Joint',
    supporting_document_url: '',
    statusa: 'Completed',
    date: '2024-05-05',
  },
  {
    id: 6,
    parcel_id: 55667,
    address: 'Rusizi, Rwanda',
    size: 250,
    ownership_type: 'Company',
    supporting_document_url: '',
    statusa: 'Rejected',
    date: '2024-05-06',
  },
])

function showToast(message) {
  toast.value = { show: true, message }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

function handleProofFileChange(files) {
  if (files && files.length > 0) {
    setProofFile(Array.from(files))
  } else {
    setProofFile([])
  }
}

function showBackendWarning() {
  showToast('Backend is not connected. Data will not be saved to the server.')
}

async function uploadProofFile(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
  const { data, error } = await supabase.storage.from('proofs').upload(fileName, file)
  if (error) throw error
  // Get public URL
  const { data: publicUrlData } = supabase.storage.from('proofs').getPublicUrl(fileName)
  return publicUrlData.publicUrl
}

async function fetchApplications() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('Land')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    applications.value = (data || []).map(app => ({
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
    if (!backendAvailable) {
      showBackendWarning()
      // Add to local mock data for demo
      applications.value.unshift({
        id: Date.now(),
        parcel_id: Number(values.parcel_id),
        address: values.address,
        size: Number(values.size),
        ownership_type: values.ownership_type,
        supporting_document_url: '',
        statusa: 'Pending',
        date: new Date().toISOString().slice(0, 10),
      })
      resetForm()
      loading.value = false
      return
    }
    // 1. Upload file to Supabase Storage
    const file = values.proof_file[0]
    let proofFileUrl = ''
    if (file) {
      proofFileUrl = await uploadProofFile(file)
    }
    // 2. Insert record into Supabase (Land table)
    const { error } = await supabase.from('Land').insert([
      {
        parcel_id: Number(values.parcel_id),
        address: values.address,
        size: Number(values.size),
        ownership_type: values.ownership_type,
        supporting_document_url: proofFileUrl,
        statusa: 'Pending',
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
