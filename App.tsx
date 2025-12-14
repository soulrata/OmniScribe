import React, { useState, useEffect } from 'react';
import { Settings, Mic, Layout, Sparkles, Key } from 'lucide-react';
import DropZone from './components/DropZone';
import ProcessingStatus from './components/ProcessingStatus';
import TranscriptionViewer from './components/TranscriptionViewer';
import { GeminiService } from './services/geminiService';
import { fileToBase64, generateId } from './utils/fileUtils';
import { JobStatus, TranscriptionJob } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string>(process.env.API_KEY || '');
  const [showSettings, setShowSettings] = useState(false);
  const [currentJob, setCurrentJob] = useState<TranscriptionJob | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Ready');

  // Check for API Key on mount
  useEffect(() => {
    if (!apiKey) {
      setShowSettings(true);
    }
  }, []);

  const handleFileAccepted = async (file: File) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const newJob: TranscriptionJob = {
      id: generateId(),
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      status: JobStatus.ANALYZING,
      progress: 0,
      createdAt: Date.now(),
    };

    setCurrentJob(newJob);
    setStatusMessage('Analyzing audio file structure...');

    try {
      // Step 1: Analyze & Prepare
      // Simulate analysis time for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCurrentJob(prev => prev ? { ...prev, status: JobStatus.UPLOADING, progress: 10 } : null);
      setStatusMessage('Converting and Uploading...');

      // Convert to Base64 (Simulating the upload phase)
      const base64Data = await fileToBase64(file);
      
      setCurrentJob(prev => prev ? { ...prev, progress: 30, status: JobStatus.TRANSCRIBING } : null);
      setStatusMessage('Gemini is listening...');

      // Step 2: Transcribe via Gemini
      const geminiService = new GeminiService(apiKey);
      
      // We wrap this in a promise to simulate progress updates during the API call wait time
      // purely for UX, as the API doesn't stream progress percentage for non-streaming calls.
      let progressInterval = setInterval(() => {
        setCurrentJob(prev => {
          if (!prev || prev.progress >= 90) return prev;
          return { ...prev, progress: prev.progress + (Math.random() * 2) };
        });
      }, 500);

      const transcript = await geminiService.transcribeAudio(base64Data, file.type, (stage) => {
        setStatusMessage(stage);
      });

      clearInterval(progressInterval);

      // Step 3: Complete
      setCurrentJob(prev => prev ? {
        ...prev,
        status: JobStatus.COMPLETED,
        progress: 100,
        result: transcript
      } : null);
      setStatusMessage('Transcription Complete');

    } catch (error: any) {
      console.error(error);
      setCurrentJob(prev => prev ? {
        ...prev,
        status: JobStatus.ERROR,
        error: error.message
      } : null);
      setStatusMessage('Error during transcription');
    }
  };

  const resetJob = () => {
    setCurrentJob(null);
    setStatusMessage('Ready');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 fixed top-0 w-full z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
            OmniScribe <span className="font-light text-blue-400">Pro</span>
          </span>
        </div>
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col pt-24 pb-10 px-6 max-w-6xl mx-auto w-full h-screen">
        
        {/* API Key Modal / Settings Panel */}
        {showSettings && (
          <div className="mb-8 p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" />
              Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Google Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your key here..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Required for the Cloud Engine. Get one at <a href="https://aistudio.google.com/" target="_blank" className="text-blue-400 hover:underline">Google AI Studio</a>.
                </p>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {!currentJob ? (
            // Idle State
            <div className="flex-1 flex flex-col items-center justify-center space-y-12 fade-in">
              <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Transcription, <br/>
                  <span className="text-blue-500">Reimagined.</span>
                </h1>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Drop your long-form audio or video files here. 
                  Powered by Gemini 1.5 Flash for seamless, chunk-free processing of files up to 9 hours.
                </p>
              </div>
              
              <div className="w-full max-w-xl">
                <DropZone onFileAccepted={handleFileAccepted} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <Layout className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
                  <h4 className="font-medium text-slate-200">Long Context</h4>
                  <p className="text-xs text-slate-500 mt-1">No cutting sentences in half.</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                  <h4 className="font-medium text-slate-200">High Accuracy</h4>
                  <p className="text-xs text-slate-500 mt-1">Speaker ID & Timestamps.</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <Mic className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                  <h4 className="font-medium text-slate-200">Multi-Format</h4>
                  <p className="text-xs text-slate-500 mt-1">MP3, WAV, M4A, MP4.</p>
                </div>
              </div>
            </div>
          ) : (
            // Active Job State
            <div className="h-full flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {currentJob.status === JobStatus.COMPLETED ? (
                // Result View
                <div className="h-full flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                     <h2 className="text-xl font-semibold text-white">Transcription Result</h2>
                     <button onClick={resetJob} className="text-sm text-slate-400 hover:text-white transition-colors">
                       Start New Transcription
                     </button>
                  </div>
                  <div className="flex-1">
                    <TranscriptionViewer content={currentJob.result || ''} fileName={currentJob.fileName} />
                  </div>
                </div>
              ) : (
                // Progress View
                <div className="flex-1 flex flex-col items-center justify-center">
                   <ProcessingStatus job={currentJob} statusMessage={statusMessage} />
                   
                   {currentJob.status === JobStatus.ERROR && (
                      <button 
                        onClick={resetJob}
                        className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                   )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;