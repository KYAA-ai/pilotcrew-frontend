// components/new-ui/FloatingNavbar.tsx
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import menuIcon from "../../assets/menu_icon.png";
import styles from "../../styles/GradientNavbar.module.css";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Platform", to: "/platform" },
  { label: "AutoEval", to: "/autoeval" },
  { label: "About Us", to: "/about" },
];

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  /** Classes applied to the OUTER desktop wrapper (you control fixed/top/etc. from the page) */
  desktopWrapperClassName?: string;
  /** Classes applied to the OUTER mobile wrapper (sticky top-0, etc. from the page if you want) */
  mobileWrapperClassName?: string;
};

export default function FloatingNavbar({
  mobileOpen,
  setMobileOpen,
  desktopWrapperClassName = "",
  mobileWrapperClassName = "",
}: Props) {
  const location = useLocation();
  return (
    <>
      {/* DESKTOP NAVBAR (wrapper classes come from parent) */}
      <div className={desktopWrapperClassName}>
        <div
          className={`
            ${styles["gradient-border"]}
            flex w-full items-center
            backdrop-blur-3xl
            rounded-[2.5rem] px-12 py-3
            shadow-[0_10px_60px_rgba(0,46,103,0.8)]
            transition-all
          `}
          style={{
            background:
              "linear-gradient(90deg, rgba(24,29,54,0.70) 60%, rgba(10,13,33,0.6) 100%)",
          }}
        >
          <div className="flex items-center gap-0.5 z-10">
            <div className="relative">
              {/* Golden blur sphere behind logo */}
              <div 
                className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-[#e9a855] blur-md opacity-60 transform -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: -1 }}
              />
              <img src={logo} alt="Logo" className="w-8 h-8 m-2 object-contain relative z-10" />
            </div>
            <span className="font-eudoxus-medium text-white text-xl tracking-wide">
              Pilotcrew.ai
            </span>
          </div>
          <nav className="flex gap-12 ml-auto z-30">
            <ul className="flex gap-12 items-center">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={link.label === "Home" ? scrollToTop : undefined}
                    className={`cursor-pointer font-eudoxus-medium font-medium transition px-2 py-1 rounded-sm text-white hover:opacity-80 ${
                      location.pathname === link.to || (link.to === "/" && location.pathname === "/platform")
                        ? "bg-[#e9a855] text-[#181d36] md:bg-transparent md:text-[#e9a855]"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* MOBILE NAVBAR (wrapper classes come from parent) */}
      <div className={mobileWrapperClassName}>
        <div
          className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between bg-[rgba(24,29,54,0.95)] backdrop-blur-md px-6 py-3 border-b border-b-[3px] border-b-[#59A2FF]/80 sm:border-b-[#005BCD]/80 shadow-[0_2px_20px_rgba(0,46,103,0.45)]"
        >
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <span className="font-eudoxus-medium text-white text-xl tracking-wide">
              Pilotcrew.ai
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-[#0b1121] transition"
            aria-label="Open menu"
          >
            <img src={menuIcon} alt="Menu" className="w-8 h-8" />
          </button>

          {mobileOpen && (
            <div
              className="absolute left-0 top-full w-full bg-black/90 flex flex-col z-40 animate-fadeIn"
            >
              <ul className="flex flex-col w-full">
                {navLinks.map((link) => (
                  <li key={link.label} className="w-full">
                    <Link
                      to={link.to}
                      className={`block w-full px-8 py-3 text-white text-lg font-inter font-medium hover:bg-[#181d36] cursor-pointer text-left ${
                        location.pathname === link.to || (link.to === "/" && location.pathname === "/platform")
                          ? "bg-[#e9a855] text-[#181d36] md:bg-transparent md:text-[#e9a855]"
                          : ""
                      }`}
                      onClick={() => {
                        setMobileOpen(false);
                        if (link.label === "Home") {
                          scrollToTop();
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
