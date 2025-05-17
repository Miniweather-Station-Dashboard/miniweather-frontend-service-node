import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetSensorData, setSensorMetadata } from "./sensorSlice";
import  { initializeSensorSocket } from "../hooks/useSensorSocket";

export const setActiveDeviceAsync = createAsyncThunk(
  "device/setActiveDeviceAsync",
  async (device, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/onboarding-device/${device.id}`
      );

      const deviceData = response.data.data.device;
      if (deviceData.sensors) {
        dispatch(resetSensorData());
        dispatch(setSensorMetadata(deviceData.sensors));
        initializeSensorSocket(deviceData.id, dispatch);     }

      return deviceData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  activeDevice: null,
  deviceList: [],
  status: "idle",
  error: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDeviceList: (state, action) => {
      console.log("setDeviceList", action.payload);
      state.deviceList = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setActiveDeviceAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setActiveDeviceAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeDevice = action.payload;
      })
      .addCase(setActiveDeviceAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setDeviceList, setStatus, setError } = deviceSlice.actions;
export default deviceSlice.reducer;
