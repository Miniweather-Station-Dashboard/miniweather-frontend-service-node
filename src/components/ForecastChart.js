"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
} from "recharts";

const FORECAST_DATA = [
  // { day: "Sen", temp: 29, rain: 20 },
  // { day: "Sel", temp: 30, rain: 10 },
  // { day: "Rab", temp: 28, rain: 40 },
  // { day: "Kam", temp: 27, rain: 60 },
  // { day: "Jum", temp: 29, rain: 30 },
];

const ForecastChart = () => {
  const isEmpty = !FORECAST_DATA || FORECAST_DATA.length === 0;

  return (
    <div className="h-[350px] flex items-center justify-center bg-white rounded-md">
      {isEmpty ? (
        <p className="text-gray-500 italic">Data prakiraan tidak tersedia.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={FORECAST_DATA}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="temp" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ForecastChart;
