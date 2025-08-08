// components/new-ui/WhyPilotcrew.tsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import butterfly from "../../assets/logo.png";

type Card = { title: string; subtitle: string };

export default function WhyPilotcrew({ cards }: { cards: Card[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);
  const [progress, setProgress] = useState(0); // 0=start, 1=end
  const [activeIdx, setActiveIdx] = useState(0);



  // Intersection observer: lock scroll when section is fully in view
  useEffect(() => {
    const obs = new window.IntersectionObserver(
      ([entry]) => {
        console.log('Intersection ratio:', entry.intersectionRatio, 'Locked:', locked);
        if (entry.intersectionRatio >= 0.95) {
          // Section is mostly in view - lock scroll
          if (!locked) {
            console.log('Locking scroll');
            setLocked(true);
          }
        } else {
          // Section not mostly in view - unlock scroll
          if (locked) {
            console.log('Unlocking scroll');
            setLocked(false);
            setProgress(0); // Reset progress when leaving section
          }
        }
      },
      { threshold: 0.95 } // Slightly more lenient threshold
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [locked]);

  // Lock/unlock page scroll
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  // Handle wheel events when locked
  useEffect(() => {
    if (!locked) return;
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const delta = e.deltaY;
      const scrollSensitivity = 0.002; // Increased sensitivity for more responsive movement
      
      console.log('Wheel event:', delta, 'Current progress:', progress);
      
      setProgress((p) => {
        let next = p + (delta * scrollSensitivity);
        if (next < 0) next = 0;
        if (next > 1) next = 1;
        console.log('New progress:', next);
        return next;
      });
    };
    
    // Only prevent wheel events, let other scroll methods work normally
    window.addEventListener("wheel", onWheel, { passive: false });
    
    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [locked]);

  // Unlock scroll when butterfly reaches the end
  useEffect(() => {
    if (locked && progress >= 1) {
      setLocked(false);
    }
  }, [progress, locked]);



  // Map progress to activeIdx
  useEffect(() => {
    const idx = Math.floor(progress * (cards.length - 1 + 1e-6));
    setActiveIdx(idx);
  }, [progress, cards.length]);

  // Compute butterfly % left
  const butterflyLeft = ((activeIdx + 0.5) / cards.length) * 100;
  console.log('Progress:', progress, 'ActiveIdx:', activeIdx, 'ButterflyLeft:', butterflyLeft, 'Locked:', locked);

  return (
    <div
      ref={sectionRef}
      className="w-full max-w-6xl mx-auto mt-32 px-4 relative overflow-visible"
    >
      <h2 className="text-center font-eudoxus-bold text-5xl text-white mb-12">
        {"Why Pilotcrew.ai?"}
      </h2>
      {/* Progress line + markers */}
      <div className="relative h-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[1px] bg-white/50" />
        </div>
        {/* Butterfly */}
        <motion.div 
          className="absolute top-1/2"
          animate={{ left: `${butterflyLeft}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {/* Golden blur sphere behind butterfly */}
          <div 
            className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-[#e9a855] blur-md opacity-40 transform -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: -1 }}
          />
          <img
            src={butterfly}
            alt="Butterfly"
            className="w-12 h-12 relative z-10"
          />
        </motion.div>
      </div>
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            className="border border-[#338AFF] rounded-xl p-8 flex flex-col min-h-[220px] items-center text-center justify-center"
            animate={{
              boxShadow:
                activeIdx === i
                  ? "0 0 30px rgba(233,193,136,0.6)"
                  : "0px 0px 0px rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-eudoxus-bold text-white mb-3">
              {card.title}
            </h3>
            <p className="text-white text-sm">{card.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
