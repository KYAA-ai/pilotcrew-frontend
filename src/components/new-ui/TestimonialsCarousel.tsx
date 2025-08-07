import type { ReactNode } from "react";
import { useRef, useState } from "react";

const TESTIMONIALS = [
  {
    quote: "Pilotcrew.ai helped us flag and fix 17 hallucinations before go‑live.",
    author: "CTO, FinTech AI",
  },
  {
    quote: "The expert feedback was actionable and fast.",
    author: "Head of Product, HealthTech",
  },
  {
    quote: "We improved our model's compliance thanks to Pilotcrew.ai reviewers.",
    author: "AI Lead, LegalTech",
  },
];

export default function TestimonialsCarousel({ quoteIcon }: { quoteIcon: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

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

    if (isLeftSwipe && currentIndex < TESTIMONIALS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const goToNext = () => {
    if (currentIndex < TESTIMONIALS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto overflow-hidden py-4">
              {/* Mobile view - Carousel */}
        <div className="md:hidden relative px-8">
          <div
            ref={trackRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {TESTIMONIALS.map((testimonial, idx) => (
              <div
                key={`${idx}-${testimonial.author}`}
                className="flex-shrink-0 w-full px-2"
              >
                <div className={`w-[85%] mx-auto h-[200px] sm:h-[240px] md:h-[280px] border-2 border-dashed border-[#338AFF] rounded-xl p-4 sm:p-6 md:p-8 flex flex-col text-white bg-[#12162c] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#e9a855]/70 ${
                  idx === currentIndex ? 'opacity-100' : 'opacity-20'
                }`}>
                  <span className="text-lg sm:text-xl leading-none flex items-start justify-start mb-2 sm:mb-3 md:mb-4">
                    {quoteIcon}
                  </span>
                  <p className="flex-1 font-inter text-sm sm:text-lg md:text-xl leading-relaxed">{testimonial.quote}"</p>
                  <span className="font-inter text-xs sm:text-sm text-white/70 mt-2 sm:mt-3 md:mt-4">{testimonial.author}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile navigation arrows */}
          <div className="flex justify-between items-center absolute top-1/2 -translate-y-1/2 w-full -mx-8 pointer-events-none">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 flex items-center justify-center bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 rounded-full shadow-xl pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed ml-2"
              aria-label="Previous testimonial"
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

            <button
              onClick={goToNext}
              disabled={currentIndex === TESTIMONIALS.length - 1}
              className="w-10 h-10 flex items-center justify-center bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 rounded-full shadow-xl pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed mr-2"
              aria-label="Next testimonial"
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

        {/* Mobile indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-[#338AFF] w-6" : "bg-white/30"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop view - Grid */}
      <div className="hidden md:flex flex-row gap-16 justify-center items-stretch">
        {TESTIMONIALS.map((testimonial, idx) => (
          <div
            key={`${idx}-${testimonial.author}`}
            className="flex-shrink-0 w-[320px] h-[280px] border-2 border-dashed border-[#338AFF] rounded-xl p-8 flex flex-col text-white bg-[#12162c] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#e9a855]/70"
          >
            <span className="text-xl leading-none flex items-start justify-start mb-4">
              {quoteIcon}
            </span>
            <p className="flex-1 font-inter text-xl leading-relaxed">{testimonial.quote}"</p>
            <span className="font-inter text-sm text-white/70 mt-4">{testimonial.author}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
