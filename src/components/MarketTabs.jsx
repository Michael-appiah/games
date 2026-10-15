import React from 'react';
import { useGame } from '../context/GameContext';

export default function MarketTabs() {
  const { selectedMarket, setSelectedMarket } = useGame();

  const markets = [
    { id: '1X2', label: '1X2' },
    { id: 'OU', label: 'O/U' },
    { id: 'DC', label: 'Double Chance' }
  ];

  return (
    <div className="bg-[#181E26] h-[46px] px-3 flex items-center justify-between border-b border-[#232B36] select-none">
      {/* Bet Builder pill button on left */}
      <button className="h-[28px] px-3 rounded-full border border-[#00C853] flex items-center space-x-1 text-[#00E676] text-[13px] font-medium active:scale-95 transition-transform">
        <span>Bet Builder</span>
        <span className="w-3.5 h-3.5 rounded-full border border-[#00C853] text-[10px] flex items-center justify-center -mr-0.5">
          ?
        </span>
      </button>

      {/* Market selection tabs */}
      <div className="flex items-center space-x-4 sm:space-x-6 h-full">
        {markets.map(m => {
          const isActive = selectedMarket === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMarket(m.id)}
              className={`relative h-full flex items-center justify-center text-[14px] transition-colors whitespace-nowrap ${
                isActive ? 'text-white font-medium' : 'text-[#8D9AA8] hover:text-white'
              }`}
            >
              <span>{m.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00C853] rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
