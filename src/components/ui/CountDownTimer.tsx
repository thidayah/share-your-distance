// src/components/ui/CountdownTimer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

// Sound effects paths (placeholder - you'll need to add actual sound files)
const SOUNDS = {
  countdownBeep: '/sounds/countdown-beep.mp3',
  raceStart: '/sounds/race-start-horn.mp3',
  confettiPop: '/sounds/confetti-pop.mp3',
};

export default function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isClient, setIsClient] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasPlayedFinalSound, setHasPlayedFinalSound] = useState(false);
  
  // Refs untuk audio
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const confettiIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preload audio files
      Object.entries(SOUNDS).forEach(([key, path]) => {
        audioRefs.current[key] = new Audio(path);
        audioRefs.current[key].preload = 'auto';
        audioRefs.current[key].volume = 0.6;
      });
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        const newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
        
        setTimeLeft(newTimeLeft);
        playCountdownSounds(newTimeLeft);
        
      } else {
        // Event has started
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        
        if (!hasPlayedFinalSound) {
          playRaceStartCelebration();
          setHasPlayedFinalSound(true);
        }
      }
    };

    const playCountdownSounds = (time: TimeLeft) => {
      // Play beep when under 1 minute
      if (time.minutes === 0 && time.seconds <= 10 && time.seconds > 0) {
        try {
          audioRefs.current.countdownBeep.currentTime = 0;
          audioRefs.current.countdownBeep.play().catch(() => {
            // Silent fail for autoplay restrictions
          });
        } catch (error) {
          console.log('Audio play failed:', error);
        }
      }
      
      // Special sound for last 24 hours
      if (time.days === 0 && time.hours === 0 && time.minutes === 30 && time.seconds === 0) {
        try {
          audioRefs.current.countdownBeep.volume = 0.8;
          audioRefs.current.countdownBeep.play().catch(() => {});
        } catch (error) {
          console.log('Audio play failed:', error);
        }
      }
    };

    const playRaceStartCelebration = () => {
      try {
        // Play race start sound
        audioRefs.current.raceStart.volume = 0.7;
        audioRefs.current.raceStart.play().catch(() => {});
        
        // Show confetti
        setShowConfetti(true);
        
        // Continuous confetti pops
        confettiIntervalRef.current = setInterval(() => {
          try {
            audioRefs.current.confettiPop.volume = 0.3;
            audioRefs.current.confettiPop.play().catch(() => {});
          } catch (error) {
            console.log('Confetti sound failed:', error);
          }
        }, 800);
        
        // Stop confetti after 10 seconds
        setTimeout(() => {
          setShowConfetti(false);
          if (confettiIntervalRef.current) {
            clearInterval(confettiIntervalRef.current);
          }
        }, 10000);
        
      } catch (error) {
        console.log('Celebration sounds failed:', error);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => {
      clearInterval(timer);
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
      }
    };
  }, [targetDate, hasPlayedFinalSound]);

  // SSR Loading State
  if (!isClient) {
    return (
      <div className={`flex justify-center space-x-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg w-20 h-20 flex items-center justify-center mb-2 animate-pulse">
              <div className="w-8 h-8 bg-white/30 rounded"></div>
            </div>
            <div className="text-white/70 text-sm font-medium capitalize">
              {['days', 'hours', 'minutes', 'seconds'][i]}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ];

  const isLastMinute = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0;
  const isLast10Seconds = isLastMinute && timeLeft.seconds <= 10;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Confetti Animation */}
      {showConfetti && <ConfettiAnimation />}
      
      <h3 className={`text-white text-lg md:text-xl font-semibold mb-6 opacity-90 transition-all duration-300 ${
        isLast10Seconds ? 'animate-pulse text-red-300' : ''
      }`}>
        {showConfetti ? "🎉 Race Has Started! 🎉" : "Race Starts In"}
      </h3>
      
      <div className="flex justify-center space-x-3 md:space-x-6">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="text-center">
            <div className={`
              relative bg-white/20 backdrop-blur-sm rounded-xl 
              w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
              flex items-center justify-center mb-3
              border border-white/30
              shadow-lg transition-all duration-300
              ${isLast10Seconds ? 'animate-bounce bg-red-500/30 border-red-300/50' : ''}
              ${index === 0 ? 'animate-pulse-slow' : ''}
            `}>
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent"></div>
              
              {/* Number dengan animation untuk last 10 seconds */}
              <span className={`
                text-2xl md:text-3xl lg:text-4xl font-bold text-white relative z-10 
                transition-all duration-200
                ${isLast10Seconds ? 'scale-110 text-red-100' : ''}
              `}>
                {unit.value.toString().padStart(2, '0')}
              </span>
              
              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/50 rounded-full"></div>
            </div>
            
            <div className={`
              text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider
              transition-all duration-300
              ${isLast10Seconds ? 'text-red-200 scale-105' : ''}
            `}>
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mt-8">
        <div className="bg-white/20 rounded-full h-2">
          <div 
            className={`
              h-2 rounded-full transition-all duration-1000
              ${showConfetti 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                : isLast10Seconds
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : 'bg-gradient-to-r from-primary-500 to-secondary-500'
              }
            `}
            style={{
              width: `${calculateProgress(timeLeft)}%`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-white/60 text-xs mt-2">
          <span>Today</span>
          <span>Race Day</span>
        </div>
      </div>

      {/* Motivational message */}
      <div className="mt-6 text-center">
        <p className={`
          text-sm md:text-base italic transition-all duration-300
          ${isLast10Seconds 
            ? 'text-red-200 font-bold animate-pulse' 
            : showConfetti
              ? 'text-green-200 font-semibold'
              : 'text-white/80'
          }
        `}>
          {getMotivationalMessage(timeLeft, showConfetti)}
        </p>
      </div>

      {/* Sound toggle for user control */}
      <div className="mt-4 flex items-center space-x-2">
        <label className="flex items-center text-white/70 text-sm cursor-pointer">
          <input 
            type="checkbox" 
            defaultChecked 
            onChange={(e) => {
              // Global mute/unmute
              Object.values(audioRefs.current).forEach(audio => {
                audio.muted = !e.target.checked;
              });
            }}
            className="mr-2 w-4 h-4 text-primary-500 rounded focus:ring-primary-400 focus:ring-opacity-25 border border-white/30 bg-white/20"
          />
          Enable sounds
        </label>
      </div>
    </div>
  );
}

// Confetti Component
function ConfettiAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Multiple confetti elements */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            backgroundColor: getRandomColor(),
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Helper functions
function calculateProgress(timeLeft: TimeLeft): number {
  const totalDays = 365;
  const daysPassed = totalDays - timeLeft.days;
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
}

function getMotivationalMessage(timeLeft: TimeLeft, showConfetti: boolean): string {
  if (showConfetti) {
    return "🎉 The race has begun! Go, go, go! 🎉";
  }

  const { days, hours, minutes, seconds } = timeLeft;

  if (days > 60) return "Great things take time. Start training today!";
  if (days > 30) return "Consistency is key. Keep pushing forward!";
  if (days > 7) return "One week to go! Time to taper and prepare!";
  if (days > 1) return "Almost there! Get your gear ready!";
  if (hours > 12) return "Tomorrow is the day! Rest well!";
  if (hours > 6) return "Today's the day! See you at the starting line!";
  if (hours > 1) return "Race starts soon! Warm up properly!";
  if (minutes > 10) return "Final preparations! Stay hydrated!";
  if (minutes > 1) return "Get to your positions! Almost time!";
  if (seconds <= 10) return "READY... SET... GET READY! 🚀";
  
  return "The journey begins now! Good luck runners!";
}

function getRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}