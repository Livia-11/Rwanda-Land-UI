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
            v-model="landSize"
            type="number"
            placeholder="e.g. 500"
            class="bg-blue-50 focus:ring-blue-400"
          />
          <span class="text-xs text-gray-500">Enter size in square meters.</span>
          <div v-if="landSizeError" class="text-xs text-red-500 mt-1">{{ landSizeError }}</div>
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
            <span v-if="app.status === 'Pending'" class="text-yellow-600 font-semibold">Pending</span>
            <span v-else-if="app.status === 'Completed'" class="text-green-600 font-semibold">Completed</span>
            <span v-else-if="app.status === 'Rejected'" class="text-red-600 font-semibold">Rejected</span>
          </td>
          <td class="px-4 py-2">{{ app.date }}</td>
        </tr>
      </BaseTable>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseFileUpload from '@/components/ui/BaseFileUpload.vue'
import BaseStepper from '@/components/ui/BaseStepper.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseToast from '@/components/ui/BaseToast.vue'

import { useForm, useField } from 'vee-validate'

const initialValues = {
  parcel_id: '',
  address: '',
  land_size: '',
  ownership_type: '',
  proof_file: [], // Store as array for consistency
}

const { handleSubmit, resetForm } = useForm({
  initialValues,
  validationSchema: {
    parcel_id: value => typeof value === 'string' && value.trim() !== '' || 'Parcel ID is required',
    address: value => typeof value === 'string' && value.trim() !== '' || 'Address is required',
    land_size: value => {
      const num = Number(value)
      return (!isNaN(num) && num > 0) || 'Land size is required'
    },
    ownership_type: value => typeof value === 'string' && value.trim() !== '' || 'Ownership type is required',
    proof_file: value => Array.isArray(value) && value.length > 0 && value[0] instanceof File || 'Proof file is required',
  },
})

const { value: parcelId, errorMessage: parcelIdError, ...parcelIdField } = useField('parcel_id')
const { value: address, errorMessage: addressError, ...addressField } = useField('address')
const { value: landSize, errorMessage: landSizeError, ...landSizeField } = useField('land_size')
const { value: ownershipType, errorMessage: ownershipTypeError, ...ownershipTypeField } = useField('ownership_type')
const { value: proofFile, errorMessage: proofFileError, setValue: setProofFile } = useField('proof_file')

const loading = ref(false)
const toast = ref({ show: false, message: '' })
const applications = ref([
  {
    id: 1,
    parcel_id: '12345',
    address: 'Kigali, Rwanda',
    status: 'Pending',
    date: '2024-05-01',
  },
  {
    id: 2,
    parcel_id: '54321',
    address: 'Huye, Rwanda',
    status: 'Completed',
    date: '2024-05-02',
  },
  {
    id: 3,
    parcel_id: '67890',
    address: 'Musanze, Rwanda',
    status: 'Rejected',
    date: '2024-05-03',
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

const onSubmit = handleSubmit((values) => {
  loading.value = true
  setTimeout(() => {
    applications.value.push({
      id: Date.now(),
      parcel_id: values.parcel_id,
      address: values.address,
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
    })
    loading.value = false
    showToast('Application submitted successfully!')
    resetForm()
  }, 1200)
})
</script>
