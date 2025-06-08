import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface GameSetupProps {
  onBack: () => void;
  onStartGame: (settings: { player1Color: string; player2Color: string; timeSeconds: number; }) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onBack, onStartGame }) => {
  const [player1Color, setPlayer1Color] = useState('PINK');
  const [player2Color, setPlayer2Color] = useState('LIGHT PINK');
  const [player1IsCPU, setPlayer1IsCPU] = useState(false);
  const [player2IsCPU, setPlayer2IsCPU] = useState(true);
  const [goalsToWin, setGoalsToWin] = useState('6');
  const [timeLeft, setTimeLeft] = useState('CLASSIC (6M)');

  const colorOptions = ['PINK', 'LIGHT PINK', 'CYAN', 'PURPLE', 'ORANGE', 'GREEN'];
  const goalOptions = ['3', '5', '6', '10', '15'];
  const timeOptions = ['CLASSIC (6M)', 'QUICK (3M)', 'EXTENDED (10M)'];

  const CustomDropdown = ({ 
    value, 
    options, 
    onChange, 
    className = '',
    color = 'orange'
  }: {
    value: string;
    options: string[];
    onChange: (value: string) => void;
    className?: string;
    color?: 'orange' | 'pink';
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const colorClasses = color === 'pink' 
      ? 'bg-pink-500 border-pink-400 text-white' 
      : 'bg-orange-500 border-orange-400 text-white';

    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 ${colorClasses} font-bold text-sm tracking-wider border-2 rounded-lg flex items-center justify-between transition-all duration-200 hover:brightness-110`}
          style={{
            boxShadow: color === 'pink' 
              ? '0 0 10px rgba(236, 72, 153, 0.5)' 
              : '0 0 10px rgba(249, 115, 22, 0.5)'
          }}
        >
          {value}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className={`absolute top-full left-0 right-0 z-20 ${colorClasses} border-2 border-t-0 rounded-b-lg max-h-48 overflow-y-auto`}>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-black/20 transition-colors duration-150 font-bold tracking-wider text-sm"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px'
           }}>
      </div>

      <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-pink-500 animate-pulse">
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-pink-500 rounded-full blur-sm opacity-60"></div>
      </div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-cyan-400 animate-pulse">
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full blur-sm opacity-60"></div>
      </div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-pink-500 animate-pulse">
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-500 rounded-full blur-sm opacity-60"></div>
      </div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-cyan-400 animate-pulse">
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full blur-sm opacity-60"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-400"></div>
      <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500"></div>



      <div className="absolute top-8 right-8 text-cyan-400 text-2xl">
        ♪
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-16">
        <div className="text-center mb-16">
          <h1 
            className="text-5xl md:text-7xl font-black tracking-wider mb-4 select-none"
            style={{
              background: 'linear-gradient(45deg, #ec4899, #f97316, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `
                0 0 20px rgba(236, 72, 153, 0.8),
                0 0 40px rgba(236, 72, 153, 0.6)
              `,
            }}
          >
            START MATCH
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-16 w-full max-w-5xl mb-16">
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-pink-500 text-xl font-bold tracking-widest">PLAYER 1 COLOR</h2>
            <CustomDropdown
              value={player1Color}
              options={colorOptions}
              onChange={setPlayer1Color}
              color="pink"
              className="w-full"
            />
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPlayer1IsCPU(!player1IsCPU)}
                className={`w-6 h-6 border-2 border-pink-500 rounded-md flex items-center justify-center transition-all duration-200 ${
                  player1IsCPU ? 'bg-pink-500' : 'bg-transparent'
                }`}
                style={{
                  boxShadow: '0 0 8px rgba(236, 72, 153, 0.5)'
                }}
              >
                {player1IsCPU && <div className="w-3 h-3 bg-white rounded-sm"></div>}
              </button>
              <span className="text-pink-500 text-lg font-bold tracking-wider">IS CPU</span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="text-center flex flex-col items-center">
              <h2 className="text-white text-xl font-bold tracking-widest mb-4">GOALS TO WIN</h2>
              <CustomDropdown
                value={goalsToWin}
                options={goalOptions}
                onChange={setGoalsToWin}
                className="w-24"
              />
            </div>

            <div className="text-center flex flex-col items-center">
              <h2 className="text-white text-xl font-bold tracking-widest mb-4">TIME LEFT</h2>
              <CustomDropdown
                value={timeLeft}
                options={timeOptions}
                onChange={setTimeLeft}
                className="w-40"
              />
            </div>


          </div>

          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-pink-500 text-xl font-bold tracking-widest">PLAYER 2 COLOR</h2>
            <CustomDropdown
              value={player2Color}
              options={colorOptions}
              onChange={setPlayer2Color}
              color="pink"
              className="w-full"
            />
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPlayer2IsCPU(!player2IsCPU)}
                className={`w-6 h-6 border-2 border-pink-500 rounded-md flex items-center justify-center transition-all duration-200 ${
                  player2IsCPU ? 'bg-pink-500' : 'bg-transparent'
                }`}
                style={{
                  boxShadow: '0 0 8px rgba(236, 72, 153, 0.5)'
                }}
              >
                {player2IsCPU && <div className="w-3 h-3 bg-white rounded-sm"></div>}
              </button>
              <span className="text-pink-500 text-lg font-bold tracking-wider">IS CPU</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-16 w-full max-w-2xl">
          <button 
            onClick={onBack}
            className="group relative px-12 py-4 bg-transparent border-4 border-pink-500 rounded-xl text-white text-xl font-bold tracking-widest transition-all duration-300 hover:scale-105 hover:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-500/50 flex-1"
            style={{
              boxShadow: `
                0 0 20px rgba(236, 72, 153, 0.4),
                inset 0 0 20px rgba(236, 72, 153, 0.1)
              `
            }}
          >
            <span className="relative z-10">BACK</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-pink-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-pink-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-pink-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-pink-500 rounded-br-lg"></div>
          </button>

          <button 
            onClick={() => {
              let seconds = 180;
              if (timeLeft.includes('6M')) seconds = 360;
              else if (timeLeft.includes('3M')) seconds = 180;
              else if (timeLeft.includes('10M')) seconds = 600;
              onStartGame({ player1Color, player2Color, timeSeconds: seconds });
            }}
            className="group relative px-12 py-4 bg-transparent border-4 border-pink-500 rounded-xl text-white text-xl font-bold tracking-widest transition-all duration-300 hover:scale-105 hover:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-500/50 flex-1"
            style={{
              boxShadow: `
                0 0 20px rgba(236, 72, 153, 0.4),
                inset 0 0 20px rgba(236, 72, 153, 0.1)
              `
            }}
          >
            <span className="relative z-10">START</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-pink-500 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-pink-500 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-pink-500 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-pink-500 rounded-br-lg"></div>
          </button>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full bg-repeat-y animate-pulse" 
             style={{
               backgroundImage: 'linear-gradient(transparent 98%, rgba(255, 255, 255, 0.03) 100%)',
               backgroundSize: '100% 4px'
             }}>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;