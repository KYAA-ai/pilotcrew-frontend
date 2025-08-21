import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Code, FileText, MessageSquare, Pi, RotateCcw, Tags, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface TaskType {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const taskTypes: TaskType[] = [
  {
    id: "qa",
    name: "QA",
    description: "Question answering and conversational AI",
    prompt: "Please answer the following question based on the provided context. Provide a clear, accurate, and helpful response.",
    icon: MessageSquare,
  },
  {
    id: "summarization",
    name: "Summarization",
    description: "Text summarization and content condensation",
    prompt: "Please provide a concise summary of the following text, capturing the key points and main ideas while maintaining accuracy.",
    icon: FileText,
  },
  {
    id: "classification",
    name: "Classification",
    description: "Text classification and categorization",
    prompt: "Please classify the following text into the appropriate category. Consider the content, context, and characteristics to make an accurate classification.",
    icon: Tags,
  },
  {
    id: "code",
    name: "Code",
    description: "Code generation and programming tasks",
    prompt: "Please generate code that meets the specified requirements. Ensure the code is well-structured, efficient, and follows best practices.",
    icon: Code,
  },
  {
    id: "function-calling",
    name: "Function Calling",
    description: "Function calling and API integration",
    prompt: "Please execute the appropriate function call based on the user's request. Extract relevant parameters and ensure proper API integration.",
    icon: Zap,
  },
  {
    id: "reasoning",
    name: "Reasoning",
    description: "Logical reasoning and problem solving",
    prompt: "Please analyze the given problem using logical reasoning. Break down the problem, identify key components, and provide a step-by-step solution.",
    icon: Pi,
  },
];

interface Step2TaskTypeSelectionProps {
  onConfigurationUpdate?: (config: { tasks: string[] }) => void;
  initialConfig?: { tasks?: string[] };
}

export default function Step2TaskTypeSelection({ onConfigurationUpdate, initialConfig }: Step2TaskTypeSelectionProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [promptText, setPromptText] = useState<string>("");

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.tasks && initialConfig.tasks.length > 0) {
      setSelectedTasks([initialConfig.tasks[0]]); // Take the first task if multiple were previously selected
    }
  }, [initialConfig]);

  const selectTask = (taskId: string) => {
    // If the same task is clicked, deselect it
    const newSelectedTasks = selectedTasks.includes(taskId) 
      ? []
      : [taskId];
    
    setSelectedTasks(newSelectedTasks);
    
    // Set prompt text based on selected task
    if (newSelectedTasks.length > 0) {
      const selectedTask = taskTypes.find(task => task.id === taskId);
      setPromptText(selectedTask?.prompt || "");
    } else {
      setPromptText("");
    }
    
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
              const isSelected = selectedTasks.includes(task.id);
              
              return (
                <Card
                  key={task.id}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border-l-4 backdrop-blur-xl ${
                    isSelected 
                      ? 'bg-[#04071307] border-l-[#FFD886] border-[#FFD886] shadow-lg' 
                      : 'bg-gradient-to-br from-[rgb(5,15,34)] to-[rgb(11,51,87)] hover:border-l-slate-300 hover:shadow-lg'
                  }`}
                  onClick={() => selectTask(task.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg">
                        <Icon className={`h-6 w-6 ${
                          isSelected ? 'text-white' : 'text-[#FFD886]'
                        }`} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          isSelected ? 'text-white' : 'text-gray-300'
                        }`}>
                          {task.name}
                        </h3>
                        <p className={`text-sm ${
                          isSelected ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-white" strokeWidth={2} />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Prompt Text Area */}
          <div className="space-y-4 mt-8">
            <h3 className="text-xl font-semibold text-white">
              Set Task Prompt
            </h3>
            {selectedTasks.length > 0 ? (
              <Textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Task prompt will appear here when you select a task..."
                className="min-h-[120px] bg-gradient-to-br from-white/8 to-white/2 backdrop-blur-xl border border-slate-500/50 text-gray-200 placeholder-gray-500 focus:border-[#f7f7f7] focus:ring-1 focus:ring-[#FFD886]/20 focus:outline-none rounded-xl p-4 shadow-lg transition-all duration-300 hover:border-slate-400/50 text-base"
              />
            ) : (
              <div className="min-h-[120px] bg-gradient-to-br from-white/8 to-white/2 backdrop-blur-xl border border-slate-500/50 rounded-xl p-4 shadow-lg flex items-center justify-center">
                <p className="text-gray-400 text-base text-center">
                  Please select a task above to modify its prompt
                </p>
              </div>
            )}
          </div>

        </CardContent>
      </>
    );
  }
