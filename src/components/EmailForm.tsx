import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface EmailFormProps {
  onSubmit: () => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 max-w-lg mx-auto">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow p-4 rounded bg-black bg-opacity-50 border border-manuflix-gray text-white"
        required
      />
      <button 
        type="submit"
        className="bg-manuflix-red text-white px-6 py-4 rounded font-bold flex items-center justify-center hover:bg-opacity-80 transition-colors"
      >
        Vamos lá <ChevronRight size={20} />
      </button>
    </form>
  );
};
