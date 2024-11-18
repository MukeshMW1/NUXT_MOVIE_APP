<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
    <!-- Header -->
    <header class="bg-gray-900 text-white py-6 shadow-lg mb-4">
      <div class="container mx-auto flex items-center justify-between px-4">
        <div class="text-2xl font-extrabold text-yellow-400">
          <a href="/">🎬 MovieApp</a>
        </div>
        <nav class="hidden md:flex gap-6 text-base font-medium">
          <a href="/" class="hover:text-yellow-400 transition-colors">Home</a>
          <a href="/filter" class="hover:text-yellow-400 transition-colors">Filter By Genre</a>
          <a href="/top" class="hover:text-yellow-400 transition-colors">Top Movies</a>
        </nav>
        <div class="relative flex items-center w-64">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search movies..."
            class="bg-gray-800 text-white text-sm rounded-full px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none w-full transition-all"
            @input="handleSearch"
          />
          <button @click="navigateToSearch" class="absolute right-2 top-1 text-gray-400 hover:text-white">
            🔍
          </button>
          <div
            v-if="isSuggestionsVisible && filteredSuggestions.length"
            class="absolute top-12 left-0 bg-gray-800 w-full rounded-lg shadow-md py-2"
          >
            <ul>
              <li
                v-for="suggestion in filteredSuggestions"
                :key="suggestion"
                @click="selectSuggestion(suggestion)"
                class="px-4 py-2 text-white hover:bg-yellow-400 hover:text-black cursor-pointer"
              >
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <footer class="bg-gray-900 text-white py-4">
      <div class="container mx-auto flex justify-between items-center">
        <p>© 2024 MovieApp. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import debounce from "lodash.debounce"; 

const searchQuery = ref<string>("");
const isSuggestionsVisible = ref<boolean>(false);

// Expanded mock suggestions, including Deadpool and other movie titles
const suggestions = ref<string[]>([
  "Avengers", "Batman", "Captain Marvel", "Doctor Strange", "Eternals", 
  "Venom", "Spider-Man", "Iron Man", "Thor", "Guardians of the Galaxy", 
  "Black Panther", "Ant-Man", "The Flash", "Shazam", "Wonder Woman",
  "Deadpool", "X-Men", "Logan", "Fantastic Four", "The Dark Knight"
]);

// Filter suggestions dynamically based on the search query
const filteredSuggestions = computed(() =>
  suggestions.value.filter((item) =>
    item.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Debounced function for handling search, which is called every 300ms
const fetchSuggestions = debounce(() => {
  // If search is empty, hide suggestions
  if (searchQuery.value.trim() === "") {
    isSuggestionsVisible.value = false;
  } else {
    // Show suggestions if filtered results exist
    isSuggestionsVisible.value = filteredSuggestions.value.length > 0;
  }
}, 300);

// Watch the search query and trigger the debounced function
watch(searchQuery, () => {
  fetchSuggestions();
});

// Select a suggestion and update the query
const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion;
  isSuggestionsVisible.value = false;
  navigateToSearch();
};

const router = useRouter();

// Navigate to the search results page
const navigateToSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: "/search", query: { q: searchQuery.value } });
    isSuggestionsVisible.value = false;
  }
};

// Handle input change for search
const handleSearch = () => {
  fetchSuggestions(); // Trigger the debounced function on each input change
};
</script>

<style scoped>
.container {
  max-width: 1280px;
}
</style>
