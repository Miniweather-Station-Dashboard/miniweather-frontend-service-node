"use client";

import { useDispatch, useSelector } from "react-redux";
import { Droplets, Gauge, Thermometer, Wind } from "lucide-react";
import { Alert, Select } from "../../components/Atom";
import useSensorSocket from "@/redux/hooks/useSensorSocket";
import useSensorHistory from "@/redux/hooks/fetchHistoryData";
import AdditionalInfo from "@/components/AdditionalInfo";
import ForecastChart from "@/components/ForecastChart";
import HistoricalChart from "@/components/HistoricalChart";
import WeatherCard from "@/components/WeatherCard";
import { setActiveDeviceAsync } from "@/redux/slices/deviceSlice";
import { useEffect } from "react";

// Constants
const WEATHER_DATA = {
  temperature: 28,
  humidity: 75,
  windSpeed: 15,
  windDirection: "SE",
  pressure: 1008,
  rainfall: 0,
  tideLevel: 1.2,
};

export default function MiniweatherDashboard() {
  const dispatch = useDispatch();
  useSensorHistory();

  const historicalData =
    useSelector((state) => state.sensorHistoryData?.historyData) || [];
  const sensorData = useSelector((state) => state.sensor);
  const deviceList = useSelector((state) => state.device.deviceList) || [];
  const activeDevice = useSelector((state) => state.device.activeDevice);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold">Miniweather Station Dashboard</h1>
          <Select
            value={activeDevice?.name}
            options={deviceList.map((d) => d.name)}
            onChange={(selectedName) => {
              const selectedDevice = deviceList.find(
                (d) => d.name === selectedName
              );
              if (selectedDevice) {
                dispatch(setActiveDeviceAsync(selectedDevice));
              }
            }}
          />
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 grid gap-6">
          {/* Weather Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sensorData.sensors?.map((sensor, index) => {
              const value = sensorData.values?.[sensor.name] ?? "-";
              const unit = sensor.unit || "";
              return (
                <WeatherCard
                  key={sensor.name}
                  title={sensor.name}
                  icon={<Thermometer className="h-4 w-4 text-gray-400" />} 
                  value={`${value} ${unit}`}
                  description={sensor.description}
                />
              );
            })}
          </div>

          {/* Forecast and Alerts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Prakiraan Cuaca</h3>
              <ForecastChart />
            </div>
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Peringatan Dini</h3>
              <p className="text-sm text-gray-500 mb-4">
                Status bencana terkini
              </p>
              <Alert title="Peringatan">
                Potensi gelombang tinggi dalam 24 jam ke depan.
              </Alert>
            </div>
          </div>

          {/* Historical Data and Additional Info */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Data Historis</h3>
              <p className="text-sm text-gray-500 mb-4">
                Data suhu per menit (24 jam terakhir)
              </p>
              <HistoricalChart data={historicalData} />
            </div>

            <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Informasi Tambahan</h3>
              <AdditionalInfo />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <p className="text-sm text-gray-500">
            © 2025 Miniweather Station. Hak cipta dilindungi.
          </p>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Tentang
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Kontak
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
