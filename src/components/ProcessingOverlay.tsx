import { Loader2 } from 'lucide-react';

interface ProcessingOverlayProps {
  isProcessing: boolean;
}

export function ProcessingOverlay({ isProcessing }: ProcessingOverlayProps) {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Processing indicator - Clean and centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-12 animate-scale-in px-8">
          {/* Massive spinning loader with crazy effects */}
          <div className="relative">
            <div className="w-48 h-48 mx-auto relative">
              {/* Multiple spinning rings */}
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#00ff88] border-r-[#00ff88]/50 animate-spin shadow-[0_0_50px_rgba(0,255,136,0.5)]"></div>
              <div className="absolute inset-4 rounded-full border-8 border-transparent border-t-[#00d4ff] border-r-[#00d4ff]/50 animate-spin-reverse shadow-[0_0_40px_rgba(0,212,255,0.5)]"></div>
              <div className="absolute inset-8 rounded-full border-8 border-transparent border-t-[#ff00ff] border-r-[#ff00ff]/50 animate-spin shadow-[0_0_30px_rgba(255,0,255,0.5)]" style={{ animationDuration: '0.6s' }}></div>
              
              {/* Center icon with glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-[#00ff88] animate-pulse drop-shadow-[0_0_20px_rgba(0,255,136,1)]" strokeWidth={3} />
                  <div className="absolute inset-0 bg-[#00ff88] rounded-full blur-2xl opacity-50 animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Text with better spacing and shadows */}
          <div className="space-y-6 bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-[#00ff88]/30">
            <h2 className="text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(0,255,136,0.8)] animate-pulse leading-tight">
              Processing
            </h2>
            <p className="text-2xl text-[#00ff88] drop-shadow-[0_0_20px_rgba(0,255,136,0.6)] font-semibold">
              AI is analyzing your document...
            </p>
            
            {/* Animated progress dots */}
            <div className="flex justify-center space-x-3 pt-4">
              <div className="w-4 h-4 bg-[#00ff88] rounded-full animate-bounce shadow-[0_0_20px_rgba(0,255,136,0.8)]" style={{ animationDelay: '0s' }}></div>
              <div className="w-4 h-4 bg-[#00d4ff] rounded-full animate-bounce shadow-[0_0_20px_rgba(0,212,255,0.8)]" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-4 h-4 bg-[#ff00ff] rounded-full animate-bounce shadow-[0_0_20px_rgba(255,0,255,0.8)]" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
