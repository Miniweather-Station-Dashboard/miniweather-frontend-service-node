import { configureStore } from "@reduxjs/toolkit";
import sensorReducer from "./slices/sensorSlice";
import sensorHistoryDataSliceReducer from "./slices/historyDataSlice";

export const store = configureStore({
  reducer: {
    sensor: sensorReducer,
    sensorHistoryData: sensorHistoryDataSliceReducer,
  },
});
