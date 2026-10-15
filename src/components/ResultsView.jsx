import { useState } from 'react';
import { TEAMS } from '../data/teamsData';
import { useGame } from '../context/GameContext';
import { TicketIcon, WinIcon, LossIcon } from './Icons';

// Helper to determine if a specific selection won based on match score
function checkSelectionWin(sel, homeScore, awayScore) {
  if (homeScore === undefined || awayScore === undefined) return true;
  const m = sel.market || '1X2';
  const s = sel.selection || '';

  if (m === '1X2') {
    if (s === '1') return homeScore > awayScore;
    if (s === 'X') return homeScore === awayScore;
    if (s === '2') return awayScore > homeScore;
  }
  if (m === 'OU') {
    const total = homeScore + awayScore;
    if (s.includes('Over 2.5') || s === 'Over 2.5') return total > 2;
    if (s.includes('Under 2.5') || s === 'Under 2.5') return total < 3;
    if (s.includes('Over 1.5') || s === 'Over 1.5') return total > 1;
    if (s.includes('Under 1.5') || s === 'Under 1.5') return total < 2;
    if (s.includes('Over')) return total > 2;
    if (s.includes('Under')) return total < 3;
  }
  if (m === 'DC') {
    if (s === '1X') return homeScore >= awayScore;
    if (s === '12') return homeScore !== awayScore;
    if (s === 'X2') return awayScore >= homeScore;
  }
  if (m === 'GG/NG') {
    if (s === 'GG') return homeScore > 0 && awayScore > 0;
    if (s === 'NG') return homeScore === 0 || awayScore === 0;
  }
  return true;
}

