import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EmployeeAuth() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = () => {
    login();
    navigate("/employee/profile", { replace: true });
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
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mx-auto mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="flex flex-col gap-4">

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSuccess();
                  }}
                  className="grid gap-4"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="emp-email">Email</Label>
                    <Input id="emp-email" type="email" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emp-password">Password</Label>
                    <Input id="emp-password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>

                <div className="text-center italic"> OR </div>

                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                    <path d="M21.35 11.1h-9.09v3.7h5.82c-.25 1.46-1.5 4.3-5.82 4.3-3.5 0-6.36-2.9-6.36-6.5s2.86-6.5 6.36-6.5c2 0 3.34.88 4.09 1.63l2.8-2.8C17.57 2.46 15.46 1.5 12.32 1.5 6.46 1.5 2 5.93 2 11.7s4.46 10.2 10.32 10.2c5.93 0 9.82-4.16 9.82-10.07 0-.84-.08-1.43-.18-2.73z"/>
                  </svg>
                  Continue with Google
                </Button>

                <div className="text-center italic"> OR </div>

                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.26 2.3-2.6 4.73-2.6C21.4 7.6 24 10 24 15v9h-5v-8.1c0-1.9-.03-4.4-2.7-4.4-2.7 0-3.1 2.1-3.1 4.2V24h-5V8z" />
                  </svg>
                  Continue with LinkedIn
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="flex flex-col gap-4">

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSuccess();
                  }}
                  className="grid gap-4"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="emp-signup-email">Email</Label>
                    <Input id="emp-signup-email" type="email" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emp-signup-password">Password</Label>
                    <Input id="emp-signup-password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign up
                  </Button>
                </form>

                <div className="text-center italic"> OR </div>

                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                    <path d="M21.35 11.1h-9.09v3.7h5.82c-.25 1.46-1.5 4.3-5.82 4.3-3.5 0-6.36-2.9-6.36-6.5s2.86-6.5 6.36-6.5c2 0 3.34.88 4.09 1.63l2.8-2.8C17.57 2.46 15.46 1.5 12.32 1.5 6.46 1.5 2 5.93 2 11.7s4.46 10.2 10.32 10.2c5.93 0 9.82-4.16 9.82-10.07 0-.84-.08-1.43-.18-2.73z"/>
                  </svg>
                  Signup with Google
                </Button>

                <div className="text-center italic"> OR </div>

                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.26 2.3-2.6 4.73-2.6C21.4 7.6 24 10 24 15v9h-5v-8.1c0-1.9-.03-4.4-2.7-4.4-2.7 0-3.1 2.1-3.1 4.2V24h-5V8z" />
                  </svg>
                  Signup with LinkedIn
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 