import React from 'react';

interface HeroProps {
  onStartPayment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartPayment }) => {
  return (
    <div className="relative h-[100vh] flex items-end justify-center text-center px-4 pb-16 bg-cover bg-center" 
      style={{ 
        backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.8) 85%, rgba(0, 0, 0, 0.9) 100%), url("https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80")',
        backgroundPosition: 'center 15%'
      }}>
      <div className="max-w-3xl relative z-10 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Conteúdo exclusivo sobre manufatura</h1>
        <h2 className="text-xl md:text-2xl mb-10 drop-shadow-md">Assista onde quiser. Cancele quando quiser.</h2>
        <button 
          onClick={onStartPayment}
          className="bg-manuflix-red text-white px-12 py-4 rounded font-bold text-lg hover:bg-opacity-80 transition-colors transform hover:scale-105 pulse-red"
        >
          ASSINAR AGORA
        </button>
      </div>
    </div>
  );
};
