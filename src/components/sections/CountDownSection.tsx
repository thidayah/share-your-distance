'use client'
import { useEffect, useRef, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountDownSection() {
  const targetDate = "2025-12-20T06:00:00"
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // setIsClient(true);

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Event has started
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ];

  return (
    <section className=" py-16 bg-gradient-to-b from-zinc-800 to-zinc-950 bg-zinc-900/70">
      <div className="container mx-auto px-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
          <div className=" w-full">
            {/* Progress bar for visual impact */}
            <div className="w-full max-w-xl mt-8">
              <div className="bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-zinc-800 to-zinc-200 h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${calculateProgress(timeLeft)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Motivational message based on time left */}
            <div className="mt-6 text-left">
              <p className="text-white text-sm md:text-base italic">
                {getMotivationalMessage(timeLeft)}
              </p>
            </div>
          </div>
          <div>
            <div className="text-right font-bold italic -mr-4">Race Starts In</div>
            <div className="flex items-center space-x-8 mt-2">
              {timeUnits.map((unit, index) => (
                <div key={index}>
                  <div className=" text-6xl md:text-9xl font-bold italic tracking-[-10px]">{unit.value.toString().padStart(2, '0')}</div>
                  <div className=" text-sm font-bold text-right">{unit.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper functions
function calculateProgress(timeLeft: TimeLeft): number {
  const totalDays = 365;
  const daysPassed = totalDays - timeLeft.days;
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
}

function getMotivationalMessage(timeLeft: TimeLeft): string {
  const { days, hours } = timeLeft;

  if (days > 60) return "Great things take time. Start training today!";
  if (days > 30) return "Consistency is key. Keep pushing forward!";
  if (days > 7) return "One week to go! Time to taper and prepare!";
  if (days > 1) return "Almost there! Get your gear ready!";
  if (hours > 12) return "Tomorrow is the day! Rest well!";
  if (hours > 6) return "Today's the day! See you at the starting line!";
  if (hours > 1) return "Race starts soon! Warm up properly!";
  
  return "The journey begins now! Good luck runners!";
}
