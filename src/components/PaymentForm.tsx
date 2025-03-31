import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, FileText, Lock, Check, Copy, Loader2 } from 'lucide-react';
import { generatePixPayment, checkPaymentStatus } from '../services/pix';

interface PaymentFormProps {
  onComplete: () => void;
}

type PaymentMethod = 'card' | 'pix' | 'boleto';

export const PaymentForm: React.FC<PaymentFormProps> = ({ onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    name: '',
    cpf: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qrcode_image: string;
    copy_paste: string;
    id: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Número do cartão é obrigatório';
      if (!formData.cardName) newErrors.cardName = 'Nome no cartão é obrigatório';
      if (!formData.expiryDate) newErrors.expiryDate = 'Data de validade é obrigatória';
      if (!formData.cvv) newErrors.cvv = 'CVV é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (formData.cpf && !/^\d{11}$/.test(formData.cpf.replace(/[^\d]/g, ''))) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você precisa aceitar os termos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (paymentMethod === 'pix') {
      setLoading(true);
      try {
        const response = await generatePixPayment(
          29.90, // Fixed price for the subscription
          'Acesso Vitalício Manuflix',
          formData.email,
          formData.name,
          formData.cpf || undefined
        );
        
        setPixData({
          qrcode_image: response.qrcode_image,
          copy_paste: response.copy_paste,
          id: response.id
        });
        
        // Calculate expiration time in seconds
        const expirationDate = new Date(response.expiration_date);
        const now = new Date();
        const expirationSeconds = Math.floor((expirationDate.getTime() - now.getTime()) / 1000);
        setTimeLeft(expirationSeconds > 0 ? expirationSeconds : 3600);
        
      } catch (error) {
        console.error('Error generating PIX:', error);
        setErrors({
          ...errors,
          submit: 'Erro ao gerar o PIX. Por favor, tente novamente.'
        });
      } finally {
        setLoading(false);
      }
    } else {
      // For demo purposes, simulate a successful payment for card and boleto
      onComplete();
    }
  };
  
  const copyPixCode = async () => {
    if (pixData?.copy_paste) {
      try {
        await navigator.clipboard.writeText(pixData.copy_paste);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
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
  
  // Check payment status periodically
  useEffect(() => {
    if (!pixData?.id) return;
    
    const checkInterval = setInterval(async () => {
      try {
        setCheckingStatus(true);
        const status = await checkPaymentStatus(pixData.id);
        
        if (status === 'COMPLETED' || status === 'CONFIRMED' || status === 'PAID') {
          clearInterval(checkInterval);
          onComplete();
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      } finally {
        setCheckingStatus(false);
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(checkInterval);
  }, [pixData?.id, onComplete]);
  
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Método de Pagamento</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div 
            className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="flex flex-col items-center">
              <CreditCard className="mb-2 text-manuflix-red" />
              <span>Cartão</span>
            </div>
          </div>
          
          <div 
            className={`payment-option ${paymentMethod === 'pix' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('pix')}
          >
            <div className="flex flex-col items-center">
              <QrCode className="mb-2 text-manuflix-red" />
              <span>PIX</span>
            </div>
          </div>
          
          <div 
            className={`payment-option ${paymentMethod === 'boleto' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('boleto')}
          >
            <div className="flex flex-col items-center">
              <FileText className="mb-2 text-manuflix-red" />
              <span>Boleto</span>
            </div>
          </div>
        </div>
      </div>
      
      {!pixData ? (
        <>
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-1">Número do Cartão</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="0000 0000 0000 0000"
                  className={`w-full p-3 rounded bg-manuflix-dark border ${errors.cardNumber ? 'border-red-500' : 'border-manuflix-gray'}`}
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm mb-1">Nome no Cartão</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="Nome como aparece no cartão"
                  className={`w-full p-3 rounded bg-manuflix-dark border ${errors.cardName ? 'border-red-500' : 'border-manuflix-gray'}`}
                />
                {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Validade</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    className={`w-full p-3 rounded bg-manuflix-dark border ${errors.expiryDate ? 'border-red-500' : 'border-manuflix-gray'}`}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                </div>
                
                <div>
                  <label className="block text-sm mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className={`w-full p-3 rounded bg-manuflix-dark border ${errors.cvv ? 'border-red-500' : 'border-manuflix-gray'}`}
                  />
                  {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'boleto' && (
            <div className="bg-manuflix-dark p-6 rounded-lg mb-6">
              <p className="mb-4">Ao clicar em "Gerar Boleto", você receberá o boleto por email.</p>
              <p className="text-sm text-manuflix-gray mb-4">O acesso será liberado em até 3 dias úteis após o pagamento.</p>
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm mb-1">Nome completo <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                className={`w-full p-3 rounded bg-manuflix-dark border ${errors.name ? 'border-red-500' : 'border-manuflix-gray'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                className={`w-full p-3 rounded bg-manuflix-dark border ${errors.email ? 'border-red-500' : 'border-manuflix-gray'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm mb-1">CPF (opcional)</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                className={`w-full p-3 rounded bg-manuflix-dark border ${errors.cpf ? 'border-red-500' : 'border-manuflix-gray'}`}
              />
              {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 mr-2"
              />
              <span className="text-sm">
                Concordo com os <a href="#" className="text-manuflix-red">Termos de Uso</a> e <a href="#" className="text-manuflix-red">Política de Privacidade</a>
              </span>
            </label>
            {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
          </div>
          
          {errors.submit && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white p-3 rounded mb-4">
              {errors.submit}
            </div>
          )}
          
          <div className="mb-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-manuflix-red text-white p-4 rounded font-bold text-lg hover:bg-opacity-80 transition-colors pulse-red disabled:bg-opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Processando...
                </span>
              ) : (
                paymentMethod === 'pix' ? 'GERAR QR CODE PIX' : 
                paymentMethod === 'boleto' ? 'GERAR BOLETO' : 
                'FINALIZAR ASSINATURA'
              )}
            </button>
            
            <div className="flex items-center justify-center mt-4 text-sm text-manuflix-gray">
              <Lock size={16} className="mr-2" />
              <span>Pagamento 100% seguro</span>
            </div>
          </div>
        </>
      ) : (
        <div id="pix-container" className="bg-manuflix-dark p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4 text-center">Escaneie o QR Code ou copie o código PIX</h3>
          
          <div className="bg-white p-4 rounded-lg inline-block mb-4 mx-auto block">
            <img 
              src={pixData.qrcode_image} 
              alt="QR Code PIX" 
              className="w-48 h-48 mx-auto"
            />
          </div>
          
          <div className="relative mb-8">
            <p className="text-sm mb-2">Código PIX copia e cola:</p>
            <div className="bg-black bg-opacity-30 p-3 rounded flex items-center justify-between mb-2">
              <span className="text-sm truncate mr-2">{pixData.copy_paste}</span>
              <button 
                type="button"
                onClick={copyPixCode}
                className="bg-manuflix-gray text-white p-2 rounded hover:bg-opacity-80 transition-colors"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            {copied && (
              <div className="absolute -bottom-6 left-0 right-0 text-green-500 text-sm text-center">
                Código copiado com sucesso!
              </div>
            )}
          </div>
          
          <div className="text-center text-sm">
            <p className="mb-2">O pagamento será confirmado automaticamente.</p>
            {checkingStatus && (
              <div className="flex items-center justify-center mt-2 text-manuflix-red">
                <Loader2 size={16} className="animate-spin mr-2" />
                <span>Verificando pagamento...</span>
              </div>
            )}
            <p className="mt-2">
              Este QR Code expira em: <span className="font-bold">{formatTimeLeft()}</span>
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-manuflix-dark p-4 rounded-lg">
        <h4 className="font-bold mb-2">Resumo da compra</h4>
        <div className="flex justify-between mb-2">
          <span>Acesso Vitalício Manuflix</span>
          <span>R$ 29,90</span>
        </div>
        <div className="border-t border-manuflix-gray pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>R$ 29,90</span>
        </div>
      </div>
    </form>
  );
};
