import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export default function UIChecker({ children }) {
  const { currentView, setCurrentView, isBetslipOpen, setIsBetslipOpen, isConfirmOpen, setIsConfirmOpen } = useGame();
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeRef, setActiveRef] = useState('main');
  const [opacity, setOpacity] = useState(50);
  const [blendMode, setBlendMode] = useState('normal'); // normal | difference | multiply
  const [viewMode, setViewMode] = useState('overlay'); // overlay | side-by-side

  const refImages = {
    main: { name: 'Main Lobby', src: '/ui/main.jpg', view: 'lobby' },
    betslip: { name: 'Betslip Modal', src: '/ui/process/betslip_ui.jpg', view: 'lobby', openBetslip: true },
    confirm: { name: 'Confirm to Pay', src: '/ui/process/confirm_to_pay.jpg', view: 'lobby', openConfirm: true },
    open_bets: { name: 'Open Bets / Ticket', src: '/ui/process/about_to_pay_slip.jpg', view: 'open_bets' },
    simulation: { name: '2D Pitch Game', src: '/ui/process/game_ui.jpg', view: 'simulation' },
    results: { name: 'Results Screen', src: '/ui/process/results.jpg', view: 'results' }
  };

  const handleSelectRef = (key) => {
    setActiveRef(key);
    const target = refImages[key];
    if (target.view) setCurrentView(target.view);
    if (target.openBetslip) setIsBetslipOpen(true);
    if (target.openConfirm) setIsConfirmOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0E12] flex flex-col items-center">
      {/* Top Floating UI Checker Control Bar */}
      <div className="w-full bg-[#1A222D] border-b border-[#2C3746] py-2 px-3 flex flex-wrap items-center justify-between text-white text-[12.5px] z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`px-2.5 py-1 rounded font-bold text-[12px] transition-colors ${
              isEnabled
                ? 'bg-[#E51B24] text-white shadow'
                : 'bg-[#2E3B4E] text-[#B0C0D4] hover:text-white'
            }`}
          >
            {isEnabled ? '🔴 UI Checker Active' : '🔍 Enable UI Checker'}
          </button>

          {isEnabled && (
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
              {Object.entries(refImages).map(([k, item]) => (
                <button
                  key={k}
                  onClick={() => handleSelectRef(k)}
                  className={`px-2 py-0.5 rounded text-[11.5px] whitespace-nowrap transition-colors ${
                    activeRef === k
                      ? 'bg-[#00C853] text-white font-semibold'
                      : 'bg-[#232D3B] text-[#8EA0B5] hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {isEnabled && (
          <div className="flex items-center space-x-3 mt-1 sm:mt-0">
            {/* Opacity slider */}
            <div className="flex items-center space-x-1.5 text-[#B0C0D4]">
              <span>Overlay:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={e => setOpacity(Number(e.target.value))}
                className="w-20 h-1.5 bg-[#3B485A] rounded-lg appearance-none cursor-pointer accent-[#00C853]"
              />
              <span className="w-7 text-right font-mono text-[11px]">{opacity}%</span>
            </div>

            {/* View mode toggle */}
            <div className="flex rounded bg-[#232D3B] p-0.5 border border-[#334255]">
              <button
                onClick={() => setViewMode('overlay')}
                className={`px-1.5 py-0.5 text-[11px] rounded ${
                  viewMode === 'overlay' ? 'bg-[#00C853] text-white font-medium' : 'text-[#8EA0B5]'
                }`}
              >
                Overlay
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-1.5 py-0.5 text-[11px] rounded ${
                  viewMode === 'side-by-side' ? 'bg-[#00C853] text-white font-medium' : 'text-[#8EA0B5]'
                }`}
              >
                Side-by-Side
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex justify-center items-start p-0 sm:p-4 overflow-x-auto">
        {isEnabled && viewMode === 'side-by-side' ? (
          <div className="flex flex-col md:flex-row gap-4 items-start justify-center max-w-5xl w-full">
            {/* Original Reference Screenshot */}
            <div className="flex flex-col items-center">
              <div className="text-[12px] font-bold text-[#E51B24] mb-1 bg-[#1A222D] px-3 py-0.5 rounded border border-[#E51B24]/30">
                Original Reference Image
              </div>
              <div className="w-[360px] max-w-[360px] rounded-lg overflow-hidden border border-[#334255] shadow-2xl bg-black">
                <img
                  src={refImages[activeRef].src}
                  alt="Reference"
                  className="w-full h-auto block object-top"
                />
              </div>
            </div>

            {/* Live Rendered App */}
            <div className="flex flex-col items-center">
              <div className="text-[12px] font-bold text-[#00C853] mb-1 bg-[#1A222D] px-3 py-0.5 rounded border border-[#00C853]/30">
                Live Rendered App
              </div>
              <div className="w-[360px] max-w-[360px] rounded-lg overflow-hidden border border-[#334255] shadow-2xl bg-[#151B22]">
                {children}
              </div>
            </div>
          </div>
        ) : (
          /* Overlay Mode or Normal Mode */
          <div className="relative w-full max-w-[480px] min-h-screen bg-[#151B22] shadow-2xl sm:rounded-lg overflow-hidden border-x border-[#283240]">
            {/* Rendered Live UI */}
            <div className="relative z-10 w-full min-h-full">
              {children}
            </div>

            {/* Overlay Reference Image with Opacity */}
            {isEnabled && viewMode === 'overlay' && (
              <div
                className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-75"
                style={{
                  opacity: opacity / 100,
                  mixBlendMode: blendMode
                }}
              >
                <img
                  src={refImages[activeRef].src}
                  alt="Reference Overlay"
                  className="w-full h-auto block object-top"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