export default function ResultsView() {
  const {
    placedTicket,
    balance,
    formatCurrency,
    handleNextRound,
    setCurrentView,
    lastMatchScore,
    simResults,
    fixtures
  } = useGame();

  const [activeTab, setActiveTab] = useState('my_events');

  // All selections placed by the user
  const selections = placedTicket?.selections || [];
  const primarySel = selections[0];
  const userHome = primarySel?.home || 'NRW';
  const userAway = primarySel?.away || 'NEW';
  const ticketType = placedTicket?.type || 'Single';

  // Helper to resolve score for any user selection
  const getMatchScoreForSelection = (sel) => {
    // If it matches the primary live match on pitch
    if (sel.home === userHome && sel.away === userAway) {
      return {
        home: lastMatchScore?.home ?? 2,
        away: lastMatchScore?.away ?? 1
      };
    }

    // Look in simResults across leagues
    if (simResults) {
      for (const leagueKey of Object.keys(simResults)) {
        const found = simResults[leagueKey]?.find(
          f => f.home === sel.home && f.away === sel.away
        );
        if (found && found.result) {
          return {
            home: found.result.homeScore,
            away: found.result.awayScore
          };
        }
      }
    }

    // Look in fixtures
    if (fixtures) {
      for (const leagueKey of Object.keys(fixtures)) {
        const found = fixtures[leagueKey]?.find(
          f => f.home === sel.home && f.away === sel.away
        );
        if (found) {
          if (found.result) {
            return { home: found.result.homeScore, away: found.result.awayScore };
          }
          if (found.simResult) {
            return { home: found.simResult.homeScore, away: found.simResult.awayScore };
          }
        }
      }
    }

    // Deterministic fallback
    return { home: 1, away: 0 };
  };

  // Calculate won state for all selections
  const evaluatedSelections = selections.map((sel, idx) => {
    const score = getMatchScoreForSelection(sel);
    const won = checkSelectionWin(sel, score.home, score.away);
    return {
      ...sel,
      idx,
      score,
      won
    };
  });

  // Calculate total ticket win amount
  const allWon = evaluatedSelections.length > 0 && evaluatedSelections.every(s => s.won);
  const winAmount = allWon ? (placedTicket?.potWin || '0.00') : '0.00';

  // Results for other league tabs from simResults or fixtures
  const getLeagueResults = (leagueId) => {
    if (simResults && simResults[leagueId]) {
      return simResults[leagueId].map(f => ({
        home: f.home,
        away: f.away,
        ftHome: f.result?.homeScore ?? f.simResult?.homeScore ?? 1,
        ftAway: f.result?.awayScore ?? f.simResult?.awayScore ?? 0,
        htHome: f.result?.halfTimeHome ?? f.simResult?.halfTimeHome ?? 0,
        htAway: f.result?.halfTimeAway ?? f.simResult?.halfTimeAway ?? 0
      }));
    }

    if (fixtures && fixtures[leagueId]) {
      return fixtures[leagueId].map(f => ({
        home: f.home,
        away: f.away,
        ftHome: f.result?.homeScore ?? f.simResult?.homeScore ?? 1,
        ftAway: f.result?.awayScore ?? f.simResult?.awayScore ?? 0,
        htHome: f.result?.halfTimeHome ?? f.simResult?.halfTimeHome ?? 0,
        htAway: f.result?.halfTimeAway ?? f.simResult?.halfTimeAway ?? 0
      }));
    }

    // Default static England matches as fallback
    return [
      { home: 'WAT', away: 'WHU', ftHome: 0, ftAway: 0, htHome: 0, htAway: 0 },
      { home: 'EVE', away: 'AST', ftHome: 2, ftAway: 0, htHome: 1, htAway: 0 },
      { home: 'WOL', away: 'SOU', ftHome: 2, ftAway: 0, htHome: 1, htAway: 0 },
      { home: 'CRY', away: 'BUR', ftHome: 0, ftAway: 1, htHome: 0, htAway: 1 },
      { home: 'CHE', away: 'LEE', ftHome: 2, ftAway: 1, htHome: 1, htAway: 0 },
      { home: 'ARS', away: 'BRE', ftHome: 3, ftAway: 0, htHome: 2, htAway: 0 },
      { home: 'MCI', away: 'FUL', ftHome: 1, ftAway: 1, htHome: 1, htAway: 1 },
      { home: 'BHA', away: 'TOT', ftHome: 1, ftAway: 2, htHome: 1, htAway: 0 }
    ];
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F5F8] select-none min-h-screen pb-[60px]">
      {/* Red header */}
      <header className="bg-[#E51B24] h-[48px] px-3 flex items-center justify-between text-white sticky top-0 z-40 shrink-0 shadow-sm">
        <h1 className="text-[17px] font-semibold tracking-tight">Instant Virtuals</h1>
        <div className="text-[15px] font-medium">GHS {formatCurrency(balance)}</div>
      </header>

      {/* League & My Events Tabs */}
      <div className="bg-white h-[42px] px-2 flex items-center justify-between border-b border-[#E5E8EC] shrink-0 sticky top-[48px] z-30">
        <div className="flex items-center h-full flex-1 overflow-x-auto no-scrollbar">
          {['My Events', 'England', 'Spain', 'Germany', 'Italy'].map(tabName => {
            const tabId = tabName.toLowerCase().replace(' ', '_');
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`relative px-3 h-full flex items-center justify-center text-[14px] whitespace-nowrap transition-colors ${
                  isActive ? 'text-[#1A202C] font-semibold' : 'text-[#8E9BAC]'
                }`}
              >
                <span>{tabName}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#00C853] rounded-t-sm" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center pl-2">
          <button
            onClick={() => setCurrentView('open_bets')}
            className="text-[#8E9BAC] hover:text-[#1A202C] p-1 transition-colors"
            title="View Ticket"
          >
            <TicketIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Content */}
      <div className="flex-1 bg-white">
        {activeTab === 'my_events' ? (
          /* My Events: ALL Selected & Betted Matches */
          evaluatedSelections.length > 0 ? (
            <div className="divide-y divide-[#F0F2F5]">
              {evaluatedSelections.map((sel) => {
                const selLabel = sel.selectionLabel || (sel.selection === '1' ? 'Home' : sel.selection === 'X' ? 'Draw' : sel.selection === '2' ? 'Away' : sel.selection);
                const oddVal = sel.odd ? Number(sel.odd).toFixed(2) : '2.00';

                return (
                  <div key={sel.fixtureId || sel.idx} className="px-4 py-4 hover:bg-[#FAFAFA] transition-colors">
                    {/* Match Score Row */}
                    <div className="flex items-center justify-between mb-2">
                      {/* Home team */}
                      <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                        <img
                          src={TEAMS[sel.home]?.logo || ''}
                          alt={sel.home}
                          className="w-[28px] h-[28px] object-contain shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-[#1A202C] font-bold text-[15px]">{sel.home}</span>
                          <span className="text-[#8E9BAC] text-[11px] block">{TEAMS[sel.home]?.name || ''}</span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="text-center flex-shrink-0 px-3">
                        <div className="text-[#1A202C] font-black text-[22px] tracking-wider">
                          {sel.score.home} - {sel.score.away}
                        </div>
                        <div className="inline-block bg-[#F4F5F8] text-[#718096] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Full Time
                        </div>
                      </div>

                      {/* Away team */}
                      <div className="flex items-center space-x-2.5 flex-1 justify-end min-w-0 text-right">
                        <div className="truncate">
                          <span className="text-[#1A202C] font-bold text-[15px]">{sel.away}</span>
                          <span className="text-[#8E9BAC] text-[11px] block">{TEAMS[sel.away]?.name || ''}</span>
                        </div>
                        <img
                          src={TEAMS[sel.away]?.logo || ''}
                          alt={sel.away}
                          className="w-[28px] h-[28px] object-contain shrink-0"
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#F0F2F5] my-2.5" />

                    {/* Bet outcome row with Win / Loss indicator */}
                    <div className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center space-x-2">
                        {sel.won ? (
                          <WinIcon className="w-[18px] h-[18px]" />
                        ) : (
                          <LossIcon className="w-[18px] h-[18px]" />
                        )}
                        <span className="text-[#1A202C] font-semibold">
                          {ticketType} {String(sel.idx + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          sel.won ? 'bg-[#E8F8EE] text-[#00A826]' : 'bg-[#FEECEC] text-[#E51B24]'
                        }`}>
                          {sel.won ? 'WON' : 'LOST'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-[#718096]">{sel.market || '1X2'}</span>
                        <span className="text-[#1A202C] font-medium">
                          {selLabel} @{oddVal}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback when no ticket was placed */
            <div className="px-4 py-8 text-center text-[#718096]">
              <div className="text-[16px] font-semibold text-[#1A202C] mb-1">No Active Selections</div>
              <p className="text-[13px]">You did not place any bets on this round.</p>
            </div>
          )
        ) : (
          /* Other League Full Round Results */
          <div className="divide-y divide-[#F0F2F5]">
            {getLeagueResults(activeTab).map((m, idx) => (
              <div key={idx} className="px-4 py-3 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors">
                <div className="flex items-center space-x-2 w-[110px] min-w-0">
                  <img
                    src={TEAMS[m.home]?.logo || ''}
                    alt={m.home}
                    className="w-[24px] h-[24px] object-contain shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[#1A202C] font-bold text-[14px]">{m.home}</span>
                    <span className="text-[#8E9BAC] text-[10px] block truncate">{TEAMS[m.home]?.name || ''}</span>
                  </div>
                </div>

                <div className="text-center px-2">
                  <div className="text-[#1A202C] font-black text-[18px] tracking-wide">
                    {m.ftHome} - {m.ftAway}
                  </div>
                  <div className="text-[#9AA5B4] text-[10.5px]">
                    FT (HT {m.htHome}-{m.htAway})
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-[110px] justify-end min-w-0 text-right">
                  <div className="truncate">
                    <span className="text-[#1A202C] font-bold text-[14px]">{m.away}</span>
                    <span className="text-[#8E9BAC] text-[10px] block truncate">{TEAMS[m.away]?.name || ''}</span>
                  </div>
                  <img
                    src={TEAMS[m.away]?.logo || ''}
                    alt={m.away}
                    className="w-[24px] h-[24px] object-contain shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-[48px] flex items-stretch z-30 select-none shadow-lg">
        <button
          onClick={() => setCurrentView('open_bets')}
          className="w-1/2 bg-[#F4F5F8] text-[#1A202C] font-bold text-[14.5px] flex items-center justify-center border-t border-r border-[#E5E8EC] hover:bg-[#EAECF0] active:bg-[#E0E3E8] transition-colors"
        >
          Ticket Details
        </button>

        <button
          onClick={handleNextRound}
          className="w-1/2 bg-[#00A826] text-white font-bold flex flex-col items-center justify-center hover:bg-[#00B82B] active:bg-[#009622] transition-colors"
        >
          <span className="text-[14px] leading-tight">Next Round</span>
          <span className="text-[11px] font-normal opacity-90 leading-tight">
            Total Won: GHS {winAmount}
          </span>
        </button>
      </div>
    </div>
  );
}
