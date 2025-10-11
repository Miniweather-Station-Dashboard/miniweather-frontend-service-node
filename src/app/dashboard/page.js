"use client";

import { Thermometer, History, Check, Clock, MapPin } from "lucide-react";
import { Select } from "../../components/Atom";
import useSensorHistory from "@/redux/hooks/fetchHistoryData";
import HistoricalChart from "@/components/HistoricalChart";
import WeatherCard from "@/components/WeatherCard";
import { setActiveDeviceAsync } from "@/redux/slices/deviceSlice";
import LocalTimeClock from "@/components/LocalTimeClock";
import EarlyWarning from "@/components/EarlyWarning";
import ArticleCarousel from "@/components/ArticleCarousel";
import ArticleSearch from "@/components/ArticleSearch";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/helper";

const DeviceMap = dynamic(() => import("@/components/DeviceMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-56 md:h-64 lg:h-72 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-inner animate-pulse" />
  ),
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

// Small building blocks -------------------------------------------------------
const SectionCard = ({ title, subtitle, icon, right, children, className = "" }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={` rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-4 md:p-5 shadow-sm ${className}`}
  >
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        {icon && <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100">{icon}</span>}
        <div>
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
    {children}
  </motion.section>
);

const ToolbarButton = ({ children, disabled, onClick, Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
      ${disabled ? "bg-gray-200 text-gray-500 ring-gray-200 cursor-not-allowed" : "bg-sky-600 text-white ring-sky-600 hover:bg-sky-700"}
    `}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </button>
);

export default function MiniweatherDashboard() {
  const dispatch = useAppDispatch();
  const { timeRange, updateTimeRange } = useSensorHistory();

  const historicalData = useAppSelector((state) => state.sensorHistoryData?.historyData) || [];
  const sensorData = useAppSelector((state) => state.sensor);
  const deviceList = useAppSelector((state) => state.device.deviceList) || [];
  const activeDevice = useAppSelector((state) => state.device.activeDevice);

  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const hasValidRange = !!customStartTime && !!customEndTime && new Date(customStartTime) < new Date(customEndTime);

  useEffect(() => {
    if (timeRange.startTime && timeRange.endTime) {
      setCustomStartTime(formatToDatetimeLocal(new Date(timeRange.startTime)));
      setCustomEndTime(formatToDatetimeLocal(new Date(timeRange.endTime)));
    }
  }, [timeRange]);

  const handleApplyCustomTimeRange = useCallback(() => {
    if (!customStartTime || !customEndTime) return;
    const start = new Date(customStartTime);
    const end = new Date(customEndTime);
    if (start >= end) return;
    updateTimeRange(start.toISOString(), end.toISOString());
  }, [customStartTime, customEndTime, updateTimeRange]);

  const handleResetTo24Hours = useCallback(() => {
    const now = new Date();
    const defaultEndTime = now.toISOString();
    const defaultStartTime = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    setCustomStartTime(formatToDatetimeLocal(new Date(defaultStartTime)));
    setCustomEndTime(formatToDatetimeLocal(new Date(defaultEndTime)));
    updateTimeRange(defaultStartTime, defaultEndTime);
  }, [updateTimeRange]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      {/* Decorative background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/0 via-sky-50/60 to-white/0"
      />

      {/* Header */}
      <header className="sticky top-0 z-[10000] border-b border-gray-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 text-white shadow-sm">
              <Thermometer className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight sm:text-2xl">Miniweather Station Dashboard</h1>
              <p className="hidden text-xs text-gray-500 sm:block">Real‑time micro‑climate monitoring & early warnings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={activeDevice?.name}
              options={deviceList.map((d) => d.name)}
              onChange={(selectedName) => {
                const selectedDevice = deviceList.find((d) => d.name === selectedName);
                if (selectedDevice) dispatch(setActiveDeviceAsync(selectedDevice));
              }}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto grid gap-6 px-4">
          {/* Map + Info */}
          <div className="grid gap-4 md:grid-cols-5">
            <SectionCard
              className="md:col-span-3"
              title="Perangkat & Lokasi"
              subtitle={activeDevice?.name || "Pilih perangkat"}
              icon={<MapPin className="h-4 w-4 text-gray-600" />}
            >
              <DeviceMap />
            </SectionCard>

            <SectionCard
              className="md:col-span-2"
              title="Waktu Lokal"
              subtitle="Zona waktu otomatis"
              icon={<Clock className="h-4 w-4 text-gray-600" />}
            >
              <div className="flex h-56 justify-center rounded-xl bg-gradient-to-br from-sky-50 to-white">
                <div className="text-center w-full">
                  <div className="mb-2 text-4xl font-bold tracking-tight text-sky-700">
                    <LocalTimeClock />
                  </div>
                  <p className="text-sm text-gray-600">Data tersinkron sesuai jam setempat</p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Sensors */}
          <SectionCard title="Data Sensor Cuaca" subtitle="Pembacaan terkini dari perangkat" icon={<Thermometer className="h-4 w-4 text-gray-600" />}>
            {sensorData.sensors?.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {sensorData.sensors.map((sensor) => {
                  const value = sensorData.values?.[sensor.name] ?? "-";
                  const unit = sensor.unit || "";
                  return (
                    <motion.div
                      key={sensor.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      whileHover={{ y: -2 }}
                      className="rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm"
                    >
                      <WeatherCard
                        title={sensor.name}
                        icon={<Thermometer className="h-4 w-4 text-gray-400" />}
                        value={`${value} ${unit}`}
                        description={sensor.description}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                <p>Belum ada data sensor untuk perangkat ini.</p>
                <button
                  onClick={handleResetTo24Hours}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm hover:bg-gray-100"
                >
                  Coba muat 24 jam terakhir
                </button>
              </div>
            )}
          </SectionCard>

          {/* Historical + Early Warning */}
          <div className="grid gap-4 lg:grid-cols-7">
            <SectionCard
              className="lg:col-span-4"
              title="Data Historis"
              subtitle="Sesuaikan rentang waktu untuk analisis"
              icon={<History className="h-4 w-4 text-gray-600" />}
              right={
                <div className="flex items-center gap-2">
                  <ToolbarButton onClick={handleApplyCustomTimeRange} disabled={!hasValidRange} Icon={Check}>
                    Apply
                  </ToolbarButton>
                  <button
                    onClick={handleResetTo24Hours}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <History className="h-4 w-4" /> Last 24 Hrs
                  </button>
                </div>
              }
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="historicalStartTime" className="text-xs font-medium text-gray-700">
                    From
                  </label>
                  <input
                    type="datetime-local"
                    id="historicalStartTime"
                    max={formatToDatetimeLocal(new Date())}
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    className="w-52 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="historicalEndTime" className="text-xs font-medium text-gray-700">
                    To
                  </label>
                  <input
                    type="datetime-local"
                    id="historicalEndTime"
                    max={formatToDatetimeLocal(new Date())}
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                    className="w-52 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                {!hasValidRange && (
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200">
                    Pastikan "From" lebih awal dari "To"
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/70 p-2 shadow-inner">
                <HistoricalChart data={historicalData} />
              </div>
            </SectionCard>

            <SectionCard className="lg:col-span-3" title="Peringatan Dini" subtitle="Notifikasi otomatis berdasarkan ambang batas">
              <EarlyWarning />
            </SectionCard>
          </div>

          {/* Articles */}
          <SectionCard title="Artikel & Edukasi" subtitle="Wawasan cuaca, iklim, dan mitigasi risiko">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl">
                <ArticleCarousel />
              </div>
              <div className="rounded-2xl">
                <ArticleSearch />
              </div>
            </div>
          </SectionCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 text-sm text-gray-600">
          <p>© 2025 Miniweather Station · Semua hak cipta dilindungi</p>
          <div className="flex items-center gap-3">
            <a className="rounded-lg px-2 py-1 hover:bg-gray-100" href="#">Tentang</a>
            <a className="rounded-lg px-2 py-1 hover:bg-gray-100" href="#">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
