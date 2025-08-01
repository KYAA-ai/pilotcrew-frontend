import type { ReactNode } from "react";

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
  return (
    <section className="relative w-full max-w-6xl mx-auto overflow-hidden py-4">
      {/* Centered testimonials grid */}
      <div className="flex flex-col md:flex-row gap-16 justify-center items-stretch">
        {TESTIMONIALS.map((testimonial, idx) => (
          <div
            key={`${idx}-${testimonial.author}`}
            className="flex-shrink-0 w-full md:w-[320px] h-[280px] border-2 border-dashed border-[#338AFF] rounded-xl p-8 flex flex-col text-white bg-[#12162c] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#e9a855]/70"
          >
            <span className="text-base md:text-xl leading-none flex items-start justify-start mb-4">
              {quoteIcon}
            </span>
            <p className="flex-1 font-inter text-lg md:text-xl leading-relaxed">{testimonial.quote}"</p>
            <span className="font-inter text-sm text-white/70 mt-4">{testimonial.author}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
