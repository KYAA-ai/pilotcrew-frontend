import { AppSidebar } from "@/components/app-sidebar"
import { GenericDataTable } from "@/components/generic-data-table"
import { SiteHeader } from "@/components/employer-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { type ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { ChevronDown, ChevronUp } from '@/components/SimpleIcons'
import { useProfile } from '@/contexts/ProfileContext'

export default function EmployerDashboard() {
  const { profile } = useProfile()
  const [selectedJob, setSelectedJob] = useState<Record<string, unknown> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const handleJobAction = (action: string, row: Record<string, unknown>) => {
    if (action === "view") {
      setSelectedJob(row)
      setIsModalOpen(true)
      setIsDescriptionExpanded(false) // Reset expansion state
    } else {
      toast.info(`Job action: ${action} for ${row.title}`)
      console.log(`Action: ${action}`, row)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
    setIsDescriptionExpanded(false)
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
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
    {
      accessorKey: "salary",
      header: "Salary Range",
      cell: ({ row }) => {
        const salary = row.getValue("salary") as { min: number; max: number; currency: string } | null
        if (salary?.min && salary?.max) {
          return (
            <div className="text-sm font-medium text-default">
              {salary.currency} {salary.min.toLocaleString()} - {salary.max.toLocaleString()}
            </div>
          )
        }
        return <span className="text-muted-foreground">-</span>
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
      accessorKey: "requirements",
      header: "Requirements",
      cell: ({ row }) => {
        const requirements = row.getValue("requirements") as string[] | null
        if (Array.isArray(requirements) && requirements.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {requirements.slice(0, 2).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req.length > 20 ? req.substring(0, 20) + "..." : req}
                </Badge>
              ))}
              {requirements.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{requirements.length - 2} more
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
              setSelectedJob(row.original)
              setIsModalOpen(true)
            }}
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
                endpoint="/jobs"
                dataKey="jobs"
                title="Jobs"
                enableSelection={true}
                customColumns={jobColumns}
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

      {/* Job Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="w-3/4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedJob?.title ? String(selectedJob.title) : "Job Details"}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this job posting
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="text-sm">{String(selectedJob.companyName || "-")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="text-sm">{String(selectedJob.location || "-")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Job Type</label>
                    <div className="mt-1">
                      {(() => {
                        const type = String(selectedJob.type || "")
                        const variant = type === "FULL_TIME" ? "default" : "secondary"
                        const label = type === "FULL_TIME" ? "Full Time" : type === "PART_TIME" ? "Part Time" : type
                        return <Badge variant={variant}>{label}</Badge>
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      {(() => {
                        const status = String(selectedJob.status || "")
                        const variant = status === "PUBLISHED" ? "default" : "secondary"
                        const label = status === "PUBLISHED" ? "Published" : status === "DRAFT" ? "Draft" : status
                        return <Badge variant={variant}>{label}</Badge>
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Compensation & Duration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compensation & Duration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Salary Range</label>
                    {(() => {
                      const salary = selectedJob.salary as { min: number; max: number; currency: string } | null
                      if (salary?.min && salary?.max) {
                        return (
                          <p className="text-lg font-semibold text-default">
                            {salary.currency} {salary.min.toLocaleString()} - {salary.max.toLocaleString()}
                          </p>
                        )
                      }
                      return <p className="text-sm text-muted-foreground">-</p>
                    })()}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    {(() => {
                      const duration = selectedJob.duration as { value: number; unit: string } | null
                      if (duration?.value && duration?.unit) {
                        return (
                          <p className="text-sm">
                            {duration.value} {duration.unit.toLowerCase()}
                          </p>
                        )
                      }
                      return <p className="text-sm text-muted-foreground">-</p>
                    })()}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description - Expandable */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDescription}
                    className="flex items-center gap-2"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show More
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className={`text-sm leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                    {String(selectedJob.description || "No description available.")}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Requirements</h3>
                {(() => {
                  const requirements = selectedJob.requirements as string[] | null
                  if (Array.isArray(requirements) && requirements.length > 0) {
                    return (
                      <div className="space-y-2">
                        {requirements.map((req, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">{req}</p>
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return <p className="text-sm text-muted-foreground">No requirements specified.</p>
                })()}
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-muted-foreground">Start Date</label>
                    <p>{selectedJob.startDate ? new Date(String(selectedJob.startDate)).toLocaleDateString() : "-"}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">Created</label>
                    <p>{selectedJob.createdAt ? new Date(String(selectedJob.createdAt)).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
