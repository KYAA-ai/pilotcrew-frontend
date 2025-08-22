import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, ChevronDown, ChevronUp, Cpu, Trophy } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

// Placeholder data for models in the workflow leaderboard (same structure as monitor page)
const placeholderModelsData = {
  "deepseek-r1": {
    "bleu": 0.2904,
    "rougeL": 0.066,
    "meteor": 0.1556,
    "semantic": 0.4407,
    "perplexity": 21.5458,
    "bertScore": 0.4407,
    "exactMatch": 0,
    "f1Score": 0.1077,
    "passAtK": { "1": 0 },
    "topK": {
      "bleu": 0.29044197026576835,
      "rougeL": 0.06595608569959363,
      "meteor": 0.1556122448979592,
      "semantic": 0.44068029503918893,
      "perplexity": 21.545833333333334,
      "bertScore": 0.44068029503918893,
      "exactMatch": 0,
      "f1Score": 0.10771827092369313
    },
    "threshold": 0.8,
    "kValue": 1,
    "totalPasses": 0,
    "totalAttempts": 20,
    "averageScore": 0.4407,
    "inputTokens": 17527,
    "outputTokens": 8055,
    "modelStartedAt": "2025-08-19T23:33:50.189Z",
    "modelEndedAt": "2025-08-19T23:35:53.215Z",
    "tokensUsed": 25582
  },
  "claude-3-5-haiku": {
    "bleu": 0.3133,
    "rougeL": 0.0797,
    "meteor": 0.1668,
    "semantic": 0.527,
    "perplexity": 12.077,
    "bertScore": 0.527,
    "exactMatch": 0,
    "f1Score": 0.1289,
    "passAtK": { "1": 0 },
    "topK": {
      "bleu": 0.3132835281138299,
      "rougeL": 0.07971818355631163,
      "meteor": 0.16683673469387755,
      "semantic": 0.5269813712042367,
      "perplexity": 12.07702380952381,
      "bertScore": 0.5269813712042367,
      "exactMatch": 0,
      "f1Score": 0.1289028954110076
    },
    "threshold": 0.8,
    "kValue": 1,
    "totalPasses": 0,
    "totalAttempts": 20,
    "averageScore": 0.527,
    "inputTokens": 19982,
    "outputTokens": 2163,
    "modelStartedAt": "2025-08-19T23:33:50.188Z",
    "modelEndedAt": "2025-08-19T23:36:05.762Z",
    "tokensUsed": 22145
  },
  "llama3-2-1b-instruct": {
    "bleu": 0.3221,
    "rougeL": 0.1009,
    "meteor": 0.1819,
    "semantic": 0.6106,
    "perplexity": 67.4168,
    "bertScore": 0.6106,
    "exactMatch": 0,
    "f1Score": 0.3554,
    "passAtK": { "1": 0.1 },
    "topK": {
      "bleu": 0.3221189506777917,
      "rougeL": 0.10093264886727986,
      "meteor": 0.18188003062686992,
      "semantic": 0.6105734581714604,
      "perplexity": 67.41678166498204,
      "bertScore": 0.6105734581714604,
      "exactMatch": 0,
      "f1Score": 0.3553716064540319
    },
    "threshold": 0.8,
    "kValue": 1,
    "totalPasses": 2,
    "totalAttempts": 20,
    "averageScore": 0.6106,
    "inputTokens": 17816,
    "outputTokens": 16285,
    "modelStartedAt": "2025-08-19T23:33:50.189Z",
    "modelEndedAt": "2025-08-19T23:37:05.753Z",
    "tokensUsed": 34101
  }
};

// Model display names
const modelDisplayNames = {
  "deepseek-r1": "DeepSeek-R1",
  "claude-3-5-haiku": "Claude-3-5-Haiku",
  "llama3-2-1b-instruct": "Llama3-2-1B-Instruct"
};

type SortField = 'bleu' | 'rougeL' | 'meteor' | 'semantic' | 'perplexity' | 'bertScore' | 'exactMatch' | 'f1Score' | 'averageScore';
type SortDirection = 'asc' | 'desc';

