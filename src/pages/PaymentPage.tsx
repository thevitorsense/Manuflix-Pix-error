import React from 'react';
import { Header } from '../components/Header';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface PaymentPageProps {
  onBack: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ onBack }) => {
  return (
    <div>
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <button 
          onClick={onBack}
          className="flex items-center text-manuflix-gray hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar para a página inicial
        </button>
        
        <div className="bg-manuflix-dark rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Pagamento Confirmado!</h1>
          
          <p className="text-lg mb-8">
            Obrigado por assinar o Manuflix. Seu acesso já está liberado!
          </p>
          
          <div className="bg-black bg-opacity-30 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Próximos passos:</h2>
            
            <ol className="text-left space-y-4">
              <li className="flex">
                <span className="bg-manuflix-red rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                <span>Acesse todo o conteúdo exclusivo na plataforma</span>
              </li>
              <li className="flex">
                <span className="bg-manuflix-red rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                <span>Você receberá um email com os detalhes da sua assinatura</span>
              </li>
              <li className="flex">
                <span className="bg-manuflix-red rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                <span>Em caso de dúvidas, entre em contato com nosso suporte</span>
              </li>
            </ol>
          </div>
          
          <button 
            onClick={onBack}
            className="bg-manuflix-red text-white px-8 py-3 rounded font-bold hover:bg-opacity-80 transition-colors"
          >
            Começar a Assistir
          </button>
        </div>
      </div>
    </div>
  );
};
