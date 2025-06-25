import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 text-center">
      <h1 className="text-3xl font-bold md:text-5xl">Welcome to KYAA, Start Your Hiring Journey</h1>
      <p className="max-w-xl text-muted-foreground md:text-lg">
        Connecting skilled professionals with top employers.
      </p>
      <div className="flex flex-col gap-4 md:flex-row">
        <Button
          size="lg"
          className="w-60 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate("/auth/employer")}
        >
          I'm an Employer
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-60"
          onClick={() => navigate("/auth/employee")}
        >
          I'm an Employee
        </Button>
      </div>
    </div>
  );
} 