export default function WorkflowLeaderboardPage() {
  const { workflowId } = useParams();
  const [sortField, setSortField] = useState<SortField>('averageScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showTopK, setShowTopK] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Convert the data structure to array format for sorting
  const modelsArray = Object.entries(placeholderModelsData).map(([id, data]) => ({
    id,
    name: modelDisplayNames[id as keyof typeof modelDisplayNames],
    ...data
  }));

  const sortedModels = [...modelsArray].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-white" />
      : <ChevronDown className="h-4 w-4 text-white" />;
  };

  const getPerformanceRank = (value: number, field: SortField) => {
    const values = sortedModels.map(model => model[field]);
    const sortedValues = [...values].sort((a, b) => {
      if (field === 'perplexity') {
        return a - b; // Lower is better for perplexity
      }
      return b - a; // Higher is better for other metrics
    });
    
    const rank = sortedValues.indexOf(value) + 1;
    return rank <= 3 ? rank : 0; // Return 1, 2, 3 for top 3, 0 for others
  };

  const getProviderIcon = (provider: string) => {
    // Placeholder for provider icons - you can replace with actual icons
    return <div className="w-4 h-4 bg-gray-600 rounded-sm mr-2" />;
  };

  const formatValue = (value: number, field: SortField) => {
    if (field === 'perplexity') {
      return value.toFixed(2);
    }
    if (field === 'exactMatch' || field === 'f1Score') {
      return (value * 100).toFixed(2) + '%';
    }
    return (value * 100).toFixed(2) + '%';
  };

  const getExecutionTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const executionMs = end.getTime() - start.getTime();
    const executionSeconds = Math.floor(executionMs / 1000);
    return `${executionSeconds}s`;
  };

  return (
    <div className="flex w-full h-full">
      <div className="h-full p-6 flex flex-col overflow-auto relative w-full">
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
              <Link to="/autoeval/leaderboard" className="text-sm text-muted-foreground hover:text-foreground">
                Leaderboard
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Workflow {workflowId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Main Heading */}
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <div className="p-2 bg-yellow-900/20 rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold">Workflow Leaderboard</h1>
        </div>

        {/* Model Performance Cards */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Model Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-auto">
              {/* Model Performance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {Object.entries(placeholderModelsData).map(([modelId, modelData]) => {
                  const displayName = modelDisplayNames[modelId as keyof typeof modelDisplayNames];
                  
                  return (
                    <Card key={modelId} className="flex flex-col">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{displayName}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        {/* Mini Cards for Key Metrics - 2x3 Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average Score</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {(modelData.averageScore * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Tokens</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {modelData.tokensUsed.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Execution Time</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {getExecutionTime(modelData.modelStartedAt, modelData.modelEndedAt)}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Attempts</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {modelData.totalAttempts}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Input Tokens</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {modelData.inputTokens.toLocaleString()}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Output Tokens</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {modelData.outputTokens.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Detailed Metrics Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Detailed Metrics</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="topK"
                      checked={showTopK}
                      onCheckedChange={(checked) => setShowTopK(checked as boolean)}
                    />
                    <label
                      htmlFor="topK"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show Top K Metrics
                    </label>
                  </div>
                </div>

                                                                                    <div className="overflow-x-auto">
                   <Table className="w-full min-w-[800px] bg-gray-900 rounded-xl overflow-hidden">
                                             <TableHeader>
                         <TableRow className="border-gray-700 hover:bg-gray-800">
                           <TableHead className="text-white bg-gray-800 border-gray-700">
                             <div className="flex items-center gap-2">
                               <Cpu className="h-4 w-4 text-gray-400" />
                               <span>Model</span>
                               <ChevronUp className="h-4 w-4 text-gray-400" />
                             </div>
                           </TableHead>
                          <TableHead className="text-white bg-gray-800 border-gray-700 text-center">
                            {sortedModels.length} / {sortedModels.length}
                          </TableHead>
                                                     {!showTopK && (
                             <TableHead 
                               className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                               onClick={() => handleSort('averageScore')}
                             >
                               <div className="flex items-center gap-2">
                                 <span>Average Score</span>
                                 {getSortIcon('averageScore')}
                               </div>
                             </TableHead>
                           )}
                          <TableHead 
                            className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                            onClick={() => handleSort('bleu')}
                          >
                            <div className="flex items-center gap-2">
                              <span>BLEU</span>
                              {getSortIcon('bleu')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                            onClick={() => handleSort('rougeL')}
                          >
                            <div className="flex items-center gap-2">
                              <span>ROUGE-L</span>
                              {getSortIcon('rougeL')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                            onClick={() => handleSort('meteor')}
                          >
                            <div className="flex items-center gap-2">
                              <span>METEOR</span>
                              {getSortIcon('meteor')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                            onClick={() => handleSort('semantic')}
                          >
                            <div className="flex items-center gap-2">
                              <span>Semantic</span>
                              {getSortIcon('semantic')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                            onClick={() => handleSort('perplexity')}
                          >
                            <div className="flex items-center gap-2">
                              <span>Perplexity</span>
                              {getSortIcon('perplexity')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                            onClick={() => handleSort('bertScore')}
                          >
                            <div className="flex items-center gap-2">
                              <span>BERT Score</span>
                              {getSortIcon('bertScore')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                            onClick={() => handleSort('exactMatch')}
                          >
                            <div className="flex items-center gap-2">
                              <span>Exact Match</span>
                              {getSortIcon('exactMatch')}
                            </div>
                          </TableHead>
                                                     <TableHead 
                             className="text-white bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700"
                             onClick={() => handleSort('f1Score')}
                           >
                            <div className="flex items-center gap-2">
                              <span>F1 Score</span>
                              {getSortIcon('f1Score')}
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedModels.map((model, index) => {
                          // Use Top K data if checkbox is checked, otherwise use regular data
                          const dataSource = showTopK ? model.topK : model;
                          
                          return (
                            <TableRow 
                              key={model.id} 
                              className={`border-gray-700 hover:bg-gray-800 ${
                                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                              }`}
                            >
                                <TableCell className="text-white border-gray-700">
                                 <span className="truncate max-w-[200px]">{model.name}</span>
                               </TableCell>
                              <TableCell className="text-white border-gray-700 text-center">
                                {/* Placeholder for additional info */}
                              </TableCell>
                                {!showTopK && (
                                 <TableCell className={`text-white border-gray-900 text-center ${
                                   getPerformanceRank(dataSource.averageScore, 'averageScore') === 1 ? 'bg-gray-800' :
                                   getPerformanceRank(dataSource.averageScore, 'averageScore') === 2 ? 'bg-gray-700' :
                                   getPerformanceRank(dataSource.averageScore, 'averageScore') === 3 ? 'bg-gray-600' : ''
                                 }`}>
                                   {formatValue(dataSource.averageScore, 'averageScore')}
                                 </TableCell>
                               )}
                                                               <TableCell className={`text-white border-gray-900 text-center ${
                                  getPerformanceRank(dataSource.bleu, 'bleu') === 1 ? 'bg-gray-800' :
                                  getPerformanceRank(dataSource.bleu, 'bleu') === 2 ? 'bg-gray-700' :
                                  getPerformanceRank(dataSource.bleu, 'bleu') === 3 ? 'bg-gray-600' : ''
                                }`}>
                                  {formatValue(dataSource.bleu, 'bleu')}
                                </TableCell>
                                <TableCell className={`text-white border-gray-900 text-center ${
                                  getPerformanceRank(dataSource.rougeL, 'rougeL') === 1 ? 'bg-gray-800' :
                                  getPerformanceRank(dataSource.rougeL, 'rougeL') === 2 ? 'bg-gray-700' :
                                  getPerformanceRank(dataSource.rougeL, 'rougeL') === 3 ? 'bg-gray-600' : ''
                                }`}>
                                  {formatValue(dataSource.rougeL, 'rougeL')}
                                </TableCell>
                                <TableCell className={`text-white border-gray-900 text-center ${
                                  getPerformanceRank(dataSource.meteor, 'meteor') === 1 ? 'bg-gray-800' :
                                  getPerformanceRank(dataSource.meteor, 'meteor') === 2 ? 'bg-gray-700' :
                                  getPerformanceRank(dataSource.meteor, 'meteor') === 3 ? 'bg-gray-600' : ''
                                }`}>
                                  {formatValue(dataSource.meteor, 'meteor')}
                                </TableCell>
                                <TableCell className={`text-white border-gray-900 text-center ${
                                  getPerformanceRank(dataSource.semantic, 'semantic') === 1 ? 'bg-gray-800' :
                                  getPerformanceRank(dataSource.semantic, 'semantic') === 2 ? 'bg-gray-700' :
                                  getPerformanceRank(dataSource.semantic, 'semantic') === 3 ? 'bg-gray-600' : ''
                                }`}>
                                  {formatValue(dataSource.semantic, 'semantic')}
                                </TableCell>
                                <TableCell className={`text-white border-gray-900 text-center ${
                                  getPerformanceRank(dataSource.perplexity, 'perplexity') === 1 ? 'bg-gray-800' :
                                  getPerformanceRank(dataSource.perplexity, 'perplexity') === 2 ? 'bg-gray-700' :
                                  getPerformanceRank(dataSource.perplexity, 'perplexity') === 3 ? 'bg-gray-600' : ''
                                }`}>
                                  {formatValue(dataSource.perplexity, 'perplexity')}
                                </TableCell>
                                <TableCell className={`text-white border-gray-900 text-center ${
                                  getPerformanceRank(dataSource.bertScore, 'bertScore') === 1 ? 'bg-gray-800' :
                                  getPerformanceRank(dataSource.bertScore, 'bertScore') === 2 ? 'bg-gray-700' :
                                  getPerformanceRank(dataSource.bertScore, 'bertScore') === 3 ? 'bg-gray-600' : ''
                                }`}>
                                  {formatValue(dataSource.bertScore, 'bertScore')}
                                </TableCell>
                                <TableCell className={`text-white border-gray-900 text-center ${
                                  getPerformanceRank(dataSource.exactMatch, 'exactMatch') === 1 ? 'bg-gray-800' :
                                  getPerformanceRank(dataSource.exactMatch, 'exactMatch') === 2 ? 'bg-gray-700' :
                                  getPerformanceRank(dataSource.exactMatch, 'exactMatch') === 3 ? 'bg-gray-600' : ''
                                }`}>
                                  {formatValue(dataSource.exactMatch, 'exactMatch')}
                                </TableCell>
                                <TableCell className={`text-white border-gray-900 text-center ${
                                  getPerformanceRank(dataSource.f1Score, 'f1Score') === 1 ? 'bg-gray-800' :
                                  getPerformanceRank(dataSource.f1Score, 'f1Score') === 2 ? 'bg-gray-700' :
                                  getPerformanceRank(dataSource.f1Score, 'f1Score') === 3 ? 'bg-gray-600' : ''
                                }`}>
                                  {formatValue(dataSource.f1Score, 'f1Score')}
                                </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                                         </Table>
                   </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
