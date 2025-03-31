import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-2">
      <button 
        className="w-full bg-manuflix-dark p-4 flex justify-between items-center hover:bg-opacity-80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium">{question}</span>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      
      {isOpen && (
        <div className="bg-manuflix-dark mt-px p-4">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export const FAQ: React.FC = () => {
  const faqItems = [
    {
      question: "O que é a Manuflix?",
      answer: "Manuflix é uma plataforma de streaming com conteúdo exclusivo sobre manufatura, processos industriais e técnicas de produção."
    },
    {
      question: "Quanto custa a Manuflix?",
      answer: "A Manuflix custa apenas R$ 29,90 para acesso vitalício a todo o conteúdo da plataforma."
    },
    {
      question: "Onde posso assistir?",
      answer: "Assista onde quiser, quando quiser. Faça login com sua conta da Manuflix em manuflix.com para assistir instantaneamente pelo computador ou em qualquer dispositivo conectado à Internet que ofereça o aplicativo da Manuflix."
    },
    {
      question: "Como faço para cancelar?",
      answer: "A Manuflix é fácil de cancelar. Não há contratos complicados nem compromissos. Você pode cancelar sua conta online com apenas dois cliques."
    },
    {
      question: "O que eu posso assistir na Manuflix?",
      answer: "A Manuflix tem uma ampla variedade de conteúdos sobre manufatura, incluindo tutoriais, documentários, entrevistas com especialistas e muito mais."
    }
  ];
  
  return (
    <div className="py-16 bg-manuflix-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Perguntas frequentes</h2>
        
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <FAQItem 
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
