import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const sensorSlice = createSlice({
  name: "sensor",
  initialState,
  reducers: {
    setSensorData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSensorData } = sensorSlice.actions;
export default sensorSlice.reducer;
