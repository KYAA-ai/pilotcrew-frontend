import { useState, useRef, useLayoutEffect } from "react";
import legalIcon from "../../assets/legal.png";
import healthcareIcon from "../../assets/healthcare.png";
import edtechIcon from "../../assets/edtech.png";
import financeIcon from "../../assets/finance.png";
import roboticsIcon from "../../assets/robotics.png";

// --- Constants ---
const CARD_WIDTH = 270; // px, must match your design
const CARD_GAP = 32; // px (gap-8 in Tailwind)
const MOBILE_CARDS = 2;

const DOMAINS = [
  { name: "Legal AI", desc: "Validate AI-generated contracts for legal correctness and bias.", icon: legalIcon },
  { name: "Healthcare AI", desc: "Validate AI-generated contracts for legal correctness and bias.", icon: healthcareIcon },
  { name: "EdTech AI", desc: "Validate AI-generated contracts for legal correctness and bias.", icon: edtechIcon },
  { name: "Finance AI", desc: "Validate AI-generated contracts for legal correctness and bias.", icon: financeIcon },
  { name: "Robotics & CV", desc: "Validate AI-generated contracts for legal correctness and bias.", icon: roboticsIcon },
];

export function DomainsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState(MOBILE_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGap, setShowGap] = useState(false);

  // Dynamically calculate visible cards based on carousel width
  useLayoutEffect(() => {
    function handleResize() {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        // On mobile, force 2 cards
        if (window.innerWidth < 640) {
          setVisibleCards(MOBILE_CARDS);
        } else {
          // Cards + gaps, always at least 2
          const n = Math.floor((containerWidth + CARD_GAP) / (CARD_WIDTH + CARD_GAP));
          setVisibleCards(Math.max(2, Math.min(n, DOMAINS.length)));
        }
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Carousel controls ---
  const handleNext = () => {
    if (currentIndex + visibleCards < DOMAINS.length) {
      setCurrentIndex(currentIndex + 1);
      setShowGap(false);
    } else if (!showGap) {
      setShowGap(true);
    } else {
      setCurrentIndex(0);
      setShowGap(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowGap(false);
    } else if (!showGap) {
      setShowGap(true);
    } else {
      setCurrentIndex(DOMAINS.length - visibleCards);
      setShowGap(false);
    }
  };

  // --- Which cards to show ---
  let cardsToShow = [];
  if (showGap) {
    cardsToShow =
      currentIndex === 0
        ? [null, ...DOMAINS.slice(currentIndex, currentIndex + visibleCards - 1)]
        : [...DOMAINS.slice(currentIndex + 1, currentIndex + visibleCards), null];
  } else {
    cardsToShow = DOMAINS.slice(currentIndex, currentIndex + visibleCards);
  }
  while (cardsToShow.length < visibleCards) cardsToShow.push(null);

  return (
    <section className="w-full flex flex-col items-center mt-24">
      <h2 className="text-center font-[Italiana,serif] text-4xl md:text-5xl text-white mb-16">Domains we serve</h2>
      <div
        ref={carouselRef}
        className="relative flex items-center justify-center w-[90vw] mx-auto"
      >
        {/* Left arrow */}
        <button
          aria-label="Previous"
          onClick={handlePrev}
          className="absolute left-0 z-10 w-10 h-10 flex items-center justify-center bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 rounded-full shadow-xl"
        >
          <svg width="24" height="24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Carousel cards */}
        <div
          className={`flex justify-center items-stretch w-full gap-8 px-8 transition-all duration-300`}
        >
          {cardsToShow.map((domain, idx) =>
            domain ? (
              <div
                key={domain.name}
                className="flex flex-col items-center justify-center bg-transparent border border-[#338AFF] rounded-xl p-8 shadow-xl"
                style={{ width: CARD_WIDTH, minHeight: 320 }}
              >
                <img src={domain.icon} alt={domain.name} className="h-16 mb-6" style={{ filter: "drop-shadow(0 0 10px #e9a85588)" }} />
                <div className="text-white text-2xl font-[Italiana,serif] mb-3">{domain.name}</div>
                <div className="text-white text-lg text-center">{domain.desc}</div>
              </div>
            ) : (
              <div key={idx} style={{ width: CARD_WIDTH, minHeight: 320 }} className="opacity-0" />
            )
          )}
        </div>
        {/* Right arrow */}
        <button
          aria-label="Next"
          onClick={handleNext}
          className="absolute right-0 z-10 w-10 h-10 flex items-center justify-center bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 rounded-full shadow-xl"
        >
          <svg width="24" height="24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </section>
  );
}
