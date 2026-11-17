"use client";
import { toSnakeCase } from "@/helper/snakeCase";
import { chartRows, defaultSensors, formatReading, formatWib, isIsolatedReading } from "@/helper/history.mjs";
import { useSelector } from "react-redux";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid } from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";

function SensorTooltip({ active, payload, label, sensor }) {
  if (!active || !payload?.length) return null;
  return <div className="max-w-full break-words rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-sm" role="status">
    <p className="break-words text-gray-500">{formatWib(label)}</p>
    <p className="mt-1 break-words font-medium text-gray-900">{sensor.name}: {formatReading(payload[0]?.value, sensor.unit)}</p>
  </div>;
}
function SensorCharts({ data = [], timeRange }) {
  const sensors = useSelector(state => state.sensor.sensors) || [];
  const [selected, setSelected] = useState([]);
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && sensors.length) {
      initialized.current = true; setSelected(defaultSensors(sensors));
    }
  }, [sensors]);
  const rows = useMemo(() => chartRows(data, sensors.map(s => toSnakeCase(s.name))), [data, sensors]);
  const start = Date.parse(timeRange?.startTime);
  const end = Date.parse(timeRange?.endTime);
  const bounds = Number.isFinite(start) && Number.isFinite(end) ? [start, end] : [rows[0]?.time || 0, rows.at(-1)?.time || 1];
  const ticks = Array.from({length: 4}, (_, i) => bounds[0] + (bounds[1] - bounds[0]) * i / 3);
  const buttonClass = "rounded-lg border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600";
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-auto text-xs text-gray-500">Sensor · {selected.length} dipilih</span>
      <button className={buttonClass} onClick={() => { initialized.current = true; setSelected(sensors.map(s => s.name)); }}>Pilih semua</button>
      <button className={buttonClass} onClick={() => { initialized.current = true; setSelected([]); }}>Clear</button>
    </div>
    <div className="flex flex-wrap gap-x-4 gap-y-3">
      {sensors.map(sensor => <label key={sensor.name} className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" className="h-4 w-4 accent-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600" checked={selected.includes(sensor.name)}
          onChange={() => setSelected(prev => prev.includes(sensor.name) ? prev.filter(name => name !== sensor.name) : [...prev, sensor.name])} />
        {sensor.name}{sensor.unit ? ` (${sensor.unit})` : ""}
      </label>)}
    </div>
    <p className="text-xs text-gray-500">Waktu WIB · Rata-rata per menit · Jeda lebih dari 5 menit ditampilkan terputus</p>
    {!selected.length && <p className="py-8 text-center text-sm text-gray-500">Pilih sensor untuk menampilkan grafik.</p>}
    {!!selected.length && !rows.length && <p className="py-8 text-center text-sm text-gray-500">Data historis tidak tersedia.</p>}
    {!!rows.length && sensors.filter(s => selected.includes(s.name)).map(sensor => <section key={sensor.name} aria-label={`Grafik ${sensor.name} dalam WIB`} className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-3">
      <h4 className="mb-4 text-sm font-medium text-gray-800">{sensor.name} <span className="font-normal text-gray-500">{sensor.unit || ""}</span></h4>
      <div className="h-56 w-full" tabIndex={0} aria-label={`Grafik ${sensor.name}. Gunakan panah kiri dan kanan untuk membaca sampel.`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart accessibilityLayer data={rows} margin={{top: 8, right: 16, bottom: 8, left: 0}}>
            <CartesianGrid vertical={false} stroke="#e5e7eb" />
            <XAxis type="number" dataKey="time" domain={bounds} ticks={ticks} allowDataOverflow tickFormatter={time => formatWib(time, true)} tick={{fontSize: 11, fill: "#6b7280"}} />
            <YAxis width={60} domain={["auto", "auto"]} tickFormatter={value => formatReading(value)} tick={{fontSize: 11, fill: "#6b7280"}} />
            <Tooltip allowEscapeViewBox={{x:false, y:false}} position={{x:0, y:0}} wrapperStyle={{maxWidth:"100%", whiteSpace:"normal", overflowWrap:"anywhere", outline:"none"}} content={<SensorTooltip sensor={sensor} />} />
            <Line type="linear" dataKey={toSnakeCase(sensor.name)} name={sensor.name} stroke="#0284c7" strokeWidth={2} dot={({ cx, cy, index }) => isIsolatedReading(rows, index, toSnakeCase(sensor.name))
              ? <circle key={index} cx={cx} cy={cy} r={3} fill="#0284c7" /> : null} activeDot={{r:4}} connectNulls={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>)}
  </div>;
}
export default function HistoricalChart(props) {
  const deviceId = useSelector(state => state.device.activeDevice?.id);
  return <SensorCharts key={deviceId || "none"} {...props} />;
}
