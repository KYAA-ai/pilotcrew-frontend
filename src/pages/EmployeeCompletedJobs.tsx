import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { RecommendedJobsView } from "@/components/recommended-jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/contexts/ProfileContext';
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function EmployeeCompletedJobs() {
  const { profile } = useProfile()
  const navigate = useNavigate();

  const handleJobAction = (action: string, row: Record<string, unknown>) => {
    if (action === "view") {
      const url = `/employee/jobs/${row.id}?source=complete`;
      navigate(url);
    } else {
      toast.info(`Job action: ${action} for ${row.title}`)
      console.log(`Action: ${action}`, row)
    }
  }

  const jobColumns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: "title",
      header: "Job Title",
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {String(row.getValue("title"))}
        </div>
      ),
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {String(row.getValue("companyName"))}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {String(row.getValue("location"))}
        </Badge>
      ),
    },
    {
      accessorKey: "type",
      header: "Job Type",
      cell: ({ row }) => {
        const type = String(row.getValue("type"))
        const variant = type === "FULL_TIME" ? "default" : "secondary"
        const label = type === "FULL_TIME" ? "Full Time" : type === "PART_TIME" ? "Part Time" : type

        return (
          <Badge variant={variant} className="text-xs">
            {label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const duration = row.getValue("duration") as { value: number; unit: string } | null
        if (duration?.value && duration?.unit) {
          return (
            <Badge variant="outline" className="text-xs">
              {duration.value} {duration.unit.toLowerCase()}
            </Badge>
          )
        }
        return <span className="text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: "features",
      header: "Features",
      cell: ({ row }) => {
        const features = row.getValue("features") as string[] | null
        if (Array.isArray(features) && features.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature.length > 20 ? feature.substring(0, 20) + "..." : feature}
                </Badge>
              ))}
              {features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{features.length - 2} more
                </Badge>
              )}
            </div>
          )
        }
        return <span className="text-muted-foreground">-</span>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const url = `/employee/jobs/${row.original.id}?source=complete`;
              navigate(url);
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => handleJobAction("apply", row.original)}
          >
            Apply
          </Button>
        </div>
      ),
    },
  ]

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <EmployeeLayout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center justify-between px-8 lg:px-16">
          <div>
            <h1 className="text-3xl font-bold">Completed Jobs</h1>
            <p className="text-muted-foreground">
              Track your completed job applications and work progress
            </p>
          </div>
        </div>

        <RecommendedJobsView
          endpoint="/v1/employee/jobs/COMPLETE"
          dataKey="jobs"
          title=""
          enableSelection={true}
          customColumns={jobColumns}
          onRowAction={handleJobAction}
          actions={[
            { label: "View", value: "view" },
          ]}
          navigationUrl="/employee/jobs/{id}?source=complete"
          pageSize={20}
        />
      </div>
    </EmployeeLayout>
  )
} 