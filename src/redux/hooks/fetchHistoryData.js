import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSensorHistoryData } from "../slices/historyDataSlice";

export default function useSensorHistory() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const endTime = now.toISOString();
      const startTime = new Date(
        now.getTime() - 24 * 60 * 60 * 1000
      ).toISOString();

      try {
        const response = await fetch(
          `http://localhost:3000/v1/weather-data?interval=minute&timezone=Asia/Jakarta&endTime=${endTime}&startTime=${startTime}`
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
  }, [dispatch]);
}
