<template>
  <div class="container mx-auto p-6 bg-gray-800 text-white">
    <!-- Filters Section -->
    <div class="flex flex-wrap gap-4 mb-6">
      <!-- Genre Dropdown -->
      <div>
        <label class="block text-black mb-2">Genre</label>
        <select
          v-model="selectedGenre"
          @change="fetchMovies"
          class="px-4 py-2 rounded-full bg-gray-700 text-black"
        >
          <option value="">Select Genre</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <!-- Release Year Dropdown -->
      <div>
        <label class="block text-black mb-2">Release Year</label>
        <select
          v-model="selectedYear"
          @change="fetchMovies"
          class="px-4 py-2 rounded-full bg-gray-700 text-black"
        >
          <option value="">Select Year</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- Rating Dropdown -->
      <div>
        <label class="block text-black mb-2">Rating</label>
        <select
          v-model="selectedRating"
          @change="fetchMovies"
          class="px-4 py-2 rounded-full bg-gray-700 text-black"
        >
          <option value="">Select Rating</option>
          <option v-for="rating in ratings" :key="rating" :value="rating">
            {{ rating }}+
          </option>
        </select>
      </div>
    </div>

    <!-- Movie Cards -->
    <div v-if="movies.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="movie in movies"
        :key="movie.id"
        :to="`/movies/${movie.id}`"
        class="card"
      >
        <div class="bg-gray-900 p-4 rounded-lg shadow-md hover:shadow-xl transition-all">
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="w-full h-40 object-cover rounded-md mb-4"
          />
          <h4 class="text-lg font-semibold text-white">{{ movie.title }}</h4>

          <!-- Genre, Release Year, and Rating -->
          <div class="mt-2 text-sm text-gray-400">
            <p><strong>Genre:</strong> {{ getGenresNames(movie.genre_ids) }}</p>
            <p><strong>Rating:</strong> {{ movie.vote_average }} / 10</p>
            <p><strong>Release Year:</strong> {{ movie.release_date ? movie.release_date.split('-')[0] : 'N/A' }}</p>
          </div>

          <p class="text-sm text-gray-400 mt-2">{{ movie.overview }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- No Movies Available Message -->
    <div v-else class="mt-6 text-gray-400">No movies available for the selected filters.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();
const apiKey = config.public.tmdbApiKey;
const apiUrl = 'https://api.themoviedb.org/3';

const genres = ref<any[]>([]);
const movies = ref<any[]>([]);
const years = ref<number[]>([]);
const ratings = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const selectedGenre = ref<number | null>(null);
const selectedYear = ref<number | null>(null);
const selectedRating = ref<number | null>(null);

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

// Fetch movies based on selected filters
const fetchMovies = async () => {
  try {
    const params: any = {
      api_key: apiKey,
    };

    if (selectedGenre.value) {
      params.with_genres = selectedGenre.value;
    }

    if (selectedYear.value) {
      params.primary_release_year = selectedYear.value;
    }

    if (selectedRating.value) {
      params['vote_average.gte'] = selectedRating.value;
    }

    console.log('API Params:', params);

    const response = await fetch(`${apiUrl}/discover/movie?${new URLSearchParams(params)}`);
    const data = await response.json();

    console.log('Movies Data:', data);

    if (data.results) {
      movies.value = data.results;
    } else {
      movies.value = [];
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

// Populate years for the Release Year dropdown
const populateYears = () => {
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1900; i--) {
    years.value.push(i);
  }
};

// Get genre names by their ids
const getGenresNames = (genreIds: number[]) => {
  return genreIds
    .map((id) => {
      const genre = genres.value.find((g) => g.id === id);
      return genre ? genre.name : null;
    })
    .filter(Boolean)
    .join(', ');
};

// On mounted, fetch genres, populate years, and fetch movies
onMounted(() => {
  fetchGenres();
  populateYears();
  fetchMovies(); // Fetch movies by default
});
</script>

<style scoped>
select {
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

select:hover {
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
