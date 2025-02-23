import { configureStore } from "@reduxjs/toolkit";
import sensorReducer from "./slices/sensorSlice";

export const store = configureStore({
  reducer: {
    sensor: sensorReducer,
  },
});
