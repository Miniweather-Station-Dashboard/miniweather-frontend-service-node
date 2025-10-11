import { useEffect } from "react";
import { setSensorData } from "../slices/sensorSlice";
import io from "socket.io-client";
import { useAppDispatch } from "./helper";

let socket;

export async function initializeSensorSocket(deviceId, dispatch) {
  if (!deviceId) return;

  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);

  socket.on("connect", () => {
    socket.emit("subscribe", `/devices/${deviceId}`);
  });

socket.on(`/devices/${deviceId}`, (incomingData) => {
  try {
    let serializableData;

    if (incomingData instanceof ArrayBuffer) {
      const textDecoder = new TextDecoder("utf-8");
      const jsonString = textDecoder.decode(incomingData);
      serializableData = JSON.parse(jsonString);
    } else if (typeof incomingData === "string") {
      serializableData = JSON.parse(incomingData);
    } else if (typeof incomingData === "object") {
      serializableData = JSON.parse(JSON.stringify(incomingData));
    } else {
      throw new Error("Unsupported data format");
    }

    dispatch(
      setSensorData({
        data: serializableData.data,
        timestamp: serializableData.timestamp, 
      })
    );
  } catch (error) {
    console.error("Error processing sensor data:", error);
  }
});
}

function cleanupSensorSocket(deviceId) {
  if (socket) {
    socket.emit("unsubscribe", `devices/${deviceId}`);
    socket.disconnect();
    socket = null;
  }
}

export default function useSensorData(deviceId) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (deviceId) {
      initializeSensorSocket(deviceId, dispatch);
    }

    return () => {
      if (deviceId) {
        cleanupSensorSocket(deviceId);
      }
    };
  }, [deviceId, dispatch]);
}
