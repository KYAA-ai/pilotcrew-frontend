import { MonitorCardView } from "@/components/monitors/MonitorCardView";
import { MonitorsTable } from "@/components/monitors/MonitorsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Grid, List, Monitor } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface MonitorData {
  id: string;
  createdAt: string;
  status: string;
  datasetId: string;
  generationOpts: Record<string, unknown>;
  [key: string]: unknown;
}

export default function RunningMonitorsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [monitors, setMonitors] = useState<MonitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Check if tablet/mobile (1024px breakpoint) on mount and window resize
  useEffect(() => {
    const checkTabletOrMobile = () => {
      const isTabletMobile = window.innerWidth < 1024; // lg breakpoint
      setIsTabletOrMobile(isTabletMobile);
      // Auto-switch to cards view on mobile/tablet
      if (isTabletMobile && viewMode === 'table') {
        setViewMode('cards');
      }
    };
    
    checkTabletOrMobile();
    window.addEventListener('resize', checkTabletOrMobile);
    return () => window.removeEventListener('resize', checkTabletOrMobile);
  }, [viewMode]);

  const fetchMonitors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/autoeval/monitors', {
        params: {
          page: currentPage,
          limit: 7,
        }
      });
      
      setMonitors(response.data.evaluations || []);
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(Math.ceil((response.data.totalCount || 0) / 7));
    } catch (error) {
      console.error('Error fetching monitors:', error);
      toast.error('Failed to fetch monitors');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Fetch monitors data for card view
  useEffect(() => {
    if (viewMode === 'cards') {
      fetchMonitors();
    }
  }, [viewMode, fetchMonitors]);



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      <div className="p-4 lg:p-6 w-full">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
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
        
        {/* Main Heading and View Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pt-2 lg:pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <Monitor className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Running Monitors</h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                Track your active evaluation workflows and their progress
              </p>
            </div>
          </div>
          
          {/* View Toggle - Hidden on mobile/tablet since they auto-switch to cards */}
          {!isTabletOrMobile && (
            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="flex items-center gap-2"
              >
                <Grid className="h-4 w-4" />
                Cards
              </Button>
            </div>
          )}
        </div>
        
        {/* Content area */}
        <div className="w-full">
          {viewMode === 'table' ? (
            <MonitorsTable />
          ) : (
            <MonitorCardView
              monitors={monitors}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalMonitors={totalCount}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
