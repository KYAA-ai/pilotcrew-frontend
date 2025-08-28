import { GenericDataTable } from "@/components/generic-data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Placeholder data for leaderboard workflows
const placeholderWorkflows = [
  {
    id: "wf-001",
    dateCreated: "2025-01-15T10:30:00Z",
    models: ["GPT-4", "Claude-3", "DeepSeek-R1"],
    dataset: "SupplyChainGHGEmissionFactors_v1.3.0_NAICS_byGHG_USD2022.csv",
    configuration: "Standard Eval Config",
    status: "Completed",
    topModel: "GPT-4",
    avgScore: 0.5123
  },
  {
    id: "wf-002",
    dateCreated: "2025-01-14T14:20:00Z",
    models: ["Llama-2", "GPT-4", "Claude-3"],
    dataset: "FinancialDataAnalysis_v2.1_QuarterlyReports.csv",
    configuration: "Financial Analysis Config",
    status: "Completed",
    topModel: "Claude-3",
    avgScore: 0.4789
  },
  {
    id: "wf-003",
    dateCreated: "2025-01-13T09:15:00Z",
    models: ["DeepSeek-R1", "GPT-4", "Llama-2"],
    dataset: "HealthcareMetrics_v1.0_PatientOutcomes.csv",
    configuration: "Healthcare Eval Config",
    status: "Completed",
    topModel: "DeepSeek-R1",
    avgScore: 0.4901
  },
  {
    id: "wf-004",
    dateCreated: "2025-01-12T16:45:00Z",
    models: ["Claude-3", "GPT-4", "DeepSeek-R1", "Llama-2"],
    dataset: "EducationalAssessment_v2.3_StudentPerformance.csv",
    configuration: "Education Benchmark Config",
    status: "Completed",
    topModel: "GPT-4",
    avgScore: 0.5234
  },
  {
    id: "wf-005",
    dateCreated: "2025-01-11T11:30:00Z",
    models: ["GPT-4", "Claude-3"],
    dataset: "RetailAnalytics_v1.5_SalesData.csv",
    configuration: "Retail Analysis Config",
    status: "Completed",
    topModel: "Claude-3",
    avgScore: 0.4567
  }
];

export default function LeaderboardPage() {
  const navigate = useNavigate();

  const handleRowAction = (action: string, row: any) => {
    if (action === "view") {
      navigate(`/autoeval/leaderboard/${row.id}`);
    }
  };

  const leaderboardColumns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: "id",
      header: "Workflow ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "dateCreated",
      header: "Date Created",
      cell: ({ row }) => {
        const date = row.getValue("dateCreated") as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: "models",
      header: "Models",
      cell: ({ row }) => {
        const models = row.getValue("models") as string[];
        return models.join(", ");
      },
    },
    {
      accessorKey: "dataset",
      header: "Dataset ID",
      cell: ({ row }) => (
        <span className="max-w-xs truncate block">{row.getValue("dataset")}</span>
      ),
    },
    {
      accessorKey: "configuration",
      header: "Configuration",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("configuration") || "-"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
          {row.getValue("status")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/autoeval/leaderboard/${row.getValue("id")}`);
          }}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

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
        <div className="flex items-center gap-3 mb-6 pt-6 flex-shrink-0">
          <div className="p-2 bg-yellow-900/20 rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">
              Model Performance Rankings
            </p>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <GenericDataTable
            endpoint=""
            dataKey=""
            title=""
            enableSelection={false}
            customColumns={leaderboardColumns}
            onRowAction={handleRowAction}
            actions={[
              { label: "View", value: "view" },
            ]}
            serverSidePagination={false}
            staticData={placeholderWorkflows}
          />
        </div>
      </div>
    </div>
  );
}
