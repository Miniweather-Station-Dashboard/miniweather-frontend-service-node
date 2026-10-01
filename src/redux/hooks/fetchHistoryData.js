import { useEffect, useState, useCallback, useRef } from "react";
import { setSensorHistoryData } from "../slices/historyDataSlice";
import { useAppDispatch, useAppSelector } from "./helper";

const WINDOW_MS = 24 * 60 * 60 * 1000; // default window: the last 24 hours

const rangeEndingAt = (end) => ({
  startTime: new Date(end.getTime() - WINDOW_MS).toISOString(),
  endTime: end.toISOString(),
});

export default function useSensorHistory() {
  const dispatch = useAppDispatch();
  const activeDevice = useAppSelector((state) => state.device.activeDevice);

  const [timeRange, setTimeRange] = useState(() => rangeEndingAt(new Date()));
  const [latestTimestamp, setLatestTimestamp] = useState(null);

  // Guards against a stale request for a previously selected device.
  const requestToken = useRef(0);

  const updateTimeRange = useCallback((newStartTime, newEndTime) => {
    setTimeRange((prev) => {
      if (prev.startTime !== newStartTime || prev.endTime !== newEndTime) {
        return { startTime: newStartTime, endTime: newEndTime };
      }
      return prev;
    });
  }, []);

  // When a device is selected, default the range to the latest data that
  // actually exists for it (instead of "now", which can be empty).
  useEffect(() => {
    if (!activeDevice) return;

    const token = ++requestToken.current;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const loadLatestRange = async () => {
      let latest = null;
      try {
        const response = await fetch(
          `${baseUrl}/v1/weather-data/latest?deviceId=${activeDevice.id}`
        );
        const result = await response.json();
        latest = result?.data?.latest || null;
      } catch (error) {
        console.error("🔥 Error fetching latest weather timestamp:", error);
      }

      if (token !== requestToken.current) return;

      setLatestTimestamp(latest);
      const end = latest ? new Date(latest) : new Date();
      setTimeRange(rangeEndingAt(end));
    };

    loadLatestRange();
  }, [activeDevice]);

  // Re-apply the "latest 24 hours that has data" selection.
  const resetToLatest = useCallback(() => {
    const end = latestTimestamp ? new Date(latestTimestamp) : new Date();
    setTimeRange(rangeEndingAt(end));
  }, [latestTimestamp]);

  useEffect(() => {
    if (!activeDevice || !timeRange.startTime || !timeRange.endTime) {
      return;
    }

    const fetchData = async () => {
      const { startTime, endTime } = timeRange;
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/v1/weather-data?interval=minute&timezone=Asia/Jakarta&endTime=${endTime}&startTime=${startTime}&deviceId=${activeDevice.id}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === "success" && result.data?.data) {
          dispatch(setSensorHistoryData(result.data.data));
        } else {
          console.error(
            "❌ Failed to fetch sensor history data:",
            result.message
          );
          dispatch(setSensorHistoryData([]));
        }
      } catch (error) {
        console.error("🔥 Error fetching sensor history data:", error);
        dispatch(setSensorHistoryData([]));
      }
    };

    fetchData();
  }, [dispatch, activeDevice, timeRange]);

  return { timeRange, updateTimeRange, latestTimestamp, resetToLatest };
}
