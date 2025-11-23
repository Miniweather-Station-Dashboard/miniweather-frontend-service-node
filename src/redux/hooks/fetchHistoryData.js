import { useEffect, useState, useCallback } from "react";
import { setSensorHistoryData } from "../slices/historyDataSlice";
import { useAppDispatch, useAppSelector } from "./helper";

export default function useSensorHistory() {
  const dispatch = useAppDispatch();
  const activeDevice = useAppSelector((state) => state.device.activeDevice);

  const nowRef = useState(() => new Date())[0];

  const [timeRange, setTimeRange] = useState(() => {
    const defaultEndTime = nowRef.toISOString();
    const defaultStartTime = new Date(
      nowRef.getTime() - 24 * 60 * 60 * 1000
    ).toISOString();
    return { startTime: defaultStartTime, endTime: defaultEndTime };
  });

  const updateTimeRange = useCallback((newStartTime, newEndTime) => {
    setTimeRange((prev) => {
      if (prev.startTime !== newStartTime || prev.endTime !== newEndTime) {
        return { startTime: newStartTime, endTime: newEndTime };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!activeDevice || !timeRange.startTime || !timeRange.endTime) {
      console.log("🟡 useSensorHistory: missing dependencies", {
        hasActiveDevice: !!activeDevice,
        startTime: timeRange.startTime,
        endTime: timeRange.endTime,
      });
      return;
    }

    const fetchData = async () => {
      const { startTime, endTime } = timeRange;

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // 🔍 Debug logs
      console.log("🧩 useSensorHistory ENV:", {
        NEXT_PUBLIC_API_BASE_URL: baseUrl,
      });

      console.log("🕒 useSensorHistory timeRange:", {
        startTime,
        endTime,
      });

      console.log("📟 useSensorHistory activeDevice:", activeDevice);

      const url = `${baseUrl}/v1/weather-data?interval=minute&timezone=Asia/Jakarta&endTime=${endTime}&startTime=${startTime}&deviceId=${activeDevice.id}`;

      console.log("🌐 useSensorHistory fetch URL:", url);

      try {
        const response = await fetch(url);

        console.log("📥 useSensorHistory response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log("📦 useSensorHistory response body:", result);

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

  return { timeRange, updateTimeRange };
}
