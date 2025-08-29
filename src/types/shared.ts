export interface AutoEvalConfiguration {
  dataset?: {
    name?: string;
    fileType?: string;
    columns?: string[];
    inputColumn?: string;
    outputColumn?: string;
    datasetId?: string;
    estimatedTotalRows?: number;
    preview?: Record<string, string>[];
  };
  tasks: Array<{
    id: string;
    prompt: string;
  }>;
  classificationLabels?: string[];
  models: Array<{
    id: string;
    name: string;
    provider: string;
    pricing: string;
    costPerMillionInputTokens: string;
    costPerMillionOutputTokens: string;
  }>;
  parameters?: Record<string, {
    temperature: number;
    topP: number;
    maxTokens: number;
  }>; // Key is model.id, not model.name
  metrics?: {
    passAtK?: string;
    textMetrics: string[];
  };
  systemPrompt?: string;
}

export interface StepUIState {
  uploadStatus?: 'idle' | 'success' | 'error';
  uploadMessage?: string;
  uploading?: boolean;
  loadingPreview?: boolean;
  uploadProgress?: number;
  uploadInitInfo?: { uploadId: string; key: string } | null;
  selectedFile?: File | null;
}
