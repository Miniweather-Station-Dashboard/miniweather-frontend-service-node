import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  articles: [],
  loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    clearArticles: (state) => {
      state.articles = [];
      state.loading = "idle";
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setArticles, clearArticles, setLoading, setError } =
  articleSlice.actions;

export default articleSlice.reducer;
