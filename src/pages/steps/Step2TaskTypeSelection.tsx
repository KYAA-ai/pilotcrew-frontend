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
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.tasks) {
      setSelectedTasks(initialConfig.tasks);
    }
  }, [initialConfig]);

  const toggleTask = (taskId: string) => {
    const newSelectedTasks = selectedTasks.includes(taskId) 
      ? selectedTasks.filter(id => id !== taskId)
      : [...selectedTasks, taskId];
    
    setSelectedTasks(newSelectedTasks);
    
    // Update configuration
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ tasks: newSelectedTasks });
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ tasks: [] });
    }
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Select the task types you want to evaluate. You can select multiple tasks.</p>
          <Button
            onClick={handleClearSelection}
            variant="outline"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear Selection
          </Button>
        </div>
        
        {/* Task Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskTypes.map((task) => {
              const Icon = task.icon;
              const isSelected = selectedTasks.includes(task.id);
              
              return (
                <Card
                  key={task.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          isSelected ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {task.name}
                        </h3>
                        <p className={`text-sm ${
                          isSelected ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
