export interface Model {
  id: string;
  name: string;
  provider: string;
  pricing: string;
  costPerMillionInputTokens: string;
  costPerMillionOutputTokens: string;
}

export interface TaskType {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string; // Icon name for dynamic import
}

export interface Metric {
  id: string;
  name: string;
  description: string;
}

export interface ModelParameters {
  temperature: number;
  topP: number;
  maxTokens: number;
}

// Available models for selection
export const AVAILABLE_MODELS: Model[] = [
  { 
    id: "gpt-4", 
    name: "GPT-4", 
    provider: "OpenAI", 
    pricing: "$0.03/1K tokens", 
    costPerMillionInputTokens: "$30.00",
    costPerMillionOutputTokens: "$60.00"
  },
  { 
    id: "gpt-3.5-turbo", 
    name: "GPT-3.5 Turbo", 
    provider: "OpenAI", 
    pricing: "$0.002/1K tokens", 
    costPerMillionInputTokens: "$2.00",
    costPerMillionOutputTokens: "$2.00"
  },
  { 
    id: "claude-3", 
    name: "Claude-3", 
    provider: "Anthropic", 
    pricing: "$0.015/1K tokens", 
    costPerMillionInputTokens: "$15.00",
    costPerMillionOutputTokens: "$75.00"
  },
  { 
    id: "gemini-pro", 
    name: "Gemini Pro", 
    provider: "Google", 
    pricing: "$0.001/1K tokens", 
    costPerMillionInputTokens: "$1.00",
    costPerMillionOutputTokens: "$2.00"
  },
  { 
    id: "llama-2", 
    name: "Llama-2", 
    provider: "Meta", 
    pricing: "$0.0006/1K tokens", 
    costPerMillionInputTokens: "$0.60",
    costPerMillionOutputTokens: "$0.60"
  },
  { 
    id: "mistral", 
    name: "Mistral", 
    provider: "Mistral AI", 
    pricing: "$0.0014/1K tokens", 
    costPerMillionInputTokens: "$1.40",
    costPerMillionOutputTokens: "$4.20"
  },
];

// Available task types
export const TASK_TYPES: TaskType[] = [
  {
    id: "qa",
    name: "QA",
    description: "Question answering and conversational AI",
    prompt: "Please answer the following question based on the provided context. Provide a clear, accurate, and helpful response.",
    icon: "MessageSquare",
  },
  {
    id: "summarization",
    name: "Summarization",
    description: "Text summarization and content condensation",
    prompt: "Please provide a concise summary of the following text, capturing the key points and main ideas while maintaining accuracy.",
    icon: "FileText",
  },
  {
    id: "classification",
    name: "Classification",
    description: "Text classification and categorization",
    prompt: "Please classify the following text into the appropriate category. Consider the content, context, and characteristics to make an accurate classification.",
    icon: "Tags",
  },
  {
    id: "code",
    name: "Code",
    description: "Code generation and programming tasks",
    prompt: "Please generate code that meets the specified requirements. Ensure the code is well-structured, efficient, and follows best practices.",
    icon: "Code",
  },
  {
    id: "function-calling",
    name: "Function Calling",
    description: "Function calling and API integration",
    prompt: "Please execute the appropriate function call based on the user's request. Extract relevant parameters and ensure proper API integration.",
    icon: "Zap",
  },
  {
    id: "reasoning",
    name: "Reasoning",
    description: "Logical reasoning and problem solving",
    prompt: "Please analyze the given problem using logical reasoning. Break down the problem, identify key components, and provide a step-by-step solution.",
    icon: "Pi",
  },
];

// Available text metrics
export const TEXT_METRICS: Metric[] = [
  {
    id: "bleu",
    name: "BLEU",
    description: "Bilingual Evaluation Understudy - measures n-gram overlap between generated and reference text"
  },
  {
    id: "rouge",
    name: "ROUGE",
    description: "Recall-Oriented Understudy for Gisting Evaluation - measures word overlap and n-gram similarity"
  },
  {
    id: "meteor",
    name: "METEOR",
    description: "Metric for Evaluation of Translation with Explicit ORdering - considers synonyms and word order"
  },
  {
    id: "bertscore",
    name: "BERTScore",
    description: "Uses BERT embeddings to compute similarity between generated and reference text"
  },
  {
    id: "exact_match",
    name: "Exact Match",
    description: "Measures if the generated text exactly matches the reference text"
  },
  {
    id: "f1_score",
    name: "F1 Score",
    description: "Harmonic mean of precision and recall for text matching"
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "Measures how well a language model predicts a sample of text, lower values indicate better performance"
  }
];

// Pass@K options
export const PASS_AT_K_OPTIONS = [
  { value: "1", label: "Pass@1" },
  { value: "4", label: "Pass@4" },
  { value: "16", label: "Pass@16" },
  { value: "64", label: "Pass@64" }
];

// Default model parameters
export const DEFAULT_MODEL_PARAMETERS: ModelParameters = {
  temperature: 0.3,
  topP: 0.6,
  maxTokens: 500
};

// Helper function to get default parameters for a model
export const getDefaultParametersForModel = (): ModelParameters => {
  return { ...DEFAULT_MODEL_PARAMETERS };
};

// Helper function to get model by ID
export const getModelById = (modelId: string): Model | undefined => {
  return AVAILABLE_MODELS.find(model => model.id === modelId);
};

// Helper function to get task type by ID
export const getTaskTypeById = (taskId: string): TaskType | undefined => {
  return TASK_TYPES.find(task => task.id === taskId);
};

// Helper function to get metric by ID
export const getMetricById = (metricId: string): Metric | undefined => {
  return TEXT_METRICS.find(metric => metric.id === metricId);
};
