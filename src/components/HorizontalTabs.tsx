import { 
  Upload, 
  FileText, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface HorizontalTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { 
    id: 'upload', 
    label: 'Upload', 
    icon: Upload, 
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
    iconColor: 'text-blue-600'
  },
  { 
    id: 'summaries', 
    label: 'Summaries', 
    icon: FileText, 
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-50 to-teal-50',
    iconColor: 'text-emerald-600'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-50',
    iconColor: 'text-purple-600'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-50',
    iconColor: 'text-orange-600'
  },
];

export function HorizontalTabs({ activeTab, setActiveTab }: HorizontalTabsProps) {
  return (
    <div className="px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-white/10 backdrop-blur-md shadow-lg border border-[#00ff88]/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/10 to-[#00d4ff]/10 rounded-xl" />
                )}
                
                <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#00ff88] to-[#00d4ff] shadow-lg shadow-[#00ff88]/50'
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-black' : 'text-gray-400'
                  }`} />
                </div>
                
                <span className={`relative z-10 font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}>
                  {tab.label}
                </span>
                
                {isActive && (
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-2 h-2 bg-gradient-to-r ${tab.color} rounded-full`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}