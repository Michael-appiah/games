import React from 'react';
import { useGame } from '../context/GameContext';
import {
  SoccerBallIcon,
  ChevronDownIcon,
  RemoveAllIcon,
  SettingsIcon,
  InfoCircleIcon,
  CloseIcon
} from './Icons';

export default function BetslipModal() {
  const {
    isBetslipOpen,
    setIsBetslipOpen,
    balance,
    formatCurrency,
    selections,
    removeSelection,
    removeAllSelections,
    betslipType,
    setBetslipType,
    stake,
    setStake,
    numericStake,
    formattedOdds,
    maxBonus,
    potentialWin,
    handlePlaceBetClick
  } = useGame();

  if (!isBetslipOpen) return null;

  const isBalanceExceeded = numericStake > balance;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-[1px] select-none">
      <div className="w-full max-w-[480px] mx-auto bg-[#181E26] rounded-t-xl flex flex-col max-h-[92vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Chevron pull handle */}
        <div
          onClick={() => setIsBetslipOpen(false)}
          className="w-full pt-2.5 pb-1 flex justify-center cursor-pointer hover:opacity-80"
        >
          <ChevronDownIcon className="w-6 h-6 text-white stroke-[2.5]" />
        </div>

        {/* Betslip Header */}
        <div className="px-3 pb-2.5 flex items-center justify-between border-b border-[#242D38]">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-[#00C853] text-white text-[12px] font-bold flex items-center justify-center">
              {selections.length}
            </span>
            <span className="text-white text-[17px] font-semibold tracking-tight">Betslip</span>
          </div>

          <div className="text-[15px] font-medium text-[#FFD700]">
            GHS {formatCurrency(balance)}
          </div>
        </div>

        {/* Sub Header Actions */}
        <div className="px-3 py-2 flex items-center justify-between text-[13px] border-b border-[#242D38] text-[#8E9BAC]">
          <button
            onClick={removeAllSelections}
            className="flex items-center space-x-1.5 hover:text-white transition-colors"
          >
            <RemoveAllIcon className="w-3.5 h-3.5 text-[#8E9BAC]" />
            <span>Remove All</span>
          </button>

          <button className="flex items-center space-x-1.5 hover:text-white transition-colors">
            <span>Bet Settings</span>
            <SettingsIcon className="w-3.5 h-3.5 text-[#8E9BAC]" />
          </button>
        </div>

        {/* Single / Multiple / System Tabs */}
        <div className="px-3 pt-2.5 flex space-x-1.5 bg-[#141A22]">
          {['Single', 'Multiple', 'System'].map(type => {
            const isActive = betslipType === type;
            return (
              <button
                key={type}
                onClick={() => setBetslipType(type)}
                className={`flex-1 py-1.5 text-[13.5px] font-medium rounded-t-md transition-colors ${
                  isActive
                    ? 'bg-[#181E26] text-white font-semibold'
                    : 'bg-[#212833] text-[#828F9F] hover:text-white'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Scrollable Selections Content */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 divide-y divide-[#242D38]">
          {selections.length === 0 ? (
            <div className="py-12 text-center text-[#738194] text-[14px]">
              Your betslip is empty. Select odds from the matches to place a bet.
            </div>
          ) : (
            selections.map(sel => (
              <div key={`${sel.fixtureId}-${sel.selection}`} className="pt-2.5 first:pt-0">
                <div className="flex items-center justify-between text-[14px]">
                  <div className="flex items-center space-x-1.5 text-white font-semibold">
                    <SoccerBallIcon className="w-4 h-4 text-white" />
                    <span>{sel.selectionLabel}</span>
                  </div>
                  <span className="text-white font-bold text-[14.5px]">{sel.odd.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-[12.5px] text-[#8694A5] mt-0.5">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => removeSelection(sel.fixtureId, sel.selection)}
                      className="text-[#687687] hover:text-white p-0.5"
                    >
                      <CloseIcon className="w-3 h-3 text-[#7A889A]" />
                    </button>
                    <span className="text-white/90 font-medium">{sel.home} vs {sel.away}</span>
                  </div>
                  <span className="text-[#6B798A]">{sel.market}</span>
                </div>
              </div>
            ))
          )}

          {/* Bonus Boost Banner */}
          {selections.length > 0 && (
            <div className="pt-3">
              <div className="bg-[#0E2818] border border-[#144A26] rounded-md px-3 py-2 flex items-center space-x-2 text-[12px] text-[#00E676]">
                <div className="w-1.5 h-3.5 bg-[#00E676] rounded-full shrink-0" />
                <span className="font-medium">Add more qualifying selections to boost your bonus</span>
              </div>
            </div>
          )}

          {/* Stake Input Row */}
          {selections.length > 0 && (
            <div className="pt-3 pb-1">
              <div className="flex items-center justify-between">
                <span className="text-white text-[14px] font-semibold">Total Stake</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold text-[14px]">GHS</span>
                  <input
                    type="number"
                    value={stake}
                    onChange={e => setStake(e.target.value)}
                    className={`w-[90px] h-[36px] bg-[#141A22] text-white text-right px-2.5 rounded text-[15px] font-bold focus:outline-none transition-colors ${
                      isBalanceExceeded
                        ? 'border border-[#E51B24] text-white'
                        : 'border border-[#2C3644] focus:border-[#00C853]'
                    }`}
                  />
                </div>
              </div>

              {isBalanceExceeded && (
                <div className="text-[#E51B24] text-[11.5px] text-right mt-1 font-medium">
                  Please enter a value less than your balance.
                </div>
              )}
            </div>
          )}

          {/* SportyInsure Section */}
          {selections.length > 0 && (
            <div className="pt-2 pb-1 flex items-center justify-between text-[12.5px]">
              <div className="flex items-center space-x-1.5">
                <span className="px-2 py-0.5 bg-[#1565C0] text-white font-bold rounded-[2px] text-[11px]">
                  SportyInsure
                </span>
                <InfoCircleIcon className="w-3.5 h-3.5 text-[#738194]" />
              </div>

              <div className="flex items-center space-x-4 text-[#8C9AA9]">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded bg-[#141A22] border-[#2C3644] text-[#00A826]" />
                  <span className="font-bold text-[#4B79A1]">F</span>
                  <span>Flexi</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded bg-[#141A22] border-[#2C3644] text-[#00A826]" />
                  <span className="font-bold text-[#4B79A1]">1</span>
                  <span>One Cut</span>
                </label>
              </div>
            </div>
          )}

          {/* Odds & Calculations Summary */}
          {selections.length > 0 && (
            <div className="pt-2 space-y-1.5 text-[13.5px]">
              <div className="flex justify-between text-white">
                <span className="font-semibold">Total Odds</span>
                <span className="font-bold">{formattedOdds}</span>
              </div>

              <div className="flex justify-between text-white">
                <span className="font-semibold">Max Bonus</span>
                <span className="font-bold">{maxBonus}</span>
              </div>

              {/* Potential Win Highlight Banner */}
              <div className="bg-[#0C2B16] rounded px-2.5 py-2 flex justify-between items-center text-white font-bold mt-2">
                <span>Potential Win</span>
                <span className="text-[15px]">{potentialWin}</span>
              </div>
            </div>
          )}
        </div>

        {/* Place Bet Action Button */}
        <div className="p-3 bg-[#141A22] border-t border-[#242D38]">
          <button
            disabled={selections.length === 0 || isBalanceExceeded || numericStake <= 0}
            onClick={handlePlaceBetClick}
            className={`w-full py-3 rounded text-center transition-colors font-bold ${
              selections.length > 0 && !isBalanceExceeded && numericStake > 0
                ? 'bg-[#00A826] hover:bg-[#00B82B] text-white active:scale-[0.99]'
                : 'bg-[#3A4554] text-[#8694A5] cursor-not-allowed'
            }`}
          >
            <div className="text-[15px] leading-tight">Place Bet</div>
            <div className="text-[11px] font-normal opacity-90">
              About to pay {numericStake.toFixed(2)}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
