import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Loader2 } from 'lucide-react';
import { SubscriptionPlan, PaymentResponse, Customer } from '../types';
import { generatePixPayment, checkPaymentStatus } from '../services/api';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
  onPaymentComplete: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  plan, 
  onClose,
  onPaymentComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<Customer>({
    email: '',
    name: '',
    cpf: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.email || !customerInfo.name) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setFormSubmitted(true);
    setLoading(true);
    setError(null);
    
    try {
      const description = `Manuflix - ${plan.name}`;
      const response = await generatePixPayment(
        plan.price,
        description,
        customerInfo.email,
        customerInfo.name,
        customerInfo.cpf || undefined
      );
      
      setPaymentData(response);
      
      // Calculate expiration time in seconds
      const expirationDate = new Date(response.expiration_date);
      const now = new Date();
      const expirationSeconds = Math.floor((expirationDate.getTime() - now.getTime()) / 1000);
      setTimeLeft(expirationSeconds > 0 ? expirationSeconds : 3600);
      
      // Start checking payment status
      startStatusCheck(response.id);
    } catch (err) {
      setError('Erro ao gerar o pagamento. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = async () => {
    if (paymentData?.copy_paste) {
      try {
        await navigator.clipboard.writeText(paymentData.copy_paste);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const startStatusCheck = (paymentId: string) => {
    const checkInterval = setInterval(async () => {
      try {
        setCheckingStatus(true);
        const status = await checkPaymentStatus(paymentId);
        
        if (status === 'COMPLETED' || status === 'CONFIRMED' || status === 'PAID') {
          clearInterval(checkInterval);
          onPaymentComplete();
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      } finally {
        setCheckingStatus(false);
      }
    }, 10000); // Check every 10 seconds

    // Return cleanup function
    return () => clearInterval(checkInterval);
  };

  // Format time left as MM:SS
  const formatTimeLeft = () => {
    if (timeLeft === null) return '00:00';
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Start payment status check when payment data is available
  useEffect(() => {
    if (paymentData?.id) {
      const cleanup = startStatusCheck(paymentData.id);
      return cleanup;
    }
  }, [paymentData?.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-manuflix-dark rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Finalizar Pagamento</h3>
            <button 
              onClick={onClose}
              className="text-manuflix-gray hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {!formSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h4 className="font-bold mb-2">Resumo do pedido</h4>
                <div className="bg-black bg-opacity-30 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span>{plan.name}</span>
                    <span>R$ {plan.price.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-manuflix-gray pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {plan.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm mb-1">Nome completo <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-black bg-opacity-50 border border-manuflix-gray"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-black bg-opacity-50 border border-manuflix-gray"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">CPF (opcional)</label>
                  <input
                    type="text"
                    name="cpf"
                    value={customerInfo.cpf}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-black bg-opacity-50 border border-manuflix-gray"
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <button 
                type="submit"
                className="w-full bg-manuflix-red text-white p-3 rounded font-bold hover:bg-opacity-80 transition-colors"
              >
                Gerar PIX
              </button>
            </form>
          ) : (
            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 size={40} className="text-manuflix-red animate-spin mb-4" />
                  <p>Gerando código PIX...</p>
                </div>
              ) : error ? (
                <div>
                  <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-4 rounded mb-6">
                    <p>{error}</p>
                  </div>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="w-full bg-manuflix-red text-white p-3 rounded font-bold hover:bg-opacity-80 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : paymentData ? (
                <div>
                  <div className="mb-6">
                    <h4 className="font-bold mb-2">Resumo do pedido</h4>
                    <div className="bg-black bg-opacity-30 p-4 rounded">
                      <div className="flex justify-between mb-2">
                        <span>{plan.name}</span>
                        <span>R$ {plan.price.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-manuflix-gray pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>R$ {plan.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="mb-4">Escaneie o QR Code abaixo com o app do seu banco</p>
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <img 
                        src={paymentData.qrcode_image} 
                        alt="QR Code PIX" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    
                    <div className="relative">
                      <p className="text-sm mb-2">Ou copie o código PIX:</p>
                      <div className="bg-black bg-opacity-30 p-3 rounded flex items-center justify-between mb-2">
                        <span className="text-sm truncate mr-2">{paymentData.copy_paste}</span>
                        <button 
                          onClick={copyPixCode}
                          className="bg-manuflix-gray text-white p-2 rounded hover:bg-opacity-80 transition-colors"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                      {copied && (
                        <div className="absolute -bottom-8 left-0 right-0 text-green-500 text-sm">
                          Código copiado com sucesso!
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-manuflix-gray">
                    <p>O pagamento será confirmado automaticamente.</p>
                    {checkingStatus && (
                      <div className="flex items-center justify-center mt-2 text-manuflix-red">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span>Verificando pagamento...</span>
                      </div>
                    )}
                    <p className="mt-2">
                      Tempo restante: <span className="font-bold">{formatTimeLeft()}</span>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
