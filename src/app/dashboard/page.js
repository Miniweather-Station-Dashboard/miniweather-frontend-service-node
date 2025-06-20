"use client";

import { useDispatch, useSelector } from "react-redux";
import { Thermometer } from "lucide-react";
import { Alert, Select } from "../../components/Atom";
import useSensorHistory from "@/redux/hooks/fetchHistoryData";
import AdditionalInfo from "@/components/AdditionalInfo";
import ForecastChart from "@/components/ForecastChart";
import HistoricalChart from "@/components/HistoricalChart";
import WeatherCard from "@/components/WeatherCard";
import { setActiveDeviceAsync } from "@/redux/slices/deviceSlice";
import LocalTimeClock from "@/components/LocalTimeClock";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";

const DeviceMap = dynamic(() => import("@/components/DeviceMap"), {
  ssr: false,
});

const formatToDatetimeLocal = (date) => {
  if (!date) return "";
  const pad = (num) => (num < 10 ? "0" + num : num);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function MiniweatherDashboard() {
  const dispatch = useDispatch();
  const { timeRange, updateTimeRange } = useSensorHistory();
  const historicalData =
    useSelector((state) => state.sensorHistoryData?.historyData) || [];
  const sensorData = useSelector((state) => state.sensor);
  const deviceList = useSelector((state) => state.device.deviceList) || [];
  const activeDevice = useSelector((state) => state.device.activeDevice);
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");

  useEffect(() => {
    if (timeRange.startTime && timeRange.endTime) {
      setCustomStartTime(formatToDatetimeLocal(new Date(timeRange.startTime)));
      setCustomEndTime(formatToDatetimeLocal(new Date(timeRange.endTime)));
    }
  }, [timeRange]);

  const handleApplyCustomTimeRange = useCallback(() => {
    if (!customStartTime || !customEndTime) {
      alert("Please select both start and end times for historical data.");
      return;
    }
    const startIso = new Date(customStartTime).toISOString();
    const endIso = new Date(customEndTime).toISOString();
    updateTimeRange(startIso, endIso);
  }, [customStartTime, customEndTime, updateTimeRange]);

  const handleResetTo24Hours = useCallback(() => {
    const now = new Date();
    const defaultEndTime = now.toISOString();
    const defaultStartTime = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    ).toISOString();
    setCustomStartTime(formatToDatetimeLocal(new Date(defaultStartTime)));
    setCustomEndTime(formatToDatetimeLocal(new Date(defaultEndTime)));
    updateTimeRange(defaultStartTime, defaultEndTime);
  }, [updateTimeRange]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-[10000] border-b bg-white shadow-sm">
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
          <section className="md:flex items-center justify-between gap-4">
            <LocalTimeClock />
            <DeviceMap />
          </section>

          <hr className="my-6 border-gray-300" />

          <section>
            <h2 className="text-xl font-semibold mb-4">Data Sensor Cuaca</h2>
            {sensorData.sensors?.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {sensorData.sensors.map((sensor) => {
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
            ) : (
              <div className="text-gray-500 text-sm italic">
                Tidak ada data sensor tersedia untuk perangkat ini.
              </div>
            )}
          </section>

          <hr className="my-6 border-gray-300" />

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Prakiraan dan Peringatan Cuaca
            </h2>
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
          </section>

          <hr className="my-6 border-gray-300" />

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Data Historis dan Informasi Tambahan
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2">Data Historis</h3>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="historicalStartTime"
                    className="text-sm font-medium"
                  >
                    From:
                  </label>
                  <input
                    type="datetime-local"
                    id="historicalStartTime"
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    className="p-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <label
                    htmlFor="historicalEndTime"
                    className="text-sm font-medium"
                  >
                    To:
                  </label>
                  <input
                    type="datetime-local"
                    id="historicalEndTime"
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                    className="p-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleApplyCustomTimeRange}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleResetTo24Hours}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-sm"
                  >
                    Last 24 Hrs
                  </button>
                </div>
                <HistoricalChart data={historicalData} />
              </div>
              <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Informasi Tambahan
                </h3>
                <AdditionalInfo />
              </div>
            </div>
          </section>
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
