import { useState, useRef } from 'react';
import { Upload, FileText, Download, Clock, CheckCircle, AlertCircle, Loader2, Eye, Play, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Document } from '../hooks/useAppState';

interface UploadTabProps {
  documents: Document[];
  isUploading: boolean;
  uploadFiles: (files: FileList) => Promise<void>;
  onViewSummary: (documentId: string) => void;
  autoProcessing?: boolean;
  processDocument?: (documentId: string) => Promise<void>;
}

export function UploadTab({ 
  documents, 
  isUploading, 
  uploadFiles, 
  onViewSummary, 
  autoProcessing = true,
  processDocument 
}: UploadTabProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleManualProcess = async (documentId: string) => {
    if (processDocument) {
      await processDocument(documentId);
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const pendingDocuments = documents.filter(d => d.status === 'uploading' && d.progress === 100 && !autoProcessing);
  const recentUploads = documents.slice(-8).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bounce-in">
        <h1 className="text-6xl font-bold text-white mb-3 tracking-tight float-crazy">
          Upload Documents
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-lg">
            Drop your files and watch the magic happen
          </p>
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <Badge variant={autoProcessing ? "default" : "secondary"} className="flex items-center space-x-1">
              {autoProcessing ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto Processing</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Manual Processing</span>
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Processing Status Alert */}
      {!autoProcessing && pendingDocuments.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-orange-900 dark:text-orange-200">Documents Ready for Processing</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {pendingDocuments.length} document{pendingDocuments.length !== 1 ? 's' : ''} uploaded and waiting for manual processing
                  </p>
                </div>
              </div>
              <Button
                onClick={() => pendingDocuments.forEach(doc => handleManualProcess(doc.id))}
                className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Process All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black backdrop-blur-xl border-4 border-[#00ff88] hover-lift group neon-glow slide-in-left shadow-[0_0_50px_rgba(0,255,136,0.6)] hover:shadow-[0_0_80px_rgba(0,255,136,0.8)] transition-all duration-500">
          <CardContent className="p-8">
            <div className="inline-block bg-black px-6 py-3 rounded-2xl mb-3">
              <div className="text-7xl font-black text-white scale-pulse drop-shadow-[0_0_40px_rgba(255,255,255,1)]">{documents.length}</div>
            </div>
            <p className="text-base text-white uppercase tracking-wider font-black drop-shadow-[0_0_20px_rgba(255,255,255,1)]">Total Uploads</p>
            <div className="mt-4 h-2 w-16 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-full group-hover:w-full transition-all duration-500 shadow-[0_0_20px_rgba(0,255,136,1)]"></div>
          </CardContent>
        </Card>
        <Card className="bg-black backdrop-blur-xl border-4 border-[#00ff88] hover-lift group neon-glow slide-in-left shadow-[0_0_50px_rgba(0,255,136,0.6)] hover:shadow-[0_0_80px_rgba(0,255,136,0.8)] transition-all duration-500" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-8">
            <div className="inline-block bg-black px-6 py-3 rounded-2xl mb-3">
              <div className="text-7xl font-black text-[#00ff88] wiggle drop-shadow-[0_0_40px_rgba(0,255,136,1)]">
                {documents.filter(d => d.status === 'completed').length}
              </div>
            </div>
            <p className="text-base text-white uppercase tracking-wider font-black drop-shadow-[0_0_20px_rgba(255,255,255,1)]">Processed</p>
            <div className="mt-4 h-2 w-16 bg-[#00ff88] rounded-full group-hover:w-full transition-all duration-500 shadow-[0_0_20px_rgba(0,255,136,1)]"></div>
          </CardContent>
        </Card>
        <Card className="bg-black backdrop-blur-xl border-4 border-[#00d4ff] hover-lift group slide-in-right shadow-[0_0_50px_rgba(0,212,255,0.6)] hover:shadow-[0_0_80px_rgba(0,212,255,0.8)] transition-all duration-500">
          <CardContent className="p-8">
            <div className="inline-block bg-black px-6 py-3 rounded-2xl mb-3">
              <div className="text-7xl font-black text-[#00d4ff] scale-pulse drop-shadow-[0_0_40px_rgba(0,212,255,1)]">
                {documents.filter(d => d.status === 'processing').length}
              </div>
            </div>
            <p className="text-base text-white uppercase tracking-wider font-black drop-shadow-[0_0_20px_rgba(255,255,255,1)]">Processing</p>
            <div className="mt-4 h-2 w-16 bg-[#00d4ff] rounded-full group-hover:w-full transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,1)]"></div>
          </CardContent>
        </Card>
        <Card className="bg-black backdrop-blur-xl border-4 border-[#ff00ff] hover-lift group slide-in-right shadow-[0_0_50px_rgba(255,0,255,0.6)] hover:shadow-[0_0_80px_rgba(255,0,255,0.8)] transition-all duration-500" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-8">
            <div className="inline-block bg-black px-6 py-3 rounded-2xl mb-3">
              <div className="text-7xl font-black text-white float-crazy drop-shadow-[0_0_40px_rgba(255,255,255,1)]">
                {isUploading ? 'Active' : 'Ready'}
              </div>
            </div>
            <p className="text-base text-white uppercase tracking-wider font-black drop-shadow-[0_0_20px_rgba(255,255,255,1)]">Status</p>
            <div className="mt-4 h-2 w-16 bg-gradient-to-r from-[#ff00ff] to-[#00ff88] rounded-full group-hover:w-full transition-all duration-500 shadow-[0_0_20px_rgba(255,0,255,1)]"></div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Card */}
      <Card className="bg-black/20 backdrop-blur-md border-2 border-[#00ff88]/40 hover:border-[#00ff88] overflow-hidden hover-lift bounce-in shadow-[0_0_40px_rgba(0,255,136,0.3)] hover:shadow-[0_0_60px_rgba(0,255,136,0.5)] transition-all duration-500">
        <CardContent className="p-12">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            onDrop={handleDrop}
            className={`border-4 border-dashed rounded-3xl p-16 text-center transition-all duration-500 relative overflow-hidden ${
              dragOver
                ? 'border-[#00ff88] bg-[#00ff88]/10 scale-[1.02] shadow-[0_0_80px_rgba(0,255,136,0.6)]'
                : 'border-[#00ff88]/30 hover:border-[#00ff88]/60 hover:bg-[#00ff88]/5'
            }`}
          >
            {dragOver && (
              <div className="absolute inset-0 bg-[#00ff88]/20 animate-pulse"></div>
            )}
            <div className="space-y-6 relative z-10">
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 ${
                dragOver ? 'bg-[#00ff88]/20 scale-110 rotate-12' : isUploading ? 'bg-[#00d4ff]/20 animate-pulse' : 'bg-white/5'
              }`}>
                {isUploading ? (
                  <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin" strokeWidth={2.5} />
                ) : (
                  <Upload className={`w-12 h-12 transition-all duration-500 ${
                    dragOver ? 'text-[#00ff88] scale-110' : 'text-gray-400'
                  }`} strokeWidth={2} />
                )}
              </div>
              
              <div>
                <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,1)]">
                  {isUploading ? 'Processing Documents...' : dragOver ? 'Drop it like it\'s hot!' : 'Drop your files here'}
                </h3>
                <p className="text-white text-xl mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                  {isUploading ? 'Analyzing your documents with AI' : 'or click to browse your computer'}
                </p>
                
                {!isUploading && (
                  <Button 
                    onClick={handleFileUpload}
                    className="!bg-white hover:!bg-white/90 !text-black !font-bold !px-8 !py-6 !text-lg !rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] transition-all duration-300 hover:scale-105 !border-0"
                    disabled={isUploading}
                    style={{ backgroundColor: 'white', color: 'black' }}
                  >
                    Choose Files
                  </Button>
                )}
              </div>
              
              <div className="text-base text-white space-y-3 pt-6 border-t-2 border-[#00ff88]/30">
                <p className="flex items-center justify-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  <FileText className="w-5 h-5 text-[#00ff88]" />
                  <span className="font-semibold">PDF, DOC, DOCX, TXT, RTF</span>
                </p>
                <p className="flex items-center justify-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  <Download className="w-5 h-5 text-[#00d4ff]" />
                  <span className="font-semibold">Max 50MB per file</span>
                </p>
                <p className="flex items-center justify-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  <Clock className="w-5 h-5 text-[#ff00ff]" />
                  <span className="font-semibold">
                    {autoProcessing 
                      ? '30-60 seconds processing time' 
                      : 'Manual processing mode'
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.rtf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card className="bg-black/60 backdrop-blur-xl border-2 border-[#00d4ff]/30 hover:border-[#00d4ff] hover-lift fade-in shadow-[0_0_40px_rgba(0,212,255,0.3)] hover:shadow-[0_0_60px_rgba(0,212,255,0.5)] transition-all duration-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">Recent Uploads</span>
            {recentUploads.length > 0 && (
              <Badge className="bg-[#00d4ff]/20 text-[#00d4ff] border-2 border-[#00d4ff]/50 px-4 py-2 text-base font-bold shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                {recentUploads.length} files
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {recentUploads.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 text-[#00d4ff] drop-shadow-[0_0_20px_rgba(0,212,255,0.8)]" />
              <p className="text-lg text-white">No uploads yet. Start by uploading your first document!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentUploads.map((file) => (
                <div key={file.id} className="group flex items-center justify-between p-5 bg-black/40 rounded-xl border-2 border-[#00d4ff]/20 hover:border-[#00d4ff] hover:bg-black/60 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_40px_rgba(0,212,255,0.4)]">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88]/20 to-[#00d4ff]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-[#00ff88]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate text-lg">{file.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{new Date(file.uploadDate).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <div className="w-24">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{file.progress}%</p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <Badge className={getStatusColor(file.status)}>
                        {file.status}
                      </Badge>
                    </div>
                    
                    {/* Manual Processing Button */}
                    {!autoProcessing && file.status === 'uploading' && file.progress === 100 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-orange-600 hover:text-orange-800 border-orange-300 hover:border-orange-400"
                        onClick={() => handleManualProcess(file.id)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Process
                      </Button>
                    )}
                    
                    {file.status === 'completed' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#00ff88] hover:text-[#00ff88] hover:bg-[#00ff88]/10 border border-[#00ff88]/30 hover:border-[#00ff88] transition-all duration-300"
                        onClick={() => onViewSummary(file.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Summary
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}