// components/countdown-timer.tsx
'use client';

import { useEffect, useState } from 'react';
import { WEDDING_DATE } from '@/lib/constants';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +WEDDING_DATE - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="inline-flex gap-3 md:gap-6">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="text-center">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 md:p-4 shadow-lg border border-purple-200 min-w-[70px] md:min-w-[90px]">
            <div className="text-3xl md:text-4xl font-bold font-cormorant text-purple-700">
              {String(unit.value).padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs md:text-sm mt-2 text-gray-700 font-medium tracking-wide">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}