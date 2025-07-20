<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8 text-center text-blue-800">Land Registration</h1>
    <BaseCard class="mb-10 bg-white/90 border-blue-100 shadow-lg">
      <Form :validation-schema="schema" @submit="onSubmit" v-slot="{ resetForm }" class="space-y-6">
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Parcel ID <span class="text-red-500">*</span>
          </label>
          <Field name="parcel_id" v-slot="{ field, errorMessage }">
            <BaseInput v-bind="field" type="text" placeholder="e.g. 12345" class="bg-blue-50 focus:ring-blue-400" />
            <span class="text-xs text-gray-500">Unique identifier for your land parcel.</span>
            <div v-if="errorMessage" class="text-xs text-red-500 mt-1">{{ errorMessage }}</div>
          </Field>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Address <span class="text-red-500">*</span>
          </label>
          <Field name="address" v-slot="{ field, errorMessage }">
            <BaseInput v-bind="field" type="text" placeholder="e.g. Kigali, Rwanda" class="bg-blue-50 focus:ring-blue-400" />
            <span class="text-xs text-gray-500">Location of the land.</span>
            <div v-if="errorMessage" class="text-xs text-red-500 mt-1">{{ errorMessage }}</div>
          </Field>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Land Size (m²) <span class="text-red-500">*</span>
          </label>
          <Field name="land_size" v-slot="{ field, errorMessage }">
            <BaseInput v-bind="field" type="number" placeholder="e.g. 500" class="bg-blue-50 focus:ring-blue-400" />
            <span class="text-xs text-gray-500">Enter size in square meters.</span>
            <div v-if="errorMessage" class="text-xs text-red-500 mt-1">{{ errorMessage }}</div>
          </Field>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Ownership Type <span class="text-red-500">*</span>
          </label>
          <Field name="ownership_type" v-slot="{ field, errorMessage }">
            <BaseSelect v-bind="field" class="bg-blue-50 focus:ring-blue-400">
              <option value="">Select Type</option>
              <option value="Individual">Individual</option>
              <option value="Joint">Joint</option>
              <option value="Company">Company</option>
            </BaseSelect>
            <div v-if="errorMessage" class="text-xs text-red-500 mt-1">{{ errorMessage }}</div>
          </Field>
        </div>
        <div>
          <label class="block text-blue-700 font-semibold mb-1">
            Proof of Ownership (PDF/Image) <span class="text-red-500">*</span>
          </label>
          <BaseFileUpload
            accept=".pdf,image/*"
            class="bg-blue-50 focus:ring-blue-400"
            @change="e => setProofFile(e.target.files)"
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
      </Form>
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
          <td class="px-4 py-2 text-yellow-600 font-semibold">Pending</td>
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

import { Form, Field, useField } from 'vee-validate'
import { toFormValidator } from '@vee-validate/zod'
import { z } from 'zod'

const schema = z.object({
  parcel_id: z.string().min(1, 'Parcel ID is required'),
  address: z.string().min(1, 'Address is required'),
  land_size: z.coerce.number().min(1, 'Land size is required'),
  ownership_type: z.string().min(1, 'Ownership type is required'),
  proof_file: z.any().refine(val => val instanceof FileList && val.length > 0, 'Proof file is required'),
})

const { value: proofFile, errorMessage: proofFileError, setValue: setProofFile } = useField('proof_file')

const applications = ref([
  {
    id: 1,
    parcel_id: '12345',
    address: 'Kigali, Rwanda',
    date: '2024-05-01',
  },
])

const loading = ref(false)
const toast = ref({ show: false, message: '' })

function showToast(message: string) {
  toast.value = { show: true, message }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

function onSubmit(values: any, { resetForm }: any) {
  loading.value = true
  setTimeout(() => {
    // Add new application to the list
    applications.value.push({
      id: Date.now(),
      parcel_id: values.parcel_id,
      address: values.address,
      date: new Date().toISOString().slice(0, 10),
    })
    loading.value = false
    showToast('Application submitted successfully!')
    resetForm()
  }, 1200)
}
</script>
