import React, { useState } from 'react';
import Header from './Header';
import { useGame } from '../context/GameContext';
import { TicketIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';

export default function OpenBetsView() {
  const { placedTicket, setCurrentView, handleKickOff } = useGame();
  const [showDetails, setShowDetails] = useState(false);

  if (!placedTicket) {
    return (
      <div className="flex-1 flex flex-col bg-[#141A22] select-none">
        <Header title="Instant Football" onBack={() => setCurrentView('lobby')} />
        <div className="p-6 text-center text-[#738194]">
          No open bets. Place a bet in the lobby.
        </div>
      </div>
    );
  }

  const matchSummary = placedTicket.selections
    .map(s => `${s.home} vs ${s.away}`)
    .join(', ');

  return (
    <div className="flex-1 flex flex-col bg-[#141A22] select-none min-h-screen pb-[60px]">
      <Header title="Instant Football" onBack={() => setCurrentView('lobby')} />

      {/* Subheader */}
      <div className="bg-[#1C232D] h-[44px] px-4 flex items-center justify-between border-b border-[#252E3B]">
        <div className="flex items-center space-x-2">
          <span className="text-white text-[15px] font-semibold">Open Bets</span>
          <span className="px-2 py-0.5 rounded-full bg-[#3B4656] text-white text-[12px] font-bold">
            1
          </span>
        </div>

        <button className="text-white hover:opacity-80">
          <TicketIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Ticket Card */}
      <div className="p-3">
        <div className="bg-[#1C232D] rounded-md p-3.5 border border-[#263140] space-y-3 shadow-md">
          {/* Ticket ID and Reload */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12.5px] text-[#7E8C9D]">
                Ticket ID: {placedTicket.id}
              </div>
              <div className="text-white text-[14px] font-semibold mt-0.5">
                {placedTicket.type}
              </div>
            </div>

            <button
              onClick={() => setCurrentView('lobby')}
              className="text-[#00E676] text-[13px] font-medium flex items-center space-x-1 hover:underline"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Reload Selections</span>
            </button>
          </div>

          {/* Matches line */}
          <div className="text-white text-[13.5px] font-medium">
            {matchSummary}
          </div>

          {/* Details toggle */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[#7E8C9D] hover:text-white text-[12.5px] flex items-center space-x-1"
            >
              <span>Match Details</span>
              {showDetails ? (
                <ChevronUpIcon className="w-3.5 h-3.5 text-[#7E8C9D]" />
              ) : (
                <ChevronDownIcon className="w-3.5 h-3.5 text-[#7E8C9D]" />
              )}
            </button>
          </div>

          {/* Collapsible Details */}
          {showDetails && (
            <div className="pt-2 border-t border-[#263140] space-y-2 text-[12.5px]">
              {placedTicket.selections.map((s, idx) => (
                <div key={idx} className="flex justify-between text-[#8E9BAC]">
                  <span>{s.home} vs {s.away} ({s.selectionLabel})</span>
                  <span className="text-white font-medium">{s.odd.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stake & Potential Win footer */}
          <div className="pt-2.5 border-t border-[#263140] flex justify-between items-center text-[13.5px]">
            <div>
              <span className="text-[#7E8C9D]">Stake </span>
              <span className="text-white font-bold">{placedTicket.stake}</span>
            </div>

            <div>
              <span className="text-[#7E8C9D]">Pot. Win </span>
              <span className="text-white font-bold">{placedTicket.potWin}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Split Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-[48px] flex items-stretch z-30 select-none shadow-lg">
        <button
          onClick={() => setCurrentView('lobby')}
          className="w-1/2 bg-[#212833] text-white font-bold text-[15px] flex items-center justify-center hover:bg-[#2A3442] active:bg-[#1B212B] transition-colors"
        >
          Keep Betting
        </button>

        <button
          onClick={handleKickOff}
          className="w-1/2 bg-[#00A826] text-white font-bold text-[15px] flex items-center justify-center hover:bg-[#00B82B] active:bg-[#009622] transition-colors"
        >
          Kick Off
        </button>
      </div>
    </div>
  );
}
