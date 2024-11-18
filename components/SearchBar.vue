<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// Search term input
const searchQuery = ref('')

// Debounced search function
let debounceTimeout = null
const router = useRouter()

// Watch for search query changes and debounce
watch(searchQuery, (newQuery) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    if (newQuery.trim() !== '') {
      router.push({ path: '/search', query: { q: newQuery } })
    }
  }, 500) // 500ms debounce
})
</script>

<template>
  <div class="p-4">
    <input v-model="searchQuery" 
           type="text" 
           placeholder="Search movies..." 
           class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
  </div>
</template>
