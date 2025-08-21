import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Monitor } from "lucide-react";
import { Link } from "react-router-dom";

export default function RunningMonitorsPage() {
  return (
    <div className="flex w-full h-full">
      <div className="h-full p-6 flex flex-col overflow-hidden relative w-full">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 flex-shrink-0">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Running Monitors</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Main Heading */}
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <div className="p-2 bg-blue-900/20 rounded-lg">
            <Monitor className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">Running Monitors</h1>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitor Dashboard
              </CardTitle>
            </CardHeader>
            <div className="p-6">
              <p className="text-muted-foreground">
                This page will display active evaluation monitors and their current status.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
