import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Code, FileText, MessageSquare, Pi, RotateCcw, Tags, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { AutoEvalConfiguration } from "@/types/shared";
import { TASK_TYPES } from "@/data/autoevalStaticData";

// Icon mapping for task types
const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  MessageSquare,
  FileText,
  Tags,
  Code,
  Zap,
  Pi,
};

interface Step2TaskTypeSelectionProps {
  onConfigurationUpdate?: (config: Partial<AutoEvalConfiguration> | ((prevConfig: AutoEvalConfiguration) => AutoEvalConfiguration)) => void;
  initialConfig?: AutoEvalConfiguration;
}

export default function Step2TaskTypeSelection({ onConfigurationUpdate, initialConfig }: Step2TaskTypeSelectionProps) {
  const [selectedTasks, setSelectedTasks] = useState<Array<{id: string; prompt: string}>>(initialConfig?.tasks || []);
  const [promptText, setPromptText] = useState<string>("");

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.tasks && initialConfig.tasks.length > 0) {
      const firstTask = initialConfig.tasks[0];
      setSelectedTasks([firstTask]); // Take the first task if multiple were previously selected
      setPromptText(firstTask.prompt);
    }
  }, [initialConfig]);

  const selectTask = (taskId: string) => {
    // If the same task is clicked, deselect it
    const isCurrentlySelected = selectedTasks.some(task => task.id === taskId);
    let newSelectedTasks: Array<{id: string; prompt: string}>;
    
    if (isCurrentlySelected) {
      newSelectedTasks = [];
      setPromptText("");
    } else {
      const selectedTask = TASK_TYPES.find(task => task.id === taskId);
      const newPromptText = selectedTask?.prompt || "";
      newSelectedTasks = [{ id: taskId, prompt: newPromptText }];
      setPromptText(newPromptText);
    }
    
    setSelectedTasks(newSelectedTasks);
    
    // Update configuration
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ tasks: newSelectedTasks });
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
    setPromptText("");
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ tasks: [] });
    }
  };

  const handlePromptChange = (newPromptText: string) => {
    setPromptText(newPromptText);
    
    // Update the prompt in the selected task
    const updatedTasks = selectedTasks.map(task => ({
      ...task,
      prompt: newPromptText
    }));
    
    // Update configuration with the new prompt text
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ tasks: updatedTasks });
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
            {TASK_TYPES.map((task) => {
              const Icon = iconMap[task.icon];
              const isSelected = selectedTasks.some(selectedTask => selectedTask.id === task.id);
              
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
                onChange={(e) => handlePromptChange(e.target.value)}
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
