<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const user = ref(null)
const router = useRouter()

async function fetchUser() {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
}

async function logout() {
  await supabase.auth.signOut()
  user.value = null
  router.push('/')
}

onMounted(() => {
  fetchUser()
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})
</script>

<template>
  <div>
    <nav v-if="user" class="bg-white/90 border-b border-blue-100 shadow flex items-center justify-between px-6 py-3 mb-4 sticky top-0 z-50">
      <div class="flex items-center gap-6">
        <span class="font-bold text-blue-800 text-xl">Rwanda Land Portal</span>
        <router-link to="/my-land" class="text-blue-700 hover:underline font-medium">Register Land</router-link>
        <router-link to="/transfers" class="text-green-700 hover:underline font-medium">Transfer Land</router-link>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-gray-700 text-sm">{{ user.email }}</span>
        <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold">Logout</button>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
nav {
  backdrop-filter: blur(4px);
}
</style>
