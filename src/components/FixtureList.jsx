import React from 'react';
import { TEAMS, LEAGUES } from '../data/teamsData';
import { useGame } from '../context/GameContext';

// Star rating renderer with 5 total slots (biased gold filled stars + dark grey unfilled stars)
function StarRating({ count = 5 }) {
  const total = 5;
  const filled = Math.min(Math.max(count, 0), total);
  
  return (
    <div className="flex items-center text-[10px] space-x-[1.5px] leading-none">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={i < filled ? 'text-[#FFB800]' : 'text-[#364253]'}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function FixtureList() {
  const { selectedLeague, fixtures, selections, toggleSelection } = useGame();

  const currentLeagueObj = LEAGUES.find(l => l.id === selectedLeague) || LEAGUES[0];
  const leagueFixtures = fixtures[selectedLeague] || [];

  return (
    <div className="flex-1 overflow-y-auto bg-[#131920] pb-24 select-none">
      {/* League Subheader */}
      <div className="bg-[#242C37] h-[34px] px-3 flex items-center justify-between border-b border-[#2C3644] sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <img
            src={currentLeagueObj.flag}
            alt={currentLeagueObj.name}
            className="w-[18px] h-[18px] rounded-full object-cover"
          />
          <span className="text-white text-[14px] font-medium">
            {currentLeagueObj.name}
          </span>
        </div>

        {/* Column odds headers */}
        <div className="flex items-center space-x-1.5 w-[174px] text-[#8693A3] text-[13px] font-normal text-center">
          <div className="w-[54px]">1</div>
          <div className="w-[54px]">X</div>
          <div className="w-[54px]">2</div>
        </div>
      </div>

      {/* Fixture rows */}
      <div className="divide-y divide-[#1D242E]">
        {leagueFixtures.map(fix => {
          const homeTeam = TEAMS[fix.home] || { name: fix.home, code: fix.home, stars: 3, logo: '' };
          const awayTeam = TEAMS[fix.away] || { name: fix.away, code: fix.away, stars: 3, logo: '' };

          const is1Selected = selections.some(s => s.fixtureId === fix.id && s.selection === '1');
          const isXSelected = selections.some(s => s.fixtureId === fix.id && s.selection === 'X');
          const is2Selected = selections.some(s => s.fixtureId === fix.id && s.selection === '2');

          return (
            <div
              key={fix.id}
              className="px-3 py-2.5 flex items-center justify-between hover:bg-[#18202A] transition-colors"
            >
              {/* Teams & Info */}
              <div className="flex flex-col justify-center flex-1 pr-2 min-w-0">
                {/* Team Logos & Codes */}
                <div className="flex items-center space-x-1.5 text-white">
                  <img
                    src={homeTeam.logo}
                    alt={homeTeam.code}
                    className="w-[20px] h-[20px] object-contain shrink-0"
                  />
                  <span className="font-semibold text-[13.5px] tracking-tight">{homeTeam.code}</span>
                  <span className="text-[11px] text-[#6A788A] px-0.5">vs</span>
                  <span className="font-semibold text-[13.5px] tracking-tight">{awayTeam.code}</span>
                  <img
                    src={awayTeam.logo}
                    alt={awayTeam.code}
                    className="w-[20px] h-[20px] object-contain shrink-0"
                  />
                </div>

                {/* Biased 5-slot Stars under each team */}
                <div className="flex items-center space-x-6 mt-0.5">
                  <StarRating count={homeTeam.stars} />
                  <StarRating count={awayTeam.stars} />
                </div>

                <div className="text-[11px] text-[#717E91] font-normal mt-0.5 flex items-center space-x-1">
                  <span>+{fix.moreCount || 71}</span>
                  <span className="text-[9px]">&gt;</span>
                </div>
              </div>

              {/* 1 X 2 Odds Buttons */}
              <div className="flex items-center space-x-1.5 shrink-0">
                {/* 1 */}
                <button
                  onClick={() => toggleSelection(fix, '1', fix.odds['1'])}
                  className={`w-[54px] h-[36px] rounded-[3px] flex items-center justify-center text-[13.5px] font-medium transition-all active:scale-95 ${
                    is1Selected
                      ? 'bg-[#00A826] text-white font-semibold shadow-sm'
                      : 'bg-[#212833] text-[#00E676] hover:bg-[#28313E]'
                  }`}
                >
                  {fix.odds['1'].toFixed(2)}
                </button>

                {/* X */}
                <button
                  onClick={() => toggleSelection(fix, 'X', fix.odds['X'])}
                  className={`w-[54px] h-[36px] rounded-[3px] flex items-center justify-center text-[13.5px] font-medium transition-all active:scale-95 ${
                    isXSelected
                      ? 'bg-[#00A826] text-white font-semibold shadow-sm'
                      : 'bg-[#212833] text-[#00E676] hover:bg-[#28313E]'
                  }`}
                >
                  {fix.odds['X'].toFixed(2)}
                </button>

                {/* 2 */}
                <button
                  onClick={() => toggleSelection(fix, '2', fix.odds['2'])}
                  className={`w-[54px] h-[36px] rounded-[3px] flex items-center justify-center text-[13.5px] font-medium transition-all active:scale-95 ${
                    is2Selected
                      ? 'bg-[#00A826] text-white font-semibold shadow-sm'
                      : 'bg-[#212833] text-[#00E676] hover:bg-[#28313E]'
                  }`}
                >
                  {fix.odds['2'].toFixed(2)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
