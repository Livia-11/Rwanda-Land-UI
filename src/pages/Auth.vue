<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <BaseCard class="max-w-md w-full text-center py-10 px-8 shadow-xl bg-white/90 border-gray-100">
      <div class="flex justify-center mb-6">
        <button :class="['px-4 py-2 font-semibold rounded-l', mode === 'login' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700']" @click="mode = 'login'">Login</button>
        <button :class="['px-4 py-2 font-semibold rounded-r', mode === 'signup' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700']" @click="mode = 'signup'">Sign Up</button>
      </div>
      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <BaseInput v-model="email" type="email" placeholder="Email" class="w-full" />
        </div>
        <div>
          <BaseInput v-model="password" type="password" placeholder="Password" class="w-full" />
        </div>
        <div v-if="mode === 'signup'">
          <BaseInput v-model="confirmPassword" type="password" placeholder="Confirm Password" class="w-full" />
        </div>
        <BaseButton type="submit" class="w-full bg-blue-700 hover:bg-blue-800 py-2" :disabled="loading">
          <span v-if="loading">{{ mode === 'login' ? 'Logging in...' : 'Signing up...' }}</span>
          <span v-else>{{ mode === 'login' ? 'Login' : 'Sign Up' }}</span>
        </BaseButton>
      </form>
      <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>
      <div v-if="success" class="text-green-600 mt-4">{{ success }}</div>
      <RouterLink to="/" class="block mt-8 text-blue-700 underline">Back to Home</RouterLink>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const mode = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const router = useRouter()

async function onSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    if (!email.value || !password.value) {
      error.value = 'Email and password are required.'
      loading.value = false
      return
    }
    if (mode.value === 'signup') {
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.'
        loading.value = false
        return
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (signUpError) {
        error.value = signUpError.message
        loading.value = false
        return
      }
      success.value = 'Signup successful! Please check your email to confirm your account.'
      // Optionally, redirect after a delay
      setTimeout(() => router.push('/my-land'), 1500)
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (signInError) {
        error.value = signInError.message
        loading.value = false
        return
      }
      success.value = 'Login successful! Redirecting...'
      setTimeout(() => router.push('/my-land'), 1000)
    }
  } catch (err) {
    error.value = 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}
</script> 