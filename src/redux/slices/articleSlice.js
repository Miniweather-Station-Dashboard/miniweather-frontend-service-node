import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  articles: [], 
  searchResults: [], 
  loading: "idle",
  searchLoading: "idle",
  error: null,
};

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    clearArticles: (state) => {
      state.articles = [];
      state.searchResults = [];
      state.loading = "idle";
      state.searchLoading = "idle";
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.searchLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setArticles,
  setSearchResults,
  clearArticles,
  setLoading,
  setSearchLoading,
  setError,
} = articleSlice.actions;

export default articleSlice.reducer;
