import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { HorizontalTabs } from './components/HorizontalTabs';
import { UploadTab } from './components/UploadTab';
import { SummariesTab } from './components/SummariesTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { SettingsTab } from './components/SettingsTab';
import { NotificationToast } from './components/NotificationToast';
import { LoginDialog } from './components/LoginDialog';
import { CrazyAnimatedBackground } from './components/CrazyAnimatedBackground';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { ExplosionEffect } from './components/ExplosionEffect';
import { useAppState } from './hooks/useAppState';

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const appState = useAppState();

  const handleViewSummary = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setActiveTab('summaries');
  };

  const handleViewAllSummaries = () => {
    setSelectedDocumentId(null);
    setActiveTab('summaries');
  };

  // Show login dialog if not authenticated
  if (!appState.isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CrazyAnimatedBackground />
        <LoginDialog 
          isOpen={true} 
          onLogin={appState.login}
        />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadTab 
          {...appState} 
          onViewSummary={handleViewSummary} 
          autoProcessing={appState.autoProcessing}
          processDocument={appState.processDocument}
        />;
      case 'summaries':
        return <SummariesTab 
          {...appState} 
          selectedDocumentId={selectedDocumentId} 
          onClearSelection={() => setSelectedDocumentId(null)}
          generateDocumentContent={appState.generateDocumentContent}
        />;
      case 'analytics':
        return <AnalyticsTab {...appState} />;
      case 'settings':
        return <SettingsTab 
          clearAllData={appState.clearAllData} 
          exportData={appState.exportData} 
          documents={appState.documents}
          darkMode={appState.darkMode}
          setDarkMode={appState.setDarkMode}
          userData={appState.userData}
          updateUserProfile={appState.updateUserProfile}
          autoProcessing={appState.autoProcessing}
          setAutoProcessing={appState.setAutoProcessing}
        />;
      default:
        return <UploadTab 
          {...appState} 
          onViewSummary={handleViewSummary}
          autoProcessing={appState.autoProcessing}
          processDocument={appState.processDocument}
        />;
    }
  };

  // Check if any document is processing OR if currently uploading
  const isProcessing = appState.isUploading || appState.documents.some(doc => 
    doc.status === 'processing' || 
    doc.status === 'uploading' || 
    (doc.progress > 0 && doc.progress < 100)
  );

  // Debug log
  console.log('Processing state:', { 
    isUploading: appState.isUploading, 
    isProcessing,
    documents: appState.documents.map(d => ({ name: d.name, status: d.status, progress: d.progress }))
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CrazyAnimatedBackground intensity={isProcessing ? 'extreme' : 'normal'} />
      
      {/* Content - completely hidden during processing */}
      {!isProcessing && (
      <div className="relative z-10 animate-fade-in">
        <TopBar 
          documents={appState.documents} 
          onViewSummary={handleViewSummary} 
          onViewAllSummaries={handleViewAllSummaries}
          userData={appState.userData}
          onUpdateProfile={appState.updateUserProfile}
          onLogout={appState.logout}
        />
        
        <div className="glass-card border-0 border-b border-white/5 sticky top-0 z-40 backdrop-blur-2xl">
          <HorizontalTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          />
        </div>
        
        <main className="p-8 overflow-auto fade-in">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>

        <NotificationToast notifications={appState.notifications} />
      </div>
      )}

      {/* Processing overlay */}
      <ProcessingOverlay isProcessing={isProcessing} />
      
      {/* CRAZY EXPLOSION EFFECT */}
      <ExplosionEffect isActive={isProcessing} />
    </div>
  );
}