import React from 'react';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onSearch?: (term: string) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  userEmail?: string;
  onOpenAdminPanel?: () => void;
  showAdminButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch: _onSearch,
  activeTab = 'Apps',
  onSelectTab,
  userEmail: _userEmail,
  onOpenAdminPanel,
  showAdminButton = false
}) => {
  const navTabs = ['Jogos', 'Apps', 'Livros', 'Crianças'];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Tabs */}
          <div className="flex items-center gap-6 md:gap-10">
            {/* Google Play Logo */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); if (onSelectTab) onSelectTab('Apps'); }}
              className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
            >
              <svg className="w-8 h-8 transition-transform group-hover:scale-105" viewBox="0 0 40 40" fill="none">
                <path d="M6 4.3v31.4c0 .8.5 1.5 1.2 1.8l17.4-17.5L7.2 2.5C6.5 2.8 6 3.5 6 4.3z" fill="#4285F4"/>
                <path d="M29.6 15.6l-5-5-17.4-8.1c-.8-.4-1.8-.2-2.3.4l17.3 17.5 7.4-4.8z" fill="#EA4335"/>
                <path d="M33.8 17.9l-4.2-2.3-5 5 5 5 4.2-2.3c1.5-.8 1.5-3.6 0-5.4z" fill="#FBBC04"/>
                <path d="M7.2 37.5l17.4-8.1 5-5-7.4-4.8L4.9 37.1c.5.6 1.5.8 2.3.4z" fill="#34A853"/>
              </svg>
              <span className="text-[21px] font-medium tracking-tight text-neutral-700">
                Google <span className="font-semibold text-neutral-800">Play</span>
              </span>
            </a>

            {/* Main Category Tabs */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => onSelectTab && onSelectTab(tab)}
                    className={`relative px-4 py-5 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive 
                        ? 'text-[#01875f] font-semibold' 
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#01875f] rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Admin Action (Visible ONLY in the admin link/mode) */}
          {showAdminButton && onOpenAdminPanel ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onOpenAdminPanel}
                title="Painel Admin (Link de Administrador)"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#01875f] text-white hover:bg-[#017252] text-xs font-semibold transition-all cursor-pointer shadow-xs animate-in fade-in"
              >
                <Settings className="w-3.5 h-3.5 text-white" />
                <span>Painel Admin</span>
              </button>
            </div>
          ) : null}

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center overflow-x-auto space-x-2 py-2 border-t border-neutral-100 no-scrollbar">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onSelectTab && onSelectTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#01875f]/10 text-[#01875f] font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
