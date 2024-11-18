<template>
  <div>
    <h2 class="text-3xl font-semibold mb-6">Movies</h2>

    <!-- Loading State -->
    <div v-if="loading" class="text-lg">Loading...</div>

    <!-- Error State -->
    <div v-if="error" class="text-red-500 text-lg">{{ error }}</div>

    <!-- Movies Grid -->
    <div v-if="movies.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="cursor-pointer rounded-lg shadow-lg overflow-hidden"
        @click="goToMovieDetail(movie.id)"
      >
        <img
          :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          :alt="movie.title"
          class="w-full h-96 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
        />
        <div class="p-4 bg-white">
          <h3 class="text-xl font-semibold text-center truncate">{{ movie.title }}</h3>
        </div>
      </div>
    </div>
    <!-- If no movies are available -->
    <div v-if="movies.length === 0" class="text-lg">No movies found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Access the API key from runtime config
const config = useRuntimeConfig()
const API_KEY = config.public.tmdbApiKey
const BASE_URL = 'https://api.themoviedb.org/3'

const movies = ref([])
const loading = ref(true)
const error = ref(null)

const router = useRouter()

// Fetch movies from the API
const fetchMovies = async () => {
  try {
    console.log(`Fetching movies from: ${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US`)
    const { data } = await useFetch(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    })
    console.log("Fetched Movies Data:", data)
    if (data && data.results) {
      movies.value = data.results
    } else {
      error.value = "No movie data found."
    }
  } catch (err) {
    console.error("Error fetching movies:", err)
    error.value = 'Failed to fetch movies'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMovies()
})

// Navigate to the movie detail page when clicked
const goToMovieDetail = (movieId) => {
  router.push(`/movies/${movieId}`)
}
</script>

<style scoped>
.movie-card img {
  transition: transform 0.3s ease;
}

.movie-card:hover img {
  transform: scale(1.05);
}
</style>
