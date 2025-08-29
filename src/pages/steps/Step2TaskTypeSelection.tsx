import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TASK_TYPES } from "@/data/autoevalStaticData";
import type { AutoEvalConfiguration } from "@/types/shared";
import { Check, Code, FileText, Info, MessageSquare, Pi, Plus, RotateCcw, Tags, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Array<{id: string; prompt: string}>>(initialConfig?.tasks || []);
  const [promptText, setPromptText] = useState<string>("");
  const [classificationLabels, setClassificationLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState<string>("");

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.tasks && initialConfig.tasks.length > 0) {
      const firstTask = initialConfig.tasks[0];
      setSelectedTasks([firstTask]); // Take the first task if multiple were previously selected
      setPromptText(firstTask.prompt);
    }
  }, [initialConfig]);

  const updateConfiguration = (tasks: Array<{id: string; prompt: string}>, labels: string[] = classificationLabels) => {
    if (onConfigurationUpdate) {
      // Check if classification task is selected and include labels
      const hasClassificationTask = tasks.some(task => task.id === 'classification');
      
      onConfigurationUpdate({ 
        tasks,
        classificationLabels: hasClassificationTask ? labels : undefined
      });
    }
  };

  const selectTask = (taskId: string) => {
    // If the same task is clicked, deselect it
    const isCurrentlySelected = selectedTasks.some(task => task.id === taskId);
    let newSelectedTasks: Array<{id: string; prompt: string}>;
    
    if (isCurrentlySelected) {
      newSelectedTasks = [];
      setPromptText("");
      setClassificationLabels([]);
    } else {
      const selectedTask = TASK_TYPES.find(task => task.id === taskId);
      const newPromptText = selectedTask?.prompt || "";
      newSelectedTasks = [{ id: taskId, prompt: newPromptText }];
      setPromptText(newPromptText);
      // Reset classification labels when switching tasks
      if (taskId !== 'classification') {
        setClassificationLabels([]);
      }
    }
    
    setSelectedTasks(newSelectedTasks);
    
    // Update configuration with validation
    updateConfiguration(newSelectedTasks);
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
    setPromptText("");
    setClassificationLabels([]);
    updateConfiguration([]);
  };

  const handlePromptChange = (newPromptText: string) => {
    setPromptText(newPromptText);
    
    // Update the prompt in the selected task
    const updatedTasks = selectedTasks.map(task => ({
      ...task,
      prompt: newPromptText
    }));
    
    // Update configuration with validation
    updateConfiguration(updatedTasks);
  };

  const addClassificationLabel = () => {
    if (newLabel.trim() && !classificationLabels.includes(newLabel.trim())) {
      const updatedLabels = [...classificationLabels, newLabel.trim()];
      setClassificationLabels(updatedLabels);
      setNewLabel("");
      // Update configuration with new labels
      updateConfiguration(selectedTasks, updatedLabels);
    }
  };

  const removeClassificationLabel = (labelToRemove: string) => {
    const updatedLabels = classificationLabels.filter(label => label !== labelToRemove);
    setClassificationLabels(updatedLabels);
    // Update configuration with updated labels
    updateConfiguration(selectedTasks, updatedLabels);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addClassificationLabel();
    }
  };

  // Check if classification task is selected
  const isClassificationSelected = selectedTasks.some(task => task.id === 'classification');

  return (
    <>
      <CardContent className="overflow-y-auto space-y-6 h-full">
        {/* Clear Selection Button - Top of Screen (Mobile) */}
        {isMobile && (
          <div className="flex justify-end">
            <Button
              onClick={handleClearSelection}
              variant="outline"
              size="sm"
              className="text-slate-400 hover:text-slate-200 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 transition-colors duration-200 w-40"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          </div>
        )}

        <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex items-center justify-between'}`}>
          <p className="text-slate-300">Select the task type for evaluation and modify the respective prompt below.</p>
          {!isMobile && (
            <Button
              onClick={handleClearSelection}
              variant="outline"
              size="sm"
              className="text-slate-400 hover:text-slate-200 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 transition-colors duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          )}
        </div>
        
        {/* Prompt Modification Notice */}
        {selectedTasks.length > 0 && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm font-medium text-blue-400 text-center flex items-center justify-center gap-2">
              <Info className="h-4 w-4" />
              {isClassificationSelected 
                ? "You can modify the prompt below and must specify classification labels for the model to process requests properly"
                : "You can modify the prompt below to better suit your specific evaluation needs"
              }
            </p>
          </div>
        )}
        
        {/* Task Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TASK_TYPES.map((task) => {
              const Icon = iconMap[task.icon];
              const isSelected = selectedTasks.some(selectedTask => selectedTask.id === task.id);
              
              return (
                <Card
                  key={task.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl border-l-4 backdrop-blur-xl ${
                    isSelected 
                      ? 'bg-[#04071307] border-l-[#FFD886] border-[#FFD886] shadow-lg' 
                      : 'bg-gradient-to-br from-[rgb(5,15,34)] to-[rgb(11,51,87)] hover:border-l-slate-300 hover:shadow-lg'
                  } ${isMobile ? 'p-3' : 'p-6'}`}
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

          {/* Classification Labels Section */}
          {isClassificationSelected && (
            <div className="space-y-4 mt-8">
              <h3 className="text-xl font-semibold text-white">
                Classification Labels
              </h3>
              <p className="text-gray-400 text-sm">
                Add the classification labels that the model should use to categorize the data.
              </p>
              
              {/* Label Tags */}
              {classificationLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {classificationLabels.map((label, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-sm"
                    >
                      <span>{label}</span>
                      <button
                        onClick={() => removeClassificationLabel(label)}
                        className="hover:text-cyan-100 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Label Input */}
                             <div className="flex gap-2">
                 <Input
                   value={newLabel}
                   onChange={(e) => setNewLabel(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder="Enter a classification label..."
                   className="flex-1 bg-gradient-to-br from-white/8 to-white/2 backdrop-blur-xl border border-slate-500/50 text-gray-200 placeholder-gray-500 focus:border-[#f7f7f7] focus:ring-1 focus:ring-[#FFD886]/20 focus:outline-none rounded-xl"
                 />
                 <Button
                   onClick={addClassificationLabel}
                   disabled={!newLabel.trim()}
                   className="px-4 bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
                 >
                   <Plus className="h-4 w-4 mr-1" />
                   Add
                 </Button>
               </div>
            </div>
          )}

          {/* Prompt Text Area */}
          <div className="space-y-4 mt-8">
            <h3 className="text-xl font-semibold text-white">
              Task Prompt
            </h3>
            <p className="text-gray-400 text-sm">
              This prompt will be used as the system prompt to guide the model's behavior for all tasks.
            </p>
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
