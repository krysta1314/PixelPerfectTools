import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Translations } from '../types';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  t?: Translations;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImage, afterImage, className = '', t }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(50); // Percentage
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<number | null>(null);

  // Interaction State Management
  useEffect(() => {
    if (isResizing || isHovered) {
      // Stop auto-slide immediately on interaction
      setIsAutoSliding(false);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
    } else {
      // Schedule resumption when interaction ends
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = window.setTimeout(() => {
        setIsAutoSliding(true);
      }, 2500); // Resume after 2.5s
    }
    
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [isResizing, isHovered]);

  // Animation Loop
  useEffect(() => {
    if (!isAutoSliding) return;

    let startTime: number | null = null;
    const duration = 5000; // 5 seconds full cycle

    // Calculate initial phase based on current position to prevent jumping
    // We map the current position back to an angle on the sine wave
    // Current pos ~ 50 + 30 * sin(angle) -> sin(angle) = (pos - 50) / 30
    const clampedPos = Math.max(20, Math.min(80, position));
    const normalizedPos = (clampedPos - 50) / 30; // Map to -1..1
    const initialAngle = Math.asin(Math.max(-1, Math.min(1, normalizedPos)));

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // angle increases over time
      const angle = initialAngle + (elapsed / duration) * 2 * Math.PI;
      
      // Calculate new position: Center (50) + Amplitude (30) * sin(angle)
      const newPos = 50 + (30 * Math.sin(angle));
      
      setPosition(newPos);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAutoSliding]); // Re-run when isAutoSliding turns true

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(newPosition);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    setIsResizing(true);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsResizing(true);
  };

  const handleMouseUp = () => setIsResizing(false);
  const handleTouchEnd = () => setIsResizing(false);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        handleMove(e.clientX);
      }
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (isResizing && e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('touchmove', handleWindowTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isResizing, handleMove]);

  return (
    <div 
      className={`relative w-full overflow-hidden select-none group rounded-2xl border-4 border-white dark:border-white/5 shadow-2xl ${className}`}
      ref={containerRef}
      style={{ aspectRatio: '16/9' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="Enhanced"
        className="absolute top-0 left-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeImage}
          alt="Original"
          className="absolute top-0 left-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
          draggable={false}
        />
        
        {/* Before Label */}
        <div className={`absolute bottom-4 left-4 transition-all duration-500 transform ${isHovered || isResizing ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
           <span className="bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs font-bold tracking-wider px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
             ORIGINAL
           </span>
        </div>
      </div>

      {/* After Label */}
      <div className={`absolute bottom-4 right-4 transition-all duration-500 transform ${isHovered || isResizing ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
         <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] md:text-xs font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg">
           UPSCALED
         </span>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 touch-none"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute inset-y-0 -left-px w-1.5 bg-gradient-to-b from-transparent via-white/50 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        
        {/* Circle Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center transform transition-all hover:scale-110 active:scale-95 cursor-ew-resize">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900 absolute">
             <polyline points="9 18 15 12 9 6" transform="scale(-1, 1) translate(-24, 0)"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};