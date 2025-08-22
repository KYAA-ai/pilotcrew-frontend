import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Monitor } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Placeholder data for running monitors
const placeholderWorkflows = [
  {
    id: "wf-001",
    dateCreated: "2024-01-15T10:30:00Z",
    models: "GPT-4 + Claude-3",
    status: "Running",
    dataset: "Customer Reviews Dataset"
  },
  {
    id: "wf-002", 
    dateCreated: "2024-01-14T14:22:00Z",
    models: "Llama-2 + GPT-3.5",
    status: "Running",
    dataset: "Product Descriptions Dataset"
  },
  {
    id: "wf-003",
    dateCreated: "2024-01-13T09:15:00Z", 
    models: "Claude-3 + PaLM-2",
    status: "Running",
    dataset: "Support Tickets Dataset"
  },
  {
    id: "wf-004",
    dateCreated: "2024-01-12T16:45:00Z",
    models: "GPT-4 + Llama-2 + Claude-3",
    status: "Running", 
    dataset: "Code Review Dataset"
  },
  {
    id: "wf-005",
    dateCreated: "2024-01-11T11:20:00Z",
    models: "PaLM-2 + GPT-3.5",
    status: "Running",
    dataset: "Email Classification Dataset"
  }
];

export default function RunningMonitorsPage() {
  const navigate = useNavigate();

  const handleRowClick = (workflowId: string) => {
    navigate(`/autoeval/monitors/${workflowId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                Active Workflows
              </CardTitle>
            </CardHeader>
            <div className="p-6 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow ID</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Models</TableHead>
                    <TableHead>Dataset</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderWorkflows.map((workflow) => (
                    <TableRow 
                      key={workflow.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(workflow.id)}
                    >
                      <TableCell className="font-medium">{workflow.id}</TableCell>
                      <TableCell>{formatDate(workflow.dateCreated)}</TableCell>
                      <TableCell>{workflow.models}</TableCell>
                      <TableCell>{workflow.dataset}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                          {workflow.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
