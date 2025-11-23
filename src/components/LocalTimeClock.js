import React, { useEffect, useState } from "react";

const LocalTimeClock = ({ compact = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bgImage, setBgImage] = useState("/bg_day.png");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const hour = now.getHours();
      if (hour >= 6 && hour < 12) setBgImage("/bg_morning.png");
      else if (hour >= 12 && hour < 18) setBgImage("/bg_day.png");
      else setBgImage("/bg_night.png");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full ${
        compact ? "h-56 md:h-64 lg:h-72" : "aspect-video"
      } rounded-2xl overflow-hidden shadow-md bg-cover bg-center`}
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex h-full flex-col justify-center text-white text-center select-none px-4">
        <h1
          className={`font-bold ${
            compact ? "text-2xl sm:text-3xl" : "text-4xl md:text-5xl"
          } tracking-tight mb-1`}
        >
          Local Time
        </h1>

        <p
          className={`font-mono ${
            compact ? "text-xl sm:text-2xl" : "text-2xl md:text-3xl"
          }`}
        >
          {currentTime.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default LocalTimeClock;
