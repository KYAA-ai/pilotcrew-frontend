import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AutoEvalLogin from "./AutoEvalLogin";
import AutoEvalSignup from "./AutoEvalSignup";

export default function AutoEvalAuth() {
  const [activeTab, setActiveTab] = useState("signup");

  const handleAuthSuccess = () => {
    console.log("AutoEval Auth successful");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            AutoEval Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <AutoEvalLogin
                onSuccess={handleAuthSuccess}
              />
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <AutoEvalSignup
                onSuccess={handleAuthSuccess}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
