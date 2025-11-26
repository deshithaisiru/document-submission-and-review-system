import React, { useState, useRef } from 'react';
import { UploadIcon, FileIcon, XIcon } from 'lucide-react';
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
}
export function FileUpload({
  onFileSelect,
  accept = '.pdf,.xlsx,.csv,.png,.jpg,.jpeg',
  maxSize = 10
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const validateFile = (file: File): boolean => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setError('File type not supported');
      return false;
    }
    return true;
  };
  const handleFileChange = (file: File) => {
    setError('');
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleRemove = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  return <div>
      <input ref={fileInputRef} type="file" accept={accept} onChange={e => e.target.files && handleFileChange(e.target.files[0])} className="hidden" />

      {!selectedFile ? <div onClick={handleClick} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}>
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-3 rounded-full">
              <UploadIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, Excel, CSV, or Images (max {maxSize}MB)
          </p>
        </div> : <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded">
                <FileIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button onClick={handleRemove} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>;
}