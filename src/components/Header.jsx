import React from 'react';
import { useGame } from '../context/GameContext';

export default function Header({ title = 'Instant Football', showBack = true, onBack }) {
  const { balance, formatCurrency, currentView, setCurrentView } = useGame();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (currentView !== 'lobby') {
      setCurrentView('lobby');
    }
  };

  return (
    <header className="bg-[#E51B24] h-[48px] px-3 flex items-center justify-between text-white select-none sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-3">
        {showBack && (
          <button
            onClick={handleBackClick}
            className="p-1 -ml-1 text-white hover:opacity-80 active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 stroke-current stroke-[2.5]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        )}
        <h1 className="text-[17px] font-medium tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center space-x-1">
        <span className="text-[15px] font-medium tracking-wide">
          GHS {formatCurrency(balance)}
        </span>
      </div>
    </header>
  );
}
