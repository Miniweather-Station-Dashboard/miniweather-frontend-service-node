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
        state.historyData = data.map((item) => ({
          timestamp: item.minute,
          temperature: parseFloat(item.avg_temperature.toFixed(2)),
          windSpeed: parseFloat(item.avg_wind_speed.toFixed(2)),
          rainfall: parseFloat(item.avg_rainfall.toFixed(2)),
          pressure: parseFloat(item.avg_pressure.toFixed(2)),
        }));
      } else {
        console.error("Invalid historical sensor data:", data);
      }
    },
  },
});

export const { setSensorHistoryData } = sensorHistoryDataSlice.actions;
export default sensorHistoryDataSlice.reducer;
