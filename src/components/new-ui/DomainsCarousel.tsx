// components/new-ui/DomainsCarousel.tsx
import { useEffect, useLayoutEffect, useState } from "react";
import edtechIcon from "../../assets/edtech.png";
import financeIcon from "../../assets/finance.png";
import healthcareIcon from "../../assets/healthcare.png";
import legalIcon from "../../assets/legal.png";
import roboticsIcon from "../../assets/robotics.png";

const getCardWidth = () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 160 : 270);
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

  // Current index into `extended`. Start at the beginning of the middle copy
  const [index, setIndex] = useState(baseLen);

  // Control CSS transitions
  const [disableTransition, setDisableTransition] = useState(false);
  const [animating, setAnimating] = useState(false);

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

  // After each CSS transition, jump back into the center copy if needed
  const handleTransitionEnd = () => {
    setAnimating(false);
    if (index >= 2 * baseLen) {
      // Moved past end of middle copy
      setDisableTransition(true);
      setIndex(baseLen);
    } else if (index < baseLen) {
      // Moved before start of middle copy
      setDisableTransition(true);
      setIndex(2 * baseLen - 1);
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
      <h2 className="text-center font-eudoxus-bold text-4xl md:text-5xl text-white mb-16">
        Domains we serve
      </h2>

      <div className="relative w-full max-w-[90vw] mx-auto overflow-hidden">
        {/* Prev */}
        <button
          onClick={movePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 rounded-full shadow-xl"
          aria-label="Previous"
        >
          <svg width="24" height="24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Track */}
        <div
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
                className="flex-shrink-0 flex flex-col items-center justify-start border border-[#338AFF] rounded-xl p-4 md:p-8 bg-transparent"
                style={{ width: cardWidth, gap: "1rem" }}
              >
                <img
                  src={domain.icon}
                  alt={domain.name}
                  className="h-16 mb-4"
                  style={{ filter: "drop-shadow(0 0 10px #e9a85588)" }}
                />
                <h3 className="text-white text-lg md:text-2xl font-eudoxus-medium mb-2 text-center">
                  {domain.name}
                </h3>
                <p className="text-white text-sm md:text-base text-center">
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

        {/* Next */}
        <button
          onClick={moveNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 rounded-full shadow-xl"
          aria-label="Next"
        >
          <svg width="24" height="24" fill="none">
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
    </section>
  );
}
