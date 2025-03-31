import React from 'react';
import { Smartphone, Laptop, Tv } from 'lucide-react';

export const DeviceSection: React.FC = () => {
  return (
    <div className="py-20 bg-manuflix-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-14">Assista em qualquer dispositivo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <Tv size={72} className="text-manuflix-red mb-6" />
            <h3 className="text-xl font-bold mb-3">TV</h3>
            <p className="text-manuflix-gray">Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, aparelhos de Blu-ray e outros dispositivos.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <Laptop size={72} className="text-manuflix-red mb-6" />
            <h3 className="text-xl font-bold mb-3">Computadores</h3>
            <p className="text-manuflix-gray">Assista no navegador do seu computador em manuflix.com.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <Smartphone size={72} className="text-manuflix-red mb-6" />
            <h3 className="text-xl font-bold mb-3">Celulares e Tablets</h3>
            <p className="text-manuflix-gray">Tenha acesso instantâneo no aplicativo da Manuflix para iOS e Android.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
