// pages/NewLandingPage.tsx
import { DomainsCarousel } from "@/components/new-ui/DomainsCarousel";
import FloatingNavbar from "@/components/new-ui/FloatingNavbar";
import Footer from "@/components/new-ui/Footer";
import TestimonialsCarousel from "@/components/new-ui/TestimonialsCarousel";
import WhyKyaaSection from "@/components/new-ui/WhyKyaa";
import { useState } from "react";
import agent from "../assets/agent.svg";
import expert from "../assets/expert.svg";
import flowchart from "../assets/flowchart.svg";
import butterfly from "../assets/logo.png";

export default function NewLandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ——— Slider section state & refs ———
  const cards = [
    { title: "Expert Insights", subtitle: "Real‑world domain experts" },
    { title: "Global Talent",   subtitle: "Cost‑effective expert pool" },
    { title: "API Integration", subtitle: "Integrate via API for validation feedback" },
    { title: "GDPR Compliant",  subtitle: "Enterprise‑ready data handling" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#040713] overflow-x-hidden">
      {/* Top “spheres” */}
      <div className="absolute -top-16 -left-16 w-[400px] h-[400px] rounded-full bg-[#006FFF] blur-[550px] z-1" />
      <div className="absolute -top-16 -right-16 w-[400px] h-[400px] rounded-full bg-[#006FFF] blur-[550px] z-1" />

      {/* Navbars */}
      <FloatingNavbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        desktopWrapperClassName="hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[80vw] max-w-6xl"
        mobileWrapperClassName="lg:hidden sticky top-0 z-30"
      />

      {/* Spacer for fixed navbar */}
      <div className="hidden lg:block h-24" aria-hidden />

      {/* Headline & tagline */}
      <div className="w-full flex flex-col items-center mt-28 px-4">
        <h1 className="font-eudoxus-extrabold text-center text-5xl md:text-6xl text-white leading-tight max-w-5xl">
          Validate Your AI with{" "}
          <span className="bg-gradient-to-r from-[#e9c188] to-[#e9a855] text-transparent bg-clip-text">
            Real Human Expertise.
          </span>
        </h1>
        <p className="mt-8 text-center text-white text-lg md:text-xl font-inter max-w-2xl">
          KYAA.ai connects businesses building AI systems with qualified human reviewers
          to ensure accuracy, safety, and compliance.
        </p>
        <img
          src={flowchart}
          alt="Flowchart"
          className="mt-14 w-full max-w-4xl mx-auto h-auto"
          draggable={false}
          style={{ userSelect: "none" }}
        />
      </div>

      {/* Clients & Experts */}
      <div className="w-full max-w-6xl mx-auto mt-24 flex flex-col gap-24 px-4">
        {/* For Clients */}
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          <div className="flex-1">
            <h2 className="font-eudoxus-bold text-3xl mb-6 bg-gradient-to-r from-[#e9c188] to-[#e9a855] text-transparent bg-clip-text">
              For Clients
            </h2>
            <ul className="text-white text-lg font-inter list-disc pl-4 space-y-3">
              <li>Submit your AI outputs and validation criteria</li>
              <li>Get matched with vetted domain experts</li>
              <li>Receive annotated, trustworthy feedback</li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={agent}
              alt="Agent"
              className="w-3/4 h-3/4 object-contain"
              draggable={false}
            />
          </div>
        </div>
        {/* For Experts */}
        <div className="flex flex-col md:flex-row-reverse md:justify-between gap-12">
          <div className="flex-1 md:text-right">
            <h2 className="font-eudoxus-bold text-3xl mb-6 bg-gradient-to-r from-[#e9c188] to-[#e9a855] text-transparent bg-clip-text inline-block">
              For Experts
            </h2>
            <ul className="text-white text-lg font-inter list-disc pl-4 md:pl-0 md:pr-4 space-y-3">
              <li>Create a profile and get certified</li>
              <li>Get matched with AI validation jobs</li>
              <li>Earn income while ensuring ethical AI</li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={expert}
              alt="Expert"
              className="w-3/4 h-3/4 object-contain"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Domains carousel */}
      <div className="w-full overflow-hidden">
        <DomainsCarousel />
      </div>

      {/* Why KYAA.ai? Slider */}
      <WhyKyaaSection cards={cards} />

      {/* Matching & Oversight System */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4 flex flex-col md:flex-row items-start gap-12">
        <div className="flex-1">
          <h2 className="font-eudoxus-bold text-4xl text-white mb-6">
            Matching &amp; Oversight System
          </h2>
          <p className="text-white text-lg">
            We use AI‑driven matching + human QA oversight to route tasks to the best
            validators.
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[500px] aspect-[16/9] border border-[#338AFF] rounded-xl" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <h2 className="font-eudoxus-bold text-center text-4xl text-white mb-8">
          Testimonials
        </h2>
        <TestimonialsCarousel quoteIcon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 20C8 15.5817 11.5817 12 16 12V8C9.37258 8 4 13.3726 4 20H8ZM16 20C16 15.5817 19.5817 12 24 12V8C17.3726 8 12 13.3726 12 20H16Z" fill="#e9c188"/></svg>} />
      </section>

      {/* Metrics & Impact */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Left: 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
          <div className="border border-white/20 rounded-xl p-8">
            <h3 className="font-eudoxus-bold text-3xl text-white mb-2">100K+</h3>
            <p className="text-white text-lg">outputs reviewed</p>
          </div>
          <div className="border border-white/20 rounded-xl p-8">
            <h3 className="font-eudoxus-bold text-3xl text-white mb-2">1200+</h3>
            <p className="text-white text-lg">expert validators onboarded</p>
          </div>
          <div className="border border-white/20 rounded-xl p-8">
            <h3 className="font-eudoxus-bold text-3xl text-white mb-2">97.8%</h3>
            <p className="text-white text-lg">validator agreement rate</p>
          </div>
          <div className="border border-white/20 rounded-xl p-8">
            <h3 className="font-eudoxus-bold text-3xl text-white mb-2">3.4&nbsp;hrs</h3>
            <p className="text-white text-lg">average turnaround</p>
          </div>
        </div>
        {/* Right: heading + butterfly */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="font-eudoxus-bold text-4xl text-white mb-6">
            Metrics &amp; Impact
          </h2>
          <img
            src={butterfly}
            alt="Butterfly"
            className="w-16 h-16"
            style={{ filter: "drop-shadow(0 0 15px rgba(233,168,85,0.6))" }}
          />
        </div>
      </section>

      {/* Resources / Blog */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4 flex flex-col items-center gap-8">
        <h2 className="font-eudoxus-bold text-4xl text-white">
          Resources / Blog
        </h2>
        <div className="w-full bg-gradient-to-r from-[#e9c188] to-[#e9a855] p-8 rounded-xl">
          <ul className="text-white font-inter text-lg list-disc list-inside space-y-3">
            <li>AI Safety &amp; HITL Guidelines</li>
            <li>EU AI Act Explained</li>
            <li>RLHF vs. RLAIF</li>
            <li>Webinars, whitepapers</li>
          </ul>
        </div>
      </section>

      {/* Empty footer */}
      <footer className="w-full h-[20vh]" />
      <Footer />
    </div>
  );
}
