<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import UiSpinner from '/components/ui/spinner.vue'  // Import the spinner component

// Access the API key from runtime config
const config = useRuntimeConfig()
const API_KEY = config.public.tmdbApiKey
const BASE_URL = 'https://api.themoviedb.org/3'

const movies = ref([])
const loading = ref(false)        // To track overall loading state
const loadingMore = ref(false)    // To track loading state for infinite scroll
const error = ref(null)
const page = ref(1)
const hasMore = ref(true)

const router = useRouter()

// Fetch movies from the API
const fetchMovies = async (pageNumber = 1) => {
  if (!API_KEY) {
    error.value = 'API Key is missing.'
    loading.value = false
    loadingMore.value = false
    return
  }

  try {
    // Set loading state for both initial and pagination loads
    if (pageNumber === 1) {
      loading.value = true  // Loading for the initial fetch
    } else {
      loadingMore.value = true  // Loading for infinite scroll
    }

    console.log(`Fetching movies from: ${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${pageNumber}`)

    const data = await $fetch(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: pageNumber,
      },
    })

    console.log("Fetched Movies Data:", data)

    if (data && data.results) {
      if (data.results.length > 0) {
        movies.value = [...movies.value, ...data.results]
        hasMore.value = true
      } else {
        hasMore.value = false
      }
    } else {
      error.value = "No movie data found."
    }
  } catch (err) {
    console.error("Error fetching movies:", err)
    error.value = `Failed to fetch movies: ${err.message || err}`
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

onMounted(() => {
  fetchMovies(page.value) // Initial fetch when the component mounts
})

// Throttle mechanism for infinite scroll
let throttleTimer
const handleScroll = (event) => {
  const container = event.target
  if (throttleTimer) return
  throttleTimer = setTimeout(() => {
    if (container.scrollHeight - container.scrollTop <= container.clientHeight + 50 && !loading.value && hasMore.value) {
      page.value += 1
      fetchMovies(page.value)
    }
    throttleTimer = null
  }, 100)
}

// Cleanup throttleTimer on unmount to prevent memory leaks
onBeforeUnmount(() => {
  if (throttleTimer) clearTimeout(throttleTimer)
})

// Navigate to the movie detail page when clicked
const goToMovieDetail = (movieId) => {
  router.push(`/movies/${movieId}`)
}
</script>

<template>
  <div class="container mx-auto p-4 bg-black text-white">
    <!-- Loading Spinner for initial fetch -->
    <UiSpinner v-if="loading && movies.length === 0" />

    <!-- Error Message -->
    <div v-if="error" class="text-red-500 text-center text-xl mt-8">
      {{ error }}
    </div>

    <!-- Movies List -->
    <div v-if="!loading && !error" 
         class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-10 pb-10"
         @scroll="handleScroll"
         style="max-height: 80vh; overflow-y: auto;">

      <div v-for="movie in movies" :key="movie.id" class="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer" @click="goToMovieDetail(movie.id)">
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Movie poster" class="w-full h-64 object-cover" />
        <div class="p-4">
          <h3 class="text-xl font-semibold text-gray-800">{{ movie.title }}</h3>
          <p class="text-gray-600 mt-2">{{ movie.release_date }}</p>
        </div>
      </div>
    </div>

    <!-- Loader for infinite scroll -->
    <div v-if="loadingMore" class="text-center text-gray-400 mt-4">
      Loading more movies...
    </div>
  </div>
</template>

<style scoped>
/* Optional: Customize the spinner style */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Hide the scrollbar but keep scrolling functionality */
.container::-webkit-scrollbar {
  display: none; /* Hide scrollbar in Webkit browsers (Chrome, Safari) */
}

.container {
  -ms-overflow-style: none;  /* Hide scrollbar in IE and Edge */
  scrollbar-width: none;     /* Hide scrollbar in Firefox */
}

/* Ensure the scroll behavior works */
.grid {
  overflow-y: auto; /* Allow vertical scrolling */
}
</style>
