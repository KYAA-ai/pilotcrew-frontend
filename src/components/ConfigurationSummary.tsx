import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AutoEvalConfiguration } from "@/types/shared";
import { Bot, Database, FileText, Settings, Target } from "lucide-react";

interface ConfigurationSummaryProps {
  config: AutoEvalConfiguration;
  currentStep?: number;
  isCompact?: boolean;
  isMobile?: boolean;
}

export default function ConfigurationSummary({ 
  config,
  isMobile = false
}: ConfigurationSummaryProps) {
  const hasConfiguration = config.dataset || config.tasks?.length || config.models?.length || config.parameters || config.metrics;
  
  // Mobile view - render content directly without Card wrapper
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-6">
          {hasConfiguration ? (
            <div className="space-y-6">
              {/* Dataset */}
              {config.dataset && (
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <Database className="h-4 w-4 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-sm">Dataset</h4>
                      <p className="text-xs text-slate-400">Uploaded file & columns</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs max-w-full">
                        <span className="truncate">
                          {config.dataset.name || 'No file selected'}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">File Type:</span> {config.dataset.fileType || 'Unknown'}
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">Columns:</span> {config.dataset.columns?.length || 0} detected
                    </div>
                    {config.dataset.estimatedTotalRows && (
                      <div className="text-xs text-slate-400">
                        <span className="font-medium text-slate-300">Total Rows:</span> {config.dataset.estimatedTotalRows.toLocaleString()}
                      </div>
                    )}
                    {config.dataset.inputColumn && (
                      <div className="text-xs text-slate-400">
                        <span className="font-medium text-slate-300">Input:</span> {config.dataset.inputColumn}
                      </div>
                    )}
                    {config.dataset.outputColumn && (
                      <div className="text-xs text-slate-400">
                        <span className="font-medium text-slate-300">Output:</span> {config.dataset.outputColumn}
                      </div>
                    )}
                    {config.dataset.datasetId && (
                      <div className="text-xs text-slate-400">
                        <span className="font-medium text-slate-300">ID:</span> {config.dataset.datasetId.substring(0, 20)}...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {config.tasks && config.tasks.length > 0 && (
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                      <FileText className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-sm">Task Type</h4>
                      <p className="text-xs text-slate-400">Selected evaluation task</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {config.tasks.map((task, index) => (
                        <Badge key={index} className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium">
                          {task.id}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Classification Labels */}
                    {config.tasks.some(task => task.id === 'classification') && config.classificationLabels && config.classificationLabels.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 font-medium">Classification Labels:</p>
                        <div className="flex flex-wrap gap-1">
                          {config.classificationLabels.map((label, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md text-cyan-300 text-xs"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Models */}
              {config.models && config.models.length > 0 && (
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <Bot className="h-4 w-4 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-sm">Models</h4>
                      <p className="text-xs text-slate-400">Selected AI models</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {config.models.map((model, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-sm text-slate-200 font-medium">{model.name}</span>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                          {model.provider}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parameters */}
              {config.parameters && Object.keys(config.parameters).length > 0 && (
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                      <Settings className="h-4 w-4 text-orange-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-sm">Parameters</h4>
                      <p className="text-xs text-slate-400">Model configuration</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(config.parameters).map(([modelName, params]) => (
                      <div key={modelName} className="bg-slate-600/30 rounded-lg p-3 border border-slate-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-sm font-medium text-slate-200">{modelName}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-1 bg-slate-700/50 rounded border border-slate-500/30">
                            <div className="text-slate-400">Temp</div>
                            <div className="text-orange-300 font-medium">{params.temperature}</div>
                          </div>
                          <div className="text-center p-1 bg-slate-700/50 rounded border border-slate-500/30">
                            <div className="text-slate-400">Top P</div>
                            <div className="text-orange-300 font-medium">{params.topP}</div>
                          </div>
                          <div className="text-center p-1 bg-slate-700/50 rounded border border-slate-500/30">
                            <div className="text-slate-400">Max Tokens</div>
                            <div className="text-orange-300 font-medium">{params.maxTokens}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics */}
              {config.metrics && (
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                      <Target className="h-4 w-4 text-red-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 text-sm">Metrics</h4>
                      <p className="text-xs text-slate-400">Evaluation criteria</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {config.metrics.passAtK && (
                      <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
                        Pass@{config.metrics.passAtK}
                      </Badge>
                    )}
                    {config.metrics.textMetrics && config.metrics.textMetrics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {config.metrics.textMetrics.map((metric, index) => (
                          <Badge key={index} className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-slate-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Settings className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-slate-200 font-medium mb-2">No Configuration Set</h3>
              <p className="text-sm text-slate-400 mb-4">Complete the setup steps to see your configuration summary</p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                <span>Waiting for configuration data</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop view - render with Card wrapper
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-3 text-slate-100">
          <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
            <Settings className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <div className="text-lg font-semibold">Configuration</div>
            <div className="text-xs text-slate-400 font-normal">Summary & Details</div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-6 p-6">
        {hasConfiguration ? (
          <div className="space-y-6">
            {/* Status Badge - Hidden on mobile */}
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                Active Configuration
              </Badge>
              <div className="text-xs text-slate-400">
                {Object.keys(config).filter(key => config[key as keyof typeof config]).length} sections
              </div>
            </div>
            
            {/* Dataset */}
            {config.dataset && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <Database className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">Dataset</h4>
                    <p className="text-xs text-slate-400">Uploaded file & columns</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs max-w-full">
                      <span className="truncate">
                        {config.dataset.name || 'No file selected'}
                      </span>
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="font-medium text-slate-300">File Type:</span> {config.dataset.fileType || 'Unknown'}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="font-medium text-slate-300">Columns:</span> {config.dataset.columns?.length || 0} detected
                  </div>
                  {config.dataset.estimatedTotalRows && (
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">Total Rows:</span> {config.dataset.estimatedTotalRows.toLocaleString()}
                    </div>
                  )}
                  {config.dataset.inputColumn && (
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">Input:</span> {config.dataset.inputColumn}
                    </div>
                  )}
                  {config.dataset.outputColumn && (
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">Output:</span> {config.dataset.outputColumn}
                    </div>
                  )}
                  {config.dataset.datasetId && (
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">ID:</span> {config.dataset.datasetId.substring(0, 20)}...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tasks */}
            {config.tasks && config.tasks.length > 0 && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                    <FileText className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">Task Type</h4>
                    <p className="text-xs text-slate-400">Selected evaluation task</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {config.tasks.map((task, index) => (
                      <Badge key={index} className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium">
                        {task.id}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Classification Labels */}
                  {config.tasks.some(task => task.id === 'classification') && config.classificationLabels && config.classificationLabels.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 font-medium">Classification Labels:</p>
                      <div className="flex flex-wrap gap-1">
                        {config.classificationLabels.map((label, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md text-cyan-300 text-xs"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* System Prompt */}
            {config.tasks && config.tasks.length > 0 && config.tasks[0].prompt && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                    <FileText className="h-4 w-4 text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">Task Prompt</h4>
                    <p className="text-xs text-slate-400">This prompt will be used as the system prompt to guide the model's behavior for all tasks.</p>
                  </div>
                </div>
                <div className="bg-slate-600/30 rounded-lg p-3 border border-slate-500/30">
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">
                    {config.tasks[0].prompt}
                  </p>
                </div>
              </div>
            )}

            {/* Models */}
            {config.models && config.models.length > 0 && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <Bot className="h-4 w-4 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">Models</h4>
                    <p className="text-xs text-slate-400">Selected AI models</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {config.models.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-600/30 rounded border border-slate-500/30">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-sm text-slate-200 font-medium">{model.name}</span>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parameters */}
            {config.parameters && Object.keys(config.parameters).length > 0 && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <Settings className="h-4 w-4 text-orange-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">Parameters</h4>
                    <p className="text-xs text-slate-400">Model configuration</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(config.parameters).map(([modelName, params]) => (
                    <div key={modelName} className="bg-slate-600/30 rounded-lg p-3 border border-slate-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-200">{modelName}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-1 bg-slate-700/50 rounded border border-slate-500/30">
                          <div className="text-slate-400">Temp</div>
                          <div className="text-orange-300 font-medium">{params.temperature}</div>
                        </div>
                        <div className="text-center p-1 bg-slate-700/50 rounded border border-slate-500/30">
                          <div className="text-slate-400">Top P</div>
                          <div className="text-orange-300 font-medium">{params.topP}</div>
                        </div>
                        <div className="text-center p-1 bg-slate-700/50 rounded border border-slate-500/30">
                          <div className="text-slate-400">Max Tokens</div>
                          <div className="text-orange-300 font-medium">{params.maxTokens}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics */}
            {config.metrics && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
                    <Target className="h-4 w-4 text-red-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">Metrics</h4>
                    <p className="text-xs text-slate-400">Evaluation criteria</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {config.metrics.passAtK && (
                    <Badge className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
                      Pass@{config.metrics.passAtK}
                    </Badge>
                  )}
                  {config.metrics.textMetrics && config.metrics.textMetrics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {config.metrics.textMetrics.map((metric, index) => (
                        <Badge key={index} className="bg-red-500/20 text-red-300 border border-red-500/30 text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Settings className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-slate-200 font-medium mb-2">No Configuration Set</h3>
            <p className="text-sm text-slate-400 mb-4">Complete the setup steps to see your configuration summary</p>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <span>Waiting for configuration data</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
