// components/new-ui/WhyKyaaSection.tsx
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import butterfly from "../../assets/logo.png";

type Card = { title: string; subtitle: string };

enum ScrollDir {
  None = 0,
  Down = 1,
  Up = -1,
}

export default function WhyKyaaSection({ cards }: { cards: Card[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);
  const [progress, setProgress] = useState(0); // 0=start, 1=end
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollDir, setScrollDir] = useState<ScrollDir>(ScrollDir.None);
  const lastScrollY = useRef(window.scrollY);

  // Helper: check if section is fully in view
  const isSectionFullyInView = () => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  // Intersection observer: lock scroll when section is fully in view and butterfly is not at boundary
  useEffect(() => {
    const obs = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio === 1) {
          // Section is fully in view
          if (!locked) {
            if (progress > 0 && progress < 1) {
              setLocked(true);
            } else if (progress === 0 && scrollDir === ScrollDir.Down) {
              setLocked(true);
            } else if (progress === 1 && scrollDir === ScrollDir.Up) {
              setLocked(true);
            }
          }
        } else {
          if (locked) setLocked(false);
        }
      },
      { threshold: 1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
     
  }, [locked, progress, scrollDir]);

  // Lock/unlock page scroll
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);

  // Handle wheel events when locked
  useEffect(() => {
    if (!locked) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY / window.innerHeight;
      setScrollDir(delta > 0 ? ScrollDir.Down : ScrollDir.Up);
      setProgress((p) => {
        let next = p + delta;
        if (next < 0) next = 0;
        if (next > 1) next = 1;
        return next;
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [locked]);

  // Unlock scroll at boundaries
  useEffect(() => {
    if (!locked) return;
    if (progress <= 0 && scrollDir === ScrollDir.Up) {
      setLocked(false);
    } else if (progress >= 1 && scrollDir === ScrollDir.Down) {
      setLocked(false);
    }
  }, [progress, locked, scrollDir]);

  // When section comes back into view from up or down, relock and set progress to boundary
  useEffect(() => {
    const onScroll = () => {
      const dir = window.scrollY > lastScrollY.current ? ScrollDir.Down : ScrollDir.Up;
      setScrollDir(dir);
      lastScrollY.current = window.scrollY;
      if (!locked && isSectionFullyInView()) {
        if (dir === ScrollDir.Up && progress >= 1) {
          setLocked(true);
          setProgress(1);
        } else if (dir === ScrollDir.Down && progress <= 0) {
          setLocked(true);
          setProgress(0);
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
     
  }, [locked, progress]);

  // Map progress to activeIdx
  useEffect(() => {
    const idx = Math.floor(progress * (cards.length - 1 + 1e-6));
    setActiveIdx(idx);
  }, [progress, cards.length]);

  // Compute butterfly % left
  const butterflyLeft = ((activeIdx + 0.5) / cards.length) * 100;

  return (
    <div
      ref={sectionRef}
      className="w-full max-w-6xl mx-auto mt-32 px-4 relative overflow-visible"
    >
      <h2 className="text-center font-[Italiana,serif] text-4xl text-white mb-12">
        {"Why KYAA.ai?"}
      </h2>
      {/* Progress line + markers */}
      <div className="relative h-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[1px] bg-white/50" />
          {cards.map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-[1px]"
              style={{ left: `${(i + 0.5) * (100 / cards.length)}%` }}
            >
              <div className="w-3 h-3 bg-white/70 rotate-45 -translate-x-1.5" />
            </div>
          ))}
        </div>
        {/* Butterfly */}
        <motion.img
          src={butterfly}
          alt="Butterfly"
          className="absolute top-0 w-8 h-8"
          animate={{ left: `${butterflyLeft}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ x: "-50%" }}
        />
      </div>
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            className="border border-[#338AFF] rounded-xl p-8 flex flex-col"
            animate={{
              boxShadow:
                activeIdx === i
                  ? "0 0 30px rgba(233,193,136,0.6)"
                  : "0px 0px 0px rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-[Italiana,serif] text-white mb-3">
              {card.title}
            </h3>
            <p className="text-white text-sm">{card.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
