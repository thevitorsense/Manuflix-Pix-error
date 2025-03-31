import React from 'react';
import { ManufLixLogo } from './ManufLixLogo';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-b from-black to-transparent absolute top-0 left-0 right-0 z-10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <ManufLixLogo className="h-8" />
        <button className="bg-manuflix-red text-white px-4 py-1 rounded font-medium">
          Entrar
        </button>
      </div>
    </header>
  );
};
