import { useState } from 'react';
import HomePage from './components/HomePage';
import GameSetup from './components/GameSetup';
import Game from './components/Game';

type Screen = 'home' | 'gameSetup' | 'howToPlay' | 'game';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [player1Color, setPlayer1Color] = useState<string>('pink-500');
  const [player2Color, setPlayer2Color] = useState<string>('pink-300');

  const handlePlayClick = () => {
    setCurrentScreen('gameSetup');
  };

  const handleHowToPlayClick = () => {
    setCurrentScreen('howToPlay');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleBackToGameSetup = () => {
    setCurrentScreen('gameSetup');
  };

  const [gameTimeSeconds, setGameTimeSeconds] = useState(180);

  const handleStartGame = ({ player1Color: p1c, player2Color: p2c, timeSeconds }: { player1Color: string; player2Color: string; timeSeconds: number; }) => {
    const colorMap: Record<string,string> = {
      'PINK': 'pink-500',
      'LIGHT PINK': 'pink-300',
      'CYAN': 'cyan-400',
      'PURPLE': 'purple-500',
      'ORANGE': 'orange-500',
      'GREEN': 'green-400'
    };
    setPlayer1Color(colorMap[p1c] || 'pink-500');
    setPlayer2Color(colorMap[p2c] || 'pink-300');
    setGameTimeSeconds(timeSeconds);
    setCurrentScreen('game');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomePage 
            onPlayClick={handlePlayClick}
            onHowToPlayClick={handleHowToPlayClick}
          />
        );
      case 'gameSetup':
        return (
          <GameSetup 
            onBack={handleBackToHome}
            onStartGame={handleStartGame}
          />
        );
      case 'howToPlay':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-white text-2xl">How to Play - Coming Soon</div>
          </div>
        );
      case 'game':
        return (
          <Game 
            onBack={handleBackToGameSetup}
            player1Color={player1Color}
            player2Color={player2Color}
            timeSeconds={gameTimeSeconds}
          />
        );
      default:
        return null;
    }
  };

  return renderCurrentScreen();
}

export default App;