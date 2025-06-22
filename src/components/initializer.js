"use client";
import useArticleData from "@/redux/hooks/fetchArticleData";
import useDeviceData from "@/redux/hooks/fetchDeviceData"; 
import useWarningData from "@/redux/hooks/fetchWarningData";

export default function AppInitializer() {
    useDeviceData(); 
    useWarningData();
    useArticleData();
    

  return null;
}
