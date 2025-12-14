export enum JobStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  UPLOADING = 'UPLOADING',
  TRANSCRIBING = 'TRANSCRIBING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface TranscriptionSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface TranscriptionJob {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  duration?: string;
  status: JobStatus;
  progress: number;
  result?: string; // Markdown or plain text
  error?: string;
  createdAt: number;
}

export interface ProcessingStats {
  estimatedTime: string;
  tokensUsed: number;
  chunksProcessed: number;
  totalChunks: number;
}