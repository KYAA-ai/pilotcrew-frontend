import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, FileText, MessageSquare, RotateCcw, Tags, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface TaskType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const taskTypes: TaskType[] = [
  {
    id: "qa",
    name: "QA",
    description: "Question answering and conversational AI",
    icon: MessageSquare,
  },
  {
    id: "summarization",
    name: "Summarization",
    description: "Text summarization and content condensation",
    icon: FileText,
  },
  {
    id: "classification",
    name: "Classification",
    description: "Text classification and categorization",
    icon: Tags,
  },
  {
    id: "code",
    name: "Code",
    description: "Code generation and programming tasks",
    icon: Code,
  },
  {
    id: "function-calling",
    name: "Function Calling",
    description: "Function calling and API integration",
    icon: Zap,
  },
];

interface Step2TaskTypeSelectionProps {
  onConfigurationUpdate?: (config: { tasks: string[] }) => void;
  initialConfig?: { tasks?: string[] };
}

export default function Step2TaskTypeSelection({ onConfigurationUpdate, initialConfig }: Step2TaskTypeSelectionProps) {
  const [selectedTask, setSelectedTask] = useState<string>('');

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.tasks && initialConfig.tasks.length > 0) {
      setSelectedTask(initialConfig.tasks[0]); // Take the first task if multiple were previously selected
    }
  }, [initialConfig]);

  const selectTask = (taskId: string) => {
    setSelectedTask(taskId);
    
    // Update configuration
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ tasks: [taskId] });
    }
  };

  const handleClearSelection = () => {
    setSelectedTask('');
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ tasks: [] });
    }
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        <div className="flex items-center justify-between">
          <p className="text-slate-300">Select the task type you want to evaluate.</p>
          <Button
            onClick={handleClearSelection}
            variant="outline"
            size="sm"
            className="text-slate-400 hover:text-slate-200 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 transition-colors duration-200"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear Selection
          </Button>
        </div>
        
        {/* Task Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskTypes.map((task) => {
              const Icon = task.icon;
              const isSelected = selectedTask === task.id;
              
              return (
                <Card
                  key={task.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border ${
                    isSelected 
                      ? 'ring-2 ring-emerald-500 bg-gradient-to-br from-slate-800 to-slate-900 border-emerald-500/30 shadow-lg' 
                      : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:border-slate-500 hover:shadow-md'
                  }`}
                  onClick={() => selectTask(task.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors duration-200 ${
                        isSelected ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-600/50 border border-slate-500/30'
                      }`}>
                        <Icon className={`h-6 w-6 transition-colors duration-200 ${
                          isSelected ? 'text-emerald-300' : 'text-slate-300'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold transition-colors duration-200 ${
                          isSelected ? 'text-slate-100' : 'text-slate-200'
                        }`}>
                          {task.name}
                        </h3>
                        <p className={`text-sm transition-colors duration-200 ${
                          isSelected ? 'text-emerald-300' : 'text-slate-400'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                        Selected
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

        </CardContent>
      </>
    );
  }
