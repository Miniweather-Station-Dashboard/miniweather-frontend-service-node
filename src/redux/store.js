import { configureStore } from "@reduxjs/toolkit";
import sensorReducer from "./slices/sensorSlice";
import sensorHistoryDataSliceReducer from "./slices/historyDataSlice";
import deviceReducer from "./slices/deviceSlice";
import warningReducer from "./slices/warningSlice";

export const store = configureStore({
  reducer: {
    sensor: sensorReducer,
    sensorHistoryData: sensorHistoryDataSliceReducer,
    device: deviceReducer,
    warning: warningReducer,
  },
});
