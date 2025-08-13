import EmployeeLogin from "@/components/auth/EmployeeLogin";
import EmployeeSignup from "@/components/auth/EmployeeSignup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmployeeAuth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-4">
      <Card className="w-full max-w-sm md:max-w-lg px-6 md:px-0">
        <CardHeader className="pb-2 md:pb-6">
          <CardTitle className="text-center text-2xl font-bold">
            Expert Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <EmployeeLogin />
            </TabsContent>
            <TabsContent value="signup">
              <EmployeeSignup />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 