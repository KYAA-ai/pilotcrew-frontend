import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import butterflyLogo from "../../assets/logo.png";

type Card = { title: string; subtitle: string };

export default function WhyKyaaMobile({ cards }: { cards: Card[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState<number | undefined>(undefined);

  // Scroll handler: update activeIdx as user scrolls
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      let found = 0;
      for (let i = 0; i < cards.length; i++) {
        const card = cardRefs.current[i];
        if (card) {
          const rect = card.getBoundingClientRect();
          if (rect.top + rect.height / 2 > 56) { // 56px for nav
            found = i;
            break;
          }
        }
      }
      setActiveIdx(found);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [cards.length]);

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

  // Compute butterfly top position: use card height and start of the line
  const getButterflyTop = () => {
    if (!cardRefs.current[0]) return 0;
    const cardHeight = cardRefs.current[0].offsetHeight;
    if (!cardHeight) return 0;
    // The offset from the top of the line to the center of the first card
    const start = cardHeight / 2;
    // The offset between each card center
    const step = cardHeight + 32; // 32px gap-8
    // Subtract half the butterfly's height (h-20 = 80px, so 40px)
    return start + step * activeIdx - 40;
  };

  return (
    <div
      ref={sectionRef}
      className="block md:hidden w-full px-4 py-12 relative min-h-[400px]"
      style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}
    >
      {/* Heading above everything */}
      <div className="w-full">
        <h2 className="font-[Italiana,serif] text-4xl text-white mt-12 mb-15 text-center w-full">Why KYAA.ai?</h2>
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