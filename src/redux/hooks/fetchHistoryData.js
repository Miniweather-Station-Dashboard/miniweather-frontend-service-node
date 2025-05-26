import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSensorHistoryData } from "../slices/historyDataSlice";

export default function useSensorHistory() {
  const dispatch = useDispatch();
  const activeDevice = useSelector((state) => state.device.activeDevice);

  useEffect(() => {
    if (!activeDevice) return; // Only run if activeDevice exists

    const fetchData = async () => {
      const now = new Date();
      const endTime = now.toISOString();
      const startTime = new Date(
        now.getTime() - 24 * 60 * 60 * 1000
      ).toISOString();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/weather-data?interval=minute&timezone=Asia/Jakarta&endTime=${endTime}&startTime=${startTime}&deviceId=${activeDevice.id}`,
        );
        
        const result = await response.json();

        if (result.status === "success" && result.data?.data) {
          dispatch(setSensorHistoryData(result.data.data));
        } else {
          console.error("Failed to fetch sensor history data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching sensor history data:", error);
      }
    };

    fetchData();
  }, [dispatch, activeDevice]);
}
