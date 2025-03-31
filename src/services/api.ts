import axios from 'axios';
import { PaymentResponse } from '../types';
import { supabase, createTransaction, updateTransactionStatus, createUserSubscription } from './supabase';

// Create a secure API instance with the token
const api = axios.create({
  baseURL: 'https://api.pushinpay.com.br/api/pix/cashIn',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_PUSHINPAY_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const generatePixPayment = async (
  amount: number, 
  description: string,
  customerEmail: string,
  customerName: string,
  customerCpf?: string
): Promise<PaymentResponse> => {
  try {
    const payload: any = {
      amount,
      description,
      customer: {
        email: customerEmail,
        name: customerName
      },
      expiration: 3600 // 1 hour expiration
    };
    
    // Add CPF if provided
    if (customerCpf) {
      payload.customer.cpf = customerCpf;
    }
    
    const response = await api.post('/pix/charges', payload);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Create transaction record
      await createTransaction(
        user.id,
        'lifetime', // Default to lifetime plan for now
        amount,
        'pix',
        response.data.id
      );
    }
    
    return response.data;
  } catch (error) {
    console.error('Error generating PIX payment:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (paymentId: string): Promise<string> => {
  try {
    const response = await api.get(`/pix/charges/${paymentId}`);
    const status = response.data.status;
    
    // If payment is completed, update transaction and create subscription
    if (status === 'COMPLETED' || status === 'CONFIRMED' || status === 'PAID') {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update transaction status
        const transaction = await updateTransactionStatus(paymentId, 'paid');
        
        // Create user subscription
        const plan = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', transaction.plan_id)
          .single();
        
        if (plan.data) {
          let expiresAt = null;
          
          // Calculate expiration date if not lifetime
          if (!plan.data.is_lifetime && plan.data.duration_days > 0) {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + plan.data.duration_days);
            expiresAt = expirationDate.toISOString();
          }
          
          await createUserSubscription(
            user.id,
            transaction.plan_id,
            plan.data.is_lifetime,
            expiresAt
          );
        }
      }
    }
    
    return status;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// Webhook handler for PushinPay notifications
export const handlePushinPayWebhook = async (event: any) => {
  try {
    const { payment_id, status } = event;
    
    if (!payment_id) {
      throw new Error('Missing payment_id in webhook payload');
    }
    
    // Get transaction by payment ID
    const transaction = await supabase
      .from('transactions')
      .select('*')
      .eq('payment_id', payment_id)
      .single();
    
    if (transaction.error) {
      throw new Error(`Transaction not found for payment_id: ${payment_id}`);
    }
    
    // Update transaction status
    await updateTransactionStatus(transaction.data.id, status.toLowerCase());
    
    // If payment is completed, create subscription
    if (status === 'COMPLETED' || status === 'CONFIRMED' || status === 'PAID') {
      // Get plan details
      const plan = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', transaction.data.plan_id)
        .single();
      
      if (plan.error) {
        throw new Error(`Plan not found: ${transaction.data.plan_id}`);
      }
      
      let expiresAt = null;
      
      // Calculate expiration date if not lifetime
      if (!plan.data.is_lifetime && plan.data.duration_days > 0) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + plan.data.duration_days);
        expiresAt = expirationDate.toISOString();
      }
      
      // Create user subscription
      await createUserSubscription(
        transaction.data.user_id,
        transaction.data.plan_id,
        plan.data.is_lifetime,
        expiresAt
      );
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
};
