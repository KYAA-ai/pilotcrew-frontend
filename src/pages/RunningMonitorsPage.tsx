import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { MonitorsTable } from "@/components/monitors/MonitorsTable";

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
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <MonitorsTable />
        </div>
      </div>
    </div>
  );
}
