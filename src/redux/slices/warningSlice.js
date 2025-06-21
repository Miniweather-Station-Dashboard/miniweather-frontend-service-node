import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  warnings: [],
  loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const warningSlice = createSlice({
  name: "warnings",
  initialState,
  reducers: {
    setWarnings: (state, action) => {
      state.warnings = action.payload;
    },
    clearWarnings: (state) => {
      state.warnings = [];
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

export const { setWarnings, clearWarnings, setLoading, setError } =
  warningSlice.actions;

export default warningSlice.reducer;
