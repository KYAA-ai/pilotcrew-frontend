// pages/NewLandingPage.tsx
import { DomainsCarousel } from "@/components/new-ui/DomainsCarousel";
import FloatingNavbar from "@/components/new-ui/FloatingNavbar";
import Footer from "@/components/new-ui/Footer";
import TestimonialsCarousel from "@/components/new-ui/TestimonialsCarousel";
import WhyPilotcrew from "@/components/new-ui/WhyPilotcrew";
import WhyPilotcrewMobile from "@/components/new-ui/WhyPilotecrewMobile";
import { useRef, useState } from "react";
import agent from "../assets/agent.png";
import backdropVideo from "../assets/backdrop-video-compressed.mp4";
import expert from "../assets/expert.png";
import fallbackImage from "../assets/fallback-image.png";
import butterfly from "../assets/logo.png";
import matchingJobs from "../assets/matching-jobs.png";
import quoteUp from "../assets/quote-up.png";
import screenPlaceholder from "../assets/screen-placeholder.mp4";

export default function NewLandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ——— Slider section state & refs ———
  const cards = [
    { title: "Expert Insights", subtitle: "Real‑world domain experts" },
    { title: "Global Talent",   subtitle: "Cost‑effective expert pool" },
    { title: "API Integration", subtitle: "Integrate via API for validation feedback" },
    { title: "GDPR Compliant",  subtitle: "Enterprise‑ready data handling" },
  ];

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#040713] overflow-x-hidden">
      {/* Top padding for fixed mobile navbar */}
      <div className="xl:hidden h-16"></div>
      {/* Top "spheres" */}
      <div className="absolute -top-16 -left-16 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-[#006FFF] blur-[300px] sm:blur-[400px] md:blur-[550px] z-0" />
      <div className="absolute -top-16 -right-16 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-[#006FFF] blur-[300px] sm:blur-[400px] md:blur-[550px] z-0" />

      {/* Navbars */}
      <FloatingNavbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        desktopWrapperClassName="hidden xl:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-6xl"
        mobileWrapperClassName="xl:hidden"
      />

             {/* Hero Section with Video Background and Text Overlay */}
       <div className="relative w-full h-[80vh] flex items-center justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Fallback Image */}
          <img
            src={fallbackImage}
            alt="Background"
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-0' : 'opacity-70'
            }`}
            style={{ zIndex: 1 }}
          />
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-90' : 'opacity-0'
            }`}
            preload="auto"
            onLoadedData={handleVideoLoad}
            style={{ zIndex: 2 }}
          >
            <source src={backdropVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Video border at the bottom of the video */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#040713]/90 via-[#040713]/50 to-transparent z-20"></div>
        </div>

        {/* Text Overlay */}
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 text-center">
          <h1 className="font-eudoxus-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-3xl sm:max-w-4xl md:max-w-5xl">
            Validate Your AI with{" "}
            <span className="text-[#e9a855] font-eudoxus-extrabold">
              Real Human Expertise.
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-white text-sm sm:text-base md:text-lg font-inter max-w-xs sm:max-w-md md:max-w-xl">
            Pilotcrew.ai connects businesses building AI systems with qualified human reviewers
            to ensure accuracy, safety, and compliance.
          </p>
        </div>
      </div>

      {/* Screen-1 Video Section */}
      <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6 md:px-8">
        {/* Golden line above video */}
        <div className="flex justify-center mb-8 sm:mb-12 w-full relative">
          <hr className="w-48 sm:w-64 md:w-80 lg:w-96 h-px bg-[#e9a855] border-0 rounded-full" />
          {/* Golden radial blur extending downward from top line */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48"
            style={{
              background: 'radial-gradient(ellipse at center top, rgba(233, 168, 85, 0.5) 0%, rgba(233, 168, 85, 0.3) 30%, rgba(233, 168, 85, 0.1) 60%, transparent 90%)',
              filter: 'blur(30px)',
              zIndex: -1
            }}
          ></div>
        </div>
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl overflow-visible">
            {/* Light blue radial blur sphere behind the image */}
            <div 
              className="absolute rounded-lg"
              style={{
                background: 'radial-gradient(ellipse at center bottom, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 30%, rgba(59, 130, 246, 0.1) 60%, transparent 80%)',
                filter: 'blur(60px)',
                transform: 'translateY(20%) scale(2.5)',
                zIndex: -1,
                width: '300%',
                height: '300%',
                left: '-100%',
                top: '-100%',
                pointerEvents: 'none'
              }}
            ></div>
            
            {/* Wrapper for video with perspective transform */}
            <div 
              className="relative"
              style={{
                transform: 'perspective(1200px) rotateX(20deg)',
                transformOrigin: 'center top'
              }}
            >
              <video
                src={screenPlaceholder}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-contain rounded-lg relative z-10"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Text Section */}
      <div className="w-full flex flex-col items-center mt-8 sm:mt-12 md:mt-16">
        <h2 className="text-center font-eudoxus-bold text-2xl sm:text-3xl md:text-4xl text-white">
          Explore Agents within seconds using our Agentic Search!
        </h2>
        {/* Golden line under demo text */}
        <div className="flex justify-center mt-6 sm:mt-8 w-full">
          <hr className="w-full max-w-4xl h-px bg-[#e9a855] border-0 rounded-full" />
        </div>
      </div>

      {/* Clients & Experts */}
      <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12 md:mt-24 flex flex-col gap-8 sm:gap-12 px-4 sm:px-6 md:px-8">
        {/* For Clients */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 sm:gap-12">
          <div className="flex-1 flex flex-col justify-center order-2 lg:order-1">
            <h2 className="font-eudoxus-bold text-2xl sm:text-3xl mb-4 sm:mb-6 text-[#e9a855] text-center lg:text-left">
              For Clients
            </h2>
            <ul className="text-white text-sm sm:text-base md:text-lg font-inter space-y-2 sm:space-y-3 text-center lg:text-left flex flex-col items-center lg:items-start">
              <li className="text-left flex items-center justify-center lg:justify-start w-full">
                <span className="mr-2">•</span>
                <span>Submit your AI outputs and validation criteria</span>
              </li>
              <li className="text-left flex items-center justify-center lg:justify-start w-full">
                <span className="mr-2">•</span>
                <span>Get matched with vetted domain experts</span>
              </li>
              <li className="text-left flex items-center justify-center lg:justify-start w-full">
                <span className="mr-2">•</span>
                <span>Receive annotated, trustworthy feedback</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center order-1 lg:order-2">
            <img
              src={agent}
              alt="Agent"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg h-auto object-contain"
              draggable={false}
            />
          </div>
        </div>
        {/* For Experts */}
        <div className="flex flex-col lg:flex-row-reverse lg:justify-between gap-8 sm:gap-12">
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2">
            <h2 className="font-eudoxus-bold text-2xl sm:text-3xl mb-4 sm:mb-6 text-[#e9a855]">
              For Experts
            </h2>
            <ul className="text-white text-base sm:text-lg font-inter space-y-2 sm:space-y-3 flex flex-col items-center lg:items-start">
              <li className="text-left flex items-center justify-center lg:justify-start w-full">
                <span className="mr-2">•</span>
                <span>Create a profile and get certified</span>
              </li>
              <li className="text-left flex items-center justify-center lg:justify-start w-full">
                <span className="mr-2">•</span>
                <span>Get matched with AI validation jobs</span>
              </li>
              <li className="text-left flex items-center justify-center lg:justify-start w-full">
                <span className="mr-2">•</span>
                <span>Earn income while ensuring ethical AI</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center order-1">
            <img
              src={expert}
              alt="Expert"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg h-auto object-contain"
              style={{ transform: 'scaleX(-1)' }}
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Domains carousel */}
      <div className="w-full overflow-hidden mt-8 sm:mt-12 md:mt-16">
        <DomainsCarousel />
      </div>

      {/* Why Pilotcrew.ai? Slider */}
      <div className="block xl:hidden">
        <WhyPilotcrewMobile cards={cards} />
      </div>
      <div className="hidden xl:block">
        <WhyPilotcrew cards={cards} />
      </div>

      {/* Matching & Oversight System */}
      <section className="w-full max-w-6xl mx-auto mt-12 sm:mt-16 md:mt-20 lg:mt-32 px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row-reverse items-stretch gap-8 sm:gap-12">
        <div className="flex-1 lg:w-1/4 flex items-center">
          <div className="text-center lg:text-left">
            <h2 className="font-eudoxus-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 sm:mb-6">
              Matching &amp; Oversight System
            </h2>
            <p className="text-white text-base sm:text-lg">
              We use AI‑driven matching + human QA oversight to route tasks to the best
              validators.
            </p>
          </div>
        </div>
        <div className="flex-1 lg:w-3/4 flex items-center justify-center">
          <img
            src={matchingJobs}
            alt="Matching Jobs"
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-none h-auto object-contain"
            draggable={false}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-6xl mx-auto mt-16 sm:mt-20 md:mt-24 lg:mt-32 px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <h2 className="font-eudoxus-bold text-center text-2xl sm:text-3xl md:text-4xl text-white mb-8 sm:mb-12 md:mb-16">
          Testimonials
        </h2>
        <div>
          <TestimonialsCarousel quoteIcon={<img src={quoteUp} alt="Quote" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ml-0" />} />
        </div>
      </section>

      {/* Metrics & Impact */}
      <section className="w-full max-w-6xl mx-auto mt-12 sm:mt-16 md:mt-20 lg:mt-24 px-4 sm:px-6 md:px-8 flex flex-col-reverse lg:flex-row items-center gap-8 sm:gap-12">
        {/* Left: 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 flex-1">
          <div className="border border-white/20 rounded-xl p-4 sm:p-6 md:p-8">
            <h3 className="font-eudoxus-bold text-2xl sm:text-3xl text-white mb-2">100K+</h3>
            <p className="text-white text-sm sm:text-base md:text-lg">outputs reviewed</p>
          </div>
          <div className="border border-white/20 rounded-xl p-4 sm:p-6 md:p-8">
            <h3 className="font-eudoxus-bold text-2xl sm:text-3xl text-white mb-2">1200+</h3>
            <p className="text-white text-sm sm:text-base md:text-lg">expert validators onboarded</p>
          </div>
          <div className="border border-white/20 rounded-xl p-4 sm:p-6 md:p-8">
            <h3 className="font-eudoxus-bold text-2xl sm:text-3xl text-white mb-2">97.8%</h3>
            <p className="text-white text-sm sm:text-base md:text-lg">validator agreement rate</p>
          </div>
          <div className="border border-white/20 rounded-xl p-4 sm:p-6 md:p-8">
            <h3 className="font-eudoxus-bold text-2xl sm:text-3xl text-white mb-2">3.4&nbsp;hrs</h3>
            <p className="text-white text-sm sm:text-base md:text-lg">average turnaround</p>
          </div>
        </div>
        {/* Right: heading + butterfly */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6 sm:mb-8 lg:mb-0">
          <h2 className="font-eudoxus-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 sm:mb-6 text-center lg:text-left">
            Metrics &amp; Impact
          </h2>
          <img
            src={butterfly}
            alt="Butterfly"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
            style={{ filter: "drop-shadow(0 0 15px rgba(233,168,85,0.6))" }}
          />
        </div>
      </section>

      {/* Resources / Blog */}
      <section className="w-full mt-16 sm:mt-20 md:mt-24 lg:mt-32 flex flex-col items-center gap-6 sm:gap-8">
        <h2 className="font-eudoxus-bold text-2xl sm:text-3xl md:text-4xl text-white text-center mb-6 sm:mb-8">
          Resources / Blog
        </h2>
        <div
          className="w-full flex justify-center items-center"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255, 216, 134, 0.3) 0%, #040713 100%)",
            minHeight: "200px",
            padding: "2rem 1rem",
          }}
        >
          <ul className="text-white font-eudoxus-medium text-base sm:text-lg md:text-xl list-disc list-inside space-y-4 sm:space-y-6 max-w-xs sm:max-w-md md:max-w-2xl mx-auto text-center" style={{ textShadow: '0 0.5px 4px #0004, 0 1px 1px #0003' }}>
            <li>AI Safety &amp; HITL Guidelines</li>
            <li>EU AI Act Explained</li>
            <li>RLHF vs. RLAIF</li>
            <li>Webinars & Whitepapers</li>
          </ul>
        </div>
      </section>

      {/* Empty footer */}
      <footer className="w-full h-20 sm:h-24 md:h-28 lg:h-[20vh]" />
      <Footer />
      <div style={{ height: '3vh' }} />
    </div>
  );
}
