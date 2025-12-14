import React, { useEffect, useState } from 'react';
import { Loader2, Cpu, CheckCircle2 } from 'lucide-react';
import { JobStatus, TranscriptionJob } from '../types';

interface ProcessingStatusProps {
  job: TranscriptionJob;
  statusMessage: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ job, statusMessage }) => {
  const [dots, setDots] = useState('');

  // Animated dots for "Processing..." feel
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.ERROR: return 'bg-red-500';
      case JobStatus.COMPLETED: return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getStepStatus = (stepStatus: JobStatus, currentStatus: JobStatus) => {
    const order = [JobStatus.ANALYZING, JobStatus.UPLOADING, JobStatus.TRANSCRIBING, JobStatus.COMPLETED];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepStatus);

    if (currentStatus === JobStatus.ERROR) return 'text-slate-600';
    if (stepIndex < currentIndex) return 'text-green-400';
    if (stepIndex === currentIndex) return 'text-blue-400 animate-pulse';
    return 'text-slate-600';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      
      {/* Main Status Icon & Text */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className={`absolute inset-0 blur-xl opacity-20 ${getStatusColor(job.status)} rounded-full`}></div>
          <div className="relative p-4 bg-slate-800 rounded-full border border-slate-700 shadow-xl">
            {job.status === JobStatus.TRANSCRIBING || job.status === JobStatus.UPLOADING ? (
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            ) : job.status === JobStatus.ANALYZING ? (
              <Cpu className="w-8 h-8 text-indigo-400" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-medium text-slate-100">
            {job.status === JobStatus.TRANSCRIBING ? `Transcribing${dots}` : statusMessage}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Using Gemini 1.5 Flash Long Context Window
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
          <span>Progress</span>
          <span>{Math.round(job.progress)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 ease-out ${getStatusColor(job.status)}`}
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      {/* Steps Pipeline Visualizer */}
      <div className="grid grid-cols-3 gap-4 text-center text-xs font-semibold uppercase tracking-wider">
        <div className={`flex flex-col items-center space-y-2 ${getStepStatus(JobStatus.ANALYZING, job.status)}`}>
          <div className="w-2 h-2 rounded-full bg-current" />
          <span>Analyze</span>
        </div>
        <div className={`flex flex-col items-center space-y-2 ${getStepStatus(JobStatus.TRANSCRIBING, job.status)}`}>
          <div className="w-2 h-2 rounded-full bg-current" />
          <span>Transcribe</span>
        </div>
        <div className={`flex flex-col items-center space-y-2 ${getStepStatus(JobStatus.COMPLETED, job.status)}`}>
          <div className="w-2 h-2 rounded-full bg-current" />
          <span>Finish</span>
        </div>
      </div>

      {/* Info Box */}
      {job.status === JobStatus.TRANSCRIBING && (
        <div className="bg-slate-900/50 rounded-lg p-4 text-xs text-slate-400 border border-slate-800/50">
          <p className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span>Processing entire context stream. No semantic chunking required.</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProcessingStatus;