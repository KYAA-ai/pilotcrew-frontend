import { SiteHeader } from "@/components/employer-header";
import { EmployerSidebar } from "@/components/employer-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GenericDataTable } from "@/components/generic-data-table";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

interface JobResponse {
  _id: string;
  employeeId: string;
  status: string;
  jobId: string;
  submission: Array<{
    questionId: string;
    question: string;
    answer: string;
  }>;
  employeeName: string;
  employeeEmail: string;
  employeeProfile: {
    name: string;
    email: string;
  };
}

export default function JobResponsesPage() {
  const { jobId } = useParams();
  const [selectedResponse, setSelectedResponse] = useState<JobResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewResponse = (response: JobResponse) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return <Badge variant="default" className="text-xs">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="secondary" className="text-xs">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  // Custom columns for the data table
  const customColumns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: "employeeName",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("employeeName") as string}</div>
      ),
    },
    {
      accessorKey: "employeeEmail",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("employeeEmail") as string}</div>
      ),
    },
    {
      accessorKey: "submission",
      header: "Questions Answered",
      cell: ({ row }) => {
        const submission = row.getValue("submission") as Array<unknown>;
        return (
          <div className="text-sm">
            {submission?.length || 0} questions
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return getStatusBadge(status);
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewResponse(row.original as unknown as JobResponse)}
        >
          View Response
        </Button>
      ),
    },
  ];

  return (
    <SidebarProvider defaultOpen={false}>
      <EmployerSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="m-4 w-full px-8 min-h-screen flex flex-col">
          {/* Back Button */}
          <div className="mt-4 mb-8">
            <Link 
              to={`/employer/jobs/${jobId}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Job Details
            </Link>
          </div>

          {/* Data Table */}
          <GenericDataTable
            endpoint={`/v1/employer/jobs/${jobId}/completed-workflows`}
            dataKey="completedWorkflows"
            title="Job Responses"
            customColumns={customColumns}
          />

          {/* Response Detail Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="min-w-3/4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Response Form</DialogTitle>
              </DialogHeader>
              {selectedResponse && (
                <div className="space-y-6">
                  {/* Responses */}
                  <div>
                    <h3 className="font-semibold mb-4">Question Responses</h3>
                    <form className="space-y-4">
                      {selectedResponse.submission?.map((response, index) => (
                        <div key={index} className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            {response.question}
                          </label>
                          <textarea
                            value={response.answer}
                            readOnly
                            className="w-full min-h-[100px] p-3 text-sm border rounded-md bg-muted/50 resize-none cursor-default"
                            style={{ cursor: 'default' }}
                          />
                        </div>
                      ))}
                    </form>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 