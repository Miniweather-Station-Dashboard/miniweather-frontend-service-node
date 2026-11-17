"use client";

import { Thermometer, History, Check, Clock, MapPin, RefreshCw } from "lucide-react";
import { Select } from "../../components/Atom";
import useSensorHistory from "@/redux/hooks/fetchHistoryData";
import HistoricalChart from "@/components/HistoricalChart";
import WeatherCard from "@/components/WeatherCard";
import { setActiveDeviceAsync } from "@/redux/slices/deviceSlice";
import LocalTimeClock from "@/components/LocalTimeClock";
import EarlyWarning from "@/components/EarlyWarning";
import ArticleCarousel from "@/components/ArticleCarousel";
import ArticleSearch from "@/components/ArticleSearch";

import { formatWibInput, parseWibInput, formatWib } from "@/helper/history.mjs";
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

const SectionCard = ({
  title,
  subtitle,
  icon,
  right,
  children,
  className = "",
  headerClassName = "",
}) => (
  <motion.section
    className={`min-w-0 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-4 md:p-5 shadow-sm ${className}`}
  >
    <div className={`mb-3 flex items-start justify-between gap-2 ${headerClassName}`}>
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-tight truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {right}
    </div>
    {children}
  </motion.section>
);

const ToolbarButton = ({
  children,
  disabled,
  onClick,
  Icon,
  secondary = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium shadow-sm ring-1 ring-inset transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
      ${
        disabled
          ? "bg-gray-200 text-gray-500 ring-gray-200 cursor-not-allowed"
          : secondary
            ? "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50"
            : "bg-sky-600 text-white ring-sky-600 hover:bg-sky-700"
      }
    `}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </button>
);

export default function MiniweatherDashboard() {
  const dispatch = useAppDispatch();
  const { timeRange, updateTimeRange, latestTimestamp, resetToLatest, refresh, historyLoading, latestLoading, historyError, latestError } =
    useSensorHistory();

  const historicalData =
    useAppSelector((state) => state.sensorHistoryData?.historyData) || [];
  const sensorData = useAppSelector((state) => state.sensor);
  const deviceList = useAppSelector((state) => state.device.deviceList) || [];
  const activeDevice = useAppSelector((state) => state.device.activeDevice);

  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const parsedStartTime = parseWibInput(customStartTime);
  const parsedEndTime = parseWibInput(customEndTime);
  const hasValidRange = Boolean(
    parsedStartTime && parsedEndTime && parsedStartTime < parsedEndTime
  );

  useEffect(() => {
    if (timeRange.startTime && timeRange.endTime) {
      setCustomStartTime(formatWibInput(new Date(timeRange.startTime)));
      setCustomEndTime(formatWibInput(new Date(timeRange.endTime)));
    }
  }, [timeRange]);

  const handleApplyCustomTimeRange = useCallback(() => {
    if (!customStartTime || !customEndTime) return;
    const start = parseWibInput(customStartTime);
    const end = parseWibInput(customEndTime);
    if (!start || !end || start >= end) return;
    updateTimeRange(start, end);
  }, [customStartTime, customEndTime, updateTimeRange]);

  const handleResetTo24Hours = useCallback(() => {
    resetToLatest();
  }, [resetToLatest]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-200">
      {/* Decorative background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/0 via-sky-50/60 to-white/0"
      />

      {/* Header */}
      <header className="sticky top-0 z-[10000] border-b border-gray-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 text-white shadow-sm">
              <Thermometer className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight sm:text-2xl truncate">
                Miniweather Station Dashboard
              </h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                Real-time micro-climate monitoring & early warnings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={activeDevice?.name}
              options={deviceList.map((d) => d.name)}
              onChange={(selectedName) => {
                const selectedDevice = deviceList.find(
                  (d) => d.name === selectedName
                );
                if (selectedDevice)
                  dispatch(setActiveDeviceAsync(selectedDevice));
              }}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto grid gap-6 px-4">
          {/* Map + Info */}
          <div className="grid gap-4 md:grid-cols-5 items-start">
  <SectionCard
    className="md:col-span-3"
    title="Perangkat & Lokasi"
    subtitle={activeDevice?.name || "Pilih perangkat"}
    icon={<MapPin className="h-4 w-4 text-gray-600" />}
  >
    <div className="relative min-h-full min-w-full overflow-hidden rounded-2xl">
      <DeviceMap />
    </div>
  </SectionCard>

  <SectionCard
    className="md:col-span-2 h-full"
    title="Waktu Lokal"
    subtitle="Zona waktu otomatis"
    icon={<Clock className="h-4 w-4 text-gray-600" />}
  >
    <div className="space-y-3">
      {/* clock as the hero content */}
      <LocalTimeClock compact />

      <p className="text-sm text-gray-600 text-center">
        Data tersinkron sesuai jam setempat
      </p>
    </div>
  </SectionCard>
</div>

          {/* Sensors */}
          <SectionCard
            title="Data Sensor Cuaca"
            subtitle="Pembacaan terkini dari perangkat"
            icon={<Thermometer className="h-4 w-4 text-gray-600" />}
          >
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
                      className="min-w-0 rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm"
                    >
                      <WeatherCard
                        title={sensor.name}
                        icon={
                          <Thermometer className="h-4 w-4 text-gray-400" />
                        }
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
              className="lg:col-span-4 !bg-white !backdrop-blur-none"
              headerClassName="flex-wrap"
              title="Data Historis"
              subtitle="Rentang pengamatan dalam WIB"
              icon={<History className="h-4 w-4 text-gray-600" />}
              right={
                <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
                  <ToolbarButton
                    onClick={handleApplyCustomTimeRange}
                    disabled={!activeDevice || !hasValidRange || historyLoading}
                    Icon={Check}
                  >
                    Apply
                  </ToolbarButton>
                  <button
                    onClick={handleResetTo24Hours}
                    disabled={!activeDevice || historyLoading || latestLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <History className="h-4 w-4" /> Last 24 Hrs
                  </button>
                  <ToolbarButton onClick={refresh} disabled={!activeDevice || historyLoading || latestLoading} Icon={RefreshCw} secondary>Refresh</ToolbarButton>
                </div>
              }
            >
              {latestTimestamp && (
                <p className="mb-3 text-xs text-gray-500">
                  Data terakhir: {formatWib(latestTimestamp)}
                </p>
              )}

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="historicalStartTime"
                    className="text-xs font-medium text-gray-700"
                  >
                    From (WIB)
                  </label>
                  <input
                    type="datetime-local"
                    id="historicalStartTime"
                    max={formatWibInput(new Date())}
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                    className="w-52 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="historicalEndTime"
                    className="text-xs font-medium text-gray-700"
                  >
                    To (WIB)
                  </label>
                  <input
                    type="datetime-local"
                    id="historicalEndTime"
                    max={formatWibInput(new Date())}
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

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div role="status" aria-live="polite" className="mb-3 text-xs text-gray-500">{historyLoading || latestLoading ? "Memuat data…" : `${historicalData.length} titik pengamatan`}</div>
                {historyError && <p role="alert" className="mb-3 text-sm text-rose-700">{historyError}</p>}
                {latestError && <p role="alert" className="mb-3 text-sm text-rose-700">{latestError}</p>}
                <HistoricalChart data={historicalData} timeRange={timeRange} />
              </div>
            </SectionCard>

            <SectionCard
              className="lg:col-span-3"
              title="Peringatan Dini"
              subtitle="Notifikasi otomatis berdasarkan ambang batas"
            >
              <EarlyWarning />
            </SectionCard>
          </div>

          {/* Articles */}
          <SectionCard
            title="Artikel & Edukasi"
            subtitle="Wawasan cuaca, iklim, dan mitigasi risiko"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl min-w-0">
                <ArticleCarousel />
              </div>
              <div className="rounded-2xl min-w-0">
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
            <a className="rounded-lg px-2 py-1 hover:bg-gray-100" href="#">
              Tentang
            </a>
            <a className="rounded-lg px-2 py-1 hover:bg-gray-100" href="#">
              Kontak
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
