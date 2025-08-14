import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Code, FileText, MessageSquare, Tags, Zap } from "lucide-react";
import { useState } from "react";

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

export default function Step2TaskTypeSelection() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <>
      <CardContent className="overflow-hidden space-y-6">
        <p className="text-muted-foreground">Select the task types you want to evaluate. You can select multiple tasks.</p>
        
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
                          isSelected ? 'text-blue-900' : 'text-gray-900'
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

          {/* Selection Summary */}
          {selectedTasks.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Selected Tasks:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTasks.map((taskId) => {
                  const task = taskTypes.find(t => t.id === taskId);
                  return (
                    <Badge key={taskId} variant="outline" className="bg-white">
                      {task?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </>
    );
  }
