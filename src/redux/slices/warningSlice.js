import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  warnings: [],
  loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
  // pagination meta in store
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

const warningSlice = createSlice({
  name: "warning",
  initialState,
  reducers: {
    setWarnings(state, action) {
      state.warnings = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setPagination(state, action) {
      const { page, limit, total, totalPages } = action.payload;
      if (page != null) state.page = page;
      if (limit != null) state.limit = limit;
      if (total != null) state.total = total;
      if (totalPages != null) state.totalPages = totalPages;
    },
  },
});

export const { setWarnings, setLoading, setError, setPagination } =
  warningSlice.actions;
export default warningSlice.reducer;
