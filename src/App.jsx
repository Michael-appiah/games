import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Header from './components/Header';
import LeagueTabs from './components/LeagueTabs';
import MarketTabs from './components/MarketTabs';
import FixtureList from './components/FixtureList';
import BottomNav from './components/BottomNav';
import BetslipModal from './components/BetslipModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import OpenBetsView from './components/OpenBetsView';
import PitchSimulation from './components/PitchSimulation';
import ResultsView from './components/ResultsView';

function MainApp() {
  const { currentView } = useGame();

  const renderContent = () => {
    switch (currentView) {
      case 'open_bets':
        return <OpenBetsView />;
      case 'simulation':
        return <PitchSimulation />;
      case 'results':
        return <ResultsView />;
      case 'lobby':
      default:
        return (
          <div className="flex flex-col min-h-screen bg-[#131920]">
            <Header title="Instant Football" showBack={true} />
            <LeagueTabs />
            <MarketTabs />
            <FixtureList />
            <BottomNav />
            <BetslipModal />
            <ConfirmModal />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E12] flex justify-center">
      <div className="w-full max-w-[480px] min-h-screen bg-[#131920] shadow-2xl relative flex flex-col">
        {renderContent()}
        <Toast />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}
