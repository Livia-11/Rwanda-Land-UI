<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-green-100 flex flex-col">
    <!-- Hero Section -->
    <div class="flex flex-col md:flex-row items-center justify-center flex-1 px-4 py-12 gap-10 max-w-6xl mx-auto w-full">
      <!-- Left: Text -->
      <div class="flex-1 flex flex-col items-start justify-center z-10">
        <h1 class="text-5xl md:text-6xl font-extrabold text-blue-900 mb-4 leading-tight drop-shadow-lg">
          Rwanda Land Portal
        </h1>
        <p class="text-2xl text-blue-700 font-semibold mb-4">Empowering Land Management for All</p>
        <p class="text-lg text-gray-700 mb-8 max-w-xl">
          A modern, transparent, and efficient platform for citizens and authorities to register, transfer, and manage land with confidence and ease.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <RouterLink to="/my-land" class="flex-1">
            <BaseButton class="w-full bg-blue-700 hover:bg-blue-800 py-3 text-lg shadow-md transition-all duration-200 hover:scale-105">Register Land</BaseButton>
          </RouterLink>
          <RouterLink to="/transfers" class="flex-1">
            <BaseButton class="w-full bg-green-600 hover:bg-green-700 py-3 text-lg shadow-md transition-all duration-200 hover:scale-105">Transfer Land</BaseButton>
          </RouterLink>
        </div>
        <div class="mt-6 w-full max-w-md">
          <RouterLink to="/auth">
            <BaseButton class="w-full bg-gray-700 hover:bg-gray-800 py-2 shadow-sm transition-all duration-200 hover:scale-105">Login / Signup</BaseButton>
          </RouterLink>
        </div>
      </div>
      <!-- Right: Hero Image -->
      <div class="flex-1 flex items-center justify-center z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
          alt="Rwanda landscape"
          class="rounded-3xl shadow-2xl w-full max-w-md object-cover border-4 border-white/80"
        />
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white/80 py-12 px-4 mt-4 shadow-inner">
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="flex flex-col items-center text-center">
          <svg class="w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7l9-4 9 4-9 4-9-4zm0 0v6a9 9 0 009 9 9 9 0 009-9V7"></path></svg>
          <h3 class="font-bold text-lg text-blue-800 mb-1">Secure & Reliable</h3>
          <p class="text-gray-600">Your land records are safe, accessible, and protected with modern cloud technology.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <svg class="w-12 h-12 text-green-600 mb-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H9m3 0h3"></path></svg>
          <h3 class="font-bold text-lg text-green-800 mb-1">Fast & Paperless</h3>
          <p class="text-gray-600">No more waiting in lines. Register and transfer land online, anytime, anywhere.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <svg class="w-12 h-12 text-yellow-600 mb-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"></path></svg>
          <h3 class="font-bold text-lg text-yellow-800 mb-1">Transparent & Accountable</h3>
          <p class="text-gray-600">Track your applications and transfers. Enjoy full transparency and peace of mind.</p>
        </div>
      </div>
    </div>

    <footer class="mt-10 text-blue-600 text-sm opacity-70 z-10 text-center">&copy; 2024 Rwanda Land Portal. All rights reserved.</footer>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { RouterLink } from 'vue-router'
</script> 