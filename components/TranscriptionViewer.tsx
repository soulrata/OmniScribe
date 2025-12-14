import React from 'react';
import { Download, Copy, Check, FileText } from 'lucide-react';
import { downloadText } from '../utils/fileUtils';

interface TranscriptionViewerProps {
  content: string;
  fileName: string;
}

const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({ content, fileName }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadText(`${fileName.split('.')[0]}_transcript.md`, content);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{fileName}</h3>
            <p className="text-xs text-slate-500">Transcription Result</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <Download className="w-4 h-4" />
            <span>Export MD</span>
          </button>
        </div>
      </div>

      {/* Editor/Viewer Area */}
      <div className="flex-1 p-0 overflow-hidden relative">
        <textarea
          readOnly
          value={content}
          className="w-full h-full p-6 bg-slate-900 text-slate-300 font-mono text-sm resize-none focus:outline-none leading-relaxed"
          style={{ fontFamily: '"Fira Code", monospace' }}
        />
        {/* Fading overlay at bottom for style */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default TranscriptionViewer;