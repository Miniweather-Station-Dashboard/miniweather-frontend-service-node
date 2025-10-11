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
        compact ? "h-32 sm:h-40 md:h-44" : "h-[45vh]"
      } rounded-xl overflow-hidden shadow-sm bg-cover bg-center`}
      style={{
        backgroundImage: `url('${bgImage}')`,
      }}
    >
      <div className="relative z-10 flex h-full flex-col justify-center text-white text-center select-none">
        <h1
          className={`font-bold ${
            compact ? "text-xl sm:text-2xl md:text-3xl" : "text-5xl md:text-6xl"
          } tracking-tight mb-1`}
        >
          Local Time
        </h1>
        <p
          className={`font-mono ${
            compact ? "text-lg sm:text-xl md:text-2xl" : "text-3xl md:text-4xl"
          }`}
        >
          {currentTime.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default LocalTimeClock;
