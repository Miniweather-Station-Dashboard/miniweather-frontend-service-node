import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sensors: [], // Array of { name, unit, description }
  values: {}, // { [sensorName]: value }
  timestamp: null,
};

const sensorSlice = createSlice({
  name: "sensor",
  initialState,
  reducers: {
    setSensorMetadata: (state, action) => {
      state.sensors = action.payload;
    },
    setSensorData: (state, action) => {
      const serializableData = action.payload;

      if (!serializableData || typeof serializableData !== "object") {
        return;
      }

      const { data, timestamp } = serializableData;

      if (!data || typeof data !== "object") {
        return;
      }

      state.sensors.forEach((sensor) => {
        const name = sensor.name;
        const rawValue = data[name];

        if (typeof rawValue === "number") {
          const fixedValue = parseFloat(rawValue.toFixed(2));
          state.values[name] = fixedValue;
        }
      });

      state.timestamp = timestamp || new Date().toISOString();
    },
    resetSensorData: (state) => {
      state.values = {};
      state.timestamp = null;
    },
  },
});

export const { setSensorMetadata, setSensorData, resetSensorData } =
  sensorSlice.actions;
export default sensorSlice.reducer;
