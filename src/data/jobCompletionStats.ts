export interface JobCompletionStats {
  completed: number;
  total: number;
}

/**
 * Job completion stats data frame - PLACEHOLDER DATA
 * 
 * This stores the number of experts who have completed each job
 * out of the total expected experts required to complete that job.
 * 
 * Structure: { jobId: { completed: number, total: number } }
 * Example: { "job_001": { completed: 15, total: 25 } } means 15/25 experts completed
 * 
 * TODO: Replace this with backend API call
 * 
 * Example backend integration:
 * 
 * ```typescript
 * // Replace this function with actual API call
 * export const getJobCompletionStats = async (jobId: string): Promise<JobCompletionStats> => {
 *   try {
 *     const response = await fetch(`/api/jobs/${jobId}/completion-stats`);
 *     const data = await response.json();
 *     return data;
 *   } catch (error) {
 *     console.error('Failed to fetch job completion stats:', error);
 *     return { completed: 0, total: 1 };
 *   }
 * };
 * ```
 */
export const jobCompletionStats: Record<string, JobCompletionStats> = {
  // Placeholder data for the 10 jobs currently displayed
  "job_001": { completed: 15, total: 25 },
  "job_002": { completed: 8, total: 12 },
  "job_003": { completed: 22, total: 30 },
  "job_004": { completed: 5, total: 8 },
  "job_005": { completed: 18, total: 20 },
  "job_006": { completed: 12, total: 15 },
  "job_007": { completed: 7, total: 10 },
  "job_008": { completed: 25, total: 35 },
  "job_009": { completed: 3, total: 5 },
  "job_010": { completed: 30, total: 40 },
};

/**
 * Get job completion stats for a specific job ID
 * @param jobId - The ID of the job
 * @returns JobCompletionStats object with completed and total counts
 */
export const getJobCompletionStats = (jobId: string): JobCompletionStats => {
  return jobCompletionStats[jobId] || { completed: 0, total: 1 };
}; 