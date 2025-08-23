import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Eye, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Placeholder data for leaderboard workflows
const placeholderWorkflows = [
  {
    id: "wf-001",
    dateCreated: "2025-01-15T10:30:00Z",
    models: ["GPT-4", "Claude-3", "DeepSeek-R1"],
    dataset: "SupplyChainGHGEmissionFactors_v1.3.0_NAICS_byGHG_USD2022.csv",
    status: "Completed",
    topModel: "GPT-4",
    avgScore: 0.5123
  },
  {
    id: "wf-002",
    dateCreated: "2025-01-14T14:20:00Z",
    models: ["Llama-2", "GPT-4", "Claude-3"],
    dataset: "FinancialDataAnalysis_v2.1_QuarterlyReports.csv",
    status: "Completed",
    topModel: "Claude-3",
    avgScore: 0.4789
  },
  {
    id: "wf-003",
    dateCreated: "2025-01-13T09:15:00Z",
    models: ["DeepSeek-R1", "GPT-4", "Llama-2"],
    dataset: "HealthcareMetrics_v1.0_PatientOutcomes.csv",
    status: "Completed",
    topModel: "DeepSeek-R1",
    avgScore: 0.4901
  },
  {
    id: "wf-004",
    dateCreated: "2025-01-12T16:45:00Z",
    models: ["Claude-3", "GPT-4", "DeepSeek-R1", "Llama-2"],
    dataset: "EducationalAssessment_v2.3_StudentPerformance.csv",
    status: "Completed",
    topModel: "GPT-4",
    avgScore: 0.5234
  },
  {
    id: "wf-005",
    dateCreated: "2025-01-11T11:30:00Z",
    models: ["GPT-4", "Claude-3"],
    dataset: "RetailAnalytics_v1.5_SalesData.csv",
    status: "Completed",
    topModel: "Claude-3",
    avgScore: 0.4567
  }
];

export default function LeaderboardPage() {
  const navigate = useNavigate();

  const handleViewClick = (workflowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/autoeval/leaderboard/${workflowId}`);
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
              <BreadcrumbPage>Leaderboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Main Heading */}
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <div className="p-2 bg-yellow-900/20 rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Model Performance Rankings
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderWorkflows.map((workflow) => (
                    <TableRow 
                      key={workflow.id} 
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{workflow.id}</TableCell>
                      <TableCell>{new Date(workflow.dateCreated).toLocaleDateString()}</TableCell>
                      <TableCell>{workflow.models.join(", ")}</TableCell>
                      <TableCell className="max-w-xs truncate">{workflow.dataset}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                          {workflow.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(event) => handleViewClick(workflow.id, event)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
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
