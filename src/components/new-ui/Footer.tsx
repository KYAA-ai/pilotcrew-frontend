// components/new-ui/Footer.tsx
import GitHubIcon from "../../assets/github.png"; // your GitHub icon
import LinkedInIcon from "../../assets/linkedin.png"; // your LinkedIn icon
import butterfly from "../../assets/logo.png"; // your glowing butterfly

export default function Footer() {
  return (
    <footer className="relative bg-[#040713] text-white overflow-x-hidden">
      {/* Top gold hairline */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#e9c188] to-[#e9a855]" />

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-10 md:flex-row md:justify-between md:items-start md:gap-8">
        {/* Left: Logo + Newsletter */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <img
              src={butterfly}
              alt="KYAA.ai Logo"
              className="w-10 h-10"
              style={{ filter: "drop-shadow(0 0 10px rgba(233,168,85,0.6))" }}
            />
            <span className="font-[Italiana,serif] text-3xl">KYAA.ai</span>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-inter">Subscribe to our newsletter!</div>
            <form className="flex w-full md:w-3/4 h-12">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-full bg-gray-200 rounded-l-2xl border border-black px-4 focus:outline-none placeholder-black"
                style={{ color: '#000' }}
              />
              <button
                type="submit"
                className="h-full px-4 bg-[#E5BE5B] rounded-r-2xl flex items-center justify-center border border-black border-l-0 hover:bg-[#59A2FF] transition-colors cursor-pointer"
                aria-label="Send"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="#000" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Company links + social */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="font-[Italiana,serif] text-2xl mb-4">Company</h3>
            <ul className="space-y-2 font-inter text-lg">
              {["About", "Contact Us", "Blog", "Terms", "Privacy"].map((item) => (
                <li key={item} className="hover:underline cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <img src={LinkedInIcon} alt="LinkedIn" className="w-8 h-8" />
            <img src={GitHubIcon} alt="GitHub" className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-8">
        <div className="max-w-6xl mx-auto px-4 border-t border-white/20 pt-4 flex flex-col md:flex-row justify-between text-gray-500 text-sm space-y-2 md:space-y-0">
          <span className="font-inter">KYAA.ai</span>
          <span className="font-inter">
            Privacy Policy | Terms of Service | ISO 27001, GDPR compliant
          </span>
          <span className="font-inter">Copyright © 2025. All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
