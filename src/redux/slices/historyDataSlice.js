import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  historyData: [],
};

const sensorHistoryDataSlice = createSlice({
  name: "sensorHistoryData",
  initialState,
  reducers: {
    setSensorHistoryData: (state, action) => {
      const data = action.payload;

      if (Array.isArray(data)) {
        state.historyData = data.map(({minute,...restOfData}) => ({
          timestamp: minute,
          ...restOfData,
        }));
      } else {
        console.error("Invalid historical sensor data:", data);
      }
    },
  },
});

export const { setSensorHistoryData } = sensorHistoryDataSlice.actions;
export default sensorHistoryDataSlice.reducer;
