import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSensorData } from "../slices/sensorSlice";
import io from "socket.io-client";

let socket;

export default function useSensorSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket = io("http://localhost:3000");

    socket.on("sensorData", (data) => {
      dispatch(setSensorData(data));
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch]);
}
