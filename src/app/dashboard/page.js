"use client";

import { useState } from "react";
import { Droplets, Gauge, Thermometer, Wind } from "lucide-react";
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

import { Badge, Card, Alert, Select } from "../../components";
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
