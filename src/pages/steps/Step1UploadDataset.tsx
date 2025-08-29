import { UploadService } from "@/components/autoeval/fileupload";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import apiClient from "@/lib/api";
import type { AutoEvalConfiguration, StepUIState } from "@/types/shared";
import { AlertCircle, Info, RotateCcw, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Step1UploadDatasetProps {
  onConfigurationUpdate?: (config: Partial<AutoEvalConfiguration> | ((prevConfig: AutoEvalConfiguration) => AutoEvalConfiguration)) => void;
  initialConfig?: AutoEvalConfiguration;
  stepState?: StepUIState;
}

export default function Step1UploadDataset({ 
  onConfigurationUpdate, 
  initialConfig,
  stepState = {}
}: Step1UploadDatasetProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // UI-specific state (not part of configuration)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>(
    stepState.uploadStatus || 'idle'
  );
  const [uploadMessage, setUploadMessage] = useState<string>(
    stepState.uploadMessage || ''
  );
  const [uploading, setUploading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(
    stepState.uploadProgress || 0
  );
  const [uploadInitInfo, setUploadInitInfo] = useState<{ uploadId: string; key: string } | null>(
    stepState.uploadInitInfo || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<boolean>(false);

  // Configuration state (shared with config summary)
  const [selectedInputColumn, setSelectedInputColumn] = useState<string>(
    initialConfig?.dataset?.inputColumn || ''
  );
  const [selectedOutputColumn, setSelectedOutputColumn] = useState<string>(
    initialConfig?.dataset?.outputColumn || ''
  );
  const [uploadedFileName, setUploadedFileName] = useState<string>(
    initialConfig?.dataset?.name || ''
  );
  const [backendResponseReceived, setBackendResponseReceived] = useState<boolean>(
    !!initialConfig?.dataset?.datasetId
  );
  const [datasetColumns, setDatasetColumns] = useState<string[]>(
    initialConfig?.dataset?.columns || []
  );
  const [datasetPreview, setDatasetPreview] = useState<Record<string, string>[]>(
    initialConfig?.dataset?.preview || []
  );

  const handleUpload = useCallback(
    async (file?: File) => {
      const fileToUpload = file || selectedFile;
      if (!fileToUpload || uploading) return;

      setUploading(true);
      cancelRef.current = false;
      setBackendResponseReceived(false); // Reset backend response state

      try {
        const result = await UploadService.uploadFile(
          fileToUpload,
          (p) => {
            setUploadProgress(Math.min(100, Math.max(0, p.percentage)));
          },
          () => cancelRef.current,
          (init) => {
            setUploadInitInfo({ uploadId: init.uploadId, key: init.key });
          }
        );
        const datasetId = result.key;
        
        try {
          console.log('🔍 Fetching dataset preview for key:', datasetId);
          setLoadingPreview(true);
          setUploadMessage('Loading dataset preview...');
          
          
          const previewResponse = await apiClient.get(`/v1/datasetupload/preview?key=${encodeURIComponent(datasetId)}&limit=5&fallback=true`);
          
          if (previewResponse.status !== 200) {
            throw new Error(`Preview API failed: ${previewResponse.status}`);
          }
          
          const previewData = previewResponse.data;
          console.log('📊 Dataset preview received:', previewData);
          
          if (onConfigurationUpdate) {
            console.log('🔧 Upload completed, updating with preview data');
            onConfigurationUpdate((prevConfig: AutoEvalConfiguration) => ({
              ...prevConfig,
              dataset: {
                ...(prevConfig.dataset as AutoEvalConfiguration['dataset']),
                datasetId: datasetId,
                columns: previewData.headers || [],
                estimatedTotalRows: previewData.estimatedTotalRows || 0,
                preview: previewData.rows || []
              }
            }));
          }
          
          // Update local state for UI
          setDatasetColumns(previewData.headers || []);
          setDatasetPreview(previewData.rows || []);
          setBackendResponseReceived(true);
          setUploadStatus('success');
          setUploadMessage('Dataset uploaded and preview loaded successfully!');
          
          // Show success toast notification
          toast.success('Dataset uploaded successfully!', {
            description: 'Your dataset has been uploaded and preview is ready.',
            duration: 4000,
          });
          
        } catch (previewError) {
          console.error('❌ Failed to fetch dataset preview:', previewError);
          // Still update with datasetId even if preview fails
          if (onConfigurationUpdate) {
            onConfigurationUpdate((prevConfig: AutoEvalConfiguration) => ({
              ...prevConfig,
              dataset: {
                ...(prevConfig.dataset as AutoEvalConfiguration['dataset']),
                datasetId: datasetId
              }
            }));
          }
          setBackendResponseReceived(true);
          setUploadStatus('success');
          setUploadMessage('Dataset uploaded successfully! (Preview unavailable)');
          
          // Show success toast notification (preview failed case)
          toast.success('Dataset uploaded successfully!', {
            description: 'Your dataset has been uploaded. Preview is temporarily unavailable.',
            duration: 4000,
          });
        } finally {
          setLoadingPreview(false);
          setUploadProgress(100);
        }
        
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadStatus('error');
        setUploadMessage(errorMessage);
        setUploadProgress(0);
        
        // Show error toast notification
        toast.error('Upload failed', {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setUploading(false);
      }
    },
    [selectedFile, uploading, onConfigurationUpdate]
  );

  const handleFileUpload = (files: FileList | null) => { 
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      const allowedExtensions = ['.csv', '.json', '.jsonl', '.xlsx', '.xls', '.parquet'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        setUploadStatus('error');
        setUploadMessage('Invalid file type. Please upload a CSV, JSON, Excel, or Parquet file.');
        return;
      }
      
      // Determine file type based on extension
      const fileType = fileExtension === '.csv' ? 'text/csv' :
                      fileExtension === '.json' ? 'application/json' :
                      fileExtension === '.jsonl' ? 'application/json' :
                      fileExtension === '.xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                      fileExtension === '.xls' ? 'application/vnd.ms-excel' :
                      fileExtension === '.parquet' ? 'application/parquet' :
                      'application/octet-stream';
      
      console.log('📄 File selected:', file.name, 'Type:', fileType, 'Extension:', fileExtension);
      
      setUploadedFileName(file.name);
      handleUpload(files[0]);
      setUploadStatus('success');
      setUploadMessage('Your dataset is being uploaded...');
      
      // Reset backend response state
      setBackendResponseReceived(false);
      setDatasetColumns([]);
      
      // Update configuration with file name and type
      if (onConfigurationUpdate) {
        console.log('📄 Setting initial configuration with fileType:', fileType);
        onConfigurationUpdate((prevConfig: AutoEvalConfiguration) => ({
          ...prevConfig,
          dataset: {
            ...(prevConfig.dataset as AutoEvalConfiguration['dataset']),
            name: file.name,
            fileType: fileType,
            columns: [],
            inputColumn: '',
            outputColumn: '',
            datasetId: '' // Will be updated after upload completes
          }
        }));
      }
    }
  };

  const handleInputColumnChange = (value: string) => {
    setSelectedInputColumn(value);
    if (uploadedFileName && onConfigurationUpdate && backendResponseReceived) {
      console.log('🔧 Updating inputColumn only, preserving fileType');
      onConfigurationUpdate((prevConfig: AutoEvalConfiguration) => ({
        ...prevConfig,
        dataset: {
          ...(prevConfig.dataset as AutoEvalConfiguration['dataset']),
          inputColumn: value
          // Only update inputColumn, preserve all other fields including fileType
        }
      }));
    }
  };

  const handleOutputColumnChange = (value: string) => {
    setSelectedOutputColumn(value);
    if (uploadedFileName && onConfigurationUpdate && backendResponseReceived) {
      console.log('🔧 Updating outputColumn only, preserving fileType');
      onConfigurationUpdate((prevConfig: AutoEvalConfiguration) => ({
        ...prevConfig,
        dataset: {
          ...(prevConfig.dataset as AutoEvalConfiguration['dataset']),
          outputColumn: value
          // Only update outputColumn, preserve all other fields including fileType
        }
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /**
   * TODO: Implement backend dataset removal
   * This function will be called when user wants to remove/delete a dataset from the backend
   * Should call backend API to delete the dataset and clean up S3 storage
   */
  const removeDatasetFromBackend = async (uploadId: string, key: string) => {
    // TODO: Implement backend call to remove dataset
    // Example: await apiClient.delete(`/v1/datasetupload/${uploadId}/${key}`);
    // This should delete the dataset record from MongoDB and remove the file from S3
    console.log('TODO: Remove dataset from backend', { uploadId, key });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const resetUploadUI = () => {
    setUploadStatus('idle');
    setUploadMessage('');
    setUploadProgress(0);
    setUploadedFileName('');
    setBackendResponseReceived(false);
    setDatasetColumns([]);
    setSelectedInputColumn('');
    setSelectedOutputColumn('');
    setUploadInitInfo(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ dataset: undefined });
    }
  };

  const handleCancelUpload = async () => {
    // trigger cancellation flag; upload service will abort and call backend
    cancelRef.current = true;
    if (uploadInitInfo) {
      try {
        await UploadService.abortUpload(uploadInitInfo.uploadId, uploadInitInfo.key);
        // TODO: Optionally cleanup any orphaned datasets after abort
        // await cleanupOrphanedDatasets();
      } catch {
        // swallow errors; UI will switch based on uploading flag
      }
    }
    resetUploadUI();
  };

  const handleClearSelection = () => {
    // Only clear column selections, keep the dataset
    setSelectedInputColumn('');
    setSelectedOutputColumn('');
    
    // Update configuration to clear only the column selections
    if (onConfigurationUpdate && backendResponseReceived) {
      onConfigurationUpdate((prevConfig: AutoEvalConfiguration) => ({
        ...prevConfig,
        dataset: {
          ...(prevConfig.dataset as AutoEvalConfiguration['dataset']),
          inputColumn: '',
          outputColumn: ''
        }
      }));
    }
  };

  return (
    <>
      <CardContent className={`space-y-4 h-full ${isMobile ? 'overflow-visible' : 'overflow-y-auto'}`}>
        {/* Clear Selection Button - Top of Screen */}
        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleClearSelection}
                  variant="outline"
                  size="sm"
                  className="border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                  disabled={!backendResponseReceived || (!selectedInputColumn && !selectedOutputColumn)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear Selection
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all selected columns and return to default state.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Step Heading */}
        <div className="space-y-2">
          <p className="text-slate-300">Upload your dataset file and select the input and output columns for evaluation.</p>
        </div>

        {/* Upload Status Message */}
        {uploadStatus !== 'idle' && (
          <div className={`flex items-center justify-between gap-2 p-2 rounded-md ${
            uploadStatus === 'success' 
              ? 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-900 dark:text-blue-200' 
              : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-900 dark:text-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {uploadStatus === 'success' ? (
                <Info className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{uploadMessage}</span>
            </div>
            {uploadStatus === 'success' && uploadInitInfo && (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    await UploadService.abortUpload(uploadInitInfo.uploadId, uploadInitInfo.key);
                    // TODO: Also remove dataset from backend when user cancels after success
                    await removeDatasetFromBackend(uploadInitInfo.uploadId, uploadInitInfo.key);
                  } catch (err) {
                    console.error(err);
                  }
                  resetUploadUI();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        )}

        {/* Drag and Drop Upload Area or Progress */}
        {uploading ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <h3 className="text-base font-medium mb-3">Uploading dataset</h3>
            <div className="flex items-center gap-3 mb-3">
              <Progress value={uploadProgress} className="w-full" />
              <span className="text-sm w-14 text-right">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={handleCancelUpload}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <h3 className="text-base font-medium text-gray-500 mb-1">
              {backendResponseReceived ? "Upload a different dataset" : "Upload your dataset"}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {backendResponseReceived 
                ? "Drag and drop a new CSV, JSON, Excel, or Parquet file to replace the current dataset"
                : "Drag and drop your CSV, JSON, Excel, or Parquet file here, or click to browse"
              }
            </p>
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-sm"
              size="sm"
            >
              Choose File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.json,.jsonl,.xlsx,.xls,.parquet"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        )}

        {/* Dataset Preview Table */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Dataset Preview</h3>
          <div className="border rounded-lg overflow-hidden">
            {!backendResponseReceived ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">Upload a dataset to see the preview</p>
                {/* <p className="text-xs mt-1">Processing will begin after upload...</p> */}
              </div>
            ) : loadingPreview ? (
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading dataset preview...</p>
                  </div>
                  <p className="text-xs text-gray-500">Processing your dataset to show sample data</p>
                </div>
                
                {/* Skeleton Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 border-b">
                    <div className="grid grid-cols-5 gap-4 p-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="divide-y">
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-5 gap-4 p-3">
                        {Array.from({ length: 5 }).map((_, colIndex) => (
                          <div key={colIndex} className="animate-pulse">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500 mt-1">Processing dataset...</p>
                </div>
              </div>
            ) : datasetColumns.length > 0 ? (
              <div 
                className="overflow-x-auto border rounded-md"
                style={{
                  scrollbarWidth: 'auto',
                  scrollbarColor: '#cbd5e0 #f7fafc'
                }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      {datasetColumns.map((column) => (
                        <TableHead key={column} className="font-medium text-xs whitespace-nowrap">
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datasetPreview.length > 0 ? (
                      datasetPreview.map((row: Record<string, unknown>, index: number) => (
                        <TableRow key={index}>
                          {datasetColumns.map((column) => (
                            <TableCell key={column} className="text-xs whitespace-nowrap">
                              {typeof row[column] === 'object' ? 
                                JSON.stringify(row[column]) : 
                                String(row[column] || '')}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={datasetColumns.length} className="text-xs text-center">
                          Dataset uploaded successfully
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Dataset Headers */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Dataset Headers</h3>
          <div className="border rounded-lg p-4">
            {!backendResponseReceived ? (
              <div className="text-center text-gray-500">
                <p className="text-sm">Upload a dataset to see the headers</p>
              </div>
            ) : loadingPreview ? (
              <div className="text-center text-gray-500">
                <p className="text-sm">Loading headers...</p>
              </div>
            ) : datasetColumns.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {datasetColumns.length} column{datasetColumns.length !== 1 ? 's' : ''} detected
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {datasetColumns.map((column, index) => (
                    <div
                      key={column}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700"
                    >
                      <span className="mr-1 text-xs text-blue-600 dark:text-blue-400">#{index + 1}</span>
                      {column}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-sm">No headers available</p>
              </div>
            )}
          </div>
        </div>

        {/* Column Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">Column Selection</h3>
          </div>
          <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4'}`}>
            <div className="space-y-3">
              <label className="text-sm font-medium">Input Column</label>
              <Select 
                value={selectedInputColumn} 
                onValueChange={handleInputColumnChange}
                disabled={!backendResponseReceived}
              >
                <SelectTrigger className={isMobile ? 'mt-1' : 'mt-3'}>
                  <SelectValue placeholder={backendResponseReceived ? "Select input column" : "Upload dataset first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {datasetColumns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Output Column</label>
              <Select 
                value={selectedOutputColumn} 
                onValueChange={handleOutputColumnChange}
                disabled={!backendResponseReceived}
              >
                <SelectTrigger className={isMobile ? 'mt-1' : 'mt-3'}>
                  <SelectValue placeholder={backendResponseReceived ? "Select output column" : "Upload dataset first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {datasetColumns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
