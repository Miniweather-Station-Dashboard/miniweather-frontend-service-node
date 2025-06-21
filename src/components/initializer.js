"use client";
import useDeviceData from "@/redux/hooks/fetchDeviceData"; 
import useWarningData from "@/redux/hooks/fetchWarningData";

export default function AppInitializer() {
    useDeviceData(); 
    useWarningData();
    

  return null;
}
