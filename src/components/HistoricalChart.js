"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";

const HistoricalChart = ({ data }) => (
  <div className="h-[350px]">
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
  </div>
);

export default HistoricalChart;
