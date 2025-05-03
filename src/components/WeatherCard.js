"use client";

import Card from "./Atom/Card";
const WeatherCard = ({ title, icon, value, description }) => (
  <Card title={title} icon={icon}>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-gray-500">{description}</p>
  </Card>
);

export default WeatherCard;