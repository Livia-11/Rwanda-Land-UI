<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './lib/supabase'

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
  document.title = 'Land Management System'
})
</script>

<template>
  <div>
    <nav v-if="user" class="bg-gradient-to-r from-blue-800 via-blue-600 to-green-600 border-b border-blue-100 shadow flex items-center justify-between px-6 py-3 mb-4 sticky top-0 z-50">
      <div class="flex items-center gap-6">
        <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Land Logo" class="h-8 w-8 rounded-full shadow mr-2" />
        <span class="font-extrabold text-white text-2xl tracking-tight drop-shadow">Land Management</span>
        <router-link to="/my-land" class="text-white/90 hover:text-white font-medium transition">Register Land</router-link>
        <router-link to="/transfers" class="text-white/90 hover:text-white font-medium transition">Transfer Land</router-link>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-white/80 text-sm">{{ user.email }}</span>
        <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition">Logout</button>
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
