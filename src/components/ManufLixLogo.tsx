import React from 'react';

interface ManufLixLogoProps {
  className?: string;
}

export const ManufLixLogo: React.FC<ManufLixLogoProps> = ({ className = '' }) => {
  return (
    <div className={`text-manuflix-red font-bold ${className}`}>
      <span className="text-2xl">MANUFLIX</span>
    </div>
  );
};
