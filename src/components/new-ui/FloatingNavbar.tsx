// components/new-ui/FloatingNavbar.tsx
import logo from "../../assets/logo.png";
import menuIcon from "../../assets/menu_icon.png";
import styles from "../../styles/GradientNavbar.module.css";

const NAV_LINKS = ["Home", "How it Works", "Domains", "Resources", "About us"];

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
          <div className="flex items-center gap-1 z-10">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <span className="font-[Italiana,serif] text-white text-2xl tracking-wide">
              KYAA.ai
            </span>
          </div>
          <div className="flex gap-12 ml-auto z-10">
            {NAV_LINKS.map((tab) => (
              <span
                key={tab}
                className="font-eudoxus-medium text-white font-medium cursor-pointer hover:opacity-80 transition"
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR (wrapper classes come from parent) */}
      <div className={mobileWrapperClassName}>
        <div
          className="
            w-full flex items-center justify-between
            bg-[rgba(24,29,54,0.95)]
            px-6 py-2 border-b border-b-[3px]
            border-b-[#59A2FF] sm:border-b-[#005BCD]
            rounded-none shadow-[0_2px_20px_rgba(0,46,103,0.45)]
          "
        >
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-[Italiana,serif] text-white text-xl tracking-wide">
              KYAA.ai
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
              className="
                absolute right-4 top-16 w-[90vw] max-w-xs
                bg-black bg-opacity-95 rounded-xl shadow-lg
                flex flex-col py-2 z-40 animate-fadeIn
              "
            >
              {NAV_LINKS.map((tab) => (
                <span
                  key={tab}
                  className="px-6 py-3 text-white text-lg font-inter font-medium hover:bg-[#181d36] cursor-pointer text-left"
                  onClick={() => setMobileOpen(false)}
                >
                  {tab}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
