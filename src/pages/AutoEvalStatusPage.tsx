import ConfigurationSummary from "@/components/ConfigurationSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AutoEvalConfiguration } from "@/types/shared";
import { ArrowRight, CheckCircle, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AutoEvalStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Get the configuration from location state or use a default
  const configuration: AutoEvalConfiguration = location.state?.configuration || {
    dataset: undefined,
    tasks: [],
    models: [],
    parameters: undefined,
    metrics: undefined,
  };

  const handleGoToMonitors = () => {
    navigate('/autoeval/monitors');
  };

  return (
    <div className={`flex w-full h-full ${isMobile ? 'p-6' : ''}`}>
      <div className={`h-full ${isMobile ? 'p-0 w-full' : 'p-6 w-2/3'} flex flex-col overflow-auto relative`}>
        <div className={`flex items-center gap-3 mb-6 flex-shrink-0 ${isMobile ? 'mb-4' : ''}`}>
          <div className="p-2 bg-purple-900/20 rounded-lg">
            <Wand2 className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Evaluation Status</h1>
        </div>
        
        <div className="flex-1 space-y-6">
          {/* Success Message Card */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-400">
                <CheckCircle className="h-6 w-6" />
                Evaluation Launched Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-green-200">
                  Your AutoEval workflow has been successfully queued and is now being processed.
                </p>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-300 mb-2">What happens next?</h4>
                  <ul className="text-sm text-green-200 space-y-1">
                    <li>• Your dataset is being processed and analyzed</li>
                    <li>• Models are being configured with your parameters</li>
                    <li>• Evaluation tasks are being queued for execution</li>
                    <li>• Results will be available in the monitors section</li>
                  </ul>
                </div>
                <Button
                  onClick={handleGoToMonitors}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Monitors Page
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Summary Card */}
          {isMobile ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfigurationSummary 
                  config={configuration}
                  currentStep={6}
                  isCompact={false}
                  isMobile={true}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfigurationSummary 
                  config={configuration}
                  currentStep={6}
                  isCompact={false}
                  isMobile={false}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Right sidebar with additional info - Hidden on mobile */}
      {!isMobile && (
        <div className="h-full p-6 overflow-hidden w-1/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGoToMonitors}
                variant="outline"
                className="w-full border-blue-400 text-white hover:text-blue-400 hover:bg-blue-400/10"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                View All Workflows
              </Button>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-200">
                  If you have any questions about your evaluation or need to make changes, 
                  you can always create a new workflow or contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
