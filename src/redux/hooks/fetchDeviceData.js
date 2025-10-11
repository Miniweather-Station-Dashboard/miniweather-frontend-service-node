import { useEffect } from "react";
import {
  setActiveDeviceAsync,
  setDeviceList,
  setStatus,
  setError,
} from "../slices/deviceSlice";
import { useAppDispatch } from "./helper";

export async function fetchDevice(dispatch) {
  dispatch(setStatus("loading"));
  dispatch(setError(null));

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/onboarding-device`
    );
    const result = await response.json();

    if (result.status === "success") {
      let deviceList = [];

      if (Array.isArray(result.data.devices)) {
        deviceList = result.data.devices;
      } else if (result.data.device) {
        deviceList = [result.data.device];
      }

      dispatch(setDeviceList(deviceList));
      dispatch(setActiveDeviceAsync(deviceList[0] || null));
      dispatch(setStatus("succeeded"));
    } else {
      dispatch(setError(result.message || "Unknown error"));
      dispatch(setStatus("failed"));
    }
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch devices"));
    dispatch(setStatus("failed"));
  }
}

export default function useDeviceData() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchDevice(dispatch);
  }, [dispatch]);
}
