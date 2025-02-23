"use client";

import { useSelector } from "react-redux";
import useSensorSocket from "@/redux/hooks/useSensorSocket";

export default function SensorPage() {
  useSensorSocket(); // Establish WebSocket connection

  const sensorData = useSelector((state) => state.sensor.data);

  return (
    <div>
      <h1>Sensor Data Logger</h1>
      {sensorData ? (
        <div>
          <h2>Latest Sensor Data:</h2>
          <pre>{JSON.stringify(sensorData, null, 2)}</pre>
        </div>
      ) : (
        <p>No sensor data received yet.</p>
      )}
    </div>
  );
}
