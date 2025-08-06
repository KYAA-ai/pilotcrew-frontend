import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import butterflyLogo from "../../assets/logo.png";

type Card = { title: string; subtitle: string };

export default function WhyPilotcrewMobile({ cards }: { cards: Card[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState<number | undefined>(undefined);

  // Scroll handler: update activeIdx as user scrolls
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Only process if section is in view
      if (sectionRect.bottom < 0 || sectionRect.top > viewportHeight) return;
      
      let found = 0;
      let minDistance = Infinity;
      
      for (let i = 0; i < cards.length; i++) {
        const card = cardRefs.current[i];
        if (card) {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const viewportCenter = viewportHeight / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            found = i;
          }
        }
      }
      
      if (found !== activeIdx) {
        setActiveIdx(found);
      }
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [cards.length, activeIdx]);

  // Update line height to match cards stack
  useEffect(() => {
    const updateLineHeight = () => {
      if (cardsContainerRef.current) {
        setLineHeight(cardsContainerRef.current.offsetHeight);
      }
    };
    updateLineHeight();
    window.addEventListener("resize", updateLineHeight);
    return () => window.removeEventListener("resize", updateLineHeight);
  }, [cards.length]);

  // Compute butterfly top position: use actual card positions
  const getButterflyTop = () => {
    if (!cardRefs.current[activeIdx] || !cardsContainerRef.current) return 0;
    
    const activeCard = cardRefs.current[activeIdx];
    const container = cardsContainerRef.current;
    
    // Get the position of the active card relative to the container
    const cardTop = activeCard.offsetTop;
    const cardHeight = activeCard.offsetHeight;
    const cardCenter = cardTop + cardHeight / 2;
    
    // Adjust for the butterfly's own height (80px = 40px offset)
    return cardCenter - 40;
  };

  return (
    <div
      ref={sectionRef}
      className="block md:hidden w-full px-4 py-12 relative min-h-[400px]"
      style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}
    >
      {/* Heading above everything */}
      <div className="w-full">
        <h2 className="font-eudoxus-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mt-12 mb-15 text-center w-full">Why Pilotcrew.ai?</h2>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', position: 'relative' }} className="justify-center w-full flex">
          {/* Vertical line at left, starts after heading */}
          <div style={{ width: 40, height: lineHeight, position: 'relative' }}>
            <div className="w-1 bg-white/50 rounded-full mx-auto" style={{ height: lineHeight, position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
            {/* Butterfly */}
            <motion.img
              src={butterflyLogo}
              alt="Butterfly"
              className="absolute left-1/2 -translate-x-1/2 w-20 h-20 object-contain"
              style={{ minHeight: '3rem', minWidth: '3rem' }}
              animate={{ top: getButterflyTop() }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          {/* Cards stacked to the right */}
          <div className="flex flex-col gap-8 ml-4 w-full" style={{ maxWidth: '60vw' }} ref={cardsContainerRef}>
            {cards.map((card, i) => (
              <div
                key={card.title}
                ref={el => { cardRefs.current[i] = el; }}
                className="border border-[#338AFF] rounded-xl p-6 flex flex-col min-h-[120px] items-start text-left justify-center bg-[#040713]"
                style={{
                  boxShadow:
                    activeIdx === i
                      ? '0 0 30px 0 rgba(233,193,136,0.6)'
                      : 'none',
                }}
              >
                <h3 className="text-xl font-eudoxus-bold text-white mb-2">{card.title}</h3>
                <p className="text-white text-sm">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 