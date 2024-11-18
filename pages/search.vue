<template>
  <div class="container mx-auto py-6 px-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
    <h1 class="text-3xl font-semibold mb-4 text-center text-white">
      Search Results for: "{{ query }}"
    </h1>

    <!-- Loading State -->
    <!-- Loading State -->
<div v-if="loading" class="flex items-center justify-center h-screen text-white">
  <svg
    class="animate-spin h-12 w-12 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 4v16m8-8H4"
    />
  </svg>
  <p class="mt-2 text-gray-200">Loading...</p>
</div>


    <!-- Error State -->
    <div v-if="error" class="text-center text-red-500 mt-4 text-sm font-medium">
      An error occurred while fetching results. Please try again later.
    </div>

    <!-- Results -->
    <div v-else>
      <div v-if="results.length === 0" class="text-center mt-4 text-gray-200">
        No results found for "{{ query }}".
      </div>

      <!-- Movie Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        <router-link
          v-for="movie in results"
          :key="movie.id"
          :to="`/movies/${movie.id}`"
          class="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="w-full h-60 object-cover rounded-t-lg"
          />
          <div class="p-4">
            <h2 class="font-semibold text-lg text-gray-800 truncate">{{ movie.title }}</h2>
            <p class="text-gray-500 text-xs mt-1">{{ movie.release_date }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const config = useRuntimeConfig();
const API_KEY = config.public.tmdbApiKey;

// State to store results, loading state, and error state
const results = ref<any[]>([]);
const loading = ref(true);
const error = ref(false);

// Get query parameter from URL
const route = useRoute();
const query = ref(route.query.q as string);

// Fetch search results from the API
const fetchResults = async () => {
  loading.value = true;
  error.value = false; // Reset error state on each fetch
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query.value}`
    );
    const data = await response.json();

    if (data.results) {
      results.value = data.results;
    } else {
      results.value = [];
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    error.value = true; // Set error state to true if API fails
  } finally {
    loading.value = false;
  }
};

// Watch the query and trigger the API call when it changes
watch(() => route.query.q, (newQuery) => {
  query.value = newQuery as string;
  fetchResults();
});

// Fetch results when component is mounted or when query changes
onMounted(() => {
  fetchResults();
});

</script>

<style scoped>
/* Custom Styles for Search Results */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.container {
  max-width: 1000px; /* Reduced max-width */
}

h1 {
  color: #ffffff;
}

.grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Reduced minimum column size */
}

.bg-gray-800 {
  background-color: #2d3748;
}

.text-gray-400 {
  color: #e2e8f0;
}

.text-gray-600 {
  color: #718096;
}

.text-gray-200 {
  color: #edf2f7;
}

.text-gray-800 {
  color: #2d3748;
}

.rounded-t-lg {
  border-radius: 8px 8px 0 0;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Hover Effect */
div:hover {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 640px) {
  .text-xl {
    font-size: 1rem; /* Reduced font size */
  }
  .h-60 {
    height: 250px; /* Reduced height */
  }
}

@media (max-width: 1024px) {
  .h-60 {
    height: 280px; /* Reduced height for larger screens */
  }
}
</style>
