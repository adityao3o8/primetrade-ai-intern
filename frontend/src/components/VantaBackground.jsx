import { useEffect, useRef } from 'react';

export default function VantaBackground() {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    const el = vantaRef.current;
    if (!el || effectRef.current) return;

    const initVanta = () => {
      if (!window.VANTA?.FOG || !window.THREE) return false;

      try {
        effectRef.current = window.VANTA.FOG({
          el,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0x6366f1,
          midtoneColor: 0x8b5cf6,
          lowlightColor: 0x312e81,
          baseColor: 0x0f172a,
          blurFactor: 0.65,
          speed: 1.1,
          zoom: 0.85,
        });
        return true;
      } catch (err) {
        console.warn('Vanta fog failed to initialize:', err);
        return false;
      }
    };

    if (!initVanta()) {
      const timer = setInterval(() => {
        if (initVanta()) clearInterval(timer);
      }, 100);
      return () => clearInterval(timer);
    }

    return () => {
      if (effectRef.current) {
        effectRef.current.destroy();
        effectRef.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className="vanta-bg" aria-hidden="true" />;
}
