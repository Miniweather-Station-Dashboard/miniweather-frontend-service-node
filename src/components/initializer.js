"use client";
import useDeviceData from "@/redux/hooks/fetchDeviceData"; 

export default function AppInitializer() {
    useDeviceData(); 
    

  return null;
}
