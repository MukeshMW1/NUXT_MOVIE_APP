<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Get the route parameters (movie ID from the URL)
const route = useRoute()
const movieId = route.params.id // Get the dynamic movie ID from the URL

const movieDetail = ref(null)
const cast = ref([])
const similarMovies = ref([])
const loading = ref(true)
const error = ref(null)

const API_KEY = useRuntimeConfig().public.tmdbApiKey // Get API key from config
const BASE_URL = 'https://api.themoviedb.org/3'

// Fetch movie details, cast, and similar movies based on the movieId
const fetchMovieDetail = async () => {
  try {
    // Fetch movie details
    const movieData = await $fetch(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    })

    movieDetail.value = movieData

    // Fetch cast details
    const castData = await $fetch(`${BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: API_KEY,
      },
    })
    cast.value = castData.cast.slice(0, 10) // Limit to 10 cast members

    // Fetch similar movies
    const similarMoviesData = await $fetch(`${BASE_URL}/movie/${movieId}/similar`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    })
    similarMovies.value = similarMoviesData.results
  } catch (err) {
    error.value = 'Failed to fetch movie details'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMovieDetail()
})
</script>

<template>
  <!-- Loading Spinner -->
  <div v-if="loading" class="flex justify-center items-center h-64">
    <svg class="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
  </div>

  <!-- Error Message -->
  <div v-if="error" class="text-red-500 text-center text-xl mt-8">
    {{ error }}
  </div>

  <!-- Movie Detail -->
  <div v-if="!loading && movieDetail" class="movie-detail p-6 bg-white shadow-lg rounded-xl max-w-4xl mx-auto mt-8">
    <!-- Movie Poster (Responsive) -->
    <img :src="`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`"
         alt="Movie Poster"
         class="w-48 h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-cover rounded-lg mx-auto shadow-md" />

    <!-- Movie Title -->
    <h2 class="text-3xl font-semibold mt-6 text-center text-gray-800">{{ movieDetail.title }}</h2>

    <!-- Release Date -->
    <p class="mt-2 text-gray-500 text-center"><strong>Release Date:</strong> {{ movieDetail.release_date }}</p>

    <!-- Movie Overview -->
    <p class="mt-4 text-gray-700 text-lg leading-relaxed">{{ movieDetail.overview }}</p>

    <!-- Movie Rating -->
    <p class="mt-2 text-gray-500 text-lg"><strong>Rating:</strong> {{ movieDetail.vote_average }} / 10</p>

    <!-- Cast Members -->
    <div v-if="cast.length > 0" class="mt-6">
      <h3 class="text-xl font-semibold mb-2">Cast</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div v-for="actor in cast" :key="actor.id" class="text-center">
          <img v-if="actor.profile_path" 
               :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`"
               alt="Actor"
               class="rounded-full w-24 h-24 mx-auto mb-2 object-cover shadow-md" />
          <p class="text-sm text-gray-800">{{ actor.name }}</p>
        </div>
      </div>
    </div>

    <!-- Similar Movies -->
    <div v-if="similarMovies.length > 0" class="mt-6">
      <h3 class="text-xl font-semibold mb-2">Similar Movies</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <div v-for="movie in similarMovies" :key="movie.id" class="text-center">
          <NuxtLink :to="`/movies/${movie.id}`" class="text-center">
            <img v-if="movie.poster_path" 
                 :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
                 alt="Similar Movie Poster"
                 class="rounded-md w-full h-auto mb-2 object-cover shadow-lg transition-transform transform hover:scale-105 cursor-pointer" />
            <p class="text-sm text-gray-800">{{ movie.title }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles can go here */
</style>
