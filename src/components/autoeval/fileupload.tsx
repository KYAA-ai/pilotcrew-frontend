import apiClient from '@/lib/api';
import axios, { type AxiosResponse, type CancelTokenSource } from 'axios';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  uploadedParts: number;
  totalParts: number;
}

export interface UploadInitResponse {
  uploadId: string;
  key: string;
  presignedUrls: string[];
  chunkSize: number;
  totalChunks: number;
}

export interface UploadPart {
  ETag: string;
  PartNumber: number;
}

export class UploadService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Initialize multipart upload
   */
  static async initializeUpload(
    fileName: string,
    fileType: string,
    fileSize: number
  ): Promise<UploadInitResponse> {
    try {
      const response: AxiosResponse<UploadInitResponse> = await apiClient.post('/v1/datasetupload/initialize', {
        fileName,
        fileType,
        fileSize,
      });
      console.log('Upload initialized:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to initialize upload';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to initialize upload');
    }
  }

  /**
   * Upload a single part with retry logic
   */
  static async uploadPart(
    presignedUrl: string,
    chunk: Blob,
    partNumber: number,
    onProgress?: (progress: { loaded: number; total: number }) => void,
    cancelToken?: CancelTokenSource
  ): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const response = await axios.put(presignedUrl, chunk, {
          // headers: {
          //   'Content-Type': fileType,
          // },
          timeout: 0, // No timeout for file uploads
          cancelToken: cancelToken?.token,
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              onProgress({
                loaded: progressEvent.loaded,
                total: progressEvent.total,
              });
            }
          },
        });

        console.log(`Part ${partNumber} uploaded successfully:`, response.status);

        const etag = response.headers['etag'] || response.headers['ETag'];
        if (!etag) {
          throw new Error('No ETag received from S3');
        }

        return etag;
      } catch (error) {
        if (axios.isCancel(error)) {
          throw new Error('Upload cancelled by user');
        }

        lastError = error as Error;
        console.warn(`Upload attempt ${attempt + 1} failed for part ${partNumber}:`, error);
        
        if (attempt < this.MAX_RETRIES - 1) {
          await this.delay(this.RETRY_DELAY * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    throw new Error(`Failed to upload part ${partNumber} after ${this.MAX_RETRIES} attempts: ${lastError?.message}`);
  }

  /**
   * Complete multipart upload
   */
  static async completeUpload(
    uploadId: string,
    key: string,
    parts: UploadPart[]
  ): Promise<{ location: string; key: string }> {
    try {
      const response: AxiosResponse<{ location: string; key: string }> = await apiClient.post('/v1/datasetupload/complete', {
        uploadId,
        key,
        parts,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to complete upload';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to complete upload');
    }
  }

  /**
   * Abort multipart upload
   */
  static async abortUpload(uploadId: string, key: string): Promise<void> {
    try {
      await apiClient.post('/v1/datasetupload/abort', {
        uploadId,
        key,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to abort upload';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to abort upload');
    }
  }

  /**
   * Upload file with multipart upload
   */
  static async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    onCancel?: () => boolean,
    onInit?: (init: UploadInitResponse) => void
  ): Promise<{ location: string; key: string }> {
    const cancelTokenSource = axios.CancelToken.source();
    
    try {
      // Initialize upload
      // start timer
      console.time('Upload Time');
      const initData = await this.initializeUpload(file.name, file.type, file.size);
      if (onInit) {
        onInit(initData);
      }
      const { uploadId, key, presignedUrls, chunkSize, totalChunks } = initData;

      // Upload parts concurrently with a fixed worker pool
      const concurrencyLimit = 3;
      let nextIndex = 0;
      const uploadedParts: UploadPart[] = [];
      let uploadedBytes = 0;

      // optional: per-part progress map for accurate totals
      const partProgressMap = new Map<number, number>();

      const worker = async () => {
        while (true) {
          const currentPartIndex = nextIndex++;
          if (currentPartIndex >= totalChunks) break;

          const partNumber = currentPartIndex + 1;
          const start = currentPartIndex * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);

          // Check for cancellation before each part
          if (onCancel && onCancel()) {
            cancelTokenSource.cancel('Upload cancelled by user');
            await this.abortUpload(uploadId, key);
            throw new Error('Upload cancelled by user');
          }

          const etag = await this.uploadPart(
            presignedUrls[currentPartIndex],
            chunk,
            partNumber,
            (pp) => {
              if (!onProgress) return;

              // track per-part loaded to avoid double-counting
              const prev = partProgressMap.get(currentPartIndex) ?? 0;
              const delta = Math.max(0, pp.loaded - prev);
              partProgressMap.set(currentPartIndex, pp.loaded);

              const loaded = uploadedBytes + delta;
              uploadedBytes = loaded;

              onProgress({
                loaded,
                total: file.size,
                percentage: (loaded / file.size) * 100,
                uploadedParts: uploadedParts.length, // completed parts count
                totalParts: totalChunks,
              });
            },
            cancelTokenSource
          );

          uploadedParts.push({ ETag: etag, PartNumber: partNumber });

          // final per-part bump to full size
          if (onProgress) {
            const prev = partProgressMap.get(currentPartIndex) ?? 0;
            const partSize = chunk.size;
            if (partSize > prev) {
              uploadedBytes += (partSize - prev);
              partProgressMap.set(currentPartIndex, partSize);
              onProgress({
                loaded: uploadedBytes,
                total: file.size,
                percentage: (uploadedBytes / file.size) * 100,
                uploadedParts: uploadedParts.length,
                totalParts: totalChunks,
              });
            }
          }
        }
      };

      // Start N workers and wait for all of them
      const workers = Array.from({ length: Math.min(concurrencyLimit, totalChunks) }, () => worker());
      await Promise.all(workers);

      // Now it's safe to complete
      const result = await this.completeUpload(uploadId, key, uploadedParts);

      console.timeEnd('Upload Time');
      return result;

    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  /**
   * Utility function for delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
