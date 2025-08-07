// components/new-ui/DomainsCarousel.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import edtechIcon from "../../assets/edtech.png";
import financeIcon from "../../assets/finance.png";
import hardwareIcon from "../../assets/hardware.png";
import healthcareIcon from "../../assets/healthcare.png";
import legalIcon from "../../assets/legal.png";
import roboticsIcon from "../../assets/robotics.png";

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
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="w-full flex flex-col items-center mt-24 px-4 pb-8 sm:pb-12 md:pb-16">
      <div className="flex flex-col items-center w-full max-w-[90vw] mb-9 sm:mb-16 md:mb-20 gap-6 md:gap-8">
        <h2 className="text-center font-eudoxus-bold text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-white">
          Domains we serve
        </h2>
        
        {/* Navigation buttons positioned under the heading */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 border border-[#338AFF] text-white hover:text-white h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 border border-[#338AFF] text-white hover:text-white h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full max-w-[1050px] mx-auto pb-4 sm:pb-6 md:pb-8 overflow-visible"
        setApi={setApi}
      >
        <CarouselContent className="-ml-2 sm:-ml-4">
          {DOMAINS.map((domain, idx) => (
            <CarouselItem key={idx} className="pl-2 sm:pl-4 md:pl-6 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="h-[200px] sm:h-[240px] md:h-[260px] lg:h-[280px] w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] mx-auto flex flex-col items-center justify-center border border-[#338AFF] rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 bg-transparent shadow-lg transition-all duration-300 ease-in-out hover:bg-[#12162c]/50 mb-2">
                <img
                  src={domain.icon}
                  alt={domain.name}
                  className="h-10 sm:h-12 md:h-14 lg:h-16 mb-2 sm:mb-3 md:mb-4"
                  style={{ filter: "drop-shadow(0 0 10px #e9a85588)" }}
                />
                <h3 className="text-white text-base sm:text-lg md:text-xl font-eudoxus-medium mb-1 sm:mb-2 text-center">
                  {domain.name}
                </h3>
                <p className="text-white text-xs sm:text-sm text-center">
                  {domain.desc}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
