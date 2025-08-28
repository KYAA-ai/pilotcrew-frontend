import { MonitorsTable } from "@/components/monitors/MonitorsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Monitor } from "lucide-react";
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
        <div className="flex items-center gap-3 mb-6 pt-6 flex-shrink-0">
          <div className="p-2 bg-blue-900/20 rounded-lg">
            <Monitor className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Running Monitors</h1>
            <p className="text-muted-foreground">
              Track your active evaluation workflows and their progress
            </p>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <MonitorsTable />
        </div>
      </div>
    </div>
  );
}
