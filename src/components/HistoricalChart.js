"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";

const HistoricalChart = ({ data }) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="h-[350px] flex items-center justify-center bg-white rounded-md">
      {isEmpty ? (
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
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            <Line type="monotone" dataKey="windSpeed" stroke="#82ca9d" />
            <Line type="monotone" dataKey="rainfall" stroke="#ffc658" />
            <Line type="monotone" dataKey="pressure" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HistoricalChart;
