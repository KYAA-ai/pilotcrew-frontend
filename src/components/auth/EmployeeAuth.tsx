import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeeAuthCard() {
  const handleLinkedInLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/v1/auth/linkedin`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Employee Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLinkedInLogin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.26 2.3-2.6 4.73-2.6C21.4 7.6 24 10 24 15v9h-5v-8.1c0-1.9-.03-4.4-2.7-4.4-2.7 0-3.1 2.1-3.1 4.2V24h-5V8z" />
              </svg>
              Continue with LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
