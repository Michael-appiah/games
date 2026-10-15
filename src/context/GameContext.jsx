import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FIXTURES } from '../data/initialFixtures';
import { TEAMS } from '../data/teamsData';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [balance, setBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('iv_balance');
      return saved !== null ? parseFloat(saved) : 11.51;
    } catch {
      return 11.51;
    }
  });

  const [selectedLeague, setSelectedLeague] = useState('england');
  const [selectedMarket, setSelectedMarket] = useState('1X2');
  const [selections, setSelections] = useState([]);
  const [betslipType, setBetslipType] = useState('Single'); // Single | Multiple | System
  const [stake, setStake] = useState('1');
  const [placedTicket, setPlacedTicket] = useState(null);
  const [currentView, setCurrentView] = useState('lobby'); // lobby | open_bets | simulation | results
  const [isBetslipOpen, setIsBetslipOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [fixtures, setFixtures] = useState(INITIAL_FIXTURES);
  const [roundId, setRoundId] = useState(943098);
  const [ticketSeq, setTicketSeq] = useState(339655);
  const [simResults, setSimResults] = useState(null);
  const [lastMatchScore, setLastMatchScore] = useState({ home: 0, away: 0 });

  useEffect(() => {
    try {
      localStorage.setItem('iv_balance', balance.toString());
    } catch (e) {
      console.error(e);
    }
  }, [balance]);

  const creditWinnings = (amount) => {
    const wonNum = parseFloat(amount) || 0;
    if (wonNum > 0) {
      setBalance(prev => {
        const next = Math.round((prev + wonNum) * 100) / 100;
        try {
          localStorage.setItem('iv_balance', next.toString());
        } catch (e) {
          console.error(e);
        }
        return next;
      });
    }
  };

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Toggle selection
  const toggleSelection = (fixture, selKey, odd) => {
    setSelections(prev => {
      const existingIdx = prev.findIndex(
        s => s.fixtureId === fixture.id && s.selection === selKey
      );
      let updated;
      if (existingIdx >= 0) {
        updated = prev.filter((_, idx) => idx !== existingIdx);
      } else {
        const filtered = prev.filter(s => s.fixtureId !== fixture.id);
        const selLabel = selKey === '1' ? 'Home' : selKey === 'X' ? 'Draw' : 'Away';
        updated = [
          ...filtered,
          {
            fixtureId: fixture.id,
            league: selectedLeague,
            home: fixture.home,
            away: fixture.away,
            market: selectedMarket || '1X2',
            selection: selKey,
            selectionLabel: selLabel,
            odd: odd
          }
        ];
      }
      setBetslipType(updated.length > 1 ? 'Multiple' : 'Single');
      return updated;
    });
  };

  const removeSelection = (fixtureId, selKey) => {
    setSelections(prev => {
      const updated = prev.filter(s => !(s.fixtureId === fixtureId && s.selection === selKey));
      setBetslipType(updated.length > 1 ? 'Multiple' : 'Single');
      return updated;
    });
  };

  const removeAllSelections = () => {
    setSelections([]);
    setBetslipType('Single');
  };

  // Calculations
  const totalOdds = selections.reduce((acc, s) => acc * s.odd, 1);
  const formattedOdds = selections.length > 0 ? (Math.round(totalOdds * 100) / 100).toFixed(2) : '0.00';
  const numericStake = parseFloat(stake) || 0;
  const maxBonus = selections.length >= 2 ? (numericStake * (selections.length * 0.046)).toFixed(2) : '0.00';
  const potentialWin = selections.length > 0 
    ? (numericStake * totalOdds + (parseFloat(maxBonus) || 0)).toFixed(2) 
    : '0.00';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePlaceBetClick = () => {
    if (numericStake > balance) {
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmPay = () => {
    setIsConfirmOpen(false);
    setIsBetslipOpen(false);
    const newBal = Math.max(0, balance - numericStake);
    const rounded = Math.round(newBal * 100) / 100;
    setBalance(rounded);
    try {
      localStorage.setItem('iv_balance', rounded.toString());
    } catch (e) {
      console.error(e);
    }

    const ticket = {
      id: ticketSeq,
      roundId: roundId,
      type: selections.length > 1 ? 'Multiple' : 'Single',
      selections: [...selections],
      stake: numericStake.toFixed(2),
      potWin: potentialWin,
      totalOdds: formattedOdds
    };
    setPlacedTicket(ticket);
    setTicketSeq(prev => prev + 1);

    showToast(`Ticket #${ticket.id} has been created successfully.`);
    setCurrentView('open_bets');
  };

  const handleKickOff = () => {
    const results = {
      england: fixtures.england.map(f => ({ ...f, result: generateBiasedSimulation(f) })),
      spain:   fixtures.spain.map(f   => ({ ...f, result: generateBiasedSimulation(f) })),
      germany: fixtures.germany.map(f => ({ ...f, result: generateBiasedSimulation(f) })),
      italy:   fixtures.italy.map(f   => ({ ...f, result: generateBiasedSimulation(f) })),
    };
    setSimResults(results);
    setCurrentView('simulation');
  };

  // Generate biased match simulation based on star ratings
  const generateBiasedSimulation = (fix) => {
    const homeStars = TEAMS[fix.home]?.stars || 3;
    const awayStars = TEAMS[fix.away]?.stars || 3;
    const starDiff = homeStars - awayStars;

    let homeGoals = Math.max(0, Math.floor(Math.random() * (homeStars >= 4 ? 3 : 2) + (starDiff > 1 ? 1 : 0)));
    let awayGoals = Math.max(0, Math.floor(Math.random() * (awayStars >= 4 ? 3 : 2) + (starDiff < -1 ? 1 : 0)));

    if (fix.simResult) {
      return fix.simResult;
    }

    return {
      homeScore: homeGoals,
      awayScore: awayGoals,
      halfTimeHome: Math.floor(homeGoals / 2),
      halfTimeAway: Math.floor(awayGoals / 2)
    };
  };

  const handleSkipToResult = () => {
    const results = {
      england: fixtures.england.map(f => ({ ...f, result: generateBiasedSimulation(f) })),
      spain:   fixtures.spain.map(f   => ({ ...f, result: generateBiasedSimulation(f) })),
      germany: fixtures.germany.map(f => ({ ...f, result: generateBiasedSimulation(f) })),
      italy:   fixtures.italy.map(f   => ({ ...f, result: generateBiasedSimulation(f) })),
    };
    setSimResults(results);
    setCurrentView('results');
  };

  const handleNextRound = () => {
    setRoundId(prev => prev + 1);
    setCurrentView('lobby');
    setPlacedTicket(null);
    setSimResults(null);
  };

  return (
    <GameContext.Provider
      value={{
        balance,
        setBalance,
        creditWinnings,
        formatCurrency,
        selectedLeague,
        setSelectedLeague,
        selectedMarket,
        setSelectedMarket,
        selections,
        toggleSelection,
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
        isBetslipOpen,
        setIsBetslipOpen,
        isConfirmOpen,
        setIsConfirmOpen,
        toastMessage,
        showToast,
        placedTicket,
        currentView,
        setCurrentView,
        handlePlaceBetClick,
        handleConfirmPay,
        handleKickOff,
        handleSkipToResult,
        handleNextRound,
        fixtures,
        roundId,
        simResults,
        lastMatchScore,
        setLastMatchScore
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
