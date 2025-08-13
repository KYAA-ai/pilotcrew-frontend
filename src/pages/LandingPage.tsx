import logo from "@/assets/logo.png";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// import { ContextTest } from "@/components/ContextTest";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <div className="mb-3">
          <img src={logo} alt="Pilotcrew.ai Logo" className="w-12 h-12 mb-4 md:w-15 md:h-15 md:mb-6 mx-auto" />
        </div>
        <h1 className="text-3xl md:text-6xl font-eudoxus-bold mb-4">
          Your entire hiring journey.<br />
          <span className="text-[var(--primary)]">Powered by one profile.</span>
        </h1>
        <p className="text-base font-eudoxus-medium md:text-lg text-[var(--foreground)]/70 mb-8 max-w-xl">
          Get personalized job recommendations, craft tailored resumes, autofill and track your job applications. Pilotcrew is here for every step of your career.
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:gap-6 mb-8">
          <Button
            size="lg"
            className="w-60 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-transparent hover:border-2 hover:border-blue-500 hover:text-white-500 cursor-pointer transition-all duration-100 text-base font-eudoxus-bold"
            onClick={() => navigate("/auth/employee")}
          >
            I'm an Expert
          </Button>
          <Button
            size="lg"
            className="w-60 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-transparent hover:border-2 hover:border-blue-500 hover:text-white-500 cursor-pointer transition-all duration-100 text-base font-eudoxus-bold"
            onClick={() => navigate("/auth/employer")}
          >
            I'm a Client
          </Button>
        </div>
        <div className="text-[var(--foreground)]/60 text-sm font-eudoxus-medium mb-8">
          <span className="text-yellow-500">★★★★★</span> Join 10,000+ professionals who use Pilotcrew
        </div>
        
        {/* Context Test Component */}
        {/* <div className="w-full max-w-md">
          <ContextTest />
        </div> */}
      </main>
    </div>
  );
} 