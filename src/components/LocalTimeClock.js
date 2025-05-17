// components/LocalTimeClock.jsx
import React, { useEffect, useState } from "react";

const LocalTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-white backdrop-blur-sm relative w-full rounded-lg shadow-md bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg_clock.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",

      }}
    >
      <div className="h-[50vh] inset-0  flex items-center justify-center">
        <div className="text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">Local Time</h1>
          <p className="text-3xl md:text-4xl font-mono">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocalTimeClock;
