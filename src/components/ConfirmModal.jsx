import React from 'react';
import { useGame } from '../context/GameContext';

export default function ConfirmModal() {
  const { isConfirmOpen, setIsConfirmOpen, numericStake, handleConfirmPay } = useGame();

  if (!isConfirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-[1px] select-none">
      <div className="w-full max-w-[480px] mx-auto bg-[#1E2631] border-t border-[#2B3544] animate-in slide-in-from-bottom duration-200 shadow-2xl">
        {/* Title and Amount */}
        <div className="pt-6 pb-5 text-center px-4">
          <div className="text-[#A0AFC2] text-[15px] font-normal mb-1">
            Confirm to Pay
          </div>
          <div className="text-white text-[23px] font-bold tracking-tight">
            GHS {numericStake.toFixed(2)}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex h-[46px] w-full">
          <button
            onClick={() => setIsConfirmOpen(false)}
            className="flex-1 bg-[#212833] text-white font-medium text-[15px] hover:bg-[#2A3442] active:bg-[#1B212B] transition-colors flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPay}
            className="flex-1 bg-[#00A826] text-white font-semibold text-[15px] hover:bg-[#00B82B] active:bg-[#009622] transition-colors flex items-center justify-center"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
