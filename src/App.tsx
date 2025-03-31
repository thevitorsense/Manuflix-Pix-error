import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { PaymentPage } from './pages/PaymentPage';
import { SubscriptionPlan } from './types';
import { PaymentModal } from './components/PaymentModal';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'payment'>('landing');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setPaymentComplete(true);
    setCurrentPage('payment');
  };

  return (
    <div className="min-h-screen bg-manuflix-black text-white">
      {currentPage === 'landing' && (
        <LandingPage onSelectPlan={handleSelectPlan} />
      )}
      
      {currentPage === 'payment' && (
        <PaymentPage onBack={() => setCurrentPage('landing')} />
      )}
      
      {showPaymentModal && selectedPlan && (
        <PaymentModal 
          plan={selectedPlan}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}

export default App;
