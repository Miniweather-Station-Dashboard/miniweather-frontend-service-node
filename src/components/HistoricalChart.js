"use client";

import { toSnakeCase } from "@/helper/snakeCase";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";
import { useEffect, useState } from "react";

const colorPalette = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const HistoricalChart = ({ data }) => {
  const sensorData = useSelector((state) => state.sensor);
  const isEmpty = !data || data.length === 0;
  const sensorsReady =
    Array.isArray(sensorData?.sensors) && sensorData.sensors.length > 0;

  const [selectedSensors, setSelectedSensors] = useState([]);

  useEffect(() => {
    if (sensorsReady && selectedSensors.length === 0) {
      setSelectedSensors(sensorData.sensors.map((s) => s.name));
    }
  }, [sensorData.sensors]);

  const handleToggleSensor = (sensorName) => {
    setSelectedSensors((prevSelected) =>
      prevSelected.includes(sensorName)
        ? prevSelected.filter((s) => s !== sensorName)
        : [...prevSelected, sensorName]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-2">
        {sensorData.sensors?.map((sensor) => (
          <label key={sensor.name} className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedSensors.includes(sensor.name)}
              onChange={() => handleToggleSensor(sensor.name)}
            />
            {sensor.name}
          </label>
        ))}
      </div>

      <div className="h-[350px] flex items-center justify-center bg-white rounded-md">
        {!sensorsReady || isEmpty ? (
          <p className="text-gray-500 italic">Data historis tidak tersedia.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timeStr) =>
                  new Date(timeStr).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
                minTickGap={20}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
              {sensorData.sensors
                .filter((sensor) => selectedSensors.includes(sensor.name))
                .map((sensor, idx) => (
                  <Line
                    key={sensor.name}
                    type="monotone"
                    dataKey={toSnakeCase(sensor.name)}
                    stroke={colorPalette[idx % colorPalette.length]}
                    name={sensor.name}
                    unit={sensor.unit}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default HistoricalChart;
