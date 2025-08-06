// components/new-ui/DomainsCarousel.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  return (
    <section className="w-full flex flex-col items-center mt-24 px-4">
      <div className="flex flex-col items-center w-full max-w-[90vw] mb-9 sm:mb-16 md:mb-20 gap-6 md:gap-8">
        <h2 className="text-center font-eudoxus-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
          Domains we serve
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full max-w-[1050px] mx-auto"
      >
        <CarouselContent className="-ml-4">
          {DOMAINS.map((domain, idx) => (
            <CarouselItem key={idx} className="pl-6 basis-1/4">
              <div className="h-[280px] w-[240px] flex flex-col items-center justify-center border border-[#338AFF] rounded-xl p-6 bg-transparent shadow-lg transition-all duration-300 ease-in-out hover:bg-[#12162c]/50">
                <img
                  src={domain.icon}
                  alt={domain.name}
                  className="h-16 mb-4"
                  style={{ filter: "drop-shadow(0 0 10px #e9a85588)" }}
                />
                <h3 className="text-white text-xl font-eudoxus-medium mb-2 text-center">
                  {domain.name}
                </h3>
                <p className="text-white text-sm text-center">
                  {domain.desc}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 border-[#338AFF] text-white hover:text-white h-12 w-12 -left-14" />
        <CarouselNext className="bg-[#12162c] bg-opacity-60 hover:bg-opacity-80 border-[#338AFF] text-white hover:text-white h-12 w-12 -right-14" />
      </Carousel>
    </section>
  );
}
