// In your store
export const useMovieStore = defineStore('movieStore', {
  state: () => ({
    filters: {
      genre: '',
      year: '',
      rating: '',
    },
  }),
});
