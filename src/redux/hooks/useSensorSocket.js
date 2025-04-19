import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSensorData } from "../slices/sensorSlice";
import io from "socket.io-client";

let socket;

export default function useSensorSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Connecting to sensor socket server");
    socket = io("http://localhost:3000");

    socket.on("sensorData", async (data) => {
      try {
        let serializableData;
    
        if (data instanceof ArrayBuffer) {
          const textDecoder = new TextDecoder("utf-8");
          const jsonString = textDecoder.decode(data);
          serializableData = JSON.parse(jsonString).data;
        } else if (typeof data === "string") {
          serializableData = JSON.parse(data).data;
        } else {
          serializableData = data.data;
        }
    
        console.log("Received sensor data:", serializableData);
        dispatch(setSensorData(serializableData));
      } catch (error) {
        console.error("Error processing sensor data:", error);
      }
    });
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch]);
}
