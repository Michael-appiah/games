import React from 'react';
import { useGame } from '../context/GameContext';

export default function BottomNav() {
  const { selections, setIsBetslipOpen, handleNextRound } = useGame();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-[48px] flex items-stretch z-30 select-none shadow-lg">
      {/* Next Round button */}
      <button
        onClick={handleNextRound}
        className="w-1/2 bg-[#212833] text-white font-bold text-[15px] flex items-center justify-center hover:bg-[#2A3442] active:bg-[#1B212B] transition-colors"
      >
        Next Round
      </button>

      {/* Betslip button */}
      <button
        onClick={() => setIsBetslipOpen(true)}
        className="w-1/2 bg-[#00A826] text-white font-bold text-[15px] flex items-center justify-center relative hover:bg-[#00B82B] active:bg-[#009622] transition-colors"
      >
        <span>Betslip</span>
        {selections.length > 0 && (
          <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#00A826] rounded-full text-[11px] font-extrabold leading-tight">
            {selections.length}
          </span>
        )}
      </button>
    </div>
  );
}
