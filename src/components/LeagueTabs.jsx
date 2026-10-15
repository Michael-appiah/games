import React from 'react';
import { LEAGUES } from '../data/teamsData';
import { useGame } from '../context/GameContext';

export default function LeagueTabs() {
  const { selectedLeague, setSelectedLeague, setCurrentView, placedTicket } = useGame();

  return (
    <div className="bg-[#1F2630] h-[42px] px-2 flex items-center justify-between border-b border-[#283240] select-none">
      <div className="flex items-center space-x-1 sm:space-x-2 h-full flex-1 overflow-x-auto no-scrollbar">
        {LEAGUES.map(league => {
          const isActive = selectedLeague === league.id;
          return (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`relative px-3 h-full flex items-center justify-center text-[14px] transition-colors whitespace-nowrap ${
                isActive
                  ? 'text-white font-medium'
                  : 'text-[#9BA6B5] hover:text-white'
              }`}
            >
              <span>{league.name}</span>
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#00C853] rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center pl-2 space-x-3 text-[#5A687A]">
        <div className="w-[1px] h-[18px] bg-[#364253]" />
        <button
          onClick={() => {
            if (placedTicket) setCurrentView('open_bets');
          }}
          className="p-1 text-white hover:opacity-80 active:scale-95 transition-transform"
          title="Open Bets / History"
        >
          {/* Ticket Receipt Icon matching screenshot */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <line x1="8" y1="8" x2="16" y2="8" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="16" x2="13" y2="16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
