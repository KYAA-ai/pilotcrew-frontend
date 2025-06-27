import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/ProfileContext";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api";

export default function EmployeeDashboard() {
  const { clearProfile } = useProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/employee/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearProfile();
      navigate("/auth/employee", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4 text-center">
      <h1 className="text-3xl font-bold md:text-5xl">Welcome! 🎉</h1>
      <p className="text-muted-foreground max-w-md">
        Your profile is complete. Explore opportunities and get hired.
      </p>
      <Button variant="outline" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
} 