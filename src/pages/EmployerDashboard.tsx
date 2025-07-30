import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/employer-header"
import { GenericDataTable } from "@/components/generic-data-table"
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useProfile } from '@/contexts/ProfileContext'
import { type ColumnDef } from "@tanstack/react-table"
// import { useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function EmployerDashboard() {
  const { profile } = useProfile()
  // Removed unused selectedJob, isModalOpen, isDescriptionExpanded
  const navigate = useNavigate();

  const handleJobAction = (action: string, row: Record<string, unknown>) => {
    if (action === "view") {
      navigate(`/employer/jobs/${row._id}`, { state: { job: row } });
    } else {
      toast.info(`Job action: ${action} for ${row.title}`)
      console.log(`Action: ${action}`, row)
    }
  }

  // Custom columns configuration for jobs
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
    // {
    //   accessorKey: "salary",
    //   header: "Salary Range",
    //   cell: ({ row }) => {
    //     const salary = row.getValue("salary") as { min: number; max: number; currency: string } | null
    //     if (salary?.min && salary?.max) {
    //       return (
    //         <div className="text-sm font-medium text-default">
    //           {salary.currency} {salary.min.toLocaleString()} - {salary.max.toLocaleString()}
    //         </div>
    //       )
    //     }
    //     return <span className="text-muted-foreground">-</span>
    //   },
    // },
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = String(row.getValue("status"))
        const variant = status === "PUBLISHED" ? "default" : "secondary"
        const label = status === "PUBLISHED" ? "Published" : status === "DRAFT" ? "Draft" : status
        
        return (
          <Badge variant={variant} className="text-xs">
            {label}
          </Badge>
        )
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
            onClick={() => handleJobAction("view", row.original)}
          >
            View
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <SectionCards /> */}
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
              
              {/* Example of GenericDataTable with custom columns */}
              <GenericDataTable
                endpoint="/v1/jobs"
                dataKey="jobs"
                title="Jobs"
                enableSelection={true}
                customColumns={jobColumns}
                customActionElement={() => (
                  <Link to="/employer/jobs/new">
                    <Button variant="outline" size="sm">
                      Post a Job
                    </Button>
                  </Link>
                )}
                onRowAction={handleJobAction}
                actions={[
                  { label: "View", value: "view" },
                  { label: "Edit", value: "edit" },
                  { label: "Delete", value: "delete", variant: "destructive" }
                ]}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
