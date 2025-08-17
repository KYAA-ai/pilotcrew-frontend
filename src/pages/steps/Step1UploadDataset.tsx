import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle, RotateCcw, Upload } from "lucide-react";
import { useEffect, useState } from "react";

interface Step1UploadDatasetProps {
  onConfigurationUpdate?: (config: { dataset?: { name: string; columns: string[]; outputColumn?: string } }) => void;
  initialConfig?: { dataset?: { name: string; columns: string[]; outputColumn?: string } };
}

export default function Step1UploadDataset({ onConfigurationUpdate, initialConfig }: Step1UploadDatasetProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedOutputColumn, setSelectedOutputColumn] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Placeholder data for df.head()
  const sampleData = [
    { id: 1, question: "What is the capital of France?", answer: "Paris", category: "Geography", difficulty: "Easy" },
    { id: 2, question: "How many planets are in our solar system?", answer: "8", category: "Science", difficulty: "Medium" },
    { id: 3, question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare", category: "Literature", difficulty: "Easy" },
    { id: 4, question: "What is the chemical symbol for gold?", answer: "Au", category: "Chemistry", difficulty: "Medium" },
    { id: 5, question: "In which year did World War II end?", answer: "1945", category: "History", difficulty: "Hard" },
  ];

  const columns = ["id", "question", "answer", "category", "difficulty"];

  // Initialize from initialConfig if provided
  useEffect(() => {
    if (initialConfig?.dataset) {
      setUploadedFileName(initialConfig.dataset.name);
      setSelectedOutputColumn(initialConfig.dataset.outputColumn || '');
      setUploadStatus('success');
      setUploadMessage('Dataset loaded from previous selection');
    }
  }, [initialConfig]);

  const handleFileUpload = (files: FileList | null) => { 
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFileName(file.name);
      setUploadStatus('success');
      setUploadMessage('Dataset uploaded successfully!');
      
      // Update configuration
      if (onConfigurationUpdate) {
        onConfigurationUpdate({
          dataset: {
            name: file.name,
            columns: columns,
            outputColumn: selectedOutputColumn || 'none'
          }
        });
      }
    }
  };

  const handleOutputColumnChange = (value: string) => {
    setSelectedOutputColumn(value);
    if (uploadedFileName && onConfigurationUpdate) {
      onConfigurationUpdate({
        dataset: {
          name: uploadedFileName,
          columns: columns,
          outputColumn: value
        }
      });
    }
  };

  const handleClearSelection = () => {
    setUploadStatus('idle');
    setUploadMessage('');
    setSelectedOutputColumn('');
    setUploadedFileName('');
    if (onConfigurationUpdate) {
      onConfigurationUpdate({ dataset: undefined });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <>
      <CardContent className="overflow-y-auto space-y-4 h-full">
        {/* Upload Status Message */}
        {uploadStatus !== 'idle' && (
          <div className={`flex items-center gap-2 p-2 rounded-md ${
            uploadStatus === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {uploadStatus === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{uploadMessage}</span>
          </div>
        )}

        {/* Drag and Drop Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
          <h3 className="text-base font-medium text-gray-900 mb-1">Upload your dataset</h3>
          <p className="text-sm text-gray-500 mb-3">Drag and drop your CSV, JSON, or Excel file here, or click to browse</p>
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
            accept=".csv,.json,.xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>

        {/* Dataset Preview Table */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Dataset Preview (df.head())</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="font-medium text-xs">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column} className="text-xs">
                        {row[column as keyof typeof row]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Output Column Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium">Output Column Selection</h3>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Output Column (Optional)</label>
            <Select value={selectedOutputColumn} onValueChange={handleOutputColumnChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select output column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </>
  );
}
