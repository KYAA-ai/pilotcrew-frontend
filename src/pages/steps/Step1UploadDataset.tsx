import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";
import { useState } from "react";

export default function Step1UploadDataset() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  // Placeholder data for df.head()
  const sampleData = [
    { id: 1, question: "What is the capital of France?", answer: "Paris", category: "Geography", difficulty: "Easy" },
    { id: 2, question: "How many planets are in our solar system?", answer: "8", category: "Science", difficulty: "Medium" },
    { id: 3, question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare", category: "Literature", difficulty: "Easy" },
    { id: 4, question: "What is the chemical symbol for gold?", answer: "Au", category: "Chemistry", difficulty: "Medium" },
    { id: 5, question: "In which year did World War II end?", answer: "1945", category: "History", difficulty: "Hard" },
  ];

  const columns = ["id", "question", "answer", "category", "difficulty"];

  const handleFileUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      // Simulate upload success
      setUploadStatus('success');
      setUploadMessage('Dataset uploaded successfully!');
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
      <CardContent className="overflow-hidden space-y-6">
        {/* Upload Status Message */}
        {uploadStatus !== 'idle' && (
          <div className={`flex items-center gap-2 p-3 rounded-md ${
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
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your dataset</h3>
          <p className="text-gray-500 mb-4">Drag and drop your CSV, JSON, or Excel file here, or click to browse</p>
          <Button 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="bg-blue-600 hover:bg-blue-700"
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dataset Preview (df.head())</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="font-medium">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column} className="text-sm">
                        {row[column as keyof typeof row]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Column Mapping */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Map Dataset Columns</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Column</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select input column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ground Truth Column</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select ground truth column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags Column (Optional)</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tags column" />
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Column (Optional)</label>
              <Select>
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
        </div>
      </CardContent>
    </>
  );
}
