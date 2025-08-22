import { UploadService } from "@/components/autoeval/fileupload";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Info, RotateCcw, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Step1UploadDatasetProps {
  onConfigurationUpdate?: (config: { dataset?: { name: string; columns: string[]; inputColumn?: string; outputColumn?: string } }) => void;
}

export default function Step1UploadDataset({ onConfigurationUpdate }: Step1UploadDatasetProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedInputColumn, setSelectedInputColumn] = useState<string>('');
  const [selectedOutputColumn, setSelectedOutputColumn] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [backendResponseReceived, setBackendResponseReceived] = useState<boolean>(false);
  const [datasetColumns, setDatasetColumns] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadInitInfo, setUploadInitInfo] = useState<{ uploadId: string; key: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<boolean>(false);

  const handleUpload = useCallback(
    async (file?: File) => {
      const fileToUpload = file || selectedFile;
      if (!fileToUpload || uploading) return;

      setUploading(true);
      cancelRef.current = false;
      setBackendResponseReceived(false); // Reset backend response state

      try {
        await UploadService.uploadFile(
          fileToUpload,
          (p) => {
            setUploadProgress(Math.min(100, Math.max(0, p.percentage)));
          },
          () => cancelRef.current,
          (init) => {
            setUploadInitInfo({ uploadId: init.uploadId, key: init.key });
          }
        );

        // Simulate successful upload
        setUploadStatus('success');
        setUploadMessage('Dataset uploaded successfully!');
        setUploadProgress(100);
        setBackendResponseReceived(true);
        
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadStatus('error');
        setUploadMessage(errorMessage);
        setUploadProgress(0);
      } finally {
        setUploading(false);
      }
    },
    [selectedFile, uploading]
  );

  const handleFileUpload = (files: FileList | null) => { 
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      const allowedExtensions = ['.csv', '.json', '.xlsx', '.xls', '.parquet'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        setUploadStatus('error');
        setUploadMessage('Invalid file type. Please upload a CSV, JSON, Excel, or Parquet file.');
        return;
      }
      
      setUploadedFileName(file.name);
      handleUpload(files[0]);
      setUploadStatus('success');
      setUploadMessage('Your dataset is being uploaded...');
      
      // Reset backend response state
      setBackendResponseReceived(false);
      setDatasetColumns([]);
      
      // Update configuration
      if (onConfigurationUpdate) {
        onConfigurationUpdate({
          dataset: {
            name: file.name,
            columns: [],
            inputColumn: '',
            outputColumn: ''
          }
        });
      }
    }
  };

  const handleInputColumnChange = (value: string) => {
    setSelectedInputColumn(value);
    if (uploadedFileName && onConfigurationUpdate && backendResponseReceived) {
      onConfigurationUpdate({
        dataset: {
          name: uploadedFileName,
          columns: datasetColumns,
          inputColumn: value,
          outputColumn: selectedOutputColumn
        }
      });
    }
  };

  const handleOutputColumnChange = (value: string) => {
    setSelectedOutputColumn(value);
    if (uploadedFileName && onConfigurationUpdate && backendResponseReceived) {
      onConfigurationUpdate({
        dataset: {
          name: uploadedFileName,
          columns: datasetColumns,
          inputColumn: selectedInputColumn,
          outputColumn: value
        }
      });
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
    // If we have a successfully uploaded dataset, remove it from backend
    if (uploadInitInfo && uploadStatus === 'success') {
      removeDatasetFromBackend(uploadInitInfo.uploadId, uploadInitInfo.key);
    }
    resetUploadUI();
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-4 h-full">
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
        ) : backendResponseReceived ? null : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <h3 className="text-base font-medium text-gray-500 mb-1">Upload your dataset</h3>
            <p className="text-sm text-gray-500 mb-3">Drag and drop your CSV, JSON, Excel, or Parquet file here, or click to browse</p>
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
              accept=".csv,.json,.xlsx,.xls,.parquet"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        )}

        {/* Dataset Preview Table */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Dataset Preview (df.head())</h3>
          <div className="border rounded-lg overflow-hidden">
            {!backendResponseReceived ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">Upload a dataset to see the preview</p>
                {/* <p className="text-xs mt-1">Processing will begin after upload...</p> */}
              </div>
            ) : datasetColumns.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {datasetColumns.map((column) => (
                      <TableHead key={column} className="font-medium text-xs">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={datasetColumns.length} className="text-xs text-center">
                      Dataset uploaded successfully
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Column Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">Column Selection</h3>
            <Button
              onClick={handleClearSelection}
              variant="outline"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Input Column</label>
              <Select 
                value={selectedInputColumn} 
                onValueChange={handleInputColumnChange}
                disabled={!backendResponseReceived}
              >
                <SelectTrigger className="mt-3">
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
                <SelectTrigger className="mt-3">
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
