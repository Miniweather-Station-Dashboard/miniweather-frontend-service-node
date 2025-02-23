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
      // Convert buffer to string using TextDecoder and then parse as JSON
      const textDecoder = new TextDecoder("utf-8");
      const jsonString = textDecoder.decode(data);
      const serializableData = JSON.parse(jsonString);
      console.log("Received sensor data:", serializableData);
      dispatch(setSensorData(serializableData));
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch]);
}
