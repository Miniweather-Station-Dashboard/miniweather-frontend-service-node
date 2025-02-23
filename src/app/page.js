"use client";

import { useSelector } from "react-redux";

export default function SensorPage() {
  const sensorData = useSelector((state) => state.sensor.temparature);

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
