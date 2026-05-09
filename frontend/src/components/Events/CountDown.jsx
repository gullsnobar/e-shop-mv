import React, { useEffect, useState } from "react";

const CountDown = () => {
  function calculateTimeLeft() {
    const difference = +new Date("2026-12-31T23:59:59") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        Minutes: Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        ),
        Seconds: Math.floor(
          (difference % (1000 * 60)) / 1000
        ),
      };
    }

    return timeLeft;
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const intervals = ["Days", "Hours", "Minutes", "Seconds"];

  return (
    <div className="flex items-center gap-2 mt-3">
      {intervals.map((interval) => {
        const value = timeLeft[interval] ?? 0;
        return (
          <div
            key={interval}
            className="flex flex-col items-center justify-center min-w-[60px] px-2 py-1.5 bg-[#3321c8] rounded-md text-white"
          >
            <span className="text-[18px] font-bold leading-tight">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide opacity-90">
              {interval}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CountDown;