"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function SensorPage() {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    socket = io("http://localhost:3000"); // Ensure the server is running at this address

    // Listen for the "sensorData" event
    socket.on("sensorData", (data) => {
      setSensorData(data);
    });

    // Clean up the connection on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

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
