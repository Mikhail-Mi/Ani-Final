import React, { useEffect, useState } from 'react';
import { Volume2, Settings } from 'lucide-react';

interface HomePageProps {
  onPlayClick: () => void;
  onHowToPlayClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPlayClick, onHowToPlayClick }) => {
  const [glowIntensity, setGlowIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => prev === 1 ? 1.2 : 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-500 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
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

      <div className="absolute top-8 left-8">
        <Volume2 className="w-8 h-8 text-pink-500 opacity-60" style={{
          filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))'
        }} />
      </div>
      <div className="absolute top-8 right-8">
        <Settings className="w-8 h-8 text-cyan-400 opacity-60 animate-spin" style={{
          filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.6))',
          animationDuration: '8s'
        }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        <div className="text-center mb-16">
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-wider mb-4 select-none"
            style={{
              background: 'linear-gradient(45deg, #ec4899, #f97316, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `
                0 0 20px rgba(236, 72, 153, ${glowIntensity * 0.8}),
                0 0 40px rgba(236, 72, 153, ${glowIntensity * 0.6}),
                0 0 60px rgba(236, 72, 153, ${glowIntensity * 0.4})
              `,
              filter: `brightness(${glowIntensity})`,
              transition: 'all 0.3s ease-in-out'
            }}
          >
            PADDLE BATTLE
          </h1>
          <div className="text-2xl md:text-3xl text-white font-bold opacity-80 tracking-widest">
            1.1
          </div>
        </div>

        <div className="flex flex-col space-y-8 w-full max-w-md">
          <button 
            onClick={onPlayClick}
            className="group relative px-16 py-6 bg-transparent border-4 border-pink-500 text-white text-2xl font-bold tracking-widest transition-all duration-300 hover:scale-105 hover:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
            style={{
              boxShadow: `
                0 0 20px rgba(236, 72, 153, 0.4),
                inset 0 0 20px rgba(236, 72, 153, 0.1)
              `
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 30px rgba(236, 72, 153, 0.8),
                inset 0 0 30px rgba(236, 72, 153, 0.2)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 20px rgba(236, 72, 153, 0.4),
                inset 0 0 20px rgba(236, 72, 153, 0.1)
              `;
            }}
          >
            <span className="relative z-10">PLAY</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button 
            onClick={onHowToPlayClick}
            className="group relative px-16 py-6 bg-transparent border-4 border-cyan-400 text-white text-2xl font-bold tracking-widest transition-all duration-300 hover:scale-105 hover:border-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
            style={{
              boxShadow: `
                0 0 20px rgba(34, 211, 238, 0.4),
                inset 0 0 20px rgba(34, 211, 238, 0.1)
              `
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 30px rgba(34, 211, 238, 0.8),
                inset 0 0 30px rgba(34, 211, 238, 0.2)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `
                0 0 20px rgba(34, 211, 238, 0.4),
                inset 0 0 20px rgba(34, 211, 238, 0.1)
              `;
            }}
          >
            <span className="relative z-10">HOW TO PLAY</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
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

export default HomePage;