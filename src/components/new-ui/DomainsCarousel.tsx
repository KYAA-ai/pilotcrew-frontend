// components/new-ui/DomainsCarousel.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import edtechIcon from "../../assets/edtech.png";
import financeIcon from "../../assets/finance.png";
import hardwareIcon from "../../assets/hardware.png";
import healthcareIcon from "../../assets/healthcare.png";
import legalIcon from "../../assets/legal.png";
import roboticsIcon from "../../assets/robotics.png";

const getCardWidth = () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 270);
const CARD_GAP = 32;

const DOMAINS = [
  {
    name: "Legal AI",
    desc: "Validate AI‑generated contracts for legal correctness and bias.",
    icon: legalIcon,
  },
  {
    name: "Healthcare AI",
    desc: "Validate AI‑generated contracts for legal correctness and bias.",
    icon: healthcareIcon,
  },
  {
    name: "EdTech AI",
    desc: "Validate AI‑generated contracts for legal correctness and bias.",
    icon: edtechIcon,
  },
  {
    name: "Finance AI",
    desc: "Validate AI‑generated contracts for legal correctness and bias.",
    icon: financeIcon,
  },
  {
    name: "Robotics & CV",
    desc: "Validate AI‑generated contracts for legal correctness and bias.",
    icon: roboticsIcon,
  },
  {
    name: "Hardware AI",
    desc: "Validate AI‑generated contracts for legal correctness and bias.",
    icon: hardwareIcon,
  },
];

export function DomainsCarousel() {
  // How many placeholders at the end of the real list
  const [placeholders, setPlaceholders] = useState(5);
  useLayoutEffect(() => {
    const upd = () => setPlaceholders(window.innerWidth < 640 ? 2 : 5);
    upd();
    window.addEventListener("resize", upd, { passive: true });
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Responsive card width
  const [cardWidth, setCardWidth] = useState(getCardWidth());
  useLayoutEffect(() => {
    const upd = () => setCardWidth(getCardWidth());
    upd();
    window.addEventListener("resize", upd, { passive: true });
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Build a "base" list = real domains + placeholders
  const base = [...DOMAINS, ...Array(placeholders).fill(null)];
  const baseLen = base.length;

  // Triple‑clone for infinite loop
  const extended = [...base, ...base, ...base];

  // Current index into `extended`. Start at the beginning
  const [index, setIndex] = useState(0);

  // Control CSS transitions
  const [disableTransition, setDisableTransition] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Touch/swipe state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Handlers
  const movePrev = () => {
    if (animating) return;
    setIndex((i) => i - 1);
    setAnimating(true);
  };
  const moveNext = () => {
    if (animating) return;
    setIndex((i) => i + 1);
    setAnimating(true);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      moveNext();
    } else if (isRightSwipe) {
      movePrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // After each CSS transition, jump back into the center copy if needed
  const handleTransitionEnd = () => {
    setAnimating(false);
    if (index >= 2 * baseLen) {
      // Moved past end of middle copy
      setDisableTransition(true);
      setIndex(baseLen);
    } else if (index < 0) {
      // Moved before start of first copy
      setDisableTransition(true);
      setIndex(baseLen - 1);
    }
  };

  // Re‑enable transitions on next frame after a jump
  useEffect(() => {
    if (disableTransition) {
      requestAnimationFrame(() => setDisableTransition(false));
    }
  }, [disableTransition]);

  // Compute transform: card+gap times index
  const offset = -(cardWidth + CARD_GAP) * index;

  return (
    <section className="w-full flex flex-col items-center mt-24 px-4">
      <div className="flex flex-col items-center w-full max-w-[90vw] mb-8 sm:mb-12 md:mb-16 gap-4 md:gap-8">
        <h2 className="text-center font-eudoxus-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
          Domains we serve
        </h2>
        
        <div className="flex gap-2 mt-4 md:mt-6">
          {/* Prev */}
          <button
            onClick={movePrev}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 rounded-full shadow-xl"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={moveNext}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 rounded-full shadow-xl"
            aria-label="Next"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative w-[85vw] sm:w-[80vw] md:w-[70vw] mx-auto overflow-hidden">
        {/* Track */}
        <div
          ref={trackRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTransitionEnd={handleTransitionEnd}
          className="flex gap-[32px] justify-start items-stretch"
          style={{
            transform: `translateX(${offset}px)`,
            transition: disableTransition ? "none" : "transform 0.3s ease",
          }}
        >
          {extended.map((domain, idx) =>
            domain ? (
              <div
                key={`${idx}-${domain.name}`}
                className="flex-shrink-0 flex flex-col items-center justify-start border border-[#338AFF] rounded-xl p-3 sm:p-4 md:p-8 bg-transparent"
                style={{ width: cardWidth, gap: "0.75rem" }}
              >
                <img
                  src={domain.icon}
                  alt={domain.name}
                  className="h-12 sm:h-14 md:h-16 mb-2 sm:mb-3 md:mb-4"
                  style={{ filter: "drop-shadow(0 0 10px #e9a85588)" }}
                />
                <h3 className="text-white text-sm sm:text-lg md:text-2xl font-eudoxus-medium mb-1 sm:mb-2 text-center">
                  {domain.name}
                </h3>
                <p className="text-white text-xs sm:text-sm md:text-base text-center">
                  {domain.desc}
                </p>
              </div>
            ) : (
              // invisible placeholder
              <div
                key={`ph-${idx}`}
                className="flex-shrink-0"
                style={{ width: cardWidth }}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
