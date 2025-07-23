// pages/NewLandingPage.tsx
import { useState } from "react";
import flowchart from "../assets/flowchart.svg";
import agent from "../assets/agent.svg";
import expert from "../assets/expert.svg";
import FloatingNavbar from "@/components/new-ui/FloatingNavbar";
import { DomainsCarousel } from "@/components/new-ui/DomainsCarousel";

export default function NewLandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#040713] overflow-x-hidden">
      {/* Top Spheres */}
      <div className="absolute -top-16 -left-16 w-[400px] h-[400px] rounded-full bg-[#006FFF] opacity-100 blur-[550px] z-[1]" />
      <div className="absolute -top-16 -right-16 w-[400px] h-[400px] rounded-full bg-[#006FFF] opacity-100 blur-[550px] z-[1]" />

      {/* Navbars */}
      <FloatingNavbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        desktopWrapperClassName="
          hidden lg:flex
          fixed top-4 left-1/2 -translate-x-1/2
          z-50 w-[80vw] max-w-6xl
        "
        mobileWrapperClassName="
          lg:hidden
          sticky top-0 z-30
        "
      />

      {/* Spacer for fixed desktop navbar */}
      <div className="hidden lg:block h-24" aria-hidden />

      {/* Headline & Tagline */}
      <div className="w-full flex flex-col items-center mt-28">
        <h1 className="text-center font-[Italiana,serif] text-5xl md:text-6xl font-normal text-white leading-tight max-w-5xl">
          Validate Your AI with{" "}
          <span className="bg-gradient-to-r from-[#e9c188] to-[#e9a855] text-transparent bg-clip-text">
            Real Human Expertise.
          </span>
        </h1>
        <p className="mt-8 text-center text-white text-lg md:text-xl font-inter font-normal max-w-2xl">
          KYAA.ai connects businesses building AI systems with qualified human reviewers to ensure accuracy, safety, and compliance.
        </p>
        <img
          src={flowchart}
          alt="Flowchart"
          className="mt-14 w-full max-w-4xl mx-auto px-4 h-auto block"
          draggable={false}
          style={{ userSelect: "none" }}
        />
      </div>

      {/* Clients / Experts section */}
      <div className="w-full max-w-6xl mx-auto mt-24 px-4 flex flex-col gap-24">
        {/* Clients */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-[Italiana,serif] mb-6 bg-gradient-to-r from-[#e9c188] to-[#e9a855] text-transparent bg-clip-text">
              For Clients
            </h2>
            <ul className="text-white text-lg font-inter space-y-3 pl-4 list-disc">
              <li>Submit your AI outputs and validation criteria</li>
              <li>Get matched with vetted domain experts</li>
              <li>Receive annotated, trustworthy feedback</li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[360px] aspect-[4/3] flex items-center justify-center">
              <img
                src={agent}
                alt="Agent"
                className="w-3/4 h-3/4 object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Experts */}
        <div className="flex flex-col md:flex-row-reverse md:items-end md:justify-between gap-12">
          <div className="flex-1 md:text-right">
            <h2 className="text-3xl font-[Italiana,serif] mb-6 bg-gradient-to-r from-[#e9c188] to-[#e9a855] text-transparent bg-clip-text inline-block">
              For Experts
            </h2>
            <ul className="text-white text-lg font-inter space-y-3 pl-4 md:pl-0 md:pr-4 list-disc md:list-inside">
              <li>Create a profile and get certified</li>
              <li>Get matched with AI validation jobs</li>
              <li>Earn income while ensuring ethical AI</li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[360px] aspect-[4/3] flex items-center justify-center">
              <img
                src={expert}
                alt="Expert"
                className="w-3/4 h-3/4 object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Domains carousel */}
      <div className="w-full overflow-hidden">
        <DomainsCarousel />
      </div>

      {/* Empty footer */}
      <footer className="w-full h-[20vh]" />
    </div>
  );
}
