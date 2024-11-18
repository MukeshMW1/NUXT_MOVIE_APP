<template>
  <div class="container mx-auto p-6 bg-gray-800 text-white">
    <!-- Genre Selection -->
    <div class="flex flex-wrap gap-4 mb-6">
      <button
        v-for="genre in genres"
        :key="genre.id"
        @click="selectGenre(genre.id)"
        :class="{
          'bg-yellow-400 text-black': selectedGenre === genre.id,
          'bg-gray-700': selectedGenre !== genre.id
        }"
        class="px-4 py-2 rounded-full transition-colors"
      >
        {{ genre.name }}
      </button>
    </div>

    <!-- Movie Cards -->
    <div v-if="movies.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="movie in movies"
        :key="movie.id"
        :to="`/movies/${movie.id}`"
        class="card"
      >
        <div
          class="bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-xl transition-all"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="w-full h-40 object-cover rounded-md mb-4"
          />
          <h4 class="text-lg font-semibold">{{ movie.title }}</h4>
          <p class="text-sm text-gray-400 mt-2">{{ movie.overview }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- No Movies Available Message -->
    <div v-else class="mt-6 text-gray-400">No movies available for this genre.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();
const apiKey = config.public.tmdbApiKey;
const apiUrl = 'https://api.themoviedb.org/3';
const genres = ref<any[]>([]);
const movies = ref<any[]>([]);
const selectedGenre = ref<number | null>(null);

// Fetch available genres
const fetchGenres = async () => {
  try {
    const response = await fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}`);
    const data = await response.json();
    genres.value = data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
};

// Fetch movies based on selected genre
const fetchMoviesByGenre = async (genreId: number) => {
  try {
    const response = await fetch(`${apiUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
    const data = await response.json();
    movies.value = data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

// Handle genre selection
const selectGenre = (genreId: number) => {
  selectedGenre.value = genreId;
  fetchMoviesByGenre(genreId);
};

// On mounted, fetch genres
onMounted(() => {
  fetchGenres();
});
</script>

<style scoped>
button {
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
