import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSensorHistoryData } from "../slices/historyDataSlice";

export default function useSensorHistory() {
  const dispatch = useDispatch();
  const activeDevice = useSelector((state) => state.device.activeDevice);

  const nowRef = useState(() => new Date())[0];

  const [timeRange, setTimeRange] = useState(() => {
    const defaultEndTime = nowRef.toISOString();
    const defaultStartTime = new Date(nowRef.getTime() - 24 * 60 * 60 * 1000).toISOString();
    return { startTime: defaultStartTime, endTime: defaultEndTime };
  });

  const updateTimeRange = useCallback((newStartTime, newEndTime) => {
    setTimeRange(prev => {
      if (prev.startTime !== newStartTime || prev.endTime !== newEndTime) {
        return { startTime: newStartTime, endTime: newEndTime };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!activeDevice || !timeRange.startTime || !timeRange.endTime) {
      console.log("Skipping fetch: No active device or missing time range.", { activeDevice, timeRange });
      return;
    }

    const fetchData = async () => {
      const { startTime, endTime } = timeRange;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/weather-data?interval=minute&timezone=Asia/Jakarta&endTime=${endTime}&startTime=${startTime}&deviceId=${activeDevice.id}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();

        if (result.status === "success" && result.data?.data) {
          dispatch(setSensorHistoryData(result.data.data));
        } else {
          console.error("Failed to fetch sensor history data:", result.message);
          dispatch(setSensorHistoryData([]));
        }
      } catch (error) {
        console.error("Error fetching sensor history data:", error);
        dispatch(setSensorHistoryData([]));
      }
    };

    fetchData();
  }, [dispatch, activeDevice, timeRange]);

  return { timeRange, updateTimeRange };
}
