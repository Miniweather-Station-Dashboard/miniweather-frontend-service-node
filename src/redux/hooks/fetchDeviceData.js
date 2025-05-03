import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveDevice, setDeviceList } from "../slices/deviceSlice";

export default function useDeviceData() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await fetch("http://localhost:3000/v1/onboarding-device");

        const result = await response.json();

        console.log("Device data:", result);    
        if (result.status === "success") {
          let deviceList = [];

          if (Array.isArray(result.data.devices)) {
            deviceList = result.data.devices;
          } else if (result.data.device) {
            deviceList = [result.data.device];
          }

          if (deviceList.length > 0) {
            dispatch(setDeviceList(deviceList));
            dispatch(setActiveDevice(deviceList[0])); 
          } else {
            console.warn("Device list is empty");
          }
        } else {
          console.error("Failed to fetch devices:", result.message);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevice();
  }, [dispatch]);
}
