import { useEffect, useRef } from 'react';

interface ExplosionEffectProps {
  isActive: boolean;
}

export function ExplosionEffect({ isActive }: ExplosionEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const colors = ['#00ff88', '#00d4ff', '#ff00ff', '#ffaa00'];
    
    // Create massive explosion from center
    const createExplosion = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const particleCount = 100;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 500 + 300;
        const size = Math.random() * 20 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
          position: fixed;
          left: ${centerX}px;
          top: ${centerY}px;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 30px ${color}, 0 0 60px ${color};
          z-index: 9999;
        `;
        
        containerRef.current?.appendChild(particle);

        const endX = centerX + Math.cos(angle) * velocity;
        const endY = centerY + Math.sin(angle) * velocity;

        particle.animate([
          { 
            transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
            opacity: 1
          },
          { 
            transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1) rotate(${Math.random() * 720}deg)`,
            opacity: 1,
            offset: 0.7
          },
          { 
            transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0) rotate(${Math.random() * 1080}deg)`,
            opacity: 0
          }
        ], {
          duration: 2000,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => particle.remove(), 2000);
      }

      // Create shockwave rings
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const ring = document.createElement('div');
          ring.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 0;
            height: 0;
            border: 4px solid ${colors[i % colors.length]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
          `;
          containerRef.current?.appendChild(ring);

          ring.animate([
            { 
              width: '0px',
              height: '0px',
              opacity: 1,
              transform: 'translate(-50%, -50%)'
            },
            { 
              width: '1500px',
              height: '1500px',
              opacity: 0,
              transform: 'translate(-50%, -50%)'
            }
          ], {
            duration: 1500,
            easing: 'ease-out'
          });

          setTimeout(() => ring.remove(), 1500);
        }, i * 100);
      }

      // Create flash
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        inset: 0;
        background: radial-gradient(circle at center, rgba(0,255,136,0.5), transparent 60%);
        pointer-events: none;
        z-index: 9997;
      `;
      containerRef.current?.appendChild(flash);

      flash.animate([
        { opacity: 0 },
        { opacity: 1, offset: 0.1 },
        { opacity: 0 }
      ], {
        duration: 500,
        easing: 'ease-out'
      });

      setTimeout(() => flash.remove(), 500);
    };

    // Trigger explosion immediately
    createExplosion();

    // Create continuous smaller explosions
    const explosionInterval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = Math.random() * 200 + 100;
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 20px ${color};
          z-index: 9999;
        `;
        
        containerRef.current?.appendChild(particle);

        const endX = x + Math.cos(angle) * velocity;
        const endY = y + Math.sin(angle) * velocity;

        particle.animate([
          { 
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1
          },
          { 
            transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`,
            opacity: 0
          }
        ], {
          duration: 1000,
          easing: 'ease-out'
        });

        setTimeout(() => particle.remove(), 1000);
      }
    }, 500);

    return () => {
      clearInterval(explosionInterval);
    };
  }, [isActive]);

  if (!isActive) return null;

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[99]" />;
}
