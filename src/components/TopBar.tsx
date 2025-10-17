import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { NotificationPanel } from './NotificationPanel';
import { SearchDialog } from './SearchDialog';
import { UserProfileDialog } from './UserProfileDialog';
import { Document } from '../hooks/useAppState';
import { UserData } from './LoginDialog';

interface TopBarProps {
  documents: Document[];
  onViewSummary: (documentId: string) => void;
  onViewAllSummaries?: () => void;
  userData: UserData | null;
  onUpdateProfile: (userData: UserData) => void;
  onLogout: () => void;
}

export function TopBar({ 
  documents, 
  onViewSummary, 
  onViewAllSummaries, 
  userData,
  onUpdateProfile,
  onLogout 
}: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  const handleSearchDocument = (documentId: string) => {
    onViewSummary(documentId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <header className="glass-card border-0 border-b border-white/5 px-8 py-5 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-[#00ff88] to-[#00d4ff] rounded-lg flex items-center justify-center shadow-lg hover-lift wiggle neon-glow">
              <FileText className="w-6 h-6 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight gradient-text">
                DocuMind
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">AI Document Analysis</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 group-hover:text-[#00ff88] transition-colors" />
              <Input
                type="text"
                placeholder="Search documents, summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchClick}
                onClick={handleSearchClick}
                className="pl-12 pr-4 h-11 bg-white/5 border border-white/10 focus:border-[#00ff88]/50 focus:ring-2 focus:ring-[#00ff88]/20 transition-all duration-300 cursor-pointer hover:bg-white/8 text-white placeholder:text-gray-500 rounded-lg"
                readOnly
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationPanel 
              documents={documents} 
              onViewSummary={onViewSummary} 
              onViewAllSummaries={onViewAllSummaries}
            />

            {/* User Profile */}
            <div className="flex items-center space-x-4 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="font-semibold text-white text-sm">{userData?.username || 'User'}</p>
                <div className="flex items-center justify-end space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{userData?.role || 'Premium'}</p>
                </div>
              </div>
              <Avatar 
                className="w-11 h-11 ring-2 ring-white/10 shadow-lg cursor-pointer hover:ring-[#00ff88]/50 transition-all hover-lift"
                onClick={handleProfileClick}
              >
                <AvatarFallback className="bg-gradient-to-br from-[#00ff88] to-[#00d4ff] text-black font-bold text-base">
                  {getInitials(userData?.username || 'User')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        documents={documents}
        onSelectDocument={handleSearchDocument}
      />

      {/* User Profile Dialog */}
      {userData && (
        <UserProfileDialog
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userData={userData}
          onUpdateProfile={onUpdateProfile}
          onLogout={onLogout}
        />
      )}
    </>
  );
}