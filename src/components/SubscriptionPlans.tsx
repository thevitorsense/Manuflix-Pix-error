import React, { useState, useEffect } from 'react';
import { Check, Star } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { getSubscriptionPlans } from '../services/supabase';

interface SubscriptionPlansProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSelectPlan }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'monthly',
      name: 'Plano Mensal',
      price: 19.90,
      period: 'por mês',
      features: [
        'Acesso a todo conteúdo',
        'Assista em qualquer dispositivo',
        'Suporte prioritário',
        'Atualizações mensais'
      ]
    },
    {
      id: 'quarterly',
      name: 'Plano Trimestral',
      price: 39.90,
      period: 'a cada 3 meses',
      features: [
        'Acesso a todo conteúdo',
        'Assista em qualquer dispositivo',
        'Suporte prioritário',
        'Atualizações mensais',
        'Economia de 33%'
      ],
      popular: true
    },
    {
      id: 'lifetime',
      name: 'Plano Vitalício',
      price: 49.90,
      period: 'pagamento único',
      features: [
        'Acesso a todo conteúdo',
        'Assista em qualquer dispositivo',
        'Suporte prioritário',
        'Atualizações vitalícias',
        'Acesso a conteúdos exclusivos',
        'Sem pagamentos recorrentes'
      ]
    }
  ]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const dbPlans = await getSubscriptionPlans();
        
        if (dbPlans.length > 0) {
          // Map database plans to UI plans
          const uiPlans: SubscriptionPlan[] = dbPlans.map(dbPlan => {
            let period = '';
            if (dbPlan.is_lifetime) {
              period = 'pagamento único';
            } else if (dbPlan.duration_days === 30) {
              period = 'por mês';
            } else if (dbPlan.duration_days === 90) {
              period = 'a cada 3 meses';
            }
            
            // Default features
            const features = [
              'Acesso a todo conteúdo',
              'Assista em qualquer dispositivo',
              'Suporte prioritário'
            ];
            
            // Add plan-specific features
            if (dbPlan.id === 'monthly') {
              features.push('Atualizações mensais');
            } else if (dbPlan.id === 'quarterly') {
              features.push('Atualizações mensais', 'Economia de 33%');
            } else if (dbPlan.id === 'lifetime') {
              features.push(
                'Atualizações vitalícias',
                'Acesso a conteúdos exclusivos',
                'Sem pagamentos recorrentes'
              );
            }
            
            return {
              id: dbPlan.id,
              name: dbPlan.name,
              price: dbPlan.price,
              period,
              features,
              popular: dbPlan.id === 'quarterly' // Mark quarterly as popular
            };
          });
          
          setPlans(uiPlans);
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      }
    };
    
    fetchPlans();
  }, []);

  return (
    <section id="planos" className="py-16 px-4 bg-manuflix-black">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Escolha seu plano</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-manuflix-dark rounded-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.popular ? 'border-2 border-manuflix-red relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-manuflix-red text-white px-4 py-1 rounded-bl-lg flex items-center">
                  <Star size={16} className="mr-1" />
                  <span className="text-sm font-bold">Mais Popular</span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
                  <span className="text-manuflix-gray ml-2">{plan.period}</span>
                </div>
                
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={20} className="text-manuflix-red mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3 rounded font-bold transition-colors ${
                    plan.popular 
                      ? 'bg-manuflix-red text-white hover:bg-opacity-80' 
                      : 'bg-manuflix-gray text-white hover:bg-opacity-80'
                  }`}
                >
                  Assinar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
