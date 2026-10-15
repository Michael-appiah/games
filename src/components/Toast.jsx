import React from 'react';
import { useGame } from '../context/GameContext';

export default function Toast() {
  const { toastMessage } = useGame();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none select-none">
      <div className="bg-[#242C38] border border-[#333E4E] text-white px-4 py-2.5 rounded shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[90%] pointer-events-auto">
        <span className="text-[13.5px] font-medium leading-snug">{toastMessage}</span>
        <div className="w-5 h-5 rounded-full bg-[#00C853] text-white flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm">
          ✓
        </div>
      </div>
    </div>
  );
}
