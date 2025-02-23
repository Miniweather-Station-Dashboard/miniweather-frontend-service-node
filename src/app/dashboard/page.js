"use client";

import { useState } from "react";
import { Droplets, Gauge, Thermometer, Wind, ChevronDown } from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Dummy data for demonstration
const weatherData = {
  temperature: 28,
  humidity: 75,
  windSpeed: 15,
  windDirection: "SE",
  pressure: 1008,
  rainfall: 0,
  tideLevel: 1.2,
};

const forecastData = [
  { day: "Sen", temp: 29, rain: 20 },
  { day: "Sel", temp: 30, rain: 10 },
  { day: "Rab", temp: 28, rain: 40 },
  { day: "Kam", temp: 27, rain: 60 },
  { day: "Jum", temp: 29, rain: 30 },
];

const historicalData = [
  { month: "Jan", rainfall: 100 },
  { month: "Feb", rainfall: 120 },
  { month: "Mar", rainfall: 150 },
  { month: "Apr", rainfall: 80 },
  { month: "Mei", rainfall: 60 },
  { month: "Jun", rainfall: 40 },
];

const Card = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {icon}
    </div>
    {children}
  </div>
);

const Select = ({ options }) => (
  <div className="relative">
    <select className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <ChevronDown className="h-4 w-4" />
    </div>
  </div>
);

const Alert = ({ title, children }) => (
  <div
    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
    role="alert"
  >
    <p className="font-bold">{title}</p>
    <p>{children}</p>
  </div>
);

const Badge = ({ children, variant = "default" }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${
      variant === "default"
        ? "bg-blue-500 text-white"
        : "bg-white text-blue-500 border border-blue-500"
    }`}
  >
    {children}
  </span>
);

export default function MiniweatherDashboard() {
  const [timeRange, setTimeRange] = useState("24jam");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold">Miniweather Station Dashboard</h1>
          <Select options={["Pantai Utara", "Pantai Selatan", "Pelabuhan"]} />
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              title="Suhu"
              icon={<Thermometer className="h-4 w-4 text-gray-400" />}
            >
              <div className="text-2xl font-bold">
                {weatherData.temperature}°C
              </div>
              <p className="text-xs text-gray-500">
                Kelembaban: {weatherData.humidity}%
              </p>
            </Card>
            <Card
              title="Angin"
              icon={<Wind className="h-4 w-4 text-gray-400" />}
            >
              <div className="text-2xl font-bold">
                {weatherData.windSpeed} km/jam
              </div>
              <p className="text-xs text-gray-500">
                Arah: {weatherData.windDirection}
              </p>
            </Card>
            <Card
              title="Curah Hujan"
              icon={<Droplets className="h-4 w-4 text-gray-400" />}
            >
              <div className="text-2xl font-bold">
                {weatherData.rainfall} mm
              </div>
              <p className="text-xs text-gray-500">Dalam 24 jam terakhir</p>
            </Card>
            <Card
              title="Tekanan Udara"
              icon={<Gauge className="h-4 w-4 text-gray-400" />}
            >
              <div className="text-2xl font-bold">
                {weatherData.pressure} hPa
              </div>
              <p className="text-xs text-gray-500">
                Tinggi Pasang: {weatherData.tideLevel} m
              </p>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Prakiraan Cuaca</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={forecastData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="temp" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Data Historis</h3>
              <p className="text-sm text-gray-500 mb-4">Curah hujan bulanan</p>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={historicalData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rainfall"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Informasi Tambahan</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Kualitas Udara</span>
                  <Badge>Baik</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Indeks UV</span>
                  <Badge variant="outline">Sedang</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Visibilitas</span>
                  <span className="text-sm">10 km</span>
                </div>
              </div>
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
