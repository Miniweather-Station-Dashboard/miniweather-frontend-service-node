import React, { useEffect, useState } from "react";

const LocalTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bgImage, setBgImage] = useState("/bg_clock.png"); // default image

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const hour = now.getHours();

      if (hour >= 6 && hour < 12) {
        setBgImage("/bg_morning.png"); 
      } else if (hour >= 12 && hour < 18) {
        setBgImage("/bg_day.png");    
      } else {
        setBgImage("/bg_night.png"); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-white backdrop-blur-sm relative w-full h-[50vh] rounded-lg shadow-md bg-cover bg-center"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="h-full inset-0 flex items-center justify-center">
        <div className="text-white text-center">
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
