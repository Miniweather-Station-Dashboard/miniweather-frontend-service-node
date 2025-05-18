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
import DeviceMap from "@/components/DeviceMap";

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
          {/* Waktu Lokal */}
          <section className="md:flex items-center justify-between gap-4">
            <LocalTimeClock />
    
            <DeviceMap />
          </section>

          <hr className="my-6 border-gray-300" />

          {/* Kartu Cuaca */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Data Sensor Cuaca</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {sensorData.sensors?.map((sensor) => {
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
          </section>

          <hr className="my-6 border-gray-300" />

          {/* Prakiraan dan Peringatan */}
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

          {/* Data Historis & Info Tambahan */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Data Historis dan Informasi Tambahan
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2">Data Historis</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Data suhu per menit (24 jam terakhir)
                </p>
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
