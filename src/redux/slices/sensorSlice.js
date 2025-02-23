import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  temperature: 0,
  windSpeed: 0,
  rainfall: 0,
  pressure: 0,
  timestamp: null,
};

const sensorSlice = createSlice({
  name: "sensor",
  initialState,
  reducers: {
    setSensorData: (state, action) => {
      console.log("Received sensor data:", action.payload);
      const { temperature, wind_speed, rainfall, pressure, timestamp } =
        action.payload;

      // Validate the data
      if (
        typeof temperature === "number" &&
        typeof wind_speed === "number" &&
        typeof rainfall === "number" &&
        typeof pressure === "number" &&
        typeof timestamp === "number"
      ) {
        state.temperature = parseFloat(temperature.toFixed(2));
        state.windSpeed = parseFloat(wind_speed.toFixed(2));
        state.rainfall = parseFloat(rainfall.toFixed(2));
        state.pressure = parseFloat(pressure.toFixed(2));
        state.timestamp = timestamp;
      } else {
        console.error("Invalid sensor data received:", action.payload);
      }
    },
  },
});

export const { setSensorData } = sensorSlice.actions;
export default sensorSlice.reducer;
