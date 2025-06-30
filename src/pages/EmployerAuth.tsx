import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployerLogin from "@/components/auth/EmployerLogin";
import EmployerSignup from "@/components/auth/EmployerSignup";

export default function EmployerAuth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Employer Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="mx-auto mb-6">
              <TabsTrigger value="signup">Sign up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <EmployerLogin />
            </TabsContent>
            <TabsContent value="signup">
              <EmployerSignup />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 