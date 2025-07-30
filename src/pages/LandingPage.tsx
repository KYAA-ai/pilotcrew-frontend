import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
// import { ContextTest } from "@/components/ContextTest";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-eudoxus-bold mb-4">
          Your entire hiring journey.<br />
          <span className="text-[var(--primary)]">Powered by one profile.</span>
        </h1>
        <p className="text-lg font-eudoxus-medium md:text-xl text-[var(--foreground)]/70 mb-8 max-w-xl">
          Get personalized job recommendations, craft tailored resumes, autofill and track your job applications. Pilotcrew is here for every step of your career.
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:gap-6 mb-8">
          <Button
            size="lg"
            className="w-60 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-800)] text-base font-eudoxus-bold"
            onClick={() => navigate("/auth/employer")}
          >
            I'm an Employer
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-60 border-[var(--secondary)] hover:bg-[var(--secondary-800)] text-base font-eudoxus-bold"
            onClick={() => navigate("/auth/employee")}
          >
            I'm an Employee
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