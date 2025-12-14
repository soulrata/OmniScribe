import React, { useCallback, useState } from 'react';
import { UploadCloud, FileAudio, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE_MB } from '../constants';
import { formatBytes } from '../utils/fileUtils';

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileAccepted, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['audio/', 'video/'];
    const isValidType = validTypes.some(type => file.type.startsWith(type));
    
    if (!isValidType) {
      setError("Format not supported. Please upload Audio or Video files.");
      return false;
    }

    // Convert MB to Bytes for check
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large for the browser demo (> ${MAX_FILE_SIZE_MB}MB). In a native app, this would use file system streaming.`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileAccepted(file);
      }
    }
  }, [onFileAccepted, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileAccepted(file);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed border-slate-700 bg-slate-900' : 'cursor-pointer'}
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
          : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 bg-slate-800/20'}
      `}
    >
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-500/20' : 'bg-slate-700/50'}`}>
          {isDragging ? (
            <UploadCloud className="w-10 h-10 text-blue-400" />
          ) : (
            <FileAudio className="w-10 h-10 text-slate-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-200">
            {isDragging ? 'Drop audio file here' : 'Drag & Drop audio file'}
          </h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Supports MP3, WAV, M4A, MP4.
            <br />
            <span className="text-xs text-slate-500">Max size for Web Demo: {MAX_FILE_SIZE_MB}MB</span>
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg text-sm mt-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropZone;