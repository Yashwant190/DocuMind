import { useEffect, useRef } from 'react';

interface CrazyAnimatedBackgroundProps {
  intensity?: 'normal' | 'extreme';
}

export function CrazyAnimatedBackground({ intensity = 'normal' }: CrazyAnimatedBackgroundProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create particle burst effect at specific position
    const createParticleBurst = (x: number, y: number, count: number = 1) => {
      for (let i = 0; i < count; i++) {
        const burst = document.createElement('div');
        const color = ['#00ff88', '#00d4ff', '#ff00ff'][Math.floor(Math.random() * 3)];
        const angle = (Math.PI * 2 * i) / count;
        const distance = Math.random() * 200 + 100;
        
        burst.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: ${Math.random() * 8 + 4}px;
          height: ${Math.random() * 8 + 4}px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 20px ${color};
          z-index: 1;
        `;
        containerRef.current?.appendChild(burst);

        const endX = x + Math.cos(angle) * distance;
        const endY = y + Math.sin(angle) * distance;

        burst.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, opacity: 0 }
        ], {
          duration: 1500,
          easing: 'ease-out'
        });

        setTimeout(() => burst.remove(), 1500);
      }
    };

    // Random bursts - MORE INTENSE during processing
    const burstDelay = intensity === 'extreme' ? 50 : 150;
    const burstInterval = setInterval(() => {
      const count = intensity === 'extreme' ? 3 : 1;
      createParticleBurst(Math.random() * window.innerWidth, Math.random() * window.innerHeight, count);
    }, burstDelay);

    // Mouse click handler - EXPLOSION!
    const handleClick = (e: MouseEvent) => {
      createParticleBurst(e.clientX, e.clientY, 20);
      
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        border: 2px solid #00ff88;
        pointer-events: none;
        z-index: 1;
      `;
      containerRef.current?.appendChild(ripple);

      ripple.animate([
        { width: '0px', height: '0px', opacity: 1, transform: 'translate(-50%, -50%)' },
        { width: '300px', height: '300px', opacity: 0, transform: 'translate(-50%, -50%)' }
      ], {
        duration: 1000,
        easing: 'ease-out'
      });

      setTimeout(() => ripple.remove(), 1000);
    };

    // Mouse move handler - trail effect
    let lastMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < 50) return; // Throttle
      lastMoveTime = now;

      const trail = document.createElement('div');
      const color = ['#00ff88', '#00d4ff', '#ff00ff'][Math.floor(Math.random() * 3)];
      trail.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 8px;
        height: 8px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 15px ${color};
        z-index: 1;
      `;
      containerRef.current?.appendChild(trail);

      trail.animate([
        { opacity: 0.8, transform: 'translate(-50%, -50%) scale(1)' },
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0)' }
      ], {
        duration: 800,
        easing: 'ease-out'
      });

      setTimeout(() => trail.remove(), 800);
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);

    // Create floating shapes
    const createFloatingShape = () => {
      const shape = document.createElement('div');
      const size = Math.random() * 150 + 50;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const duration = Math.random() * 10 + 5;
      const delay = Math.random() * 5;
      
      shape.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(0, 255, 136, 0.15), transparent);
        border-radius: 50%;
        filter: blur(40px);
        pointer-events: none;
        animation: crazy-float ${duration}s ease-in-out ${delay}s infinite;
        z-index: 0;
      `;
      containerRef.current?.appendChild(shape);
      return shape;
    };

    const shapes = Array.from({ length: 30 }, () => createFloatingShape());

    // Cleanup
    return () => {
      clearInterval(burstInterval);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      shapes.forEach(shape => shape.remove());
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" />
      
      {/* Animated gradient mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        {/* Crazy animated orbs - MORE INTENSE during processing */}
        <div className={`absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full transition-opacity duration-1000 ${
          intensity === 'extreme' ? 'opacity-100' : 'opacity-70'
        }`}
             style={{ 
               background: 'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 70%)',
               animation: intensity === 'extreme' ? 'crazy-float 4s ease-in-out infinite' : 'crazy-float 8s ease-in-out infinite',
               filter: intensity === 'extreme' ? 'blur(60px)' : 'blur(100px)'
             }} />
        <div className={`absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full transition-opacity duration-1000 ${
          intensity === 'extreme' ? 'opacity-100' : 'opacity-70'
        }`}
             style={{ 
               background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
               animation: intensity === 'extreme' ? 'crazy-float-reverse 5s ease-in-out infinite' : 'crazy-float-reverse 10s ease-in-out infinite',
               filter: intensity === 'extreme' ? 'blur(60px)' : 'blur(100px)'
             }} />
        <div className={`absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full transition-opacity duration-1000 ${
          intensity === 'extreme' ? 'opacity-100' : 'opacity-70'
        }`}
             style={{ 
               background: 'radial-gradient(circle, rgba(255,0,255,0.25) 0%, transparent 70%)',
               animation: intensity === 'extreme' ? 'crazy-spin 6s linear infinite' : 'crazy-spin 12s linear infinite',
               filter: intensity === 'extreme' ? 'blur(60px)' : 'blur(100px)'
             }} />
        
        {/* Extra orbs during extreme mode */}
        {intensity === 'extreme' && (
          <>
            <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] rounded-full animate-ping"
                 style={{ 
                   background: 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, transparent 70%)',
                   animationDuration: '3s'
                 }} />
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full"
                 style={{ 
                   background: 'radial-gradient(circle, rgba(255,0,255,0.3) 0%, transparent 70%)',
                   animation: 'crazy-spin 4s linear infinite reverse',
                   filter: 'blur(80px)'
                 }} />
          </>
        )}
        
        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {Array.from({ length: 20 }, (_, i) => (
            <line
              key={i}
              x1={`${i * 5}%`}
              y1="0%"
              x2={`${100 - i * 5}%`}
              y2="100%"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </svg>

        {/* Rotating grid */}
        <div className="absolute inset-0 opacity-5 animate-slow-spin"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px',
               animation: 'slow-spin 60s linear infinite'
             }} />
      </div>

      {/* Custom keyframes */}
      <style>{`
        @keyframes particle-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes crazy-float {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(100px, -100px) scale(1.3) rotate(90deg);
          }
          50% {
            transform: translate(-50px, 100px) scale(0.7) rotate(180deg);
          }
          75% {
            transform: translate(150px, 50px) scale(1.1) rotate(270deg);
          }
        }
        
        @keyframes crazy-float-reverse {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(-150px, 100px) scale(1.4) rotate(120deg);
          }
          66% {
            transform: translate(100px, -80px) scale(0.8) rotate(240deg);
          }
        }
        
        @keyframes crazy-spin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.3);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
        
        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
