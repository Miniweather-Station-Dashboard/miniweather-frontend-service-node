import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeDevice: null,
  deviceList: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setActiveDevice: (state, action) => {
      state.activeDevice = action.payload;
    },
    setDeviceList: (state, action) => {
      state.deviceList = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setActiveDevice,
  setDeviceList,
  setStatus,
  setError,
} = deviceSlice.actions;
export default deviceSlice.reducer;
